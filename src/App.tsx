import { useState, useEffect } from 'react';
import { Institution, Leader, ReligiousEvent, UserRole, UserSession } from './types';
import { 
  INITIAL_INSTITUTIONS, 
  INITIAL_LEADERS, 
  INITIAL_EVENTS, 
  getStoredData, 
  setStoredData 
} from './data';
import Dashboard from './components/Dashboard';
import InstitutionsTab from './components/InstitutionsTab';
import LeadersTab from './components/LeadersTab';
import EventsTab from './components/EventsTab';
import ReportsTab from './components/ReportsTab';
import ProjectInfoTab from './components/ProjectInfoTab';
import ChatTab from './components/ChatTab';
import { LayoutDashboard, Building, Users, Calendar, FileText, GraduationCap, Lock, Unlock, UserCircle, RefreshCw, MessageSquare } from 'lucide-react';


export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load initial states with localStorage persistence support
  const [institutions, setInstitutions] = useState<Institution[]>(() => 
    getStoredData('institutions', INITIAL_INSTITUTIONS)
  );
  const [leaders, setLeaders] = useState<Leader[]>(() => 
    getStoredData('leaders', INITIAL_LEADERS)
  );
  const [events, setEvents] = useState<ReligiousEvent[]>(() => 
    getStoredData('events', INITIAL_EVENTS)
  );

  // Dynamic user session and role authorization simulation
  const [activeRole, setActiveRole] = useState<UserRole>(() => 
    getStoredData<'ADMIN' | 'EDITOR' | 'VISITOR'>('active_role', 'ADMIN')
  );

  const [activeUser, setActiveUser] = useState<UserSession>(() => {
    if (activeRole === 'ADMIN') {
      return { name: 'João Tchayevala', email: 'joao.tchayevala@ipcachiungo.ao', role: 'ADMIN' };
    } else if (activeRole === 'EDITOR') {
      return { name: 'Auxiliar de Registo', email: 'registo@culto-huambo.gov.ao', role: 'EDITOR' };
    } else {
      return { name: 'Consultor Geral (Gabinete)', email: 'visitante@huambo.gov.ao', role: 'VISITOR' };
    }
  });

  // Track role switches to change simulated active profile
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setStoredData('active_role', role);

    if (role === 'ADMIN') {
      setActiveUser({ name: 'João Tchayevala', email: 'joao.tchayevala@ipcachiungo.ao', role: 'ADMIN' });
    } else if (role === 'EDITOR') {
      setActiveUser({ name: 'Auxiliar de Registo', email: 'registo@culto-huambo.gov.ao', role: 'EDITOR' });
    } else {
      setActiveUser({ name: 'Consultor Geral (Gabinete)', email: 'visitante@huambo.gov.ao', role: 'VISITOR' });
    }
  };

  // Sync state modifications onto local storage whenever they occur
  useEffect(() => {
    setStoredData('institutions', institutions);
  }, [institutions]);

  useEffect(() => {
    setStoredData('leaders', leaders);
  }, [leaders]);

  useEffect(() => {
    setStoredData('events', events);
  }, [events]);

  // Restores standard factory simulation data
  const handleResetDatabase = () => {
    if (window.confirm('Pretende repor todos os dados originais de simulação e apagar as modificações efectuadas?')) {
      setInstitutions(INITIAL_INSTITUTIONS);
      setLeaders(INITIAL_LEADERS);
      setEvents(INITIAL_EVENTS);
    }
  };

  // ==========================================
  // INSTITUTIONS CRUD TRIGGERS
  // ==========================================
  const handleAddInstitution = (payload: Omit<Institution, 'id'>) => {
    const newId = `i${Date.now()}`;
    const newInst: Institution = {
      id: newId,
      ...payload
    };
    setInstitutions(prev => [...prev, newInst]);

    // Automatically bind temple back into leader if missing
    if (payload.leaderId) {
      setLeaders(prev => prev.map(lead => {
        if (lead.id === payload.leaderId) {
          return { ...lead, institutionId: newId };
        }
        return lead;
      }));
    }
  };

  const handleUpdateInstitution = (updated: Institution) => {
    setInstitutions(prev => prev.map(inst => inst.id === updated.id ? updated : inst));

    // Also update binding relations in leaders
    setLeaders(prev => prev.map(lead => {
      // Unbind from old if matching and reassigned
      if (lead.institutionId === updated.id && lead.id !== updated.leaderId) {
        return { ...lead, institutionId: undefined };
      }
      // Bind to new leader
      if (lead.id === updated.leaderId) {
        return { ...lead, institutionId: updated.id };
      }
      return lead;
    }));
  };

  const handleDeleteInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(inst => inst.id !== id));
    // Remove references
    setLeaders(prev => prev.map(lead => lead.institutionId === id ? { ...lead, institutionId: undefined } : lead));
    setEvents(prev => prev.filter(evt => evt.institutionId !== id));
  };

  // ==========================================
  // LEADERS CRUD TRIGGERS
  // ==========================================
  const handleAddLeader = (payload: Omit<Leader, 'id'>) => {
    const newId = `l${Date.now()}`;
    const newLeader: Leader = {
      id: newId,
      ...payload
    };
    setLeaders(prev => [...prev, newLeader]);

    // If an institution was designated, bind the leader back immediately
    if (payload.institutionId) {
      setInstitutions(prev => prev.map(inst => {
        if (inst.id === payload.institutionId) {
          return { ...inst, leaderId: newId };
        }
        return inst;
      }));
    }
  };

  const handleUpdateLeader = (updated: Leader) => {
    setLeaders(prev => prev.map(l => l.id === updated.id ? updated : l));

    // Adjust institution references
    setInstitutions(prev => prev.map(inst => {
      // Unlink leader from old institutions
      if (inst.leaderId === updated.id && inst.id !== updated.institutionId) {
        return { ...inst, leaderId: '' };
      }
      // Link to new one
      if (inst.id === updated.institutionId) {
        return { ...inst, leaderId: updated.id };
      }
      return inst;
    }));
  };

  const handleDeleteLeader = (id: string) => {
    setLeaders(prev => prev.filter(l => l.id !== id));
    // Clear references from institutions
    setInstitutions(prev => prev.map(inst => inst.leaderId === id ? { ...inst, leaderId: '' } : inst));
  };

  // ==========================================
  // EVENTS CRUD TRIGGERS
  // ==========================================
  const handleAddEvent = (payload: Omit<ReligiousEvent, 'id'>) => {
    const newEvt: ReligiousEvent = {
      id: `e${Date.now()}`,
      ...payload
    };
    setEvents(prev => [...prev, newEvt]);
  };

  const handleUpdateEvent = (updated: ReligiousEvent) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans text-[#1A1A1A] antialiased selection:bg-[#E63946]/10 selection:text-[#E63946]">
      
      {/* Top Banner indicating National/Province identity */}
      <div id="top-national-banner" className="bg-[#1A1A1A] text-white px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2 border-b border-white/10 font-mono">
        <span>República de Angola</span>
        <span className="opacity-40">•</span>
        <span>Governo Provincial do Huambo</span>
        <span className="opacity-40">•</span>
        <span>S.G.O.</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-45 bg-[#F9F8F6] border-b border-[#1A1A1A] shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-[#1A1A1A] text-white font-serif italic text-lg shadow-none">
              H
            </div>
            <div>
              <h2 className="font-extrabold text-base uppercase tracking-wider text-[#1A1A1A] leading-none font-serif">S.G.O. HUAMBO</h2>
              <p className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/60 mt-1 font-mono">Instituto Politécnico do Cachiungo</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard size={13} /> },
              { id: 'instituicoes', label: 'Instituições', icon: <Building size={13} /> },
              { id: 'lideres', label: 'Líderes', icon: <Users size={13} /> },
              { id: 'eventos', label: 'Agenda/Eventos', icon: <Calendar size={13} /> },
              { id: 'chat', label: 'Chat Direto', icon: <MessageSquare size={13} /> },
              { id: 'relatorios', label: 'Relatórios PDF', icon: <FileText size={13} /> },
              { id: 'projecto', label: 'Ficha Científica', icon: <GraduationCap size={13} /> }
            ].map(tab => (

              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                    : 'bg-transparent text-[#1A1A1A]/70 border-transparent hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Header Controls: Dynamic Role Selection with visual warning indicator */}
          <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-[#1A1A1A]/10 pt-3 lg:pt-0 lg:pl-4">
            <div className="text-right hidden xl:block">
              <p className="text-[11px] font-bold text-[#1A1A1A] leading-none uppercase tracking-wider">{activeUser.name}</p>
              <p className="text-[9px] text-[#1A1A1A]/50 mt-1 font-mono">{activeUser.email}</p>
            </div>
            
            <div className="flex items-center gap-1 bg-[#1A1A1A]/5 p-1 border border-[#1A1A1A]/13">
              {([
                { id: 'ADMIN', label: 'ADM', icon: <Lock size={10} />, tooltip: 'Acesso total' },
                { id: 'EDITOR', label: 'Edit', icon: <Unlock size={10} />, tooltip: 'Inserção livre (Não apaga)' },
                { id: 'VISITOR', label: 'Leitor', icon: <UserCircle size={10} />, tooltip: 'Apenas Consulta' }
              ] as const).map(roleOption => (
                <button
                  key={roleOption.id}
                  onClick={() => handleRoleChange(roleOption.id)}
                  title={roleOption.tooltip}
                  className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold tracking-wider transition ${
                    activeRole === roleOption.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/5'
                  }`}
                >
                  {roleOption.icon}
                  <span>{roleOption.label}</span>
                </button>
              ))}
            </div>

            {/* Quick action: Reset Database */}
            <button
              onClick={handleResetDatabase}
              title="Restaurar simulação de fábrica"
              className="p-1.5 border border-[#1A1A1A]/20 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition shrink-0 bg-white"
            >
              <RefreshCw size={13} />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic tabs controller */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            institutions={institutions} 
            leaders={leaders} 
            events={events}
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        )}

        {activeTab === 'instituicoes' && (
          <InstitutionsTab 
            institutions={institutions} 
            leaders={leaders} 
            activeRole={activeRole}
            onAdd={handleAddInstitution}
            onUpdate={handleUpdateInstitution}
            onDelete={handleDeleteInstitution}
          />
        )}

        {activeTab === 'lideres' && (
          <LeadersTab 
            leaders={leaders} 
            institutions={institutions} 
            activeRole={activeRole}
            onAdd={handleAddLeader}
            onUpdate={handleUpdateLeader}
            onDelete={handleDeleteLeader}
          />
        )}

        {activeTab === 'eventos' && (
          <EventsTab 
            events={events} 
            institutions={institutions} 
            activeRole={activeRole}
            onAdd={handleAddEvent}
            onUpdate={handleUpdateEvent}
            onDelete={handleDeleteEvent}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTab 
            activeRole={activeRole}
            activeUser={activeUser}
            leaders={leaders}
          />
        )}

        {activeTab === 'relatorios' && (

          <ReportsTab 
            institutions={institutions} 
            leaders={leaders} 
            events={events} 
          />
        )}

        {activeTab === 'projecto' && (
          <ProjectInfoTab />
        )}

      </main>

      {/* Global Bottom Footer styled elegantly representing Cachiungo Study */}
      <footer className="bg-[#1A1A1A] text-[#F9F8F6]/80 py-12 border-t border-[#1A1A1A] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-serif italic text-base text-white tracking-wide">S.G.O. Huambo</span>
              <span className="px-2 py-0.5 bg-[#E63946] text-white font-mono text-[9px] font-bold tracking-widest uppercase">v4.0 Editorial</span>
            </div>
            <p className="font-sans text-xs text-[#F9F8F6]/60 max-w-md">Sistema centralizado para gestão e mapeamento de instituições religiosas de Huambo, Angola.</p>
            <p className="text-[10px] text-[#F9F8F6]/40 font-mono">Desenvolvido com base no trabalho tecnológico de João Q. K. Tchayevala (12ª Classe).</p>
          </div>

          <div className="text-left md:text-right space-y-2 text-[10px] uppercase tracking-wider font-mono text-[#F9F8F6]/60">
            <p>Escola: <span className="text-white font-sans font-bold">Instituto Politécnico do Cachiungo</span></p>
            <p>Orientador: <span className="text-white font-sans font-bold">Pedro Canoquela Capitango</span></p>
            <p className="opacity-40">Província do Huambo — Angola © 2025/2026</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
