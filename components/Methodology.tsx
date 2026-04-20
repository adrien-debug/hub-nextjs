import React from 'react';

export default function Methodology() {
  return (
    <section id="methodology" className="relative py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/5 overflow-hidden bg-grain">
      
      {/* Ghost Vertical Line - System Flow (Plus visible) */}
      <div className="hidden lg:block absolute left-[41.666%] top-0 bottom-0 w-px bg-white/5 z-0"></div>
      <div className="hidden lg:block absolute left-[41.666%] top-[-50%] h-[100%] w-px bg-gradient-to-b from-transparent via-[#5eead4]/50 to-transparent z-0 animate-flow-y"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.02</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Engine</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0">
          
          {/* Phase 1 : Schéma Opérationnel */}
          <div className="lg:col-span-5 pr-0 lg:pr-16">
            <div className="flex justify-between items-end mb-8">
              <div className="font-mono text-slate-600 text-[10px] tracking-widest">PHASE 1 // CORE</div>
              <div className="font-mono text-[#5eead4]/80 text-[10px] tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#5eead4] rounded-full animate-pulse cyan-glow"></span>
                T+ 00:00 &rarr; ???:??
              </div>
            </div>
            
            {/* Accent Typographique: "Incubate" en cyan assumé */}
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-[#5eead4]/90 mb-16 uppercase leading-[0.85]">
              Incubate
            </h3>
            
            {/* Timeline / Flow System */}
            <div className="relative pl-10 font-mono">
              {/* Main Axis (Track) */}
              <div className="absolute left-0 top-2 bottom-0 w-px bg-white/10"></div>
              {/* Active Flow (Cyan) */}
              <div className="absolute left-0 top-2 h-[45%] w-[2px] bg-gradient-to-b from-[#5eead4] to-[#5eead4]/10 cyan-glow"></div>

              {/* Graduations (Ticks) */}
              <div className="absolute left-[-3px] top-[20%] w-1.5 h-px bg-slate-600"></div>
              <div className="absolute left-[-3px] top-[40%] w-1.5 h-px bg-slate-600"></div>
              <div className="absolute left-[-3px] top-[60%] w-1.5 h-px bg-slate-600"></div>
              <div className="absolute left-[-3px] top-[80%] w-1.5 h-px bg-slate-600"></div>

              {/* Steps (Nodes) */}
              <div className="space-y-16 relative z-10">
                
                {/* Step 1 - Active */}
                <div className="relative group cursor-crosshair">
                  {/* Node Dot */}
                  <div className="absolute left-[-43px] top-1.5 w-2 h-2 bg-[#0A0A0A] border-[1.5px] border-[#5eead4] rounded-full group-hover:bg-[#5eead4] transition-colors cyan-glow"></div>
                  {/* Connector Line */}
                  <div className="absolute left-[-35px] top-2.5 w-6 h-px bg-[#5eead4]/40 group-hover:bg-[#5eead4] transition-colors"></div>

                  <div className="ml-0">
                    <div className="text-[9px] text-[#5eead4]/70 mb-2 flex items-center gap-3 tracking-widest">
                      <span>[ SEQ.01 ]</span>
                      <span className="w-4 h-px bg-slate-700"></span>
                      <span className="text-slate-500">VALIDATION</span>
                    </div>
                    <div className="text-sm text-slate-300 uppercase tracking-wider group-hover:text-white transition-colors leading-relaxed">
                      Strategic validation &<br/>market analysis
                    </div>
                    {/* Micro-metrics */}
                    <div className="mt-4 flex gap-2 text-[8px] text-slate-500 tracking-widest">
                      <span className="bg-white/5 px-2 py-1 border border-white/5">STATUS: OPTIMAL</span>
                      <span className="bg-white/5 px-2 py-1 border border-white/5 text-[#5eead4]/60">SYNC</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Offset */}
                <div className="relative group cursor-crosshair">
                  <div className="absolute left-[-43px] top-1.5 w-2 h-2 bg-[#0A0A0A] border-[1.5px] border-[#5eead4]/50 rounded-full group-hover:border-[#5eead4] group-hover:bg-[#5eead4] transition-colors"></div>
                  <div className="absolute left-[-35px] top-2.5 w-16 h-px bg-white/10 group-hover:bg-[#5eead4]/60 transition-colors"></div>

                  <div className="ml-10">
                    <div className="text-[9px] text-slate-500 mb-2 flex items-center gap-3 tracking-widest group-hover:text-[#5eead4]/70 transition-colors">
                      <span>[ SEQ.02 ]</span>
                      <span className="w-4 h-px bg-slate-700"></span>
                      <span className="text-slate-600">PROTOTYPING</span>
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors leading-relaxed">
                      Rapid prototyping on<br/>Hearst infrastructure
                    </div>
                    <div className="mt-4 flex gap-2 text-[8px] text-slate-600 tracking-widest">
                      <span className="bg-white/5 px-2 py-1 border border-white/5">LOAD: 84%</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 - Offset */}
                <div className="relative group cursor-crosshair">
                  <div className="absolute left-[-43px] top-1.5 w-2 h-2 bg-[#0A0A0A] border-[1.5px] border-white/20 rounded-full group-hover:border-[#5eead4] group-hover:bg-[#5eead4] transition-colors"></div>
                  <div className="absolute left-[-35px] top-2.5 w-8 h-px bg-white/10 group-hover:bg-[#5eead4]/60 transition-colors"></div>

                  <div className="ml-2">
                    <div className="text-[9px] text-slate-500 mb-2 flex items-center gap-3 tracking-widest group-hover:text-[#5eead4]/70 transition-colors">
                      <span>[ SEQ.03 ]</span>
                      <span className="w-4 h-px bg-slate-700"></span>
                      <span className="text-slate-600">ASSEMBLY</span>
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors leading-relaxed">
                      Team assembly &<br/>resource allocation
                    </div>
                    <div className="mt-4 flex gap-2 text-[8px] text-slate-600 tracking-widest">
                      <span className="bg-white/5 px-2 py-1 border border-white/5">ALLOCATION: PENDING</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 - Offset */}
                <div className="relative group cursor-crosshair">
                  <div className="absolute left-[-43px] top-1.5 w-2 h-2 bg-[#0A0A0A] border-[1.5px] border-white/20 rounded-full group-hover:border-[#5eead4] group-hover:bg-[#5eead4] transition-colors"></div>
                  <div className="absolute left-[-35px] top-2.5 w-24 h-px bg-white/10 group-hover:bg-[#5eead4]/60 transition-colors"></div>

                  <div className="ml-16">
                    <div className="text-[9px] text-slate-500 mb-2 flex items-center gap-3 tracking-widest group-hover:text-[#5eead4]/70 transition-colors">
                      <span>[ SEQ.04 ]</span>
                      <span className="w-4 h-px bg-slate-700"></span>
                      <span className="text-slate-600">ACCELERATION</span>
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors leading-relaxed">
                      Launch & growth<br/>acceleration
                    </div>
                    <div className="mt-4 flex gap-2 text-[8px] text-slate-600 tracking-widest">
                      <span className="bg-white/5 px-2 py-1 border border-white/5">STATUS: LOCKED</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="lg:col-span-6 lg:col-start-7 lg:mt-64 pl-0 lg:pl-12">
            <div className="font-mono text-slate-600 text-[10px] mb-8 tracking-widest">PHASE 2 // SCALE</div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white/80 mb-12 uppercase leading-none">
              Operational<br/>
              <span className="text-slate-600 font-light">Mastery</span>
            </h3>
            
            <p className="text-slate-500 font-light leading-relaxed mb-16 max-w-md text-sm">
              Post-launch ventures run on centralized piloting and real-time synchronization. Complete control, <span className="text-[#5eead4]/80 font-medium">zero overhead</span>. The system governs itself.
            </p>
            
            <div className="grid grid-cols-1 gap-12 relative">
              <div className="absolute top-0 -left-6 w-px h-full bg-white/5"></div>
              
              {[
                { title: "Centralized Access", desc: "Unified expense & identity management." },
                { title: "Real-Time Sync", desc: "Cross-venture data synchronization." },
                { title: "AI Intelligence", desc: "Proprietary cognitive layers." },
                { title: "Seamless Integration", desc: "Frictionless tool deployment." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-baseline border-b border-white/5 pb-6 group cursor-crosshair">
                  <div className="w-1.5 h-1.5 bg-slate-700 group-hover:bg-[#5eead4] group-hover:cyan-glow transition-all duration-500"></div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-widest mb-2 group-hover:text-[#5eead4] transition-colors duration-500">{item.title}</div>
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
