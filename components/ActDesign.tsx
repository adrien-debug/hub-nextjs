import React from 'react';

const VERTICALS = [
  {
    id: '01',
    sector: 'DeFi & Digital Assets',
    title: 'Financial\nSovereignty',
    desc: 'Non-custodial protocols, yield optimization engines, and on-chain asset management. Every financial primitive rebuilt from scratch.',
    items: [
      { label: 'Protocols', value: '4 Live' },
      { label: 'TVL Target', value: '$50M+' },
      { label: 'Chains', value: 'Multi' },
    ],
  },
  {
    id: '02',
    sector: 'AI & Cognitive Systems',
    title: 'Machine\nIntelligence',
    desc: 'Autonomous agents, proprietary LLM orchestration, and decision-making systems that operate without human intervention.',
    items: [
      { label: 'Agents', value: '7 Active' },
      { label: 'Latency', value: '< 200ms' },
      { label: 'Autonomy', value: 'Full' },
    ],
  },
  {
    id: '03',
    sector: 'Infrastructure & DevOps',
    title: 'Stack\nControl',
    desc: 'Bare-metal servers, edge compute, CI/CD pipelines, and monitoring — zero reliance on third-party managed services.',
    items: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Regions', value: '3' },
      { label: 'Deploy', value: '< 90s' },
    ],
  },
  {
    id: '04',
    sector: 'Commerce & SaaS',
    title: 'Market\nCapture',
    desc: 'White-label platforms, multi-tenant SaaS engines, and commerce systems designed for vertical domination.',
    items: [
      { label: 'Platforms', value: '5 Live' },
      { label: 'Revenue', value: 'Recurring' },
      { label: 'Scale', value: 'Global' },
    ],
  },
];

export default function ActDesign() {
  return (
    <section id="incubate-verticals" className="relative py-32 px-6 md:px-12 lg:px-24 bg-dark border-t border-white/5 overflow-hidden bg-grain">

      {/* Ghost line */}
      <div className="hidden lg:block absolute left-[41.666%] top-0 bottom-0 w-px bg-white/5 z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.03</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">Incubation Verticals</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 mb-32">
          <div className="lg:col-span-5 pr-0 lg:pr-16">
            <div className="font-mono text-slate-600 text-[10px] tracking-widest mb-8">PHASE 3 // DEPLOY</div>
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-accent/90 mb-8 uppercase leading-[0.85]">
              Incubate
            </h3>
            <p className="text-slate-500 font-light leading-relaxed text-sm max-w-md">
              Four verticals. One operating system. Every venture is built on the same infrastructure, 
              governed by the same principles, and scaled through the same engine.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:mt-16 pl-0 lg:pl-12">
            <div className="grid grid-cols-2 gap-6">
              {[
                { n: '4', label: 'Active Verticals' },
                { n: '16+', label: 'Projects in Pipeline' },
                { n: '0.4%', label: 'Acceptance Rate' },
                { n: '< 48h', label: 'Capital Deploy Time' },
              ].map((s, i) => (
                <div key={i} className="border-l border-white/10 pl-4 py-2 group cursor-default hover:border-accent/40 transition-colors duration-500">
                  <div className="font-mono text-2xl md:text-3xl text-white font-bold tracking-tight group-hover:text-accent transition-colors duration-500">{s.n}</div>
                  <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Verticals ── */}
        <div className="space-y-0">
          {VERTICALS.map((v, index) => (
            <div
              key={v.id}
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 border-t border-white/5 py-16 cursor-crosshair"
            >
              {/* Left: ID + sector */}
              <div className={`lg:col-span-5 pr-0 lg:pr-16 flex flex-col ${index % 2 === 1 ? 'lg:order-2 lg:col-start-7 lg:pl-12 lg:pr-0' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs text-accent tracking-widest">[{v.id}]</span>
                  <span className="w-8 h-px bg-white/10 group-hover:bg-accent/50 transition-colors duration-500"></span>
                  <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase group-hover:text-white/60 transition-colors duration-500">
                    {v.sector}
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-bold text-white/90 uppercase tracking-tight leading-[0.95] mb-6 whitespace-pre-line group-hover:text-accent transition-colors duration-500">
                  {v.title}
                </h3>

                <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md">
                  {v.desc}
                </p>
              </div>

              {/* Right: Metrics */}
              <div className={`lg:col-span-6 flex items-end ${index % 2 === 1 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'} pl-0 lg:pl-12`}>
                <div className="flex gap-8 md:gap-12 w-full">
                  {v.items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 flex-1">
                      <span className="font-mono text-[8px] text-slate-600 uppercase tracking-widest">{item.label}</span>
                      <span className="font-mono text-sm md:text-base text-white group-hover:text-accent transition-colors duration-500">{item.value}</span>
                      <div className="w-full h-px bg-white/5 group-hover:bg-accent/30 transition-colors duration-500 mt-1"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
