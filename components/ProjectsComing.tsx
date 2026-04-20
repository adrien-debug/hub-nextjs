import React from 'react';

const comingProjects = [
  { id: "X.01", name: "Thynk", cat: "Cognitive Mirroring", desc: "Mapping decisions and behavioral patterns." },
  { id: "X.02", name: "Atlas", cat: "Global Intelligence", desc: "Macro data mapping and predictive analytics." }
];

export default function ProjectsComing() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-24 border-b border-white/10 pb-8">
          <span className="font-mono text-xs text-[#5eead4] uppercase tracking-widest">SYS.04</span>
          <h2 className="text-sm font-bold tracking-widest uppercase text-white">The Pipeline</h2>
        </div>

        <div className="border-t border-white/10">
          <div className="py-8 flex justify-between items-center text-xs font-mono text-slate-600 uppercase tracking-widest border-b border-white/5">
            <span>Designation</span>
            <span>Status</span>
          </div>

          {comingProjects.map((project, i) => (
            <div key={i} className="group border-b border-white/5 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white/[0.02] transition-colors cursor-not-allowed px-6 -mx-6">
              <div className="flex items-center gap-8 md:gap-16">
                <span className="font-mono text-xs text-slate-600">{project.id}</span>
                <div>
                  <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-white/40 group-hover:text-white transition-colors uppercase mb-2">{project.name}</h3>
                  <div className="text-sm text-[#5eead4] font-mono">{project.cat}</div>
                </div>
              </div>
              
              <div className="md:text-right flex flex-col md:items-end gap-2">
                <p className="text-slate-500 font-light text-sm max-w-xs">{project.desc}</p>
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 mt-2">
                  <div className="w-1 h-1 bg-slate-500"></div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Classified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
