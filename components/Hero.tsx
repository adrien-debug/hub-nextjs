import React from 'react';
import HubLogo from '@/components/HubLogo';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-dark px-6 md:px-12 lg:px-24 py-12 overflow-hidden">
      {/* Grille SVG ultra-fine (2% opacité) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '6rem 6rem' }}>
      </div>

      {/* Ambient System Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-accent opacity-[0.015] blur-[150px] rounded-full pointer-events-none"></div>

      {/* Ligne réseau animée (signal système renforcé) */}
      <div className="absolute top-0 left-[15%] w-px h-[200%] bg-gradient-to-b from-transparent via-accent/60 to-transparent animate-flow-y pointer-events-none"></div>

      <header className="relative z-10 flex justify-between items-start">
        <HubLogo textColor="#ffffff" className="h-12 md:h-16" />
        <div className="text-right font-mono text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">
          <span className="flex items-center justify-end gap-2 mb-1">
            <span className="w-2 h-2 bg-accent rounded-full cyan-glow animate-pulse"></span>
            System Online
          </span>
          Hearst Infrastructure
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mt-24 mb-12">
        <div className="flex items-center gap-3 font-mono text-slate-500 text-[10px] md:text-xs tracking-widest uppercase mb-8">
          <span>[ CORE PROTOCOL // ACTIVE ]</span>
          <span className="w-1 h-1 bg-accent rounded-full animate-flicker"></span>
        </div>
        
        {/* Accent Typographique: "Run" en cyan assumé */}
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white leading-[0.9] uppercase">
          Engineered<br />
          To <span className="text-accent/90">Run</span><br />
          The Future<span className="text-slate-500 font-light animate-blink">_</span>
        </h1>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8 relative">
          {/* Ligne structurelle cyan */}
          <div className="absolute top-0 left-0 w-12 h-px bg-accent/80"></div>
          
          <div className="md:col-span-2">
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-light">
              Mining at the core. Intelligence, connectivity, and data built on top. 
              We own the stack to scale the <span className="text-white font-medium">unstoppable</span>.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end justify-start gap-4">
            <a href="#projects" className="group relative text-white hover:text-accent transition-colors py-2">
              <span className="font-mono text-sm uppercase tracking-widest">Access Ventures</span>
              <div className="absolute bottom-0 left-0 w-full h-px bg-white/20"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
