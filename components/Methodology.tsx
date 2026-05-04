import React from 'react';

const PHASES = [
  { id: '01', title: 'Source', desc: 'Identify strong signals, markets and opportunities early.' },
  { id: '02', title: 'Validate', desc: 'Test assumptions quickly and reduce uncertainty.' },
  { id: '03', title: 'Build', desc: 'Design, structure and launch with precision.' },
  { id: '04', title: 'Scale', desc: 'Grow the ventures that show real traction.' },
];

const VERTICALS = [
  {
    id: '01',
    sector: 'DeFi & Digital Assets',
    title: 'Financial\nSovereignty',
    desc: 'Non-custodial protocols, yield optimization, and on-chain asset management.',
  },
  {
    id: '02',
    sector: 'AI & Cognitive Systems',
    title: 'Machine\nIntelligence',
    desc: 'Autonomous agents, proprietary LLM orchestration, decision systems.',
  },
  {
    id: '03',
    sector: 'Infrastructure & DevOps',
    title: 'Stack\nControl',
    desc: 'Bare-metal servers, edge compute, CI/CD — zero managed services.',
  },
  {
    id: '04',
    sector: 'Commerce & SaaS',
    title: 'Market\nCapture',
    desc: 'White-label platforms and multi-tenant engines built for vertical depth.',
  },
];

export default function Methodology() {
  return (
    <section id="methodology" className="scroll-mt-20 relative py-16 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-24 bg-dark border-t border-white/5 overflow-hidden bg-grain">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-16 md:mb-24 border-b border-white/10 pb-5 sm:pb-6 md:pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.02</span>
          <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/80">The Engine</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-0 mb-14 sm:mb-20 md:mb-32">
          <div className="lg:col-span-5 pr-0 lg:pr-16">
            <div className="font-mono text-slate-600 text-[10px] tracking-widest mb-4 sm:mb-6 md:mb-8">OPERATING SYSTEM</div>
            <h3 className="text-[3.25rem] xs:text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-accent/90 mb-5 sm:mb-6 md:mb-8 uppercase leading-[0.9] sm:leading-[0.85]">
              Incubate
            </h3>
            <div className="relative pl-5 sm:pl-6 md:pl-8 border-l border-accent/40">
              <p className="text-base sm:text-xl md:text-2xl text-slate-500 leading-relaxed font-light">
                Four <span className="text-accent/90 font-medium">phases</span> applied across
                four <span className="text-accent/90 font-medium">verticals</span>. One system, one stack.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:mt-16 pl-0 lg:pl-12">
            <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base max-w-md">
              From source to scale, every venture moves through the same operating discipline — applied inside a fixed set of vertical theses.
            </p>
          </div>
        </div>

        <div className="mb-14 sm:mb-20 md:mb-32">
          <div className="font-mono text-slate-600 text-[10px] tracking-widest mb-5 sm:mb-8 md:mb-12">PHASES // EXECUTION</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {PHASES.map((step) => (
              <div key={step.id} className="bg-dark p-5 sm:p-6 md:p-8 group cursor-crosshair flex flex-col gap-3 sm:gap-4 md:gap-6 min-h-[140px] sm:min-h-[180px] md:min-h-[200px] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></div>
                <span className="font-mono text-[11px] sm:text-xs text-accent tracking-widest">[{step.id}]</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 uppercase tracking-tight leading-[0.95] group-hover:text-accent transition-colors duration-500">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed mt-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-slate-600 text-[10px] tracking-widest mb-5 sm:mb-8 md:mb-12">VERTICALS // DOMAINS</div>
          <div className="space-y-0">
            {VERTICALS.map((v) => (
              <div
                key={v.id}
                className="group relative grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-0 border-t border-white/5 py-7 sm:py-10 md:py-12 cursor-crosshair"
              >
                <div className="lg:col-span-2 flex items-center gap-3 mb-1 lg:mb-0">
                  <span className="font-mono text-[11px] sm:text-xs text-accent tracking-widest">[{v.id}]</span>
                  <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase group-hover:text-white/60 transition-colors duration-500">
                    {v.sector}
                  </span>
                </div>

                <h3 className="lg:col-span-5 text-xl sm:text-2xl md:text-4xl font-bold text-white/90 uppercase tracking-tight leading-[1] sm:leading-[0.95] lg:whitespace-pre-line group-hover:text-accent transition-colors duration-500">
                  {v.title.replace('\n', ' ')}
                </h3>

                <p className="lg:col-span-5 text-sm sm:text-base text-slate-500 font-light leading-relaxed self-end max-w-md">
                  {v.desc}
                </p>

                <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
