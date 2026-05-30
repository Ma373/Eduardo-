import React, { useState } from 'react';
import { Leader, Institution, UserRole } from '../types';
import { LEADER_CARGOS } from '../data';
import { Search, Plus, Edit, Trash2, X, AlertCircle, Sparkles, UserCheck, Phone, Mail } from 'lucide-react';

interface LeadersTabProps {
  leaders: Leader[];
  institutions: Institution[];
  activeRole: UserRole;
  onAdd: (leader: Omit<Leader, 'id'>) => void;
  onUpdate: (leader: Leader) => void;
  onDelete: (id: string) => void;
}

export default function LeadersTab({
  leaders,
  institutions,
  activeRole,
  onAdd,
  onUpdate,
  onDelete
}: LeadersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCargo, setSelectedCargo] = useState<string>('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);

  // Form input variables
  const [name, setName] = useState('');
  const [role, setRole] = useState(LEADER_CARGOS[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [institutionId, setInstitutionId] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenAdd = () => {
    if (activeRole === 'VISITOR') return;
    setEditingLeader(null);
    setName('');
    setRole(LEADER_CARGOS[0]);
    setPhone('');
    setEmail('');
    setInstitutionId(institutions[0]?.id || '');
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (l: Leader) => {
    if (activeRole === 'VISITOR') return;
    setEditingLeader(l);
    setName(l.name);
    setRole(l.role);
    setPhone(l.phone);
    setEmail(l.email);
    setInstitutionId(l.institutionId || '');
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('O nome do líder é de preenchimento obrigatório.');
      return;
    }

    const payload = {
      name,
      role,
      phone,
      email,
      institutionId: institutionId || undefined
    };

    if (editingLeader) {
      onUpdate({ ...editingLeader, ...payload });
    } else {
      onAdd(payload);
    }
    setIsFormOpen(false);
  };

  // Filter lists
  const filteredLeaders = leaders.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.phone.includes(searchTerm);
    const matchesCargo = selectedCargo === 'All' || l.role === selectedCargo;
    return matchesSearch && matchesCargo;
  });

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">01 / LÍDERES ECLESIÁSTICOS REGISTADOS</h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-serif italic">Registe e consulte sacerdotes, pastores, bispos e responsáveis pelas congregações.</p>
          </div>

          {activeRole !== 'VISITOR' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
            >
              <Plus size={14} />
              REGISTAR LÍDER
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="relative sm:col-span-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1A1A1A]/40">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="PESQUISAR LÍDER POR NOME, TELEFONE E-MAIL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 pl-9 pr-3 text-[11px] placeholder-[#1A1A1A]/40 uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCargo}
              onChange={(e) => setSelectedCargo(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 px-3 text-[11px] text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="All">TODOS OS CARGOS</option>
              {LEADER_CARGOS.map(cargo => (
                <option key={cargo} value={cargo}>{cargo.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Leaders (Editorial Minimalist index-style layouts) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLeaders.length === 0 ? (
          <div className="col-span-full border border-[#1A1A1A] bg-white p-12 text-center text-[#1A1A1A]/50 text-xs font-mono uppercase tracking-widest">
            Nenhum líder encontrado com esses critérios.
          </div>
        ) : (
          filteredLeaders.map(leader => {
            const connectedInstitution = institutions.find(inst => inst.id === leader.institutionId);

            return (
              <div 
                key={leader.id} 
                className="border border-[#1A1A1A] bg-white p-6 shadow-none transition hover:bg-[#F9F8F6] flex flex-col justify-between gap-6"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border border-[#1A1A1A]/20 bg-[#F9F8F6] text-[#1A1A1A]">
                        <UserCheck size={18} />
                      </div>
                      <div>
                        <h3 className="font-serif italic font-extrabold text-[#1A1A1A] text-base leading-tight">{leader.name}</h3>
                        <span className="inline-block bg-[#1A1A1A] text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest mt-1">
                          {leader.role.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {activeRole !== 'VISITOR' && (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(leader)}
                          className="p-1 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/50 hover:text-[#1A1A1A] bg-white transition"
                          title="Editar"
                        >
                          <Edit size={12} />
                        </button>
                        {activeRole === 'ADMIN' && (
                          <button
                            onClick={() => onDelete(leader.id)}
                            className="p-1 border border-[#E63946]/20 hover:border-[#E63946] text-[#E63946]/60 hover:text-[#E63946] bg-white transition"
                            title="Eliminar"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Institution reference details */}
                  <div className="mt-4 border-t border-[#1A1A1A]/10 pt-4 text-xs">
                    <span className="text-[9px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Instituição Constituída</span>
                    <p className="font-bold text-[#1A1A1A] uppercase tracking-wide mt-1">
                      {connectedInstitution ? connectedInstitution.name : 'NENHUMA CONGREGAÇÃO VINCULADA'}
                    </p>
                    {connectedInstitution && (
                      <p className="text-[10px] text-[#E63946] font-mono mt-0.5 uppercase tracking-wider">📍 {connectedInstitution.municipality}</p>
                    )}
                  </div>
                </div>

                {/* Footer contact details */}
                <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-1.5 text-xs text-[#1A1A1A]/70 uppercase tracking-wide">
                  <div className="flex items-center gap-2">
                    <Phone className="text-[#1A1A1A]/40 shrink-0" size={12} />
                    <span className="font-mono text-[10px]">{leader.phone || 'SEM NÚMERO'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-[#1A1A1A]/40 shrink-0" size={12} />
                    <span className="truncate lowercase text-[10px]">{leader.email || 'SEM E-MAIL'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Leader Add/Edit Prompt Dialog Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-white border border-[#1A1A1A] p-6 shadow-none animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">
                {editingLeader ? '02 // ALTERAR DADOS LÍDER' : '02 // NOVO REGISTO DE LÍDER'}
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
              {/* Leader Name */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: DOM PEIXOTO JOÃO"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs uppercase tracking-wide focus:border-[#1A1A1A] focus:outline-none"
                />
              </div>

              {/* Leader cargo/ecclesiastical role */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Cargo Eclesiástico</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                >
                  {LEADER_CARGOS.map(cargo => (
                    <option key={cargo} value={cargo}>{cargo.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Institution Bind Relation */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Templo / Instituição sob Liderança</label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                >
                  <option value="">NENHUM TEMPLO (NÃO ALOCADO)</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name.toUpperCase()} ({inst.municipality.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              {/* Phone contact input */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Telefone de Contacto</label>
                <input
                  type="tel"
                  placeholder="EX: +244923456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs font-mono focus:border-[#1A1A1A] focus:outline-none"
                />
              </div>

              {/* Email address input */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Endereço Eletrónico (E-mail)</label>
                <input
                  type="email"
                  placeholder="EX: SECRETARIA@ADMINISTRACAO.AO"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs lowercase focus:border-[#1A1A1A] focus:outline-none"
                />
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
                  className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  {editingLeader ? 'EDITAR REGISTO' : 'CONFIRMAR REGISTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
