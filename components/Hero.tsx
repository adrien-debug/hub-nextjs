import React from 'react';
import HubLogo from '@/components/HubLogo';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-[#0A0A0A] px-6 md:px-12 lg:px-24 py-12 overflow-hidden">
      {/* Grille SVG ultra-fine (2% opacité) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '6rem 6rem' }}>
      </div>

      <header className="relative z-10 flex justify-between items-start">
        <HubLogo textColor="#ffffff" className="h-12 md:h-16" />
        <div className="text-right font-mono text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">
          <span className="flex items-center justify-end gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-[#5eead4] animate-pulse"></span>
            System Online
          </span>
          Hearst Infrastructure
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mt-24 mb-12">
        <div className="font-mono text-[#5eead4] text-xs md:text-sm tracking-widest uppercase mb-8">
          [ Core Protocol ]
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white leading-[0.9] uppercase">
          Engineered<br />
          <span className="text-slate-500">To Run</span><br />
          The Future.
        </h1>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8">
          <div className="md:col-span-2">
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-light">
              Mining at the core. Intelligence, connectivity, and data built on top. 
              We own the stack to scale the unstoppable.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end justify-start gap-4">
            <a href="#projects" className="group flex items-center gap-4 text-white hover:text-[#5eead4] transition-colors">
              <span className="font-mono text-sm uppercase tracking-widest">Access Ventures</span>
              <div className="w-8 h-px bg-white group-hover:bg-[#5eead4] transition-colors"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
