import { useState } from 'react';
import { Institution, Leader, ReligiousEvent } from '../types';
import { HUAMBO_MUNICIPALITIES, RELIGION_TYPES } from '../data';
import { Church, Users, Calendar, Award, MapPin, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  institutions: Institution[];
  leaders: Leader[];
  events: ReligiousEvent[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ institutions, leaders, events, onNavigate }: DashboardProps) {
  // Aggregate statistics
  const totalInstitutions = institutions.length;
  const totalLeaders = leaders.length;
  const totalEvents = events.length;
  const activeInstitutionsCount = institutions.filter(inst => inst.status === 'Ativa').length;
  const processInstitutionsCount = institutions.filter(inst => inst.status === 'Em Processo de Registo').length;

  // Group by Religion Type
  const religionCounts = RELIGION_TYPES.map(type => {
    const count = institutions.filter(inst => inst.religionType === type).length;
    return { type, count };
  }).filter(item => item.count > 0);

  // Group by Municipality
  const municipalityCounts = HUAMBO_MUNICIPALITIES.map(muni => {
    const count = institutions.filter(inst => inst.municipality === muni).length;
    return { name: muni, count };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      {/* Editorial Headline & Main Visual Hero Banner */}
      <section className="border border-[#1A1A1A] bg-white p-10 md:p-12 flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#E63946] block">
            Status: PAINEL DE CONTROLO OPERACIONAL v4.0
          </span>
          <h1 className="text-[52px] md:text-[68px] leading-[0.9] font-serif italic font-light tracking-tight text-[#1A1A1A]">
            Sinfonia <br/>
            <span className="not-italic font-black text-[60px] md:text-[76px] uppercase tracking-tighter block mt-1 text-[#1A1A1A]">
              Funcional
            </span>
          </h1>
          <p className="text-sm md:text-base leading-relaxed font-light text-[#1A1A1A]/70 max-w-xl">
            Uma interface integrada desenhada para máxima eficiência operacional, controle estatístico, registro e fiscalização de todas as entidades e templos religiosos ativos nos 11 municípios da província do Huambo.
          </p>
        </div>

        {/* Big Editorial Metrics panel inside the hero */}
        <div className="lg:w-[350px] border-t lg:border-t-0 lg:border-l border-[#1A1A1A] pt-8 lg:pt-0 lg:pl-10 flex flex-col justify-between gap-6 shrink-0">
          <div>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] mb-4 text-[#1A1A1A]/50">01 / Monitoramento Geral</h2>
            <p className="text-xs text-[#1A1A1A]/70">Níveis globais de regularidade civil e territorial garantidos em conformidade estadual.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 border-t border-[#1A1A1A]/10 pt-6">
            <div className="flex flex-col">
              <span className="text-[38px] font-serif text-[#1A1A1A] leading-none select-none">{totalInstitutions}</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 mt-1">Instituições</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[38px] font-serif text-[#1A1A1A] leading-none select-none">{totalLeaders}</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 mt-1">Líderes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[38px] font-serif text-[#1A1A1A] leading-none select-none">{totalEvents}</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 mt-1">Agenda</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[38px] font-serif text-[#1A1A1A] leading-none select-none">
                {totalInstitutions > 0 ? ((activeInstitutionsCount / totalInstitutions) * 100).toFixed(0) : 0}%
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/40 mt-1">Regulares</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats Counters using index card aesthetic */}
      <section id="stats-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat card 1 */}
        <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/40">01 / TOTAL TEMPLOS</span>
            <div className="text-[#1A1A1A]"><Church size={16} /></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-serif font-black">{totalInstitutions}</h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold">● {activeInstitutionsCount} ATIVAS E REGULARES</p>
          </div>
        </div>

        {/* Stat card 2 */}
        <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/40">02 / LÍDERES REGISTADOS</span>
            <div className="text-[#1A1A1A]"><Users size={16} /></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-serif font-black">{totalLeaders}</h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#1A1A1A]/50">ADMINISTRADORES CIVIS</p>
          </div>
        </div>

        {/* Stat card 3 */}
        <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/40">03 / EVENTOS E AGENDAS</span>
            <div className="text-[#1A1A1A]"><Calendar size={16} /></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-serif font-black">{totalEvents}</h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#E63946] font-bold">ATIVIDADES NA PROVÍNCIA</p>
          </div>
        </div>

        {/* Stat card 4 */}
        <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/40">04 / EM PROCESSO</span>
            <div className="text-[#1A1A1A]"><ShieldCheck size={16} /></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-serif font-black">{processInstitutionsCount}</h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-blue-700 font-bold">EM ANÁLISE LEGAL</p>
          </div>
        </div>
      </section>

      {/* Charts section with monochromatic styled dashboards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Religion Distribution */}
        <div className="border border-[#1A1A1A] bg-white p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">01 / FILIAÇÃO & DENOMINAÇÃO RELIGIOSA</h2>
            <Activity className="text-[#1A1A1A]" size={16} />
          </div>
          
          <div className="space-y-5">
            {religionCounts.map((item, index) => {
              const percentages = totalInstitutions > 0 ? ((item.count / totalInstitutions) * 100).toFixed(0) : 0;
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#1A1A1A]">
                    <span>{item.type}</span>
                    <span className="font-mono text-[#1A1A1A]/60">{item.count} ({percentages}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1A1A1A]/5">
                    <div 
                      className="h-full bg-[#1A1A1A]" 
                      style={{ width: `${percentages}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Municipality Distribution */}
        <div className="border border-[#1A1A1A] bg-white p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">02 / DISTRIBUIÇÃO POR MUNICÍPIOS</h2>
            <MapPin className="text-[#1A1A1A]" size={16} />
          </div>
          
          {municipalityCounts.length === 0 ? (
            <p className="py-8 text-center text-xs uppercase tracking-wider font-mono text-[#1A1A1A]/40">Nenhum registo disponível.</p>
          ) : (
            <div className="space-y-4">
              {municipalityCounts.map((item) => {
                const maxCount = Math.max(...municipalityCounts.map(m => m.count));
                const scaleWidth = ((item.count / maxCount) * 100).toFixed(0);
                return (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="w-28 truncate text-xs font-bold text-[#1A1A1A]/80 uppercase tracking-wider">{item.name}</span>
                    <div className="flex-1 h-3 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#1A1A1A]/60 to-[#1A1A1A]"
                        style={{ width: `${scaleWidth}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1A1A1A] w-6 text-right">{item.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Map Widget */}
      <section className="border border-[#1A1A1A] bg-white p-8">
        <div className="mb-6 border-b border-[#1A1A1A]/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">03 / MAPA DE DENSIDADE GEOGRÁFICA</h2>
            <p className="text-[11px] text-[#1A1A1A]/60 mt-1 uppercase tracking-wide">Mapeamento civil de templos religiosos autorizados no Huambo.</p>
          </div>
          <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-white font-mono text-[9px] tracking-widest uppercase">
            CONTROLO AUTOMATIZADO
          </span>
        </div>
        
        <div className="relative mt-4 h-80 bg-[#F9F8F6] border border-[#1A1A1A] flex items-center justify-center overflow-hidden">
          {/* Elegant structural grid layout lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-b border-r border-[#1A1A1A]/5" />
            ))}
          </div>

          {/* Render stylized municipality nodes */}
          <div className="relative w-full h-full">
            {institutions.map((inst, index) => {
              // Deterministic but random-looking coordinates in the container for illustration
              const xPositions = [35, 60, 20, 75, 45, 15, 80, 50, 30, 65, 55];
              const yPositions = [30, 50, 25, 40, 70, 60, 15, 80, 45, 85, 90];
              const x = xPositions[index % xPositions.length];
              const y = yPositions[index % yPositions.length];
              
              return (
                <div 
                  key={inst.id} 
                  className="absolute pointer-events-auto group cursor-help transition transform hover:scale-125"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="flex h-6 w-6 items-center justify-center bg-white shadow-none border border-[#1A1A1A] text-[#1A1A1A] font-bold group-hover:bg-[#1A1A1A] group-hover:text-white transition">
                    <Church size={11} />
                  </div>
                  {/* Outer circle accent */}
                  <div className="absolute -inset-1 border border-dashed border-[#1A1A1A]/20 scale-125" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 bottom-full mb-2 z-20 hidden -translate-x-1/2 group-hover:block w-52 bg-[#1A1A1A] p-3 text-[10px] text-white shadow-none border border-white/10">
                    <p className="font-serif italic text-white truncate text-xs pb-1 border-b border-white/10 mb-1">{inst.name}</p>
                    <p className="text-white/80 uppercase font-mono tracking-widest">{inst.religionType} — {inst.municipality}</p>
                    <p className="text-white/40 font-mono mt-1 uppercase tracking-wider">{inst.neighborhood}</p>
                  </div>
                </div>
              );
            })}

            {/* Styled map boundaries & labels of towns in clear serif / mono */}
            <div className="absolute top-[20%] left-[25%] font-mono text-[9px] text-[#1A1A1A]/40 tracking-[0.2em] uppercase font-bold">BAILUNDO M.</div>
            <div className="absolute top-[45%] left-[50%] font-serif italic text-[16px] text-[#1A1A1A]/20 tracking-widest uppercase font-bold">HUAMBO CENTRO</div>
            <div className="absolute top-[35%] left-[70%] font-mono text-[9px] text-[#1A1A1A]/40 tracking-[0.2em] uppercase font-bold">CACHIUNGO M.</div>
            <div className="absolute top-[65%] left-[15%] font-mono text-[9px] text-[#1A1A1A]/40 tracking-[0.2em] uppercase font-bold">CAÁLA M.</div>
          </div>
        </div>
      </section>

      {/* Latest Events & Quick Links */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Latest Events */}
        <div className="col-span-1 md:col-span-2 border border-[#1A1A1A] bg-white p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A]">04 / PRÓXIMAS ATIVIDADES E REUNIÕES</h2>
            <button 
              onClick={() => onNavigate('eventos')} 
              className="text-[10px] uppercase font-bold tracking-widest text-[#E63946] hover:underline flex items-center gap-1"
            >
              VER AGENDA <ArrowUpRight size={12} />
            </button>
          </div>
          
          <div className="divide-y divide-[#1A1A1A]/10">
            {events.slice(0, 3).map(evt => {
              const institution = institutions.find(i => i.id === evt.institutionId);
              return (
                <div key={evt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono">
                        {evt.type}
                      </span>
                      <span className="text-[10px] lowercase text-[#1A1A1A]/50 font-mono">
                        {evt.date} às {evt.time}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#1A1A1A] leading-tight">{evt.title}</p>
                    <p className="text-xs text-[#1A1A1A]/60 line-clamp-1">{evt.description}</p>
                    {institution && (
                      <p className="text-[10px] text-[#1A1A1A]/80 uppercase tracking-widest font-mono">📍 {institution.name}</p>
                    )}
                  </div>
                  <span className={`inline-block text-center border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest font-mono self-start sm:self-center ${
                    evt.status === 'Agendado' ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' :
                    evt.status === 'Realizado' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-rose-600 bg-rose-50 text-rose-800'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links & Scientific Portfolio Details */}
        <div className="border border-[#1A1A1A] bg-[#1A1A1A] p-8 text-[#F9F8F6] flex flex-col justify-between">
          <div className="space-y-6">
            <Award className="text-[#E63946]" size={36} />
            <h3 className="text-lg font-serif italic text-white leading-tight">Trabalho de Fim de Curso</h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans font-light">
              Este sistema foi desenhado com base em rigorosas metodologias de acompanhamento e fiscalização para superar a recolha de dados manual e consolidar a segurança civil com precisão estatística.
            </p>
          </div>
          
          <div className="mt-8 border-t border-white/10 pt-6 text-[10px] font-mono tracking-wider opacity-60 uppercase space-y-1">
            <p className="text-white">Autor: João Q. K. Tchayevala</p>
            <p>Escola: I.P. Cachiungo</p>
            <p>Orientador: Pedro Canoquela</p>
          </div>
        </div>
      </section>
    </div>
  );
}
