import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-24 border-b border-slate-200 pb-8">
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">SYS.01</span>
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900">The Foundation</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <h3 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.95] mb-12 uppercase">
              Absolute Control.<br />
              <span className="text-slate-400">Zero Reliance.</span>
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl font-light">
              Hearst bridges complex engineering with seamless user experience. From custom silicon optimization to bespoke consensus protocols, we control every layer. Eliminating third-party friction is not an option—it is the bedrock of a new era of decentralized compute.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 gap-px bg-slate-200 border border-slate-200">
              {[
                { value: "100%", label: "Proprietary Stack", desc: "Hardware to Application" },
                { value: "ZERO", label: "External Dependencies", desc: "Fully Sovereign Infrastructure" },
                { value: "07+", label: "Active Ventures", desc: "Running on Hearst Core" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 group hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-5xl font-bold tracking-tighter text-slate-900">{stat.value}</span>
                    <span className="font-mono text-[10px] text-[#5eead4] opacity-0 group-hover:opacity-100 transition-opacity">VERIFIED</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
