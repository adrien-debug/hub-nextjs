import React from "react";

export default function Footer() {
  return (
    <footer className="pt-32 pb-12 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-24 relative inline-block">
          <h2 className="text-[12vw] leading-none font-black tracking-tighter text-white uppercase opacity-90">
            Hearst
          </h2>
          <div className="absolute bottom-4 right-[-20px] w-4 h-px bg-[#5eead4]/50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-white/10 pt-12 mb-24">
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-6">HQ / Protocol</div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-light">
              Redefining digital infrastructure. Proprietary tech stack from silicon to consensus. <span className="text-white font-medium">Absolute sovereignty.</span>
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-6">Platform</div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Hearst AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hearst Connect</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Infrastructure</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-6">Company</div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Ventures</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-6">Network</div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">X / Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-8 border-t border-white/10 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          <div className="flex gap-6 items-center">
            <span>© 2026 Hearst Infrastructure</span>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 bg-[#5eead4] rounded-full cyan-glow animate-pulse"></span>
              <span className="text-[#5eead4]/90">SYSTEM STATUS: OPERATIONAL</span>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
