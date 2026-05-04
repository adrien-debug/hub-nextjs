import React from "react";
import HubLogo from "@/components/HubLogo";

export default function Footer() {
  return (
    <footer className="pt-16 sm:pt-20 md:pt-32 pb-8 sm:pb-10 md:pb-12 px-5 sm:px-8 md:px-12 lg:px-24 bg-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 sm:mb-16 md:mb-24 relative inline-block">
          <HubLogo textColor="#ffffff" className="h-10 sm:h-12 md:h-16" />
          <div className="absolute bottom-2 md:bottom-4 right-[-12px] md:right-[-20px] w-3 md:w-4 h-px bg-accent/50"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 md:gap-8 border-t border-white/10 pt-8 sm:pt-10 md:pt-12 mb-10 sm:mb-16 md:mb-24">
          <div className="col-span-2 md:col-span-4">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-3 sm:mb-4 md:mb-6">HQ / Protocol</div>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xs font-light">
              Redefining digital infrastructure. Proprietary tech stack from silicon to consensus. <span className="text-white font-medium">Absolute sovereignty.</span>
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-3 sm:mb-4 md:mb-6">Platform</div>
            <ul className="space-y-3 md:space-y-4 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">Hearst AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">Hearst Connect</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">Infrastructure</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">Documentation</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-3 sm:mb-4 md:mb-6">Company</div>
            <ul className="space-y-3 md:space-y-4 text-sm text-slate-300">
              <li><a href="#about" className="hover:text-white transition-colors inline-block py-1">About</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors inline-block py-1">Ventures</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-3 sm:mb-4 md:mb-6">Network</div>
            <ul className="space-y-3 md:space-y-4 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">X / Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors inline-block py-1">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 sm:gap-6 pt-6 sm:pt-8 border-t border-white/10 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-3 sm:items-center">
            <span>© 2026 Hearst Infrastructure</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full cyan-glow animate-pulse"></span>
              <span className="text-accent/90">SYSTEM STATUS: OPERATIONAL</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors py-1">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors py-1">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors py-1">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
