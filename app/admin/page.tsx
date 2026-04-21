'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── TYPES ──────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  slug: string;
  status: 'live' | 'coming' | 'future' | 'archived';
  category: string;
  description: string;
  published: boolean;
  created_at: string;
  tech_stack: string[];
  port?: number;
}

interface ProjectStats {
  total: number;
  published: number;
  by_status: Record<string, { total: number; published: number }>;
}

interface Startup {
  id: string;
  name: string;
  slug: string;
  founders: string[];
  category?: string;
  problem?: string;
  solution?: string;
  market_size?: string;
  current_phase_id?: number;
  current_phase_name?: string;
  overall_score?: number;
  cohort?: string;
  status: string;
  repo_url?: string;
  pitch_deck_url?: string;
  created_at: string;
}

interface Phase {
  id: number;
  slug: string;
  name: string;
  description: string;
  typical_duration_days: number;
  validation_criteria: string[];
  deliverables: string[];
  kpis: string[];
}

interface StartupPhase {
  id: string;
  startup_id: string;
  phase_id: number;
  status: string;
  started_at?: string;
  completed_at?: string;
  actual_deliverables?: string[];
  kpi_values?: Record<string, any>;
  notes?: string;
  blockers?: string;
  phase_name?: string;
  phase_slug?: string;
}

interface IncubationStats {
  total: number;
  active: number;
  graduated: number;
  phase_distribution: any[];
  status_breakdown: any[];
}

// ─── DESIGN TOKENS ──────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  live: 'border-accent-border text-accent bg-accent-subtle',
  coming: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  future: 'border-blue-400/30 text-blue-400 bg-blue-400/5',
  archived: 'border-slate-500/30 text-slate-400 bg-slate-500/5',
};

const STARTUP_STATUS_BADGE: Record<string, string> = {
  applicant: 'border-slate-500/30 text-slate-400 bg-slate-500/5',
  screening: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  accepted: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  active: 'border-accent-border text-accent bg-accent-subtle',
  graduated: 'border-violet-400/30 text-violet-400 bg-violet-400/5',
  alumni: 'border-blue-400/30 text-blue-400 bg-blue-400/5',
  rejected: 'border-red-500/30 text-red-400 bg-red-500/5',
};

