import React, { useState } from 'react';
import { Institution, Leader, ReligionType, InstitutionStatus, UserRole } from '../types';
import { HUAMBO_MUNICIPALITIES, RELIGION_TYPES } from '../data';
import { Search, Filter, Plus, Edit, Trash2, X, AlertCircle, Building, Check } from 'lucide-react';

interface InstitutionsTabProps {
  institutions: Institution[];
  leaders: Leader[];
  activeRole: UserRole;
  onAdd: (institution: Omit<Institution, 'id'>) => void;
  onUpdate: (institution: Institution) => void;
  onDelete: (id: string) => void;
}

export default function InstitutionsTab({
  institutions,
  leaders,
  activeRole,
  onAdd,
  onUpdate,
  onDelete
}: InstitutionsTabProps) {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Institution | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [religionType, setReligionType] = useState<ReligionType>('Católica');
  const [municipality, setMunicipality] = useState(HUAMBO_MUNICIPALITIES[0]);
  const [neighborhood, setNeighborhood] = useState('');
  const [foundedYear, setFoundedYear] = useState(2000);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<InstitutionStatus>('Ativa');
  const [leaderId, setLeaderId] = useState('');

  // Form error states
  const [errorMessage, setErrorMessage] = useState('');

  // Open form for adding new
  const handleOpenAdd = () => {
    if (activeRole === 'VISITOR') return;
    setEditingInst(null);
    setName('');
    setReligionType('Católica');
    setMunicipality(HUAMBO_MUNICIPALITIES[0]);
    setNeighborhood('');
    setFoundedYear(2025);
    setPhone('');
    setEmail('');
    setStatus('Ativa');
    setLeaderId(leaders[0]?.id || '');
    setErrorMessage('');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleOpenEdit = (inst: Institution) => {
    if (activeRole === 'VISITOR') return;
    setEditingInst(inst);
    setName(inst.name);
    setReligionType(inst.religionType);
    setMunicipality(inst.municipality);
    setNeighborhood(inst.neighborhood);
    setFoundedYear(inst.foundedYear);
    setPhone(inst.phone);
    setEmail(inst.email);
    setStatus(inst.status);
    setLeaderId(inst.leaderId);
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('O nome da instituição religiosa é obrigatório.');
      return;
    }

    const payload = {
      name,
      religionType,
      municipality,
      neighborhood,
      foundedYear,
      phone,
      email,
      status,
      leaderId
    };

    if (editingInst) {
      onUpdate({ ...editingInst, ...payload });
    } else {
      onAdd(payload);
    }
    setIsFormOpen(false);
  };

  // Filter institutions
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReligion = selectedReligion === 'All' || inst.religionType === selectedReligion;
    const matchesMunicipality = selectedMunicipality === 'All' || inst.municipality === selectedMunicipality;
    const matchesStatus = selectedStatus === 'All' || inst.status === selectedStatus;

    return matchesSearch && matchesReligion && matchesMunicipality && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Section */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">01 / INSTITUIÇÕES REGISTADAS</h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-serif italic">Consulte, pesquise e faça a gestão das igrejas cadastradas na província.</p>
          </div>
          
          {activeRole !== 'VISITOR' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
            >
              <Plus size={14} />
              REGISTAR TEMPLO
            </button>
          )}
        </div>

        {/* Dynamic filters grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1A1A1A]/40">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="PESQUISAR NOME OU BAIRRO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 pl-9 pr-3 text-[11px] placeholder-[#1A1A1A]/40 uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            />
          </div>

          {/* Religion Type Selector */}
          <div>
            <select
              value={selectedReligion}
              onChange={(e) => setSelectedReligion(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 px-3 text-[11px] text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="All">TODAS AS DENOMINAÇÕES</option>
              {RELIGION_TYPES.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Municipality Selector */}
          <div>
            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 px-3 text-[11px] text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="All">TODOS OS MUNICÍPIOS</option>
              {HUAMBO_MUNICIPALITIES.map(muni => (
                <option key={muni} value={muni}>{muni.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-white py-2 px-3 text-[11px] text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="All">QUALQUER ESTADO</option>
              <option value="Ativa">REGULARIZADA / ATIVA</option>
              <option value="Inativa">INATIVA</option>
              <option value="Em Processo de Registo">EM PROCESSO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of items / Table */}
      <div className="border border-[#1A1A1A] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#1A1A1A] bg-[#1A1A1A]/5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
                <th className="p-4">Instituição / ID</th>
                <th className="p-4">Denominação</th>
                <th className="p-4">Geolocalização / Bairro</th>
                <th className="p-4">Líder Líquido</th>
                <th className="p-4 text-center">Ano Fundação</th>
                <th className="p-4">Estado</th>
                {(activeRole !== 'VISITOR') && <th className="p-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/10 text-xs">
              {filteredInstitutions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#1A1A1A]/50 uppercase tracking-widest font-mono">
                    Nenhuma instituição religiosa encontrada com esses filtros.
                  </td>
                </tr>
              ) : (
                filteredInstitutions.map((inst) => {
                  const correlatedLeader = leaders.find(l => l.id === inst.leaderId);
                  
                  return (
                    <tr key={inst.id} className="hover:bg-[#1A1A1A]/5 transition">
                      {/* Name of Church */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-2 text-[#1A1A1A]">
                            <Building size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A] uppercase tracking-wide">{inst.name}</p>
                            <p className="text-[10px] text-[#1A1A1A]/40 font-mono">CODE ID: {inst.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Denomination Type */}
                      <td className="p-4">
                        <span className="inline-block bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          {inst.religionType}
                        </span>
                      </td>

                      {/* Geological Location */}
                      <td className="p-4 text-[#1A1A1A]">
                        <p className="font-bold uppercase text-[10px] tracking-wider">{inst.municipality}</p>
                        <p className="text-[10px] text-[#1A1A1A]/50 font-mono lowercase">{inst.neighborhood}</p>
                      </td>

                      {/* Leader details */}
                      <td className="p-4">
                        {correlatedLeader ? (
                          <div>
                            <p className="font-bold text-[#1A1A1A] uppercase tracking-wide">{correlatedLeader.name}</p>
                            <p className="text-[10px] text-[#1A1A1A]/40 font-mono uppercase">{correlatedLeader.role}</p>
                          </div>
                        ) : (
                          <span className="text-[#1A1A1A]/30 uppercase font-mono tracking-widest text-[9px]">NÃO DESIGNADO</span>
                        )}
                      </td>

                      {/* Foundation Year */}
                      <td className="p-4 text-center font-mono font-bold text-[#1A1A1A]">
                        {inst.foundedYear}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-block border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest font-mono ${
                          inst.status === 'Ativa' ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' :
                          inst.status === 'Inativa' ? 'border-[#E63946] bg-red-50 text-[#E63946]' :
                          'border-blue-600 bg-blue-50 text-blue-800'
                        }`}>
                          {inst.status === 'Em Processo de Registo' ? 'EM PROCESSO' : inst.status}
                        </span>
                      </td>

                      {/* Actions */}
                      {activeRole !== 'VISITOR' && (
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(inst)}
                              className="p-1 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/50 hover:text-[#1A1A1A] bg-white transition"
                              title="Editar Instituição"
                            >
                              <Edit size={12} />
                            </button>
                            
                            {activeRole === 'ADMIN' && (
                              <button
                                onClick={() => onDelete(inst.id)}
                                className="p-1 border border-[#E63946]/20 hover:border-[#E63946] text-[#E63946]/60 hover:text-[#E63946] bg-white transition"
                                title="Eliminar"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-lg bg-white border border-[#1A1A1A] p-6 shadow-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">
                {editingInst ? '02 // ALTERAR DADOS TEMPLO' : '02 // NOVO REGISTO DE INSTITUIÇÃO'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#1A1A1A]/65 hover:text-[#1A1A1A] transition">
                <X size={16} />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 border border-[#E63946] bg-red-50 p-3 text-xs text-[#E63946] font-semibold">
                <AlertCircle size={14} className="shrink-0" />
                <span className="uppercase tracking-wider font-mono text-[10px]">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Institution Name */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Nome Oficial da Instituição *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: IGREJA ADVENTISTA DO SÉTIMO DIA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs uppercase tracking-wide focus:border-[#1A1A1A] focus:outline-none"
                />
              </div>

              {/* Grid: Religion Type & Founded Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Denominação Religiosa</label>
                  <select
                    value={religionType}
                    onChange={(e) => setReligionType(e.target.value as ReligionType)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    {RELIGION_TYPES.map(type => (
                      <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Ano de Fundação</label>
                  <input
                    type="number"
                    min={1500}
                    max={2030}
                    required
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(parseInt(e.target.value) || 2025)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {/* Grid: Municipality & Neighborhood */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Município do Huambo</label>
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    {HUAMBO_MUNICIPALITIES.map(muni => (
                      <option key={muni} value={muni}>{muni.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Bairro / Localidade</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: BAIRRO CHIVA"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs uppercase tracking-wide focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Grid: Phone and Email */}
              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Correio Eletrónico (E-mail)</label>
                  <input
                    type="email"
                    placeholder="EX: SECRETARIA@IGREJA.AO"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs lowercase focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Leader Relation & Registration Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Líder Responsável</label>
                  <select
                    value={leaderId}
                    onChange={(e) => setLeaderId(e.target.value)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    <option value="">NENHUM</option>
                    {leaders.map(l => (
                      <option key={l.id} value={l.id}>{l.name.toUpperCase()} ({l.role.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Estado de Registo</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InstitutionStatus)}
                    className="w-full border border-[#1A1A1A]/20 px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider font-bold"
                  >
                    <option value="Ativa">REGULARIZADA / ATIVA</option>
                    <option value="Inativa">INATIVA</option>
                    <option value="Em Processo de Registo">EM PROCESSO DE REGISTO</option>
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
                  className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  <Check size={12} />
                  {editingInst ? 'GRAVAR ALTERAÇÕES' : 'CONFIRMAR REGISTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
