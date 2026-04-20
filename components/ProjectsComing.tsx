import React from 'react';

const comingProjects = [
  { id: "SYS.ERR.404", name: "Thynk", cat: "Cognitive Mirroring", desc: "Mapping decisions and behavioral patterns. Neural sync active. Data stream encrypted." },
  { id: "SYS.REQ.808", name: "Atlas", cat: "Global Intelligence", desc: "Macro data mapping and predictive analytics. Access denied." }
];

export default function ProjectsComing() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-dark border-t border-white/5 bg-grain relative overflow-hidden">
      
      {/* Ghost Flow Line plus visible */}
      <div className="absolute top-1/3 left-[-50%] w-[200%] h-[2px] bg-accent blur-[2px] opacity-20 animate-flow-x pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.04</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Pipeline</h2>
        </div>

        <div className="border-t border-white/10">
          <div className="group border-b border-white/5 py-16 flex flex-col lg:flex-row justify-between gap-12 relative">
            <div className="font-mono text-[9px] text-slate-700 relative mb-4 lg:mb-0 lg:absolute lg:left-0 lg:top-4 tracking-widest">{comingProjects[0].id}</div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline mt-4 lg:mt-0">
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{comingProjects[0].name}</h3>
              <span className="text-xs font-mono text-accent/60 tracking-widest uppercase">{comingProjects[0].cat}</span>
            </div>
            
            <div className="max-w-sm lg:text-right flex flex-col justify-end">
              <p className="text-slate-400 font-mono text-[10px] leading-relaxed uppercase">
                Mapping decisions and behavioral patterns. <span className="text-accent/80 font-bold">Neural sync active.</span> Data stream encrypted.
              </p>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 tracking-widest uppercase">
              RESTRICTED
            </div>
          </div>

          <div className="group border-b border-white/5 py-16 flex flex-col lg:flex-row justify-between gap-12 relative opacity-50 hover:opacity-100 transition-opacity duration-700">
            <div className="font-mono text-[9px] text-slate-700 relative mb-4 lg:mb-0 lg:absolute lg:left-0 lg:top-4 tracking-widest">{comingProjects[1].id}</div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline mt-4 lg:mt-0">
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{comingProjects[1].name}</h3>
              <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">{comingProjects[1].cat}</span>
            </div>
            
            <div className="max-w-sm lg:text-right flex flex-col justify-end">
              <p className="text-slate-400 font-mono text-[10px] leading-relaxed uppercase">
                {comingProjects[1].desc}
              </p>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 tracking-widest uppercase">
              ACCESS LIMITED
            </div>
          </div>
        </div>

        <div className="mt-24 flex justify-end">
          <div className="flex items-center gap-2 font-mono text-[10px] text-accent/90">
            <span className="text-glitch">INPUT STREAM: WAITING</span>
            <span className="animate-blink">_</span>
          </div>
        </div>

      </div>
    </section>
  );
}
