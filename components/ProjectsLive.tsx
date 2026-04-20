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
    <section id="projects" className="py-32 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-24 border-b border-slate-200 pb-8">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">SYS.03</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-900">Live Ventures</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Dominant Card - Brutalist, Overlapping, Massive */}
          <div className="lg:col-span-12 relative z-20 bg-[#0A0A0A] text-white p-12 md:p-24 -mx-6 md:mx-0 shadow-[0_40px_80px_rgba(0,0,0,0.15)] mb-16 lg:-mb-12">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#5eead4]"></div>
            
            <div className="flex justify-between items-start mb-24">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#0A0A0A] font-bold bg-[#5eead4] px-3 py-1.5 uppercase tracking-widest">FLAGSHIP NODE</span>
                <span className="w-2 h-2 bg-[#5eead4] rounded-full animate-pulse"></span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">ID.{dominant.id}</span>
            </div>
            
            <h3 className="text-[12vw] lg:text-[9rem] leading-[0.8] font-black tracking-tighter uppercase mb-12">{dominant.name}</h3>
            
            <div className="grid md:grid-cols-2 gap-12 items-end border-t border-white/10 pt-12">
              <p className="text-xl md:text-3xl text-slate-400 font-light tracking-tight leading-tight">
                {dominant.desc}
              </p>
              <div className="text-right">
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2">Category</div>
                <div className="text-sm font-bold uppercase tracking-wider">{dominant.cat}</div>
              </div>
            </div>
          </div>

          {/* Secondary Cards - Broken Rhythm */}
          
          {/* Card 2: Dense, compact, pushed right */}
          <div className="lg:col-span-4 lg:col-start-9 bg-slate-50 p-8 border-l-2 border-slate-200 hover:border-[#5eead4] transition-colors">
            <div className="flex justify-between items-start mb-12">
              <span className="font-mono text-[10px] text-slate-400">ID.{others[0].id}</span>
              <span className="font-mono text-[10px] text-slate-900 uppercase tracking-widest">Active</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tighter text-slate-900 mb-4 uppercase">{others[0].name}</h3>
            <p className="text-xs text-slate-500 font-mono leading-relaxed">{others[0].desc}</p>
          </div>

          {/* Card 3: Massive empty space, small text */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-16 md:p-32 flex flex-col justify-between min-h-[400px]">
            <div className="font-mono text-[10px] text-slate-400">ID.{others[1].id}</div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{others[1].cat}</div>
              <h3 className="text-4xl font-bold tracking-tighter text-slate-900 mb-6 uppercase">{others[1].name}</h3>
              <p className="text-sm text-slate-500 font-light max-w-sm">{others[1].desc}</p>
            </div>
          </div>

          {/* Card 4 & 5: Asymmetrical split */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-12">
            <div className="flex justify-between items-start mb-16">
              <span className="font-mono text-[10px] text-slate-500">ID.{others[2].id}</span>
            </div>
            <h3 className="text-5xl font-black tracking-tighter mb-6 uppercase">{others[2].name}</h3>
            <p className="text-slate-400 font-light">{others[2].desc}</p>
          </div>

          <div className="lg:col-span-12 border-t border-b border-slate-200 py-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-slate-50 transition-colors cursor-crosshair">
            <div className="flex items-center gap-8">
              <span className="font-mono text-[10px] text-slate-400">ID.{others[3].id}</span>
              <h3 className="text-2xl font-bold tracking-tighter text-slate-900 uppercase">{others[3].name}</h3>
            </div>
            <p className="text-xs text-slate-500 font-mono max-w-xl md:text-right">{others[3].desc}</p>
          </div>

        </div>
      </div>
    </section>
  );
}
