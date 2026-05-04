import React from 'react';
import { ProjectService } from '@/lib/projects';

export default function Metrics() {
  const liveAll = ProjectService.list({ published: true, status: 'live' });
  const live = liveAll.filter((p) => p.slug !== 'hearst-ai');
  const coming = ProjectService.list({ published: true, status: 'coming' });
  const future = ProjectService.list({ published: true, status: 'future' });
  const pipeline = coming.length + future.length;
  const portfolio = live.length + pipeline;

  const items = [
    { value: String(live.length).padStart(2, '0'), label: 'Live Ventures', hint: 'DEPLOYED' },
    { value: String(pipeline).padStart(2, '0'), label: 'In Pipeline', hint: 'INCOMING' },
    { value: String(portfolio).padStart(2, '0'), label: 'Total Portfolio', hint: 'VENTURES' },
  ];

  return (
    <section className="bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24">
        <div className="grid grid-cols-3 divide-x divide-slate-200 md:divide-y-0">
          {items.map((m) => (
            <div
              key={m.label}
              className="group relative md:aspect-[4/5] lg:aspect-square flex flex-col justify-between gap-6 sm:gap-10 md:gap-0 py-8 sm:py-10 md:py-10 lg:py-14 px-4 sm:px-6 md:px-6 lg:px-10 cursor-default overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>

              <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-full"></span>
                <span>{m.hint}</span>
              </div>

              <div className="min-w-0">
                <div className="font-black tracking-tighter text-slate-900 leading-none tabular-nums truncate text-[clamp(2.75rem,18vw,4.5rem)] md:text-[clamp(4rem,12vw,9rem)] lg:text-[clamp(5rem,11vw,11rem)]">
                  {m.value}
                </div>
                <div className="mt-2 sm:mt-3 md:mt-6 font-mono text-[10px] sm:text-xs md:text-sm text-slate-500 uppercase tracking-tight sm:tracking-widest leading-tight">
                  {m.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
