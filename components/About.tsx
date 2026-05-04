import React from 'react';

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-16 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-16 md:mb-24 border-b border-slate-200 pb-5 sm:pb-6 md:pb-8">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">SYS.01</span>
          <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-900">Thesis</h2>
          <span className="w-2 h-2 bg-accent rounded-full cyan-glow animate-pulse ml-auto"></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <h2 className="text-[3.25rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter text-slate-900 leading-[0.9] sm:leading-[0.85] uppercase mb-2 sm:mb-3 md:mb-4">
              Absolute<br />
              <span className="text-accent/90">Control.</span>
            </h2>
            <div className="text-xl xs:text-2xl sm:text-3xl md:text-6xl lg:text-[5rem] font-light tracking-[0.12em] sm:tracking-[0.15em] text-slate-900/20 uppercase">
              Zero Reliance
            </div>
          </div>

          <div className="lg:col-span-5 relative pl-5 sm:pl-6 md:pl-8 border-l border-accent/40">
            <p className="text-base sm:text-xl md:text-2xl text-slate-500 leading-relaxed font-light">
              Capital, infrastructure and execution under one roof. We back what we operate, and operate what we back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
