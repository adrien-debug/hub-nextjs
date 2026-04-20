import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          <span className="uppercase tracking-widest text-xs font-semibold text-[#5eead4] block mb-6">
            01 / The Foundation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Absolute Control.<br />
            Zero Reliance.
          </h2>
        </div>

        <div className="lg:col-span-7">
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
            Hearst bridges complex engineering with seamless user experience. From custom silicon optimization to bespoke consensus protocols, we control every layer. Eliminating third-party friction is not an option—it is the bedrock of a new era of decentralized compute.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-16">
            {[
              { value: "100%", label: "Proprietary Stack" },
              { value: "0", label: "External Dependencies" },
              { value: "7+", label: "Active Ventures" },
              { value: "∞", label: "Scalable Compute" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 p-8 flex flex-col justify-center">
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">{stat.value}</span>
                <span className="text-sm font-medium text-slate-500 mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
