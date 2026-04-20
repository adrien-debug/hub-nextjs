import React from 'react';

export default function ProjectsComing() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="uppercase tracking-widest text-xs font-semibold text-slate-400">
              ⚡ In Development
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            The Pipeline.
          </h2>
          <p className="text-lg text-slate-400">
            Next-generation infrastructure currently in stealth and incubation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "Thynk", cat: "Cognitive Mirroring", desc: "Mapping decisions and behavioral patterns." },
            { name: "Atlas", cat: "Global Intelligence", desc: "Macro data mapping and predictive analytics." }
          ].map((project, i) => (
            <div key={i} className="bg-[#111111] border border-white/5 p-12 relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-4">{project.cat}</span>
              <h3 className="text-3xl font-bold text-white tracking-tight mb-4">{project.name}</h3>
              <p className="text-slate-400">{project.desc}</p>
              
              <div className="absolute -right-4 -bottom-6 text-7xl font-black text-white/[0.03] pointer-events-none select-none tracking-tighter">
                [CLASSIFIED]
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