const PHASE_STATUS: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  pending: { dot: 'bg-slate-700', text: 'text-slate-500', bg: 'bg-dark-card', border: 'border-dark-border' },
  in_progress: { dot: 'bg-accent animate-pulse cyan-glow', text: 'text-accent', bg: 'bg-accent-subtle', border: 'border-accent-border' },
  completed: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
  blocked: { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/30' },
  skipped: { dot: 'bg-slate-600', text: 'text-slate-600', bg: 'bg-dark-card', border: 'border-dark-border' },
};

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tab
  const [tab, setTab] = useState<'projects' | 'incubation'>('projects');

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [projectFilter, setProjectFilter] = useState<'all' | 'live' | 'coming' | 'future' | 'archived'>('all');

  // Incubation
  const [startups, setStartups] = useState<Startup[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [incubationStats, setIncubationStats] = useState<IncubationStats | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [startupPhases, setStartupPhases] = useState<StartupPhase[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [startupFilter, setStartupFilter] = useState<string>('all');

  // ─── AUTH ─────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) loadAll(token);
  }, [isLoggedIn, token]);

  const authed = useCallback((t: string) => ({ headers: { Authorization: `Bearer ${t}` } }), []);

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.data.token);
        setIsLoggedIn(true);
        localStorage.setItem('admin_token', data.data.token);
      } else setError(data.error || 'Login failed');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken('');
    setSelectedStartup(null);
    localStorage.removeItem('admin_token');
  };

  // ─── DATA LOADING ─────────────────────────────────────
  const loadAll = async (t: string) => {
    setLoading(true);
    try {
      const [pRes, psRes, sRes, phRes, isRes] = await Promise.all([
        fetch('/api/projects', authed(t)),
        fetch('/api/projects/statistics', authed(t)),
        fetch('/api/incubation/startups', authed(t)),
        fetch('/api/incubation/phases'),
        fetch('/api/incubation/statistics'),
      ]);
      const [pD, psD, sD, phD, isD] = await Promise.all([pRes.json(), psRes.json(), sRes.json(), phRes.json(), isRes.json()]);
      if (pD.success) setProjects(pD.data);
      if (psD.success) setProjectStats(psD.data);
      if (sD.success) setStartups(sD.data);
      if (phD.success) setPhases(phD.data);
      if (isD.success) setIncubationStats(isD.data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const loadStartupDetail = async (startup: Startup) => {
    setSelectedStartup(startup);
    try {
      const res = await fetch(`/api/incubation/startups/${startup.id}/phases`, authed(token));
      const data = await res.json();
      if (data.success) setStartupPhases(data.data);
    } catch (err: any) { setError(err.message); }
  };

  // ─── PROJECT ACTIONS ──────────────────────────────────
  const togglePublish = async (id: string, published: boolean) => {
    const ep = published ? 'unpublish' : 'publish';
    try {
      const res = await fetch(`/api/projects/${id}/${ep}`, { method: 'POST', ...authed(token) });
      const d = await res.json();
      if (d.success) loadAll(token);
    } catch (err: any) { setError(err.message); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Supprimer ce projet ? Irréversible.')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', ...authed(token) });
      const d = await res.json();
      if (d.success) loadAll(token);
    } catch (err: any) { setError(err.message); }
  };

  // ─── PHASE ACTIONS ────────────────────────────────────
  const updatePhase = async (startupId: string, phaseId: number, data: any) => {
    try {
      await fetch(`/api/incubation/startups/${startupId}/phases/${phaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      await loadStartupDetail(selectedStartup!);
    } catch (err: any) { setError(err.message); }
  };

  // ─── HELPERS ──────────────────────────────────────────
  const filteredProjects = projects.filter(p => projectFilter === 'all' || p.status === projectFilter);
  const filteredStartups = startups.filter(s => startupFilter === 'all' || s.status === startupFilter);

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

  const completedPhases = startupPhases.filter(sp => sp.status === 'completed').length;
  const totalPhases = startupPhases.length || 28;
  const progressPct = Math.round((completedPhases / totalPhases) * 100);

  // ─── LOGIN ────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dark bg-grain flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
          
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse cyan-glow"></div>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Hub Admin</span>
          </div>

          <h1 className="text-2xl font-semibold text-center tracking-tight mb-2">Authentification</h1>
          <p className="text-xs text-slate-500 text-center mb-8 font-mono">Accès restreint — infrastructure Hearst</p>

          {error && (
            <div className="mb-6 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2.5 font-mono">
              ERR: {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-accent-foreground text-sm font-semibold rounded-lg px-4 py-3 transition-all hover:cyan-glow mt-4"
            >
              {loading ? 'Connexion en cours...' : 'Accéder au système'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STARTUP DETAIL VIEW ──────────────────────────────
  if (selectedStartup) {
    return (
      <div className="min-h-screen bg-dark bg-grain text-white">
        <header className="border-b border-dark-border px-6 py-4 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedStartup(null)} className="font-mono text-xs text-slate-400 hover:text-accent transition-colors flex items-center gap-2">
              <span className="text-lg leading-none">←</span> Retour
            </button>
            <div className="h-4 w-px bg-dark-border"></div>
            <h2 className="text-lg font-medium tracking-tight">{selectedStartup.name}</h2>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded border ${STARTUP_STATUS_BADGE[selectedStartup.status] || 'border-dark-border text-slate-400 bg-dark-card'}`}>
              {selectedStartup.status}
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-slate-400 bg-dark-card border border-dark-border px-3 py-1.5 rounded-full">
            <span>Phase <span className="text-white">{selectedStartup.current_phase_id || 1}</span>/28</span>
            <span className="text-dark-border">|</span>
            <span className="text-accent">{selectedStartup.current_phase_name || '—'}</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          {/* Info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-white/10 transition-colors">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div> Fondateurs
              </div>
              <div className="text-sm text-slate-200 font-medium">{selectedStartup.founders?.join(', ') || '—'}</div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-white/10 transition-colors">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div> Catégorie
              </div>
              <div className="text-sm text-slate-200 font-medium">{selectedStartup.category || '—'}</div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-white/10 transition-colors">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div> Cohorte
              </div>
              <div className="text-sm text-slate-200 font-medium">{selectedStartup.cohort || '—'}</div>
            </div>
            <div className="bg-accent-subtle border border-accent-border rounded-xl p-5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/10 rounded-full blur-xl"></div>
              <div className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full cyan-glow"></div> Score Global
              </div>
              <div className="text-2xl text-accent font-semibold">{selectedStartup.overall_score ?? '—'}</div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-12 bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Progression du Pipeline</h3>
                <p className="text-xs font-mono text-slate-500">{completedPhases} phases validées sur {totalPhases}</p>
              </div>
              <div className="text-xl font-mono text-accent">{progressPct}%</div>
            </div>
            <div className="h-2 bg-dark rounded-full overflow-hidden border border-dark-border">
              <div className="h-full bg-accent rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPct}%` }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Problem / Solution */}
          {(selectedStartup.problem || selectedStartup.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Problème
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedStartup.problem || '—'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Solution
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedStartup.solution || '—'}</p>
              </div>
            </div>
          )}

          {/* 28 Phases timeline */}
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-sm font-medium text-white">Tracker 28 Phases</h3>
            <div className="h-px flex-1 bg-dark-border"></div>
          </div>

          <div className="relative pl-4 md:pl-8">
            {/* Timeline vertical line */}
            <div className="absolute left-[15px] md:left-[31px] top-4 bottom-4 w-px bg-dark-border"></div>

            <div className="space-y-4">
              {startupPhases.map((sp) => {
                const phaseInfo = phases.find(p => p.id === sp.phase_id);
                const pStatus = PHASE_STATUS[sp.status] || PHASE_STATUS.pending;
                const isExpanded = expandedPhase === sp.phase_id;

                return (
                  <div key={sp.phase_id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[21px] md:-left-[21px] top-5 w-3 h-3 rounded-full border-2 border-dark ${pStatus.dot} z-10`}></div>

                    <div className={`border rounded-xl transition-all duration-200 overflow-hidden ${pStatus.bg} ${pStatus.border} ${isExpanded ? 'shadow-lg' : 'hover:border-white/20'}`}>
                      <button
                        onClick={() => setExpandedPhase(isExpanded ? null : sp.phase_id)}
                        className="w-full flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-3 md:w-1/4 shrink-0">
                          <span className="font-mono text-xs text-slate-500 bg-dark border border-dark-border px-2 py-0.5 rounded">P{sp.phase_id.toString().padStart(2, '0')}</span>
                          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${pStatus.border} ${pStatus.text}`}>
                            {sp.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <span className="text-sm font-medium text-white flex-1">{sp.phase_name}</span>
                        
                        <div className="flex items-center gap-4 shrink-0">
                          {sp.started_at && <span className="text-[10px] text-slate-500 font-mono hidden md:inline">Début: {fmtDate(sp.started_at)}</span>}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-dark border ${pStatus.border} text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            ▾
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-dark-border/50">
                          {/* Phase info */}
                          {phaseInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs mb-6 bg-dark/50 rounded-lg p-4 border border-dark-border">
                              <div>
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Objectif</div>
                                <p className="text-slate-300 leading-relaxed">{phaseInfo.description}</p>
                              </div>
                              <div>
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Validation</div>
                                <ul className="text-slate-300 space-y-1.5">
                                  {phaseInfo.validation_criteria.map((c, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-accent">▹</span> {c}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Livrables</div>
                                <ul className="text-slate-300 space-y-1.5">
                                  {phaseInfo.deliverables.map((d, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-accent">▹</span> {d}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Notes */}
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Notes & Appréciations</label>
                              <textarea
                                defaultValue={sp.notes || ''}
                                onBlur={(e) => {
                                  if (e.target.value !== (sp.notes || ''))
                                    updatePhase(selectedStartup.id, sp.phase_id, { notes: e.target.value });
                                }}
                                rows={3}
                                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 resize-none transition-all"
                                placeholder="Observations sur l'exécution..."
                              />
                            </div>

                            {/* Blockers */}
                            <div>
                              <label className="block text-[10px] font-mono text-red-400/70 uppercase tracking-widest mb-2">Points de blocage</label>
                              <textarea
                                defaultValue={sp.blockers || ''}
                                onBlur={(e) => {
                                  if (e.target.value !== (sp.blockers || ''))
                                    updatePhase(selectedStartup.id, sp.phase_id, { blockers: e.target.value });
                                }}
                                rows={3}
                                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 resize-none transition-all"
                                placeholder="Obstacles identifiés..."
                              />
                            </div>
                          </div>

                          {/* Footer: Dates & Actions */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-dark-border/50">
                            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-500 bg-dark px-3 py-1.5 rounded-md border border-dark-border">
                              {sp.started_at && <span>Début: <span className="text-slate-300">{fmtDate(sp.started_at)}</span></span>}
                              {sp.completed_at && <span>Fin: <span className="text-slate-300">{fmtDate(sp.completed_at)}</span></span>}
                              {phaseInfo && <span>Durée typique: <span className="text-slate-300">{phaseInfo.typical_duration_days}j</span></span>}
                            </div>

                            <div className="flex gap-2">
                              {sp.status === 'pending' && (
                                <button
                                  onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'in_progress' })}
                                  className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 bg-accent-subtle text-accent border border-accent-border rounded-lg hover:bg-accent/20 transition-all hover:cyan-glow"
                                >
                                  Démarrer la phase
                                </button>
                              )}
                              {sp.status === 'in_progress' && (
                                <>
                                  <button
                                    onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'completed' })}
                                    className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all"
                                  >
                                    Valider
                                  </button>
                                  <button
                                    onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'blocked' })}
                                    className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                                  >
                                    Signaler Bloqué
                                  </button>
                                </>
                              )}
                              {sp.status === 'blocked' && (
                                <button
                                  onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'in_progress' })}
                                  className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 bg-accent-subtle text-accent border border-accent-border rounded-lg hover:bg-accent/20 transition-all hover:cyan-glow"
                                >
                                  Débloquer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ───────────────────────────────────
  return (
    <div className="min-h-screen bg-dark bg-grain text-white pb-20">
      {/* Top bar */}
      <header className="border-b border-dark-border px-6 py-4 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse cyan-glow"></div>
          <span className="text-sm font-medium tracking-tight">Hub Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => loadAll(token)} disabled={loading} className="font-mono text-[10px] text-slate-400 hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
            <svg className={`w-3 h-3 ${loading ? 'animate-spin text-accent' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Sync...' : 'Sync'}
          </button>
          <div className="w-px h-4 bg-dark-border"></div>
          <button onClick={logout} className="font-mono text-[10px] text-slate-400 hover:text-red-400 transition-colors uppercase tracking-widest">
            Déconnexion
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-dark-border px-6 bg-dark-card/50">
        <div className="flex gap-6 max-w-7xl mx-auto">
          <button
            onClick={() => setTab('projects')}
            className={`py-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
              tab === 'projects' ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Projets 
            {projectStats && <span className={`px-1.5 py-0.5 rounded text-[9px] ${tab === 'projects' ? 'bg-accent/10' : 'bg-dark border border-dark-border'}`}>{projectStats.total}</span>}
          </button>
          <button
            onClick={() => setTab('incubation')}
            className={`py-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
              tab === 'incubation' ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Incubation 
            {incubationStats && <span className={`px-1.5 py-0.5 rounded text-[9px] ${tab === 'incubation' ? 'bg-accent/10' : 'bg-dark border border-dark-border'}`}>{incubationStats.total}</span>}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-8 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 font-mono flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> ERR: {error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-300">×</button>
          </div>
        )}

        {/* ─── PROJECTS TAB ──────────────────────────── */}
        {tab === 'projects' && (
          <div className="animate-in fade-in duration-300">
            {projectStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard label="Total Projets" value={projectStats.total} />
                <StatCard label="Publiés" value={projectStats.published} type="accent" />
                <StatCard label="Live" value={projectStats.by_status.live?.total || 0} type="cyan" />
                <StatCard label="Pipeline" value={(projectStats.by_status.coming?.total || 0) + (projectStats.by_status.future?.total || 0)} />
              </div>
            )}

            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-lg font-medium tracking-tight">Répertoire Projets</h2>
              <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1">
                {(['all', 'live', 'coming', 'future', 'archived'] as const).map(f => (
                  <button key={f} onClick={() => setProjectFilter(f)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-colors ${
                      projectFilter === f ? 'bg-dark border border-dark-border text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {f === 'all' ? 'Tous' : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(p => (
                <div key={p.id} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-accent-border transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${STATUS_BADGE[p.status] || 'border-dark-border text-slate-400 bg-dark'}`}>
                      {p.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePublish(p.id, p.published)}
                        className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded transition-colors ${
                          p.published ? 'text-accent bg-accent-subtle border border-accent-border' : 'text-slate-500 bg-dark border border-dark-border hover:text-white'
                        }`}>
                        {p.published ? 'Public' : 'Masqué'}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-medium text-white mb-1 group-hover:text-accent transition-colors">{p.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 flex-1">{p.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-dark-border flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech_stack.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] font-mono text-slate-500 bg-dark border border-dark-border px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                      {p.tech_stack.length > 3 && <span className="text-[9px] text-slate-600 bg-dark px-1.5 py-0.5 rounded">+{p.tech_stack.length - 3}</span>}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {p.port && <span className="text-[10px] font-mono text-slate-500 bg-dark px-1.5 py-0.5 rounded border border-dark-border">:{p.port}</span>}
                      <button onClick={() => deleteProject(p.id)} className="text-slate-600 hover:text-red-400 transition-colors" title="Supprimer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="py-20 text-center border border-dashed border-dark-border rounded-xl bg-dark-card/30">
                <div className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">Aucun projet trouvé</div>
                <p className="text-sm text-slate-600">Modifiez vos filtres pour voir plus de résultats.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── INCUBATION TAB ────────────────────────── */}
        {tab === 'incubation' && (
          <div className="animate-in fade-in duration-300">
            {incubationStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard label="Total Startups" value={incubationStats.total} />
                <StatCard label="Actives" value={incubationStats.active} type="accent" />
                <StatCard label="Graduées" value={incubationStats.graduated} type="violet" />
                <StatCard label="Phases Config" value={phases.length} />
              </div>
            )}

            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-lg font-medium tracking-tight">Portefeuille Incubation</h2>
              <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1 flex-wrap">
                {['all', 'applicant', 'screening', 'accepted', 'active', 'graduated', 'alumni', 'rejected'].map(f => (
                  <button key={f} onClick={() => setStartupFilter(f)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-colors ${
                      startupFilter === f ? 'bg-dark border border-dark-border text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {f === 'all' ? 'Toutes' : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStartups.map(s => (
                <div key={s.id} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-accent-border transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${STARTUP_STATUS_BADGE[s.status] || 'border-dark-border text-slate-400 bg-dark'}`}>
                      {s.status}
                    </span>
                    {s.overall_score != null && (
                      <div className="text-[10px] font-mono text-accent bg-accent-subtle border border-accent-border px-2 py-1 rounded flex items-center gap-1">
                        <span className="w-1 h-1 bg-accent rounded-full cyan-glow"></span>
                        {s.overall_score}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-base font-medium text-white mb-1 group-hover:text-accent transition-colors">{s.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-1">{s.founders?.join(', ') || 'Fondateurs inconnus'}</p>
                  
                  <div className="mt-auto pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Phase {s.current_phase_id || 1}/28</div>
                      <div className="text-[10px] font-mono text-accent truncate max-w-[120px]">{s.current_phase_name || '—'}</div>
                    </div>
                    
                    <button onClick={() => loadStartupDetail(s)}
                      className="w-full py-2.5 bg-dark border border-dark-border rounded-lg text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-accent hover:border-accent-border hover:bg-accent-subtle transition-all flex items-center justify-center gap-2">
                      Ouvrir le dossier <span className="text-lg leading-none">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredStartups.length === 0 && (
              <div className="py-20 text-center border border-dashed border-dark-border rounded-xl bg-dark-card/30">
                <div className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">Aucune startup trouvée</div>
                <p className="text-sm text-slate-600">Créez une startup via l'API ou modifiez vos filtres.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, type }: { label: string; value: number; type?: 'accent' | 'cyan' | 'violet' | 'default' }) {
  const isAccent = type === 'accent' || type === 'cyan';
  const isViolet = type === 'violet';
  
  const textColor = isAccent ? 'text-accent' : isViolet ? 'text-violet-400' : 'text-white';
  const borderColor = isAccent ? 'border-accent-border' : isViolet ? 'border-violet-500/30' : 'border-dark-border';
  const bgColor = isAccent ? 'bg-accent-subtle' : isViolet ? 'bg-violet-500/5' : 'bg-dark-card';
  const dotColor = isAccent ? 'bg-accent cyan-glow' : isViolet ? 'bg-violet-400' : 'bg-slate-500';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-5 relative overflow-hidden group hover:border-white/20 transition-colors`}>
      {isAccent && <div className="absolute -right-6 -top-6 w-20 h-20 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>}
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div> {label}
      </div>
      <div className={`text-3xl font-semibold tracking-tight ${textColor}`}>{value}</div>
    </div>
  );
}
