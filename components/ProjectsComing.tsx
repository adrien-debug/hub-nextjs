import React from 'react';

const comingProjects = [
  { id: "SYS.ERR.404", name: "Thynk", cat: "Cognitive Mirroring", desc: "Mapping decisions and behavioral patterns. Neural sync active. Data stream encrypted." },
  { id: "SYS.REQ.808", name: "Atlas", cat: "Global Intelligence", desc: "Macro data mapping and predictive analytics. Access denied." }
];

export default function ProjectsComing() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/5 bg-grain relative overflow-hidden">
      
      {/* Ambient Noise / Glitch element */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#5eead4] rounded-full blur-[150px] opacity-[0.02] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-[#5eead4] uppercase tracking-widest">SYS.04</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Pipeline</h2>
        </div>

        <div className="border-t border-white/10">
          {/* Project 1: High contrast, blurred description */}
          <div className="group border-b border-white/5 py-16 flex flex-col lg:flex-row justify-between gap-12 relative">
            <div className="font-mono text-[9px] text-slate-700 absolute left-0 top-4 tracking-widest">{comingProjects[0].id}</div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline mt-4 lg:mt-0">
              <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">{comingProjects[0].name}</h3>
              <span className="text-xs font-mono text-[#5eead4] blur-[0.5px] tracking-widest uppercase">{comingProjects[0].cat}</span>
            </div>
            
            <div className="max-w-sm lg:text-right flex flex-col justify-end">
              <p className="text-slate-500 font-mono text-[10px] blur-[2px] select-none leading-relaxed uppercase">
                {comingProjects[0].desc}
              </p>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] font-mono text-red-500/60 tracking-[0.5em] rotate-90 origin-right uppercase">
              [ REDACTED ]
            </div>
          </div>

          {/* Project 2: Low contrast, cut off */}
          <div className="group border-b border-white/5 py-16 flex flex-col lg:flex-row justify-between gap-12 relative opacity-40 hover:opacity-100 transition-opacity duration-700">
            <div className="font-mono text-[9px] text-slate-700 absolute left-0 top-4 tracking-widest">{comingProjects[1].id}</div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline mt-4 lg:mt-0">
              <h3 className="text-5xl md:text-7xl font-black text-white/20 uppercase tracking-tighter leading-none">{comingProjects[1].name}</h3>
              <span className="text-xs font-mono text-slate-600 tracking-widest uppercase">{comingProjects[1].cat}</span>
            </div>
            
            <div className="max-w-sm lg:text-right flex flex-col justify-end overflow-hidden">
              <p className="text-slate-600 font-mono text-[10px] whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-transparent uppercase">
                {comingProjects[1].desc} SYSTEM OVERRIDE INITIATED...
              </p>
            </div>
          </div>
        </div>

        {/* Living System Element */}
        <div className="mt-24 flex justify-end">
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-600">
            <div className="w-2 h-4 bg-[#5eead4] animate-pulse"></div>
            <span>AWAITING_INPUT_</span>
          </div>
        </div>

      </div>
    </section>
  );
}
