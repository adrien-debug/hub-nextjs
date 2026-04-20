import React from 'react';

export default function Methodology() {
  return (
    <section id="methodology" className="relative py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/5 overflow-hidden bg-grain">
      
      {/* Ghost Vertical Line - The Spine */}
      <div className="hidden lg:block absolute left-[41.666%] top-[-10%] bottom-[-10%] w-px bg-white/5 z-0"></div>
      <div className="hidden lg:block absolute left-[41.666%] top-1/4 h-32 w-px bg-[#5eead4] z-0 animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.02</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Engine</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0">
          
          {/* Phase 1: Left Aligned, Massive, Offset Top */}
          <div className="lg:col-span-5 pr-0 lg:pr-16">
            <div className="font-mono text-[#5eead4] text-[10px] mb-8 tracking-widest">PHASE 1 // CORE</div>
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-12 uppercase leading-[0.85]">
              Incubate
            </h3>
            
            <div className="w-12 h-1 bg-white/20 mb-16"></div>
            
            <div className="space-y-12 font-mono text-xs text-slate-400 uppercase tracking-wider">
              <div className="flex items-start gap-6">
                <span className="text-[#5eead4]">01</span>
                <span className="leading-relaxed">Strategic validation &<br/>market analysis</span>
              </div>
              <div className="flex items-start gap-6 ml-8 border-l border-white/10 pl-6">
                <span className="text-[#5eead4]">02</span>
                <span className="leading-relaxed">Rapid prototyping on<br/>Hearst infrastructure</span>
              </div>
              <div className="flex items-start gap-6 ml-4">
                <span className="text-[#5eead4]">03</span>
                <span className="leading-relaxed">Team assembly &<br/>resource allocation</span>
              </div>
              <div className="flex items-start gap-6 ml-12 border-l border-[#5eead4]/30 pl-6 text-white">
                <span className="text-[#5eead4]">04</span>
                <span className="leading-relaxed">Launch & growth<br/>acceleration</span>
              </div>
            </div>
          </div>

          {/* Phase 2: Right Aligned, Smaller, Offset Bottom (+160px) */}
          <div className="lg:col-span-6 lg:col-start-7 lg:mt-48 pl-0 lg:pl-12">
            <div className="font-mono text-slate-600 text-[10px] mb-8 tracking-widest">PHASE 2 // SCALE</div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white/80 mb-12 uppercase leading-none">
              Operational<br/>Mastery
            </h3>
            
            <p className="text-slate-500 font-light leading-relaxed mb-16 max-w-md text-sm">
              Post-launch ventures run on centralized piloting and real-time synchronization. Complete control, zero overhead. The system governs itself.
            </p>
            
            <div className="grid grid-cols-1 gap-12">
              {[
                { title: "Centralized Access", desc: "Unified expense & identity management." },
                { title: "Real-Time Sync", desc: "Cross-venture data synchronization." },
                { title: "AI Intelligence", desc: "Proprietary cognitive layers." },
                { title: "Seamless Integration", desc: "Frictionless tool deployment." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-baseline border-b border-white/5 pb-6">
                  <div className="w-1.5 h-1.5 bg-slate-700"></div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-widest mb-2">{item.title}</div>
                    <div className="text-xs text-slate-600 font-mono">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
