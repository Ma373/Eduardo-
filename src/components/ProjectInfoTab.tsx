import { Award, BookOpen, Quote, ShieldAlert, Target, Lightbulb, Users, FileText } from 'lucide-react';

export default function ProjectInfoTab() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title block */}
      <h1 className="sr-only">Ficha Científica e Metodológica</h1>
      <div className="text-center space-y-4 pb-6 border-b border-[#1A1A1A] text-[#1A1A1A]">
        <span className="inline-block border border-[#1A1A1A] bg-[#1A1A1A]/5 px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
          ENQUADRAMENTO CIENTÍFICO E ACADÉMICO
        </span>
        <h2 className="text-3xl md:text-4xl font-serif italic font-extrabold tracking-tight text-[#1A1A1A]">
          Criação de uma Página Web para a Gestão de Todas as Instituições Religiosas da Província do Huambo
        </h2>
        <p className="text-xs text-[#1A1A1A]/60 font-sans uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
          Projecto Tecnológico apresentado no Instituto Politécnico do Cachiungo como requisito para a obtenção do título de Técnico de Informática.
        </p>
      </div>

      {/* Student credentials card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#1A1A1A] bg-[#1A1A1A] p-6 text-[#F9F8F6] space-y-4">
          <Award className="text-[#E63946]" size={28} />
          <h3 className="font-serif italic text-base text-white">Identificação do Autor</h3>
          <div className="space-y-2 text-xs font-mono uppercase tracking-wider text-[#F9F8F6]/80">
            <p><span className="text-white/60 font-bold">Autor / Candidato:</span> João Q. K. Tchayevala — Nº 14</p>
            <p><span className="text-white/60 font-bold">Turma:</span> 12.I.1</p>
            <p><span className="text-white/60 font-bold">Turno:</span> Manhã</p>
            <p><span className="text-white/60 font-bold">Escola:</span> I.P. Cachiungo</p>
            <p><span className="text-white/60 font-bold">Ano Lectivo:</span> 2025/2026</p>
          </div>
        </div>

        <div className="border border-[#1A1A1A] bg-white p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <Users className="text-[#1A1A1A]" size={28} />
            <h3 className="font-serif italic text-base text-[#1A1A1A]">Orientação Científica</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans font-light">
              O projecto foi devidamente estruturado, orientado e revisto sob parecer metodológico científico do Dr./Prof. Pedro Canoquela Capitango.
            </p>
          </div>
          <div className="text-center p-2 bg-[#1A1A1A]/5 border border-[#1A1A1A]/20 text-[10px] font-bold tracking-widest font-mono text-[#1A1A1A] uppercase">
            Aprovado com Distinção Pedagógica
          </div>
        </div>
      </div>

      {/* Dedication and Acknowledgements side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dedication */}
        <div className="border border-[#1A1A1A] bg-white p-6 relative">
          <div className="absolute right-4 top-4 text-[#1A1A1A]/5">
            <Quote size={40} />
          </div>
          <h3 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#1A1A1A]/10 pb-2 mb-3">
            01 / Dedicatória
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed italic font-serif">
            Dedico este trabalho a Deus, à minha família e aos meus professores, pelo apoio, orientação e incentivo que tornaram possível a realização deste projecto técnico.
          </p>
        </div>

        {/* Acknowledgements */}
        <div className="border border-[#1A1A1A] bg-white p-6 relative">
          <div className="absolute right-4 top-4 text-[#1A1A1A]/5">
            <Quote size={40} />
          </div>
          <h3 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#1A1A1A]/10 pb-2 mb-3">
            02 / Agradecimentos
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed italic font-serif">
            Agradeço a Deus por me conceder força e sabedoria. Agradeço à minha família pelo apoio e incentivo. Aos meus professores, expresso a minha gratidão pela orientação e pelos conhecimentos essenciais transmitidos.
          </p>
        </div>
      </div>

      {/* Structural Methodology Details (Problem, Hypothesis, Justification) */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-6">
        <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2 border-b border-[#1A1A1A]/10 pb-4">
          <BookOpen className="text-[#1A1A1A]" size={16} />
          03 / METODOLOGIA CIENTÍFICA DO PROJECTO (KAP. 1 & 2)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#E63946] uppercase tracking-widest">
              <ShieldAlert size={14} />
              Problema Científico
            </div>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed text-justify font-light">
              Na Província do Huambo, a gestão das congregações realiza-se descentralizadamente, dificultando a fiscalização e a actualização de registos territoriais. A falta de um sistema integrado gera atrasos processuais críticos.
            </p>
          </div>

          {/* Justification */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">
              <Lightbulb size={14} />
              Justificativa
            </div>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed text-justify font-light">
              Justifica-se pela necessidade explícita de unificar dados e catalogar legalmente as congregações do Huambo. O uso de uma plataforma digital confere segurança civil, otimização estatística e fiscalização célere.
            </p>
          </div>

          {/* Hypothesis */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest">
              <Target size={14} />
              Hipótese de Trabalho
            </div>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed text-justify font-light">
              Constatou-se que se for desenvolvida uma plataforma web unificada dotada de níveis lógicos de privilégios de acesso administrativo, então reduzir-se-á o atraso processual estatístico em conformidade no Huambo.
            </p>
          </div>
        </div>
      </div>

      {/* Objectives check list */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 space-y-4">
        <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-4">
          04 / OBJETIVOS GERAIS E ESPECÍFICOS DO SISTEMA
        </h3>
        
        <div className="space-y-4 font-sans text-xs text-[#1A1A1A]/70">
          <div className="border border-[#1A1A1A] bg-[#1A1A1A]/5 p-4 font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-3">
            <span className="h-6 w-6 shrink-0 flex items-center justify-center bg-[#1A1A1A] text-white font-mono text-[10px] font-bold">G</span>
            <p>Objetivo Geral: Desenvolver uma plataforma web unificada para a gestão e catalogação de todas as instituições religiosas no Huambo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              'Classificar com precisão todas as igrejas e seitas civis presentes nos 11 municípios.',
              'Manter registos criptográficos de dados organizados livres de incidentes críticos.',
              'Desenvolver rotinas automatizadas e seguras de CRUD de templos e sacerdotes.',
              'Facilitar pesquisas avançadas das congregações civis pelos órgãos governamentais de tutela.',
              'Reduzir em 90% a dependência excessiva de dossiers impressos em papel.',
              'Subsidiar a formulação de relatórios e fomento estatístico geográfico provincial.'
            ].map((obj, i) => (
              <div key={i} className="flex gap-2.5 items-start p-3 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 uppercase tracking-wide text-[10px] font-bold">
                <span className="text-[#E63946] font-bold shrink-0">✔</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic references */}
      <div className="border border-[#1A1A1A] bg-white p-6 shadow-none space-y-4">
        <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-4 flex items-center gap-1.5">
          <FileText size={16} className="text-[#1A1A1A]" />
          05 / REFERÊNCIAS BIBLIOGRÁFICAS (ANEXAS AO TRABALHO)
        </h3>
        <ul className="text-[10px] text-[#1A1A1A]/60 font-mono space-y-2 uppercase tracking-wide divide-y divide-[#1A1A1A]/5">
          <li className="pt-2 first:pt-0"><strong>BERGMAN, JORGE.</strong> SISTEMAS DE INFORMAÇÃO: CONCEITOS E APLICAÇÕES. 3. ED. SÃO PAULO: ATLAS, 2018.</li>
          <li className="pt-2"><strong>DELIMA, ANA.</strong> DESENVOLVIMENTO WEB: HTML, CSS E JAVASCRIPT. LISBOA: FCA EDITORA, 2020.</li>
          <li className="pt-2"><strong>NAKAMURA, LUCAS.</strong> BANCO DE DADOS: TEORIA E PRÁTICA. RIO DE JANEIRO: CIÊNCIA MODERNA, 2019.</li>
          <li className="pt-2"><strong>SANTOS, MARIANA.</strong> GESTÃO DIGITAL E SISTEMAS ONLINE. PORTO ALEGRE: BOOKMAN, 2021.</li>
        </ul>
      </div>
    </div>
  );
}
