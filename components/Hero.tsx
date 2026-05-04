import React from 'react';
import HubLogo from '@/components/HubLogo';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-dark px-5 sm:px-8 md:px-12 lg:px-24 py-5 sm:py-8 md:py-12 overflow-hidden">

      <header className="relative z-10 flex justify-between items-center gap-4">
        <HubLogo textColor="#ffffff" className="h-9 sm:h-12 md:h-16" />
        <div className="text-right font-mono text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-widest leading-tight">
          <span className="flex items-center justify-end gap-1.5 sm:gap-2 mb-1">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full cyan-glow animate-pulse"></span>
            System Online
          </span>
          <span className="hidden sm:inline">Hearst Infrastructure</span>
          <span className="sm:hidden">Hearst Infra</span>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mt-12 sm:mt-20 md:mt-24 mb-6 sm:mb-10 md:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-slate-500 text-[9px] sm:text-[10px] md:text-xs tracking-widest uppercase mb-5 sm:mb-7 md:mb-8">
          <span>[ CORE PROTOCOL // ACTIVE ]</span>
          <span className="w-1 h-1 bg-accent rounded-full animate-flicker"></span>
        </div>

        <h1 className="text-[2.5rem] xs:text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white leading-[0.95] sm:leading-[0.9] uppercase">
          Engineered<br />
          To <span className="text-accent/90">Run</span><br />
          The Future<span className="text-slate-500 font-light animate-blink">_</span>
        </h1>

        <div className="mt-8 sm:mt-12 md:mt-16 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 border-t border-white/10 pt-6 sm:pt-8 relative">
          <div className="absolute top-0 left-0 w-12 h-px bg-accent/80"></div>

          <div className="md:col-span-2">
            <p className="text-sm sm:text-lg md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-light">
              Mining at the core. Intelligence, connectivity, and data built on top.
              We own the stack to scale the <span className="text-white font-medium">unstoppable</span>.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end justify-start">
            <a
              href="#projects"
              className="group relative inline-flex items-center text-white hover:text-accent transition-colors py-3 min-h-[44px]"
            >
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest">Access Ventures</span>
              <div className="absolute bottom-0 left-0 w-full h-px bg-white/20"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
