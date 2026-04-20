import React from 'react';

const projects = [
  {
    id: "01",
    name: "Onyx Pay",
    cat: "Luxury Crypto Payment",
    desc: "White-label reconciliation and branded acceptance with absolute operational control.",
    theme: "dark"
  },
  {
    id: "02",
    name: "WeMine",
    cat: "Automated Hashrate",
    desc: "Tokenized mining contracts yielding passive rewards across BTC, DOGE, and LTC.",
    theme: "light"
  },
  {
    id: "03",
    name: "NetPool",
    cat: "Global Connectivity",
    desc: "Next-generation, shareable eSIM infrastructure enabling instant global access.",
    theme: "light"
  },
  {
    id: "04",
    name: "Agora Hub",
    cat: "Web3 Arena",
    desc: "The ultimate nexus for authentic, gamified experiences connecting users, investors, and builders.",
    theme: "dark"
  },
  {
    id: "05",
    name: "Bull21",
    cat: "Behavioral Growth",
    desc: "Engineering viral loops and community psychology to transform projects into self-reinforcing ecosystems.",
    theme: "light"
  }
];

export default function ProjectsLive() {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-24 border-b border-slate-200 pb-8">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">SYS.03</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-900">Live Ventures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
          {projects.map((project, i) => {
            const isDark = project.theme === "dark";
            return (
              <div 
                key={i} 
                className={`p-12 lg:p-16 relative group cursor-crosshair flex flex-col justify-between min-h-[400px] ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-white text-slate-900 hover:bg-slate-50 transition-colors'}`}
                style={i === 4 ? { gridColumn: "1 / -1" } : {}}
              >
                {/* Ligne cyan persistante sur Onyx */}
                {project.id === "01" && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5eead4]/80 to-transparent"></div>
                )}
                
                {/* Ligne cyan au hover plus épaisse */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                
                <div className="flex justify-between items-start mb-16">
                  <span className={`font-mono text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ID.{project.id}</span>
                  {project.id === "01" && (
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>NODE // CORE ACTIVE</span>
                      <span className="w-2 h-2 bg-[#5eead4] rounded-full cyan-glow animate-pulse"></span>
                    </div>
                  )}
                  {project.id !== "01" && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ACTIVE</span>
                      <span className="w-1.5 h-1.5 bg-[#5eead4] rounded-full"></span>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{project.cat}</div>
                  
                  {/* Accent Typographique: "Pay" en cyan assumé sur Onyx */}
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
                    {project.id === "01" ? (
                      <>Onyx <span className="text-[#5eead4]/90">Pay</span></>
                    ) : (
                      project.name
                    )}
                  </h3>
                  
                  <p className={`text-sm font-light leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {project.desc}
                  </p>
                </div>
                
                <div className={`absolute bottom-6 right-6 font-mono text-[8px] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>+</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
