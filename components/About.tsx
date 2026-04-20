import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-24">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">STACK STATUS: VERIFIED</span>
          <span className="w-2 h-2 bg-[#5eead4] rounded-full cyan-glow animate-pulse"></span>
        </div>

        <div className="mb-24">
          {/* Accent Typographique: "Control." en cyan assumé */}
          <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter text-slate-900 leading-[0.85] uppercase mb-4">
            Absolute<br />
            <span className="text-[#5eead4]/90">Control.</span>
          </h2>
          <div className="text-4xl md:text-6xl lg:text-[5rem] font-light tracking-[0.15em] text-slate-900/20 uppercase">
            Zero Reliance
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 relative pl-8 border-l border-[#5eead4]/40">
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-light">
              We control every <span className="text-[#5eead4]/90 font-medium">critical layer</span>.<br />
              From silicon to consensus, nothing is outsourced.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-end">
            <div className="flex flex-col border-t border-slate-200">
              {[
                { value: "100%", label: "Proprietary Stack" },
                { value: "0", label: "External Dependencies" },
                { value: "07+", label: "Active Ventures" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 py-10 border-b border-slate-200 group relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 w-32">{stat.value}</span>
                  <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
