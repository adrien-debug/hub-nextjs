"use client";

import React, { useState, useEffect } from "react";

const PHASES = [
  {
    id: "validation",
    title: "Validation",
    description: "Market fit & thesis verification",
    status: "completed",
    steps: ["Application", "Screening", "Deep Dive Review", "Thesis Approval"],
  },
  {
    id: "prototyping",
    title: "Prototyping",
    description: "Core architecture & MVP build",
    status: "active",
    steps: ["System Design", "Core Engineering", "Alpha Release", "User Testing"],
  },
  {
    id: "assembly",
    title: "Assembly",
    description: "Team formation & legal structuring",
    status: "locked",
    steps: ["Co-founder Matching", "Entity Incorporation", "Cap Table Setup", "IP Transfer"],
  },
  {
    id: "acceleration",
    title: "Acceleration",
    description: "Go-to-market & rapid scaling",
    status: "locked",
    steps: ["Beta Launch", "Growth Hacking", "Metrics Tracking", "Revenue Generation"],
  },
  {
    id: "graduation",
    title: "Graduation",
    description: "Seed funding & spin-off",
    status: "locked",
    steps: ["Pitch Deck Polish", "Investor Roadshow", "Term Sheet", "Spin-off"],
  },
];

export default function IncubationPipeline() {
  const [activePhase, setActivePhase] = useState("prototyping");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="pipeline" className="relative py-32 px-6 md:px-12 lg:px-24 bg-dark border-t border-white/5 overflow-hidden bg-grain">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/muted rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <div className="w-full mb-24 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">SYS.03</span>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">The Pipeline</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-accent to-blue-500 uppercase">
              Incubation Core
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-white/50 text-[10px] tracking-widest uppercase">
              System Status: <span className="text-accent animate-pulse">Online</span>
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-5xl flex flex-col items-center">
        {/* Central Energy Core Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-dark-border">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-accent via-accent/50 to-transparent shadow-[0_0_15px_rgba(94,234,212,0.8)]" />
        </div>

        {PHASES.map((phase, index) => {
          const isCompleted = phase.status === "completed";
          const isActive = phase.status === "active";
          const isLocked = phase.status === "locked";
          const isEven = index % 2 === 0;

          return (
            <div
              key={phase.id}
              className={`relative w-full flex items-center justify-between mb-24 last:mb-0 ${
                isEven ? "flex-row" : "flex-row-reverse"
              }`}
              onMouseEnter={() => !isLocked && setActivePhase(phase.id)}
            >
              {/* Content Side */}
              <div className={`w-[45%] flex flex-col ${isEven ? "items-end text-right" : "items-start text-left"}`}>
                <div
                  className={`relative p-6 rounded-xl border backdrop-blur-md transition-all duration-500 group cursor-pointer ${
                    isActive
                      ? "bg-accent/subtle border-accent/50 shadow-[0_0_30px_rgba(94,234,212,0.15)]"
                      : isCompleted
                      ? "bg-dark-card border-accent/20 hover:border-accent/40"
                      : "bg-dark-card/50 border-dark-border opacity-50 grayscale"
                  }`}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="text-xs font-bold tracking-widest text-accent mb-2 uppercase">
                    Phase 0{index + 1} {"//"} {phase.status}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">{phase.title}</h3>
                  <p className="text-white/60 text-sm mb-6">{phase.description}</p>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {phase.steps.map((step, stepIdx) => (
                      <div
                        key={stepIdx}
                        className={`text-xs p-2 rounded border flex items-center gap-2 ${
                          isActive
                            ? "bg-dark border-accent/20 text-white/80"
                            : isCompleted
                            ? "bg-dark border-white/10 text-white/60"
                            : "bg-transparent border-white/5 text-white/40"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCompleted ? "bg-accent" : isActive && stepIdx <= 1 ? "bg-accent animate-pulse" : "bg-white/20"
                          }`}
                        />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Central Node */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-500 ${
                    isActive
                      ? "border-accent bg-dark shadow-[0_0_20px_rgba(94,234,212,0.5)]"
                      : isCompleted
                      ? "border-accent/50 bg-accent/10"
                      : "border-dark-border bg-dark"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      isActive
                        ? "bg-accent shadow-[0_0_10px_rgba(94,234,212,1)]"
                        : isCompleted
                        ? "bg-accent/50"
                        : "bg-white/10"
                    }`}
                  />
                  {/* Orbital rings for active state */}
                  {isActive && (
                    <>
                      <div className="absolute inset-[-10px] border border-accent/30 rounded-full animate-[spin_4s_linear_infinite]" />
                      <div className="absolute inset-[-20px] border border-accent/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                    </>
                  )}
                </div>
              </div>

              {/* Empty Side for layout balance */}
              <div className="w-[45%]" />
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
