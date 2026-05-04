'use client';

import React, { useState } from 'react';

export default function Join() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
      setState('sent');
    } catch (err: any) {
      setState('error');
      setError(err.message || 'Something went wrong');
    }
  }

  return (
    <section id="join" className="scroll-mt-20 relative bg-accent text-dark overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #0A0A0A 0 1px, transparent 1px 12px)',
        }}
      />

      <svg
        className="pointer-events-none absolute -right-16 -bottom-24 md:-right-24 md:-bottom-40 h-[420px] md:h-[640px] lg:h-[820px] w-auto opacity-[0.10]"
        viewBox="560 455 150 170"
        aria-hidden
      >
        <polygon
          fill="#0A0A0A"
          points="601.74 466.87 572.6 466.87 572.6 609.73 601.74 609.73 601.74 549.07 633.11 579.43 665.76 579.43 601.74 517.46 601.74 466.87"
        />
        <polygon
          fill="#0A0A0A"
          points="672.72 466.87 672.72 528.12 644.63 500.93 611.98 500.93 672.72 559.72 672.72 609.73 701.86 609.73 701.86 466.87 672.72 466.87"
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-16 sm:py-24 md:py-40 lg:py-48">

        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-20 border-b border-dark/20 pb-5 sm:pb-6 md:pb-8">
          <span className="font-mono text-[10px] text-dark/60 uppercase tracking-widest">SYS.05</span>
          <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-dark">Join Us</h2>
          <span className="ml-auto flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-dark/60 tracking-widest">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dark rounded-full animate-pulse"></span>
            <span className="hidden xs:inline">ACCEPTING SIGNAL</span>
            <span className="xs:hidden">LIVE</span>
          </span>
        </div>

        <h3 className="text-[2.5rem] xs:text-5xl sm:text-7xl md:text-8xl lg:text-[11rem] font-black tracking-tighter text-dark leading-[0.9] sm:leading-[0.85] uppercase mb-8 sm:mb-12 md:mb-16">
          Build<br />
          With<br />
          Us<span className="text-dark/40">.</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-end">
          <p className="lg:col-span-5 text-base sm:text-lg md:text-xl text-dark/70 font-light leading-relaxed max-w-md">
            Operators, founders, capital. If your work belongs in this stack, the door is open — but the bar is set.
          </p>

          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            <span className="font-mono text-[10px] text-dark/60 uppercase tracking-widest">
              {state === 'sent' ? 'Signal Received' : 'Drop Your Address'}
            </span>

            {state === 'sent' ? (
              <div className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-dark py-3">
                Thanks — we&rsquo;ll be in touch.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="group flex flex-col gap-2">
                <div className="flex items-center gap-3 sm:gap-5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    className="flex-1 min-w-0 bg-transparent text-lg sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-dark placeholder-dark/30 focus:outline-none py-2"
                  />
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="shrink-0 inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-2xl sm:text-3xl md:text-4xl text-dark transition-transform duration-300 hover:translate-x-2 disabled:opacity-50"
                    aria-label="Send"
                  >
                    {state === 'sending' ? '…' : '→'}
                  </button>
                </div>
                <div className="relative h-px w-full bg-dark/20 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-0 bg-dark group-focus-within:w-full transition-all duration-700"></div>
                </div>
                {state === 'error' && (
                  <span className="font-mono text-[10px] text-red-900 uppercase tracking-widest">
                    {error}
                  </span>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 sm:mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 md:gap-12 border-t border-dark/20 pt-6 sm:pt-8 md:pt-10 font-mono text-[10px] uppercase tracking-widest text-dark/60">
          <div>
            <div className="text-dark/40 mb-1">Status</div>
            <div className="text-dark">Open · Selective</div>
          </div>
          <div>
            <div className="text-dark/40 mb-1">Response</div>
            <div className="text-dark">&lt; 72H</div>
          </div>
          <div>
            <div className="text-dark/40 mb-1">Verticals</div>
            <div className="text-dark">All Active</div>
          </div>
          <div>
            <div className="text-dark/40 mb-1">Stage</div>
            <div className="text-dark">Pre-seed → Scale</div>
          </div>
        </div>

      </div>
    </section>
  );
}
