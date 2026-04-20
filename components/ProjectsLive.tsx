import React from 'react';
import { ProjectService } from '@/lib/projects';
import type { Project } from '@/lib/types';

function rowTheme(i: number): 'dark' | 'light' {
  return i % 2 === 0 ? 'dark' : 'light';
}

export default async function ProjectsLive() {
  const projects = ProjectService.list({ published: true, status: 'live' });

  return (
    <section id="projects" className="py-32 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-32 border-b border-slate-200 pb-8">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">SYS.03</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-900">Live Ventures</h2>
        </div>

        {projects.length === 0 ? (
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest border border-slate-200 p-12">
            NO_PUBLISHED_LIVE_NODES
          </p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
          {projects.map((project: Project, i: number) => {
            const theme = rowTheme(i);
            const isDark = theme === 'dark';
            const spanFullRow =
              projects.length > 1 && i === projects.length - 1 && projects.length % 2 === 1;
            return (
              <div
                key={project.id}
                className={`p-12 lg:p-16 relative group cursor-crosshair flex flex-col justify-between min-h-[400px] transition-colors ${isDark ? 'bg-dark text-white hover:bg-[#111111]' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                style={spanFullRow ? { gridColumn: '1 / -1' } : {}}
              >
                {i === 0 && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/80 to-transparent"></div>
                )}

                <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>

                <div className="flex justify-between items-start mb-16">
                  <span className={`font-mono text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ID.{project.id.slice(0, 8)}
                  </span>
                  {i === 0 ? (
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        NODE // CORE ACTIVE
                      </span>
                      <span className="w-2 h-2 bg-accent rounded-full cyan-glow animate-pulse"></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        ACTIVE
                      </span>
                      <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    </div>
                  )}
                </div>

                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {project.category}
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
                    {project.name}
                  </h3>

                  <p className={`text-sm font-light leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {project.description}
                  </p>
                </div>

                <div className={`absolute bottom-6 right-6 font-mono text-[8px] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>
                  +
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
