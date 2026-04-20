import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectsLive() {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4]"></span>
            <span className="uppercase tracking-widest text-xs font-semibold text-slate-500">
              Live Ventures
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Running on Hearst.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          
          {[
            { name: "Onyx Pay", cat: "Luxury Crypto Payment", desc: "White-label reconciliation and branded acceptance with absolute operational control." },
            { name: "WeMine", cat: "Automated Hashrate", desc: "Tokenized mining contracts yielding passive rewards across Bitcoin, Dogecoin, and Litecoin." },
            { name: "NetPool", cat: "Global Connectivity", desc: "Next-generation, shareable eSIM infrastructure enabling instant global access." }
          ].map((project, i) => (
            <div key={i} className="md:col-span-2 group relative bg-white border border-slate-200 p-8 hover:-translate-y-1 hover:shadow-sm transition-all duration-300 overflow-hidden cursor-pointer">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-4">{project.cat}</span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">{project.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{project.desc}</p>
              
              <ArrowUpRight className="absolute top-8 right-8 w-5 h-5 text-[#5eead4] opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5eead4] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
          ))}

          {[
            { name: "Agora Hub", cat: "Web3 Arena", desc: "The ultimate nexus for authentic, gamified experiences connecting users, investors, and builders." },
            { name: "Bull21", cat: "Behavioral Growth", desc: "Engineering viral loops and community psychology to transform projects into self-reinforcing ecosystems." }
          ].map((project, i) => (
            <div key={i} className="md:col-span-3 group relative bg-white border border-slate-200 p-10 hover:-translate-y-1 hover:shadow-sm transition-all duration-300 overflow-hidden cursor-pointer">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-4">{project.cat}</span>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{project.name}</h3>
              <p className="text-slate-500 leading-relaxed max-w-md">{project.desc}</p>
              
              <ArrowUpRight className="absolute top-10 right-10 w-6 h-6 text-[#5eead4] opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5eead4] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
