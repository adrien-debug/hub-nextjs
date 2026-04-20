import React from 'react';
import { ProjectService } from '@/lib/projects';
import type { Project } from '@/lib/types';

function pipelineProjects(): Project[] {
  const coming = ProjectService.list({ published: true, status: 'coming' });
  const future = ProjectService.list({ published: true, status: 'future' });
  return [...coming, ...future].sort((a, b) => a.order_index - b.order_index || a.name.localeCompare(b.name));
}

export default async function ProjectsComing() {
  const items = pipelineProjects();

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-dark border-t border-white/5 bg-grain relative overflow-hidden">

      <div className="absolute top-1/3 left-[-50%] w-[200%] h-[2px] bg-accent blur-[2px] opacity-20 animate-flow-x pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-32 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.04</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Pipeline</h2>
        </div>

        {items.length === 0 ? (
          <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest border border-white/10 py-16 px-6">
            NO_PUBLISHED_PIPELINE_NODES
          </p>
        ) : (
        <div className="border-t border-white/10">
          {items.map((project, index) => {
            const isLead = index === 0;
            const rowMuted = !isLead;
            return (
              <div
                key={project.id}
                className={`group border-b border-white/5 py-16 flex flex-col lg:flex-row justify-between gap-12 relative ${rowMuted ? 'opacity-50 hover:opacity-100 transition-opacity duration-700' : ''}`}
              >
                <div className="font-mono text-[9px] text-slate-700 relative mb-4 lg:mb-0 lg:absolute lg:left-0 lg:top-4 tracking-widest">
                  {project.status.toUpperCase()}.{project.slug.slice(0, 12).toUpperCase()}
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline mt-4 lg:mt-0">
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                    {project.name}
                  </h3>
                  <span className={`text-xs font-mono tracking-widest uppercase ${isLead ? 'text-accent/60' : 'text-slate-500'}`}>
                    {project.category}
                  </span>
                </div>

                <div className="max-w-sm lg:text-right flex flex-col justify-end">
                  <p className="text-slate-400 font-mono text-[10px] leading-relaxed uppercase">
                    {project.description}
                  </p>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 tracking-widest uppercase">
                  {isLead ? 'RESTRICTED' : 'ACCESS LIMITED'}
                </div>
              </div>
            );
          })}
        </div>
        )}

        <div className="mt-24 flex justify-end">
          <div className="flex items-center gap-2 font-mono text-[10px] text-accent/90">
            <span className="text-glitch">INPUT STREAM: WAITING</span>
            <span className="animate-blink">_</span>
          </div>
        </div>

      </div>
    </section>
  );
}
