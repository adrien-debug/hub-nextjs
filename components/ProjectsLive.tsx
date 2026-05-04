import React from 'react';
import { ProjectService } from '@/lib/projects';
import type { Project } from '@/lib/types';

const HOMEPAGE_EXCLUDE = new Set(['hearst-ai']);

export default async function ProjectsLive() {
  const liveAll = ProjectService.list({ published: true, status: 'live' });
  const live = liveAll.filter((p) => !HOMEPAGE_EXCLUDE.has(p.slug));
  const coming = ProjectService.list({ published: true, status: 'coming' });
  const future = ProjectService.list({ published: true, status: 'future' });
  const pipelineItems = [...coming, ...future];
  const [lead, ...rest] = live;

  return (
    <section id="projects" className="scroll-mt-20 py-16 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 border-b border-slate-200 pb-5 sm:pb-6 md:pb-8">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">SYS.03</span>
          <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-900">Live Ventures</h2>
          <span className="ml-auto font-mono text-[10px] text-slate-400 tracking-widest">
            {String(live.length).padStart(2, '0')} ACTIVE
          </span>
        </div>

        {live.length === 0 ? (
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest border border-slate-200 p-8 md:p-12">
            NO_PUBLISHED_LIVE_NODES
          </p>
        ) : (
          <>
            {lead && <FeaturedCard project={lead} />}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 mt-px">
                {rest.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i + 2} />
                ))}
              </div>
            )}
          </>
        )}

        {pipelineItems.length > 0 && (
          <div id="pipeline" className="mt-16 sm:mt-20 md:mt-32 scroll-mt-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 border-b border-slate-200 pb-5 sm:pb-6 md:pb-8">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">SYS.04</span>
              <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-900">Pipeline</h2>
              <span className="ml-auto font-mono text-[10px] text-slate-400 tracking-widest">
                {String(pipelineItems.length).padStart(2, '0')} INCOMING
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {pipelineItems.map((project, i) => (
                <PipelineCard key={project.id} project={project} index={i + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <div className="bg-dark text-white p-6 sm:p-8 md:p-12 lg:p-20 relative group cursor-crosshair overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/80 to-transparent"></div>

      <div className="flex flex-row justify-between items-center gap-3 mb-8 sm:mb-10 md:mb-16 relative z-10">
        <span className="font-mono text-[10px] text-slate-400">
          01 / {project.id.slice(0, 8)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            <span className="hidden sm:inline">NODE // </span>CORE ACTIVE
          </span>
          <span className="w-2 h-2 bg-accent rounded-full cyan-glow animate-pulse"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 md:items-end relative z-10">
        <div className="md:col-span-8">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 text-white/80">
            {project.tagline || project.category}
          </div>
          <h3 className="text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-3 sm:mb-4 md:mb-6 leading-[0.9]">
            {project.name}
          </h3>
        </div>
        <p className="md:col-span-4 text-sm sm:text-base font-light leading-relaxed text-slate-400">
          {project.description}
        </p>
      </div>

      <div className="mt-8 sm:mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 sm:gap-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 flex-1">
          <Stat label="Status" value="OPERATIONAL" accent />
          <Stat label="Vertical" value={project.category} />
          <Stat label="Profile" value={project.slug.toUpperCase()} />
        </div>
        {project.urls?.production && (
          <WebsiteButton href={project.urls.production} dark />
        )}
      </div>
    </div>
  );
}

const UGLY_HOST_PATTERNS = [/webflow\.io$/, /vercel\.app$/, /wixsite\.com$/, /netlify\.app$/];

function WebsiteButton({ href, dark = false }: { href: string; dark?: boolean }) {
  let label = href;
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    label = UGLY_HOST_PATTERNS.some((re) => re.test(host)) ? 'Website' : host;
  } catch {}

  const palette = dark
    ? 'text-white border-white/30 hover:text-accent hover:border-accent group-hover:text-accent group-hover:border-accent'
    : 'text-slate-900 border-slate-300 hover:text-accent hover:border-accent group-hover:text-accent group-hover:border-accent';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border px-4 py-2 transition-colors whitespace-nowrap ${dark ? 'self-end' : 'self-start'} ${palette}`}
    >
      <span>{label}</span>
      <span className="transition-transform group-hover:translate-x-0.5">↗</span>
    </a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="bg-white p-5 sm:p-8 lg:p-12 relative group cursor-crosshair flex flex-col justify-between min-h-[260px] sm:min-h-[320px] md:min-h-[360px] hover:bg-slate-50 transition-colors">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>

      <div className="flex justify-between items-start mb-6 sm:mb-8 md:mb-12">
        <span className="font-mono text-[10px] text-slate-400">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            ACTIVE
          </span>
          <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 text-slate-700">
          {project.tagline || project.category}
        </div>
        <h3 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3 md:mb-4">
          {project.name}
        </h3>
        <p className="text-sm sm:text-base font-light leading-relaxed text-slate-500">
          {project.description}
        </p>
      </div>

      <div className="mt-5 sm:mt-6 md:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex flex-col gap-3 sm:gap-4">
        {(project.tech_stack || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {(project.tech_stack || []).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] uppercase tracking-widest text-slate-500 border border-slate-200 px-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        {project.urls?.production && (
          <WebsiteButton href={project.urls.production} />
        )}
      </div>
    </div>
  );
}

const PIPELINE_PROGRESS = [65, 55, 40, 30];

function PipelineCard({ project, index }: { project: Project; index: number }) {
  const progress = PIPELINE_PROGRESS[index - 1] ?? 30;
  const eta = progress >= 60 ? 'Q2 — Q3' : progress >= 40 ? 'Q4' : 'H2 — 2026';

  return (
    <div className="group relative bg-dark text-white p-5 sm:p-6 md:p-10 overflow-hidden cursor-crosshair">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #5eead4 0 1px, transparent 1px 10px)',
        }}
      />

      <div className="relative z-10 flex items-center justify-between mb-6 sm:mb-8 md:mb-12">
        <span className="font-mono text-[10px] text-slate-500 tracking-widest">
          PIPE.{String(index).padStart(2, '0')}
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 border text-accent border-accent/40 bg-accent/[0.08]">
          COMING SOON
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-[2rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] sm:leading-[0.9] mb-3 md:mb-4 group-hover:text-accent transition-colors duration-500">
          {project.name}
        </h3>
        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70 mb-3 sm:mb-4 md:mb-6">
          {project.tagline || project.category}
        </div>
        <p className="text-sm md:text-base font-light leading-relaxed text-slate-400 max-w-md">
          {project.description}
        </p>
      </div>

      <div className="relative z-10 mt-6 sm:mt-8 md:mt-12 pt-5 sm:pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-2 font-mono text-[9px] tracking-widest uppercase text-slate-500">
          <span>Build Progress</span>
          <span className="text-slate-300">{progress}% · ETA {eta}</span>
        </div>
        <div className="relative h-px w-full bg-white/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`font-mono text-[9px] uppercase tracking-widest ${small ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </span>
      <span
        className={`font-mono uppercase tracking-widest break-words ${small ? 'text-[10px]' : 'text-xs'} ${
          accent ? 'text-accent' : small ? 'text-slate-700' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
