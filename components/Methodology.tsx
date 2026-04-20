import React from 'react';

export default function Methodology() {
  return (
    <section id="methodology" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-24 border-b border-white/10 pb-8">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">SYS.02</span>
          <h2 className="text-sm font-bold tracking-widest uppercase text-white">The Engine</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 border border-white/10">
          
          <div className="lg:col-span-5 bg-[#0A0A0A] p-12 lg:p-16 relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#5eead4] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"></div>
            <div className="font-mono text-[#5eead4] text-xs mb-8">PHASE 1</div>
            <h3 className="text-4xl font-bold tracking-tighter text-white mb-6 uppercase">Incubation<br/>Framework</h3>
            <p className="text-slate-400 font-light leading-relaxed mb-12">
              From ideation to MVP, high-potential concepts are nurtured through our full-stack infrastructure.
            </p>
            <div className="space-y-6">
              {[
                "Strategic validation & market analysis",
                "Rapid prototyping on Hearst core",
                "Team assembly & resource allocation",
                "Launch & growth acceleration"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 border-t border-white/5 pt-4">
                  <span className="font-mono text-[10px] text-slate-600 mt-1">0{i + 1}</span>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0A0A0A] p-12 lg:p-16 relative group">
            <div className="absolute top-0 right-0 w-1 h-full bg-white scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500"></div>
            <div className="font-mono text-slate-500 text-xs mb-8">PHASE 2</div>
            <h3 className="text-4xl font-bold tracking-tighter text-white mb-6 uppercase">Operational<br/>Mastery</h3>
            <p className="text-slate-400 font-light leading-relaxed mb-12 max-w-lg">
              Post-launch ventures run on centralized piloting and real-time synchronization. Complete control, zero overhead.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Centralized Access", desc: "Unified expense & identity management." },
                { title: "Real-Time Sync", desc: "Cross-venture data synchronization." },
                { title: "AI Intelligence", desc: "Proprietary cognitive layers." },
                { title: "Seamless Integration", desc: "Frictionless tool deployment." }
              ].map((item, i) => (
                <div key={i} className="border-l border-white/10 pl-6">
                  <div className="text-sm font-bold text-white uppercase tracking-wider mb-2">{item.title}</div>
                  <div className="text-xs text-slate-500 font-mono">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
