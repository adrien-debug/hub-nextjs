import React from 'react';

export default function Methodology() {
  return (
    <section id="methodology" className="relative py-32 px-6 md:px-12 lg:px-24 bg-dark border-t border-white/5 overflow-hidden bg-grain">
      
      {/* Ghost Vertical Line - System Flow (Plus visible) */}
      <div className="hidden lg:block absolute left-[41.666%] top-0 bottom-0 w-px bg-white/5 z-0"></div>
      <div className="hidden lg:block absolute left-[41.666%] top-[-50%] h-[100%] w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent z-0 animate-flow-y"></div>

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
              <div className="font-mono text-accent/80 text-[10px] tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse cyan-glow"></span>
                T+ 00:00 &rarr; ???:??
              </div>
            </div>
            
            {/* Accent Typographique: "Incubate" en cyan assumé */}
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter text-accent/90 mb-16 uppercase leading-[0.85]">
              Incubate
            </h3>
            
            {/* Orbital Incubation Pipeline (Step-by-Step) */}
            <div className="relative mt-24 mb-16">
              
              {/* Main Vertical Axis */}
              <div className="absolute left-8 md:left-[5.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              {/* Active Flow Line */}
              <div className="absolute left-8 md:left-[5.5rem] top-0 h-1/3 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent cyan-glow animate-flow-y"></div>

              <div className="space-y-24 relative z-10">
                {[
                  {
                    id: "01",
                    title: "Screening & Sourcing",
                    subtitle: "Signal Detection",
                    desc: "Algorithmic filtering and deep-dive due diligence. We identify market anomalies and compute asymmetric opportunities before they surface.",
                    metrics: [ { label: "Selectivity", value: "0.4%" }, { label: "Data Points", value: "10k+" } ]
                  },
                  {
                    id: "02",
                    title: "Capital Injection",
                    subtitle: "Resource Allocation",
                    desc: "Immediate funding deployment and strategic resource allocation. Fueling the engine without bureaucratic friction.",
                    metrics: [ { label: "Deploy Time", value: "< 48H" }, { label: "Friction", value: "ZERO" } ]
                  },
                  {
                    id: "03",
                    title: "Infrastructure Sync",
                    subtitle: "Hearst Core Integration",
                    desc: "High-velocity iteration and architecture stress-testing on our proprietary stack. From silicon to consensus.",
                    metrics: [ { label: "Uptime", value: "99.99%" }, { label: "Latency", value: "Ultra-Low" } ]
                  },
                  {
                    id: "04",
                    title: "Talent Synthesis",
                    subtitle: "Strike Team Assembly",
                    desc: "Elite talent allocation. We surround founders with operational mercenaries to execute the vision flawlessly.",
                    metrics: [ { label: "Network", value: "Global" }, { label: "Expertise", value: "Niche" } ]
                  },
                  {
                    id: "05",
                    title: "Hyper-Scaling",
                    subtitle: "Global Deployment",
                    desc: "Go-to-market execution. Viral loop engineering and global scaling protocols engaged for exponential growth.",
                    metrics: [ { label: "Trajectory", value: "Vertical" }, { label: "Status", value: "Unstoppable" } ]
                  }
                ].map((step, index) => (
                  <div key={step.id} className="relative flex gap-8 md:gap-16 group cursor-crosshair">
                    
                    {/* Orbital Mechanism Node */}
                    <div className="relative w-16 h-16 md:w-44 md:h-44 flex-shrink-0 flex items-center justify-center -ml-[2rem] md:-ml-[5.5rem] bg-dark">
                      
                      {/* Crosshair Background */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-50 transition-opacity duration-500">
                        <div className="w-full h-px bg-white/20"></div>
                        <div className="h-full w-px bg-white/20"></div>
                      </div>

                      {/* Outer Orbit */}
                      <div className="absolute inset-2 md:inset-4 rounded-full border border-white/5 group-hover:border-accent/20 transition-colors duration-500 animate-[spin_20s_linear_infinite]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/20 group-hover:bg-accent/50 rounded-full transition-colors"></div>
                      </div>

                      {/* Middle Dashed Orbit */}
                      <div className="absolute inset-4 md:inset-10 rounded-full border border-dashed border-white/10 group-hover:border-accent/40 transition-colors duration-500 animate-[spin_15s_linear_infinite_reverse]">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white/40 group-hover:bg-accent rounded-full transition-colors group-hover:cyan-glow"></div>
                      </div>

                      {/* Inner Orbit */}
                      <div className="absolute inset-6 md:inset-16 rounded-full border border-accent/20 group-hover:border-accent/60 transition-colors duration-500 animate-[spin_10s_linear_infinite]">
                        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full cyan-glow"></div>
                      </div>

                      {/* The Core */}
                      <div className="relative z-10 w-4 h-4 md:w-8 md:h-8 bg-dark border border-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(94,234,212,0.2)] group-hover:shadow-[0_0_25px_rgba(94,234,212,0.5)] transition-shadow duration-500">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-2 md:pt-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                        <span className="font-mono text-[10px] md:text-xs text-accent tracking-widest">[{step.id}]</span>
                        <span className="hidden md:block w-8 h-px bg-white/10 group-hover:bg-accent/50 transition-colors duration-500"></span>
                        <h4 className="font-mono text-[10px] md:text-xs text-slate-500 tracking-widest uppercase group-hover:text-white transition-colors duration-500">
                          {step.title}
                        </h4>
                      </div>
                      
                      <h3 className="text-2xl md:text-4xl font-bold text-white/90 uppercase tracking-tight mb-4 group-hover:text-accent transition-colors duration-500">
                        {step.subtitle}
                      </h3>
                      
                      <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed max-w-lg mb-8">
                        {step.desc}
                      </p>

                      {/* Micro Metrics */}
                      <div className="flex gap-4 md:gap-8">
                        {step.metrics.map((metric, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <span className="font-mono text-[8px] md:text-[9px] text-slate-600 uppercase tracking-widest">{metric.label}</span>
                            <span className="font-mono text-xs md:text-sm text-white group-hover:text-accent transition-colors duration-500">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="lg:col-span-6 lg:col-start-7 lg:mt-32 pl-0 lg:pl-12">
            <div className="font-mono text-slate-600 text-[10px] mb-8 tracking-widest">PHASE 2 // SCALE</div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white/80 mb-12 uppercase leading-none">
              Operational<br/>
              <span className="text-slate-600 font-light">Mastery</span>
            </h3>
            
            <p className="text-slate-500 font-light leading-relaxed mb-16 max-w-md text-sm">
              Post-launch ventures run on centralized piloting and real-time synchronization. Complete control, <span className="text-accent/80 font-medium">zero overhead</span>. The system governs itself.
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
                  <div className="w-1.5 h-1.5 bg-slate-700 group-hover:bg-accent group-hover:cyan-glow transition-all duration-500"></div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-widest mb-2 group-hover:text-accent transition-colors duration-500">{item.title}</div>
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
