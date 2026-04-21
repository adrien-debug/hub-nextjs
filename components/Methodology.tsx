import React from 'react';

const STEPS = [
  {
    id: '01',
    title: 'Source',
    desc: 'Identify strong signals, markets and opportunities early.',
  },
  {
    id: '02',
    title: 'Validate',
    desc: 'Test assumptions quickly and reduce uncertainty.',
  },
  {
    id: '03',
    title: 'Build',
    desc: 'Design, structure and launch with precision.',
  },
  {
    id: '04',
    title: 'Scale',
    desc: 'Grow the ventures that show real traction.',
  },
];

export default function Methodology() {
  return (
    <section id="methodology" className="relative py-32 px-6 md:px-12 lg:px-24 bg-dark border-t border-white/5 overflow-hidden bg-grain">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header — même pattern que About, ActDesign, ProjectsLive */}
        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.02</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Engine</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 mb-32">
          {/* Left — titre + paragraphe */}
          <div className="lg:col-span-5 pr-0 lg:pr-16">
            <div className="font-mono text-slate-600 text-[10px] tracking-widest mb-8">PHASE 1 // CORE</div>
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-accent/90 mb-16 uppercase leading-[0.85]">
              Incubate
            </h3>
            <div className="relative pl-8 border-l border-accent/40">
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-light">
                We build and scale ventures with <span className="text-accent/90 font-medium">structure</span>, clarity and control.
              </p>
            </div>
          </div>

          {/* Right — description + stats */}
          <div className="lg:col-span-6 lg:col-start-7 lg:mt-32 pl-0 lg:pl-12">
            <p className="text-slate-500 font-light leading-relaxed text-sm max-w-md mb-16">
              From early signal to execution, each venture is developed through a clear and disciplined operating framework. Four stages. One system.
            </p>

            <div className="flex flex-col border-t border-white/10">
              {[
                { value: '0.4%', label: 'Acceptance Rate' },
                { value: '< 48H', label: 'Capital Deploy Time' },
                { value: '04', label: 'Operating Phases' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 py-10 border-b border-white/10 group relative cursor-crosshair">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter text-white w-32 group-hover:text-accent transition-colors duration-500">{stat.value}</span>
                  <span className="text-sm font-mono text-slate-600 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline — 4 étapes, même pattern que les verticals de ActDesign */}
        <div className="space-y-0">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 border-t border-white/5 py-16 cursor-crosshair"
            >
              <div className="lg:col-span-5 pr-0 lg:pr-16 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs text-accent tracking-widest">[{step.id}]</span>
                  <span className="w-8 h-px bg-white/10 group-hover:bg-accent/50 transition-colors duration-500"></span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white/90 uppercase tracking-tight leading-[0.95] mb-6 group-hover:text-accent transition-colors duration-500">
                  {step.title}
                </h3>
              </div>

              <div className="lg:col-span-6 lg:col-start-7 pl-0 lg:pl-12 flex items-center">
                <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md">
                  {step.desc}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
