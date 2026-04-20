import React from 'react';
import { ArrowDown } from 'lucide-react';
import HubLogo from '@/components/HubLogo';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#0A0A0A] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}>
      </div>

      <div className="relative z-10 max-w-5xl">
        <div className="mb-10">
          <HubLogo textColor="#ffffff" />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] animate-pulse"></span>
          <span className="uppercase tracking-widest text-xs font-semibold text-slate-400">
            Hearst Infrastructure Ecosystem
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.05]">
          Engineered to run <br />
          <span className="text-[#5eead4]">the future of work.</span>
        </h1>
        
        <p className="mt-8 text-xl text-slate-400 max-w-2xl leading-relaxed">
          Mining at the core. Intelligence, connectivity, and data built on top. 
          We own the stack to scale the unstoppable.
        </p>
        
        <div className="mt-12 flex items-center gap-8">
          <a href="#projects" className="bg-[#5eead4] text-black px-8 py-4 text-sm font-medium hover:bg-[#4dd4b8] transition-all duration-300">
            Explore the Ecosystem
          </a>
          <a href="#methodology" className="text-white px-2 py-4 text-sm font-medium border-b border-transparent hover:border-[#5eead4] transition-all duration-300">
            Our Methodology
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 animate-bounce">
        <ArrowDown className="w-5 h-5 text-[#5eead4] stroke-[1.5]" />
      </div>
    </section>
  );
}
