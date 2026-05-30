import { useState } from 'react';
import { Institution, Leader, ReligiousEvent } from '../types';
import { HUAMBO_MUNICIPALITIES, RELIGION_TYPES } from '../data';
import { FileText, Printer } from 'lucide-react';

interface ReportsTabProps {
  institutions: Institution[];
  leaders: Leader[];
  events: ReligiousEvent[];
}

export default function ReportsTab({ institutions, leaders, events }: ReportsTabProps) {
  const [reportType, setReportType] = useState<'municipality' | 'denomination' | 'status'>('municipality');
  const [selectedMuni, setSelectedMuni] = useState<string>('All');
  const [selectedRel, setSelectedRel] = useState<string>('All');

  // Print simulation trigger
  const handlePrint = () => {
    window.print();
  };

  // 1. Group by Municipality Report
  const renderMunicipalityData = () => {
    const list = selectedMuni === 'All' ? HUAMBO_MUNICIPALITIES : [selectedMuni];
    return list.map(muni => {
      const muniInsts = institutions.filter(i => i.municipality === muni);
      const muniActive = muniInsts.filter(i => i.status === 'Ativa').length;
      const muniInactive = muniInsts.filter(i => i.status === 'Inativa').length;
      const muniPending = muniInsts.filter(i => i.status === 'Em Processo de Registo').length;
      
      if (muniInsts.length === 0 && selectedMuni === 'All') return null; // Skip empty in list representation

      return {
        name: muni,
        total: muniInsts.length,
        active: muniActive,
        inactive: muniInactive,
        pending: muniPending,
        churches: muniInsts
      };
    }).filter(Boolean) as any[];
  };

  // 2. Group by Denomination/Religion Report
  const renderDenominationData = () => {
    const list = selectedRel === 'All' ? RELIGION_TYPES : [selectedRel];
    return list.map(rel => {
      const relInsts = institutions.filter(i => i.religionType === rel);
      const relActive = relInsts.filter(i => i.status === 'Ativa').length;
      const relMuniCount = new Set(relInsts.map(i => i.municipality)).size;

      if (relInsts.length === 0 && selectedRel === 'All') return null;

      return {
        denomination: rel,
        total: relInsts.length,
        active: relActive,
        municipalitiesCount: relMuniCount,
        churches: relInsts
      };
    }).filter(Boolean) as any[];
  };

  const municipalityReport = renderMunicipalityData();
  const denominationReport = renderDenominationData();

  return (
    <div className="space-y-6">
      {/* Report Controls Panel */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
              <FileText className="text-[#1A1A1A]" size={16} />
              01 / CENTRAL DE RELATÓRIOS ADMINISTRATIVOS
            </h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-serif italic">Gere resumos, contagens estatísticas e tabelas formatadas prontas para consulta governamental.</p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition shrink-0"
          >
            <Printer size={13} />
            IMPRIMIR RELATÓRIO (PDF)
          </button>
        </div>

        {/* Tab configuration inside reports */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReportType('municipality')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition border ${
              reportType === 'municipality' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-transparent text-[#1A1A1A]/60 border-transparent hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]'
            }`}
          >
            ESTATÍSTICAS POR MUNICÍPIO
          </button>
          
          <button
            onClick={() => setReportType('denomination')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition border ${
              reportType === 'denomination' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-transparent text-[#1A1A1A]/60 border-transparent hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]'
            }`}
          >
            ESTATÍSTICAS POR DENOMINAÇÃO
          </button>
        </div>

        {/* Localized Filter within reports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10">
          {reportType === 'municipality' && (
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/60">Filtrar por Município</label>
              <select
                value={selectedMuni}
                onChange={(e) => setSelectedMuni(e.target.value)}
                className="w-full border border-[#1A1A1A]/20 bg-white p-2 text-xs uppercase font-bold tracking-wide focus:border-[#1A1A1A] focus:outline-none"
              >
                <option value="All font-bold">VER TODOS OS MUNICÍPIOS</option>
                {HUAMBO_MUNICIPALITIES.map(m => (
                  <option key={m} value={m}>{m.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'denomination' && (
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/60">Filtrar por Denominação</label>
              <select
                value={selectedRel}
                onChange={(e) => setSelectedRel(e.target.value)}
                className="w-full border border-[#1A1A1A]/20 bg-white p-2 text-xs uppercase font-bold tracking-wide focus:border-[#1A1A1A] focus:outline-none"
              >
                <option value="All">VER TODAS AS DENOMINAÇÕES</option>
                {RELIGION_TYPES.map(rt => (
                  <option key={rt} value={rt}>{rt.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center text-[10px] text-[#1A1A1A]/60 uppercase tracking-wider font-mono p-1 leading-tight">
            * Use os seletores para delimitar as tabelas oficiais abaixo antes de gerar o documento físico de impressão.
          </div>
        </div>
      </div>

      {/* Styled Printable Sheet (Aesthetic Dossier Layout) */}
      <div className="print-sheet border border-[#1A1A1A] bg-white p-8 md:p-12 shadow-none space-y-8">
        
        {/* Document Header */}
        <div className="text-center border-b border-[#1A1A1A] pb-6 space-y-1.5 text-[#1A1A1A]">
          <p className="font-bold text-xs uppercase tracking-[0.25em] font-serif">República de Angola</p>
          <p className="font-extrabold text-xs uppercase tracking-widest font-sans">Governo Provincial do Huambo</p>
          <p className="text-[10px] text-[#1A1A1A]/60 uppercase tracking-[0.15em] font-mono">Gabinete Provincial de Cultura, Turismo e Assuntos Religiosos</p>
          
          <div className="py-3 inline-block">
            <span className="h-10 w-10 flex items-center justify-center border border-[#1A1A1A] bg-[#F9F8F6] mx-auto font-serif italic text-sm font-bold">
              H
            </span>
          </div>
          
          <h1 className="text-xl font-serif italic font-extrabold pb-1 tracking-tight text-[#1A1A1A]">
            {reportType === 'municipality' ? 'Relatório Oficial de Instituições por Circunscrição Municipal' : 'Relatório Oficial de Instituições por Afiliação Denominacional'}
          </h1>
          <p className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/50 font-mono">GAB-ID: {new Date().toLocaleDateString('pt-AO')} / HUAMBO SECTOR CENTRAL</p>
        </div>

        {/* Content Sheets of Reports */}
        <div className="space-y-8">
          {reportType === 'municipality' && (
            <div className="space-y-8">
              {municipalityReport.length === 0 ? (
                <p className="py-6 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/40 font-mono">Nenhum registo associado para este município.</p>
              ) : (
                municipalityReport.map(item => (
                  <div key={item.name} className="border-b border-[#1A1A1A]/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-4 py-2 mb-3 gap-2">
                      <span className="font-extrabold text-xs text-[#1A1A1A] uppercase tracking-widest font-mono">
                        📍 Circunscrição de {item.name}
                      </span>
                      <div className="flex gap-4 text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono">
                        <span>Total: {item.total}</span>
                        <span className="text-[#1A1A1A] font-extrabold">Ativas: {item.active}</span>
                        <span className="text-[#E63946]">Inativas: {item.inactive}</span>
                        <span className="text-[#1A1A1A]/50">Pendente: {item.pending}</span>
                      </div>
                    </div>

                    {/* Sub list of churches under this specific municipality */}
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#1A1A1A]/30 text-[#1A1A1A] font-extrabold uppercase text-[9px] tracking-wider">
                          <th className="py-2">Nome da Instituição</th>
                          <th className="py-2">Denominação</th>
                          <th className="py-2">Bairro / Zona</th>
                          <th className="py-2">Contacto</th>
                          <th className="py-2 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A1A1A]/10">
                        {item.churches.map((c: any) => (
                          <tr key={c.id} className="text-[#1A1A1A]/85">
                            <td className="py-2.5 pr-2 font-bold text-[#1A1A1A] uppercase tracking-wide">{c.name}</td>
                            <td className="py-2.5 pr-2 font-mono text-[10px] uppercase">{c.religionType}</td>
                            <td className="py-2.5 pr-2 uppercase text-[10px] tracking-wide text-[#1A1A1A]/60">{c.neighborhood}</td>
                            <td className="py-2.5 pr-2 font-mono text-[10px] text-[#1A1A1A]/50">{c.phone || 'SEM NÚMERO'}</td>
                            <td className="py-2.5 text-center">
                              <span className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-mono ${
                                c.status === 'Ativa' ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' :
                                c.status === 'Inativa' ? 'border-[#E63946] bg-red-50 text-[#E63946]' : 'border-blue-600 bg-blue-50 text-blue-800'
                              }`}>
                                {c.status === 'Em Processo de Registo' ? 'PROCESSO' : c.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          )}

          {reportType === 'denomination' && (
            <div className="space-y-8">
              {denominationReport.length === 0 ? (
                <p className="py-6 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/40 font-mono">Nenhum registo disponível para denominação.</p>
              ) : (
                denominationReport.map(item => (
                  <div key={item.denomination} className="border-b border-[#1A1A1A]/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-4 py-2 mb-3 gap-2">
                      <span className="font-extrabold text-xs text-[#1A1A1A] uppercase tracking-widest font-mono">
                        ⛪ Denominação: {item.denomination.toUpperCase()}
                      </span>
                      <div className="flex gap-4 text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono">
                        <span>Registos: {item.total}</span>
                        <span className="text-[#1A1A1A] font-extrabold">Ativas: {item.active}</span>
                        <span>Cidades activas: {item.municipalitiesCount}</span>
                      </div>
                    </div>

                    {/* Sub list */}
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#1A1A1A]/30 text-[#1A1A1A] font-extrabold uppercase text-[9px] tracking-wider">
                          <th className="py-2">Nome da Instituição</th>
                          <th className="py-2">Círculo Municipal</th>
                          <th className="py-2">Bairro / Zona</th>
                          <th className="py-2">Canal Digital (E-mail)</th>
                          <th className="py-2 text-center">Ano Fundação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A1A1A]/10">
                        {item.churches.map((c: any) => (
                          <tr key={c.id} className="text-[#1A1A1A]/85">
                            <td className="py-2.5 pr-2 font-bold text-[#1A1A1A] uppercase tracking-wide">{c.name}</td>
                            <td className="py-2.5 pr-2 font-extrabold text-[10px] uppercase tracking-widest text-[#E63946]">{c.municipality}</td>
                            <td className="py-2.5 pr-2 uppercase text-[10px] tracking-wide text-[#1A1A1A]/60">{c.neighborhood}</td>
                            <td className="py-2.5 pr-2 font-mono text-[10px] text-[#1A1A1A]/50 lowercase">{c.email || 'CONTEÚDO NÃO DESIGNADO'}</td>
                            <td className="py-2.5 text-center font-mono font-bold">{c.foundedYear}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Official seals & Signatures placeholder */}
        <div className="mt-16 pt-8 border-t border-dashed border-[#1A1A1A]/40 grid grid-cols-2 gap-8 text-center text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-mono">
          <div className="space-y-8">
            <p>O Administrador Civil / Desenvolvedor</p>
            <div className="h-0.5 border-b border-[#1A1A1A]/20 w-48 mx-auto" />
            <div>
              <p className="font-bold text-[#1A1A1A] font-serif italic text-xs capitalize">João Q. K. Tchayevala</p>
              <p className="text-[8px]">ID REGISTO: 14 | I.P. CACHIUNGO</p>
            </div>
          </div>

          <div className="space-y-8">
            <p>Por Delegação / O Orientador Científico</p>
            <div className="h-0.5 border-b border-[#1A1A1A]/20 w-48 mx-auto" />
            <div>
              <p className="font-bold text-[#1A1A1A] font-serif italic text-xs capitalize">Pedro Canoquela Capitango</p>
              <p className="text-[8px]">MEMBRO JÚRI TECNOLÓGICO PROVINCIAL</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
