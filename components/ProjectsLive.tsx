import React from 'react';

const projects = [
  {
    id: "01",
    name: "Onyx Pay",
    cat: "Luxury Crypto Payment",
    desc: "White-label reconciliation and branded acceptance with absolute operational control.",
    dominant: true
  },
  {
    id: "02",
    name: "WeMine",
    cat: "Automated Hashrate",
    desc: "Tokenized mining contracts yielding passive rewards across BTC, DOGE, and LTC."
  },
  {
    id: "03",
    name: "NetPool",
    cat: "Global Connectivity",
    desc: "Next-generation, shareable eSIM infrastructure enabling instant global access."
  },
  {
    id: "04",
    name: "Agora Hub",
    cat: "Web3 Arena",
    desc: "The ultimate nexus for authentic, gamified experiences connecting users, investors, and builders."
  },
  {
    id: "05",
    name: "Bull21",
    cat: "Behavioral Growth",
    desc: "Engineering viral loops and community psychology to transform projects into self-reinforcing ecosystems."
  }
];

export default function ProjectsLive() {
  const dominant = projects[0];
  const others = projects.slice(1);

  return (
    <section id="projects" className="py-32 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-24 border-b border-slate-200 pb-8">
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">SYS.03</span>
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900">Live Ventures</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-200 border border-slate-200">
          
          {/* Dominant Card */}
          <div className="lg:col-span-8 bg-white p-12 lg:p-20 relative group cursor-crosshair">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#5eead4] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out"></div>
            <div className="flex justify-between items-start mb-24">
              <span className="font-mono text-xs text-slate-400">ID.{dominant.id}</span>
              <span className="flex items-center gap-2 text-[10px] font-mono text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#5eead4] rounded-full animate-pulse"></span>
                OPERATIONAL
              </span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{dominant.cat}</div>
            <h3 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-8 uppercase">{dominant.name}</h3>
            <p className="text-xl text-slate-500 font-light max-w-lg leading-relaxed mb-12">
              {dominant.desc}
            </p>
            <div className="font-mono text-xs text-[#5eead4] uppercase tracking-widest group-hover:translate-x-4 transition-transform duration-300">
              Access Protocol →
            </div>
          </div>

          {/* Secondary Cards (Right Column) */}
          <div className="lg:col-span-4 flex flex-col gap-px bg-slate-200">
            {others.slice(0, 2).map((project, i) => (
              <div key={i} className="bg-white p-10 flex-1 relative group cursor-crosshair hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-mono text-[10px] text-slate-400">ID.{project.id}</span>
                  <span className="w-1.5 h-1.5 bg-[#5eead4] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{project.cat}</div>
                <h3 className="text-3xl font-bold tracking-tighter text-slate-900 mb-4 uppercase">{project.name}</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{project.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          {others.slice(2).map((project, i) => (
            <div key={i} className="lg:col-span-6 bg-white p-10 relative group cursor-crosshair hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-12">
                <span className="font-mono text-[10px] text-slate-400">ID.{project.id}</span>
                <span className="w-1.5 h-1.5 bg-[#5eead4] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{project.cat}</div>
              <h3 className="text-3xl font-bold tracking-tighter text-slate-900 mb-4 uppercase">{project.name}</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md">{project.desc}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
