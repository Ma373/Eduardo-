import React, { useState, useEffect, useRef } from 'react';
import { UserRole, ChatMessage, Leader } from '../types';
import { getStoredData, setStoredData } from '../data';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Database, 
  AlertCircle, 
  Check, 
  CheckCheck, 
  Circle, 
  Sparkles, 
  Trash2, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface ChatTabProps {
  activeRole: UserRole;
  activeUser: { name: string; email: string; role: UserRole };
  leaders: Leader[];
}

// Fixed initial chat history to seed the chat
const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-init-1',
    senderName: 'Padre Francisco Katito',
    senderEmail: 'francisco.katito@igrejacatolica.ao',
    senderRole: 'LEADER',
    senderTitle: 'Padre (Huambo)',
    content: 'Graça e Paz a todos os membros do Gabinete Provincial. Confirmamos que a actualização dos dados da Sé Catedral do Huambo foi realizada com sucesso neste painel.',
    timestamp: '08:45:10',
    dateStr: '2026-05-30'
  },
  {
    id: 'msg-init-2',
    senderName: 'Pastor Samuel Chivinda',
    senderEmail: 'samuel.chivinda@ieca.org',
    senderRole: 'LEADER',
    senderTitle: 'Pastor (Huambo)',
    content: 'Saudações respeitosas! Acabo de registar o agendamento da nossa Conferência de Juventude para 15 de Junho no município do Huambo. Conseguem visualizar nos vossos terminais?',
    timestamp: '08:50:20',
    dateStr: '2026-05-30'
  },
  {
    id: 'msg-init-3',
    senderName: 'João Tchayevala',
    senderEmail: 'joao.tchayevala@ipcachiungo.ao',
    senderRole: 'ADMIN',
    senderTitle: 'Administrador (Nº 14)',
    content: 'Bom dia, Padre Francisco e Pastor Samuel. Confirmamos a recepção dos dados. Conseguimos ver tudo perfeitamente na nossa Visão Geral. Excelente trabalho de preenchimento.',
    timestamp: '09:02:15',
    dateStr: '2026-05-30'
  },
  {
    id: 'msg-init-4',
    senderName: 'Auxiliar de Registo',
    senderEmail: 'registo@culto-huambo.gov.ao',
    senderRole: 'EDITOR',
    senderTitle: 'Operador (Gabinete)',
    content: 'Perfeito. Estou a fazer a revisão metodológica do levantamento estatístico para o município de Cachiungo e Caála neste exacto momento para gerar os ficheiros oficiais.',
    timestamp: '09:05:40',
    dateStr: '2026-05-30'
  }
];

