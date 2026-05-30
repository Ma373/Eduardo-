import React, { useState } from 'react';
import { ReligiousEvent, Institution, UserRole } from '../types';
import { Search, Plus, Edit, Trash2, X, AlertCircle, CalendarCheck, Clock, MapPin } from 'lucide-react';

interface EventsTabProps {
  events: ReligiousEvent[];
  institutions: Institution[];
  activeRole: UserRole;
  onAdd: (event: Omit<ReligiousEvent, 'id'>) => void;
  onUpdate: (event: ReligiousEvent) => void;
  onDelete: (id: string) => void;
}

export default function EventsTab({
  events,
  institutions,
  activeRole,
  onAdd,
  onUpdate,
  onDelete
}: EventsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ReligiousEvent | null>(null);

  // Form variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [status, setStatus] = useState<'Agendado' | 'Realizado' | 'Cancelado'>('Agendado');
  const [type, setType] = useState<'Culto' | 'Missa' | 'Conferência' | 'Ação Social' | 'Outro'>('Culto');

  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenAdd = () => {
    if (activeRole === 'VISITOR') return;
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setInstitutionId(institutions[0]?.id || '');
    setStatus('Agendado');
    setType('Culto');
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt: ReligiousEvent) => {
    if (activeRole === 'VISITOR') return;
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setDate(evt.date);
    setTime(evt.time);
    setInstitutionId(evt.institutionId);
    setStatus(evt.status);
    setType(evt.type);
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      setErrorMessage('Título, data e hora da atividade são obrigatórios.');
      return;
    }

    const payload = {
      title,
      description,
      date,
      time,
      institutionId,
      status,
      type
    };

    if (editingEvent) {
      onUpdate({ ...editingEvent, ...payload });
    } else {
      onAdd(payload);
    }
    setIsFormOpen(false);
  };

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || evt.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || evt.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Filters */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">01 / AGENDA DE ATIVIDADES E EVENTOS</h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-serif italic">Acompanhe cultos, missas, campanhas de ação social e eventos das instituições eclesiásticas.</p>
          </div>

          {activeRole !== 'VISITOR' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
            >
              <Plus size={14} />
              AGENDAR ATIVIDADE
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1A1A1A]/40">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="PROCURAR ATIVIDADE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 pl-9 pr-3 text-[11px] placeholder-[#1A1A1A]/40 uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 px-3 text-[11px] text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="All">TODOS OS TIPOS</option>
              <option value="Culto">CULTOS</option>
              <option value="Missa">MISSAS</option>
              <option value="Conferência">CONFERÊNCIAS</option>
              <option value="Ação Social">ACÇÕES SOCIAIS</option>
              <option value="Outro">OUTRAS ATIVIDADES</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 px-3 text-[11px] text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="All">QUALQUER ESTADO</option>
              <option value="Agendado">AGENDADO</option>
              <option value="Realizado">REALIZADO</option>
              <option value="Cancelado">CANCELADO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Agenda List (Fine editorial borders) */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="border border-[#1A1A1A] bg-white p-12 text-center text-[#1A1A1A]/50 text-xs font-mono uppercase tracking-widest">
            Nenhuma atividade agendada corresponde à sua pesquisa.
          </div>
        ) : (
          filteredEvents.map(evt => {
            const correspondingChurch = institutions.find(i => i.id === evt.institutionId);

            return (
              <div 
                key={evt.id} 
                className="group relative border border-[#1A1A1A] bg-white p-6 shadow-none transition hover:bg-[#F9F8F6] md:flex md:items-center md:justify-between gap-6 overflow-hidden"
              >
                {/* Visual indicator corner tagged by type */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  evt.type === 'Missa' ? 'bg-[#E63946]' :
                  evt.type === 'Culto' ? 'bg-[#1A1A1A]' :
                  evt.type === 'Conferência' ? 'bg-[#1A1A1A]/60' :
                  evt.type === 'Ação Social' ? 'bg-[#E63946]/70' : 'bg-[#1A1A1A]/30'
                }`} />

                <div className="space-y-2 flex-1 md:pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest font-mono">
                      {evt.type.toUpperCase()}
                    </span>
                    
                    <span className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-mono ${
                      evt.status === 'Agendado' ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' :
                      evt.status === 'Realizado' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' :
                      'border-rose-600 bg-rose-50 text-rose-800'
                    }`}>
                      {evt.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-serif italic font-extrabold text-[#1A1A1A] text-lg leading-tight">
                    {evt.title}
                  </h3>
                  
                  <p className="text-xs text-[#1A1A1A]/70 max-w-2xl leading-relaxed font-light">
                    {evt.description}
                  </p>

                  {correspondingChurch && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A]/80 uppercase tracking-wider font-mono">
                      <MapPin size={12} className="shrink-0 text-[#E63946]" />
                      <span>{correspondingChurch.name} ({correspondingChurch.municipality.toUpperCase()} — {correspondingChurch.neighborhood.toUpperCase()})</span>
                    </div>
                  )}
                </div>

                {/* Right side: DateTime details and Admin Actions */}
                <div className="mt-4 md:mt-0 flex flex-col md:items-end justify-between h-full space-y-4 shrink-0">
                  <div className="flex flex-col md:items-end font-mono text-[10px] tracking-widest text-[#1A1A1A]/60 uppercase">
                    <div className="flex items-center gap-1.5 pb-1">
                      <CalendarCheck size={12} className="text-[#1A1A1A]/40" />
                      <span className="font-bold text-[#1A1A1A]">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={12} className="text-[#1A1A1A]/40" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {activeRole !== 'VISITOR' && (
                    <div className="flex items-center gap-1.5 pt-2 md:pt-0">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="flex items-center gap-1 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] bg-white text-[#1A1A1A] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition"
                      >
                        <Edit size={10} />
                        EDITAR
                      </button>
                      
                      {activeRole === 'ADMIN' && (
                        <button
                          onClick={() => onDelete(evt.id)}
                          className="flex items-center gap-1 border border-[#E63946]/20 hover:border-[#E63946] bg-white text-[#E63946] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition"
                        >
                          <Trash2 size={10} />
                          EXCLUIR
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Dialogue Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/55 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-white border border-[#1A1A1A] p-6 shadow-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">
                {editingEvent ? '02 // ALTERAR DADOS ATIVIDADE' : '02 // NOVO AGENDAMENTO DE ATIVIDADE'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#1A1A1A]/65 hover:text-[#1A1A1A] transition">
                <X size={16} />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 flex items-center gap-2 border border-[#E63946] bg-red-50 p-3 text-xs text-[#E63946] font-semibold">
                <AlertCircle size={14} className="shrink-0" />
                <span className="uppercase tracking-wider font-mono text-[10px]">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Event Title */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Título do Evento / Atividade *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: MISSA VOCACIONAL PROVINCIAL"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs uppercase tracking-wide focus:border-[#1A1A1A] focus:outline-none"
                />
              </div>

              {/* Event description */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Descrição ou Programa</label>
                <textarea
                  placeholder="EX: CELEBRAÇÃO PRESIDIDA PELO BISPO DIOCESANO DO HUAMBO COM PARTICIPAÇÃO DE TODAS AS PARÓQUIAS CIVIS..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 border border-[#1A1A1A]/20 px-3 py-2 text-xs uppercase tracking-wide focus:border-[#1A1A1A] focus:outline-none resize-none font-serif"
                />
              </div>

              {/* Grid: Type and Destination Location Church */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Tipo de Atividade</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    <option value="Culto">CULTO</option>
                    <option value="Missa">MISSA</option>
                    <option value="Conferência">CONFERÊNCIA</option>
                    <option value="Ação Social">ACÇÃO SOCIAL</option>
                    <option value="Outro">OUTRO</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Templo Associado</label>
                  <select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name.toUpperCase()} ({inst.municipality.toUpperCase()})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Date, Time & Status */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-mono">Data *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-2 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-mono">Hora *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-2 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border border-[#1A1A1A]/20 px-2 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    <option value="Agendado">AGENDADO</option>
                    <option value="Realizado">REALIZADO</option>
                    <option value="Cancelado">CANCELADO</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="border border-[#1A1A1A]/30 hover:bg-[#1A1A1A]/5 text-[#1A1A1A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  {editingEvent ? 'EDITAR REGISTO' : 'CONFIRMAR AGENDAMENTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
