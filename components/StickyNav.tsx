'use client';

import React, { useEffect, useState } from 'react';
import HubLogo from '@/components/HubLogo';

const LINKS = [
  { href: '#about', label: 'Thesis' },
  { href: '#methodology', label: 'Engine' },
  { href: '#projects', label: 'Ventures' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#join', label: 'Join' },
];

export default function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  return (
    <nav
      aria-label="Primary"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-dark/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 h-14 md:h-16 flex items-center justify-between gap-4 relative">
          <a href="#top" className="flex items-center shrink-0 min-h-[44px]" aria-label="Back to top">
            <HubLogo textColor="#ffffff" className="h-6 sm:h-7 md:h-8" />
          </a>

          <ul className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative font-mono text-[11px] uppercase tracking-widest text-slate-400 hover:text-white transition-colors py-2"
                >
                  {l.label}
                  <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#join"
              className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-dark bg-accent hover:bg-white transition-colors px-3 md:px-4 py-2 min-h-[40px]"
            >
              <span>Get In</span>
              <span>→</span>
            </a>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden inline-flex flex-col items-end justify-center gap-1.5 w-11 h-11 -mr-2"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? 'w-5 translate-y-[7px] rotate-45' : 'w-5'}`}></span>
              <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 w-5' : 'w-3.5'}`}></span>
              <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? 'w-5 -translate-y-[7px] -rotate-45' : 'w-5'}`}></span>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden border-t border-white/5 transition-[max-height] duration-500 ${
            menuOpen ? 'max-h-[480px]' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col bg-dark">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-white/5">
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/5 px-5 py-4 min-h-[52px]"
                >
                  <span>{l.label}</span>
                  <span className="text-slate-600">→</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="#join"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-dark bg-accent hover:bg-white px-5 py-4 min-h-[52px]"
              >
                <span>Get In</span>
                <span>→</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