export default function ChatTab({ activeRole, activeUser, leaders }: ChatTabProps) {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(() => 
    getStoredData<ChatMessage[]>('chat_messages', INITIAL_CHAT)
  );
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [activeTabsCount, setActiveTabsCount] = useState<number>(1);
  const [activeTabMembers, setActiveTabMembers] = useState<string[]>([]);
  
  // Custom message simulation (allows impersonating a leader)
  const [impersonatedSender, setImpersonatedSender] = useState<string>('session'); 

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const presenceIntervalRef = useRef<number | null>(null);

  // Tab Unique ID to isolate browser tabs in presence awareness
  const tabIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));

  // Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Save to localStorage whenever messages mutate
    setStoredData('chat_messages', messages);
  }, [messages]);

  // Real-Time Multi-Tab Synchronization via BroadcastChannel
  useEffect(() => {
    // Check support
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('sgo_huambo_chat_bc');
      channelRef.current = channel;

      // Listen for incoming messages and presence beacons
      channel.onmessage = (event) => {
        const { type, payload, senderTabId } = event.data;

        if (type === 'NEW_MESSAGE') {
          // Double check if already added to protect against double-broadcasting
          setMessages(prev => {
            if (prev.some(m => m.id === payload.id)) return prev;
            return [...prev, payload];
          });
        } 
        else if (type === 'TYPING_START') {
          if (senderTabId !== tabIdRef.current) {
            setIsTyping(payload); // Displays name of typing peer
          }
        } 
        else if (type === 'TYPING_STOP') {
          if (senderTabId !== tabIdRef.current) {
            setIsTyping(null);
          }
        }
        else if (type === 'PRESENCE_PING') {
          // Send pong back
          channel.postMessage({
            type: 'PRESENCE_PONG',
            payload: {
              tabId: tabIdRef.current,
              user: activeUser.name,
              role: activeUser.role
            },
            senderTabId: tabIdRef.current
          });
          
          handleJoinPresence(payload.user, payload.tabId);
        }
        else if (type === 'PRESENCE_PONG') {
          if (senderTabId !== tabIdRef.current) {
            handleJoinPresence(payload.user, payload.tabId);
          }
        }
      };

      // Broadcast startup presence ping to detect other tabs
      channel.postMessage({
        type: 'PRESENCE_PING',
        payload: {
          tabId: tabIdRef.current,
          user: activeUser.name,
          role: activeUser.role
        },
        senderTabId: tabIdRef.current
      });

      // Periodically announce presence to stay updated
      const interval = window.setInterval(() => {
        channel.postMessage({
          type: 'PRESENCE_PING',
          payload: {
            tabId: tabIdRef.current,
            user: activeUser.name,
            role: activeUser.role
          },
          senderTabId: tabIdRef.current
        });
      }, 5000);
      
      presenceIntervalRef.current = interval;

      return () => {
        clearInterval(interval);
        channel.close();
      };
    }
  }, [activeUser]);

  // Keep list of tab IDs seen in the last 15 seconds to calculate tab counts
  const [visitedTabs, setVisitedTabs] = useState<Record<string, { name: string; timestamp: number }>>({});

  const handleJoinPresence = (name: string, tabId: string) => {
    setVisitedTabs(prev => {
      const now = Date.now();
      const updated = {
        ...prev,
        [tabId]: { name, timestamp: now }
      };

      // Clean up stale tabs (older than 15s)
      const cleaned: Record<string, { name: string; timestamp: number }> = {};
      Object.keys(updated).forEach(tid => {
        if (now - updated[tid].timestamp < 15000) {
          cleaned[tid] = updated[tid];
        }
      });

      // Update members indicator lists
      const uniqueNames = Array.from(new Set(Object.values(cleaned).map(t => t.name)));
      setActiveTabMembers(uniqueNames);
      setActiveTabsCount(Object.keys(cleaned).length + 1); // self + other active tabs
      
      return cleaned;
    });
  };

  const handleInputKeyDown = () => {
    // Broadcast typing state to peers
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'TYPING_START',
        payload: activeUser.name,
        senderTabId: tabIdRef.current
      });
    }
  };

  const handleInputBlur = () => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'TYPING_STOP',
        senderTabId: tabIdRef.current
      });
    }
  };

  // Submit Message Action
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Determine Sender details (based on current session OR selected impersonated leader simulation)
    let finalSenderName = activeUser.name;
    let finalSenderEmail = activeUser.email;
    let finalSenderRole: UserRole | 'SYSTEM' | 'LEADER' = activeUser.role;
    let finalSenderTitle = activeUser.role === 'ADMIN' ? 'Administrador' : activeUser.role === 'EDITOR' ? 'Operador' : 'Visitante';

    if (impersonatedSender !== 'session') {
      const chosenLeader = leaders.find(l => l.id === impersonatedSender);
      if (chosenLeader) {
        finalSenderName = chosenLeader.name;
        finalSenderEmail = chosenLeader.email;
        finalSenderRole = 'LEADER';
        finalSenderTitle = `${chosenLeader.role} (${leaders.find(le => le.id === chosenLeader.id)?.phone || 'Membro do Clero'})`;
      }
    }

    const now = new Date();
    const timestampStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: finalSenderName,
      senderEmail: finalSenderEmail,
      senderRole: finalSenderRole,
      senderTitle: finalSenderTitle,
      content: inputText,
      timestamp: timestampStr,
      dateStr: dateStr
    };

    // Append Locally
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Broadcast through Channel instantly for real-time sync with other tab
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'NEW_MESSAGE',
        payload: newMsg,
        senderTabId: tabIdRef.current
      });
      // Stop typing
      channelRef.current.postMessage({
        type: 'TYPING_STOP',
        senderTabId: tabIdRef.current
      });
    }

    // Trigger AI / Simulated replies based on text triggers, after 1.5 seconds delay with typing simulation
    triggerSimulatedReply(inputText, finalSenderName);
  };

  // Automated chatbot simulation representing regional leaders replying
  const triggerSimulatedReply = (userText: string, nameOfUser: string) => {
    const textLower = userText.toLowerCase();
    let replyText = '';
    let chosenSimulatedLeader: Leader | undefined;

    if (textLower.includes('olá') || textLower.includes('bom dia') || textLower.includes('boatarde') || textLower.includes('boas')) {
      chosenSimulatedLeader = leaders[0]; // Padre Katito
      replyText = `Bom dia, estimado ${nameOfUser}! Paz de Deus. É óptimo tê-lo aqui no canal de comunicação operacional do Huambo. Tudo em ordem por Cachiungo?`;
    } 
    else if (textLower.includes('cachiungo')) {
      chosenSimulatedLeader = leaders[4]; // Padre Kassenda (de Cachiungo)
      replyText = `Saudações a partir do Cachiungo! O nosso orientador cientifico Prof. Pedro Canoquela Capitango e o estudante João Tchayevala conceberam uma obra de arte tecnológica com este painel eclesiástico.`;
    } 
    else if (textLower.includes('relatório') || textLower.includes('relatorio' ) || textLower.includes('pdf') || textLower.includes('imprimir')) {
      chosenSimulatedLeader = leaders[2]; // Bispo Manuel Catchiungo
      replyText = `O Sector Central de Relatórios Administrativos do Huambo foi auditado. O documento está em perfeito estado para exportação local das congregações.`;
    } 
    else if (textLower.includes('igreja') || textLower.includes('seita') || textLower.includes('seitas') || textLower.includes('legal')) {
      chosenSimulatedLeader = leaders[1]; // Pastor Samuel Chivinda
      replyText = `Através da lei angolana de exercício de cultos, todas as 6 congregações modelo no nosso registo provincial encontram-se com estatuto administrativo regularizado.`;
    }
    else if (textLower.includes('agenda') || textLower.includes('culto') || textLower.includes('missa') || textLower.includes('evento')) {
      chosenSimulatedLeader = leaders[5]; // Pastora Teresa Ngueve
      replyText = `Temos atividades importantes agendadas na nossa grelha. Por favor, lembre-se de atualizar o estado de 'Agendado' para 'Realizado' após o término do evento no separador da Agenda.`;
    }
    else if (textLower.includes('ajuda') || textLower.includes('suporte') || textLower.includes('limpar')) {
      replyText = `Este chat opera totalmente de forma local em tempo real no browser! Carregue em 'Eliminar Histórico' no topo direito se desejar reiniciar as conversas salvas no seu localStorage.`;
    }

    if (replyText && chosenSimulatedLeader) {
      const leaderToReply = chosenSimulatedLeader;
      // Start typing indicator after 500ms
      setTimeout(() => {
        setIsTyping(leaderToReply.name);
        
        // Push actual message after 2000ms
        setTimeout(() => {
          const replyMsg: ChatMessage = {
            id: `msg-sim-${Date.now()}`,
            senderName: leaderToReply.name,
            senderEmail: leaderToReply.email,
            senderRole: 'LEADER',
            senderTitle: `${leaderToReply.role} (${leaderToReply.phone})`,
            content: replyText,
            timestamp: new Date().toTimeString().split(' ')[0],
            dateStr: new Date().toISOString().split('T')[0]
          };

          setMessages(prev => [...prev, replyMsg]);
          setIsTyping(null);

          // Sync into other tab as well
          if (channelRef.current) {
            channelRef.current.postMessage({
              type: 'NEW_MESSAGE',
              payload: replyMsg,
              senderTabId: tabIdRef.current
            });
          }
        }, 1500);

      }, 400);
    }
  };

  // Erase Saved history completely
  const handleClearHistory = () => {
    if (confirm('Deseja apagar definitivamente todas as mensagens do chat armazenadas localmente?')) {
      setMessages(INITIAL_CHAT);
      setStoredData('chat_messages', INITIAL_CHAT);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
              <MessageSquare className="text-[#E63946]" size={16} />
              01 / CANAL DE COMUNICAÇÃO OPERACIONAL EM TEMPO REAL
            </h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-serif italic">Linha direta integrada para coordenação, avisos governamentais e intercâmbio de dados inter-paroquiais do Huambo.</p>
          </div>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 border border-[#E63946]/30 hover:border-[#E63946] hover:bg-rose-50 text-[#E63946] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest transition shrink-0"
          >
            <Trash2 size={13} />
            ELIMINAR HISTÓRICO
          </button>
        </div>

        {/* Real-time sync banner info (Metadata styling: humble and authentic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 p-4 text-xs">
          <div className="flex items-start gap-2 text-[#1A1A1A]/80">
            <Database className="shrink-0 text-[#1A1A1A]/50 mt-0.5" size={14} />
            <div>
              <p className="font-extrabold uppercase font-mono text-[9px] tracking-wider">Mecanismo de Armazenamento</p>
              <p className="text-[#1A1A1A]/65 text-[11px] mt-0.5 font-sans leading-relaxed font-light">Armazenado no <strong className="text-black font-semibold">localStorage</strong> do navegador. Nada é enviado para servidores de banco de dados externos, em estrito respeito pela privacidade.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[#1A1A1A]/80">
            <Sparkles className="shrink-0 text-[#E63946] mt-0.5" size={14} />
            <div>
              <p className="font-extrabold uppercase font-mono text-[9px] tracking-wider">Multi-Janela Ativa (Instantâneo)</p>
              <p className="text-[#1A1A1A]/65 text-[11px] mt-0.5 font-sans leading-relaxed font-light">Aberto em várias abas? O canal sincroniza as mensagens e presença usando tecnologia <strong className="text-black font-semibold">BroadcastChannel</strong> nativa sem latência.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[#1A1A1A]/80">
            <div className="relative shrink-0 mt-1">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <div>
              <p className="font-extrabold uppercase font-mono text-[9px] tracking-wider">Estado da Rede / Terminais Activos</p>
              <p className="text-[#1A1A1A]/65 text-[11px] mt-0.5 font-sans leading-relaxed font-light"><strong className="text-[#E63946] font-extrabold">{activeTabsCount} terminal(ais) local(ais) detectado(s)</strong> no browser. {activeTabMembers.length > 0 && `Membros: ${activeTabMembers.join(', ')}.`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebars Contacts Presence, Right Side the Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Contacts Sidebar List representing Clergy/Bishops + support team */}
        <div className="lg:col-span-1 border border-[#1A1A1A] bg-white divide-y divide-[#1A1A1A]/10 h-fit">
          <div className="p-4 bg-[#1A1A1A]/5">
            <h3 className="text-[10px] font-extrabold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
              <Users size={14} />
              Terminais e Clérigos
            </h3>
            <p className="text-[10px] text-[#1A1A1A]/50 mt-0.5">Estado de login local e clero do Huambo.</p>
          </div>

          {/* Current Sessions List */}
          <div className="p-4 space-y-3">
            <p className="text-[9px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">SESSÕES ACTIVAS NO NAVEGADOR</p>
            
            <div className="space-y-2">
              {/* Main self user */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate whitespace-nowrap">
                  <div className="relative">
                    <Circle size={8} className="fill-emerald-500 text-emerald-500" />
                  </div>
                  <span className="font-bold text-[#1A1A1A] truncate">{activeUser.name} (Você)</span>
                </div>
                <span className="bg-[#1A1A1A] text-white px-1.5 py-0.5 rounded-none text-[7px] font-bold font-mono uppercase tracking-widest shrink-0">{activeUser.role}</span>
              </div>

              {/* Other tabs dynamically detected */}
              {activeTabMembers.filter(m => m !== activeUser.name).map(m => (
                <div key={m} className="flex items-center justify-between text-xs my-1">
                  <div className="flex items-center gap-2 truncate">
                    <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                    <span className="font-bold text-[#1A1A1A]/80 truncate">{m}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-400/30 px-1.5 py-0.5 text-[7px] font-bold font-mono tracking-widest shrink-0">MULTITAB</span>
                </div>
              ))}
            </div>
          </div>

          {/* Huambo Clergy Simulated Accounts (With artificial online indices) */}
          <div className="p-4 space-y-3">
            <p className="text-[9px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">CLERO DO HUAMBO (ONLINE SIMULADO)</p>
            
            <div className="space-y-3 mt-2">
              {leaders.map((leader, idx) => {
                // Alternating online status for simulation
                const isOnline = idx % 3 !== 2;
                const isAway = idx === 2 || idx === 5;
                const isOffline = !isOnline && !isAway;

                return (
                  <div key={leader.id} className="text-xs flex items-center justify-between gap-1.5">
                    <div className="truncate">
                      <div className="flex items-center gap-2 truncate">
                        {isOnline && <Circle size={8} className="fill-emerald-500 text-emerald-500" />}
                        {isAway && <Circle size={8} className="fill-amber-500 text-amber-500" />}
                        {isOffline && <Circle size={8} className="fill-stone-300 text-stone-300" />}
                        <span className="font-serif italic font-extrabold text-[#1A1A1A] truncate">{leader.name}</span>
                      </div>
                      <p className="text-[9px] text-[#1A1A1A]/50 pl-3 font-mono leading-none mt-0.5">{leader.role.toUpperCase()} • {leader.phone}</p>
                    </div>
                    
                    <span className="text-[8px] font-mono shrink-0 uppercase tracking-wide">
                      {isOnline && 'Ativo'}
                      {isAway && 'Ausente'}
                      {isOffline && 'Offline'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-[#1A1A1A]/5 text-[9px] text-[#1A1A1A]/50 tracking-wide uppercase font-mono leading-normal">
            💡 Dica: Escreva mensagens mencionando palavras-chave como 'Cachiungo', 'relatório', 'Igreja' ou 'Agenda' para desencadear respostas automáticas do clero eclesiástico do Huambo em fracções de segundos!
          </div>
        </div>

        {/* Chat Box Element */}
        <div className="lg:col-span-3 border border-[#1A1A1A] bg-white flex flex-col justify-between h-[600px]">
          
          {/* Box Header */}
          <div className="p-4 border-b border-[#1A1A1A]/10 bg-[#F9F8F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 border border-[#1A1A1A]/30 bg-white text-[#1A1A1A]">
                <MessageSquare size={14} />
              </div>
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-[0.15em] text-[#1A1A1A]">Mural Conversacional do Gabinete</h3>
                <p className="text-[9px] text-[#1A1A1A]/60 font-mono mt-0.5 uppercase tracking-wider">
                  Canal Activo: #geral-provincial-huambo
                </p>
              </div>
            </div>

            {/* Impersonator Selector: Highly interactive widget! */}
            <div className="flex items-center gap-1.5 bg-white p-1.5 border border-[#1A1A1A]/20">
              <label htmlFor="impersonate-select" className="text-[8px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/60">Enviar como:</label>
              <select
                id="impersonate-select"
                value={impersonatedSender}
                onChange={(e) => setImpersonatedSender(e.target.value)}
                className="text-[9px] font-bold uppercase tracking-wider bg-transparent text-[#1A1A1A] focus:outline-none cursor-pointer p-0.5 border-none"
              >
                <option value="session">MINHA SESSÃO ({activeUser.role})</option>
                <optgroup label="Simular como Líder (Clero):">
                  {leaders.map(l => (
                    <option key={l.id} value={l.id}>{l.name.toUpperCase()} ({l.role.toUpperCase()})</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Messages Scrolling Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FAF9F6]/55 space-y-4">
            
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#1A1A1A]/40 font-mono uppercase tracking-widest text-[10px]">
                <AlertCircle size={18} className="mb-2" />
                Sem histórico de mensagens locais. Comece por enviar uma mensagem abaixo!
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderEmail === activeUser.email;
                const isSystem = msg.senderRole === 'SYSTEM';
                const isLeader = msg.senderRole === 'LEADER';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2 text-[#1A1A1A]/40 text-[9px] font-mono tracking-widest uppercase">
                      [ {msg.timestamp} ] • {msg.content}
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                    
                    {/* Message metadata (Sender details) */}
                    <div className="flex items-center gap-2 mb-1 text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest">
                      <span className="font-bold text-[#1A1A1A]">{msg.senderName}</span>
                      {msg.senderTitle && (
                        <span>({msg.senderTitle})</span>
                      )}
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Message Bubble */}
                    <div className={`p-3.5 border ${
                      isMe 
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F8F6]' 
                        : isLeader 
                          ? 'border-[#E63946]/30 bg-rose-50/40 text-[#1A1A1A]' 
                          : 'border-[#1A1A1A]/30 bg-white text-[#1A1A1A]'
                    }`}>
                      <p className="text-xs leading-relaxed break-words whitespace-pre-wrap font-sans font-normal selection:bg-rose-500/30 selection:text-white">
                        {msg.content}
                      </p>
                    </div>

                    {/* Receipt Status Mark */}
                    <div className="flex items-center gap-1 mt-1 text-[8px] font-mono text-[#1A1A1A]/50 tracking-wider">
                      <span>ENTREGUE NO TERMINAL</span>
                      <CheckCheck size={10} className="text-emerald-600 font-bold" />
                    </div>
                  </div>
                );
              })
            )}

            {/* Loading typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 italic uppercase tracking-wider">
                <Circle size={6} className="fill-emerald-500 text-emerald-500 animate-ping shrink-0" />
                <span>{isTyping} está a escrever uma mensagem...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Action writing zone */}
          <form onSubmit={handleSubmitMessage} className="p-4 border-t border-[#1A1A1A]/10 bg-[#F9F8F6] flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                placeholder={
                  impersonatedSender === 'session' 
                    ? `ENVIAR MENSAGEM COMO ${activeUser.name.toUpperCase()}...` 
                    : `ENVIAR SIMULAÇÃO COMO ${leaders.find(l => l.id === impersonatedSender)?.name.toUpperCase()}...`
                }
                className="w-full border border-[#1A1A1A]/20 bg-white px-3 py-2.5 text-xs text-[#1A1A1A] uppercase tracking-wide placeholder-[#1A1A1A]/40 focus:border-[#1A1A1A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] transition"
            >
              <span>ENVIAR</span>
              <Send size={11} />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
