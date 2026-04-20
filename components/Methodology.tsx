import React from 'react';

export default function Methodology() {
  return (
    <section id="methodology" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="uppercase tracking-widest text-xs font-semibold text-slate-500 block mb-6">
            02 / The Engine
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Incubate. Scale. Dominate.
          </h2>
          <p className="text-lg text-slate-400">
            A proprietary framework for building and launching world-class ventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111111] border border-white/5 border-t-[#5eead4] border-t-4 p-12">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-4">Incubation Framework</h3>
            <p className="text-slate-400 mb-12 leading-relaxed">
              From ideation to MVP, high-potential concepts are nurtured through our full-stack infrastructure.
            </p>
            <ul className="space-y-6">
              {[
                "Strategic validation & market analysis",
                "Rapid prototyping on Hearst infrastructure",
                "Team assembly & resource allocation",
                "Launch & growth acceleration"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold text-slate-500 mt-1.5">0{i + 1}.</span>
                  <span className="text-slate-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#111111] border border-white/5 border-t-white border-t-4 p-12">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-4">Operational Mastery</h3>
            <p className="text-slate-400 mb-12 leading-relaxed">
              Post-launch ventures run on centralized piloting and real-time synchronization. Complete control, zero overhead.
            </p>
            <ul className="space-y-6">
              {[
                "Centralized access & expense management",
                "Real-time data synchronization",
                "AI-driven intelligence layer",
                "Seamless tool integration"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-[#5eead4] text-lg leading-none mt-0.5">▪</span>
                  <span className="text-slate-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
