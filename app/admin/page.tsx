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
const ACCENT = '#5eead4';
const BG = '#0A0A0A';

const STATUS_BADGE: Record<string, string> = {
  live: `border-[${ACCENT}]/40 text-[${ACCENT}]`,
  coming: 'border-amber-500/40 text-amber-400',
  future: 'border-blue-400/40 text-blue-400',
  archived: 'border-slate-500/40 text-slate-500',
};

const STARTUP_STATUS_BADGE: Record<string, string> = {
  applicant: 'border-slate-500/40 text-slate-400',
  screening: 'border-amber-500/40 text-amber-400',
  accepted: 'border-emerald-500/40 text-emerald-400',
  active: `border-[${ACCENT}]/40 text-[${ACCENT}]`,
  graduated: 'border-violet-400/40 text-violet-400',
  alumni: 'border-blue-400/40 text-blue-400',
  rejected: 'border-red-500/40 text-red-400',
};

const PHASE_STATUS: Record<string, { dot: string; text: string }> = {
  pending: { dot: 'bg-slate-600', text: 'text-slate-600' },
  in_progress: { dot: `bg-[${ACCENT}] animate-pulse`, text: `text-[${ACCENT}]` },
  completed: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  blocked: { dot: 'bg-red-500', text: 'text-red-400' },
  skipped: { dot: 'bg-slate-700', text: 'text-slate-700' },
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
      <div className="min-h-screen bg-[#0A0A0A] bg-grain flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Hub Admin</span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Connexion</h1>
          <p className="text-sm text-slate-500 mb-8">Accès restreint — infrastructure Hearst</p>

          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 font-mono">
              ERR: {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5eead4]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5eead4]/50 transition-colors"
              />
            </div>
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-[#5eead4] hover:bg-[#5eead4]/90 disabled:opacity-50 text-[#0A0A0A] text-sm font-semibold rounded px-4 py-2.5 transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STARTUP DETAIL VIEW ──────────────────────────────
  if (selectedStartup) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] bg-grain text-white">
        <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedStartup(null)} className="font-mono text-xs text-slate-500 hover:text-[#5eead4] transition-colors">
              ← Retour
            </button>
            <span className="text-white/20">|</span>
            <span className="text-sm font-semibold">{selectedStartup.name}</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${STARTUP_STATUS_BADGE[selectedStartup.status] || 'border-white/20 text-white/50'}`}>
              {selectedStartup.status}
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
            <span>Phase {selectedStartup.current_phase_id || 1}/28</span>
            <span className="text-[#5eead4]">{selectedStartup.current_phase_name || '—'}</span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* Info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white/[0.03] border border-white/10 rounded p-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Fondateurs</div>
              <div className="text-sm text-white">{selectedStartup.founders?.join(', ') || '—'}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded p-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Catégorie</div>
              <div className="text-sm text-white">{selectedStartup.category || '—'}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded p-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Cohorte</div>
              <div className="text-sm text-white">{selectedStartup.cohort || '—'}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded p-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Score</div>
              <div className="text-sm text-[#5eead4] font-semibold">{selectedStartup.overall_score ?? '—'}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-mono">Progression pipeline</span>
              <span className="text-xs text-[#5eead4] font-mono">{completedPhases}/{totalPhases} — {progressPct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#5eead4] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>

          {/* Problem / Solution */}
          {(selectedStartup.problem || selectedStartup.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <div className="bg-white/[0.03] border border-white/10 rounded p-4">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Problème</div>
                <p className="text-sm text-slate-300">{selectedStartup.problem || '—'}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded p-4">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Solution</div>
                <p className="text-sm text-slate-300">{selectedStartup.solution || '—'}</p>
              </div>
            </div>
          )}

          {/* 28 Phases timeline */}
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
            Pipeline — 28 Phases
          </h3>

          <div className="space-y-1">
            {startupPhases.map((sp) => {
              const phaseInfo = phases.find(p => p.id === sp.phase_id);
              const pStatus = PHASE_STATUS[sp.status] || PHASE_STATUS.pending;
              const isExpanded = expandedPhase === sp.phase_id;

              return (
                <div key={sp.phase_id} className="border border-white/5 rounded hover:border-white/10 transition-colors">
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : sp.phase_id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="font-mono text-[10px] text-slate-600 w-6">{sp.phase_id}</span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${pStatus.dot}`}></span>
                    <span className="text-sm text-white flex-1">{sp.phase_name}</span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${pStatus.text}`}>{sp.status.replace('_', ' ')}</span>
                    {sp.started_at && <span className="text-[10px] text-slate-600 font-mono hidden md:inline">{fmtDate(sp.started_at)}</span>}
                    <span className="text-slate-600 text-xs">{isExpanded ? '▾' : '▸'}</span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-4">
                      {/* Phase info */}
                      {phaseInfo && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="text-[10px] font-mono text-slate-600 uppercase mb-1">Description</div>
                            <p className="text-slate-400">{phaseInfo.description}</p>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-slate-600 uppercase mb-1">Critères de validation</div>
                            <ul className="text-slate-400 space-y-0.5">
                              {phaseInfo.validation_criteria.map((c, i) => <li key={i}>• {c}</li>)}
                            </ul>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-slate-600 uppercase mb-1">Livrables requis</div>
                            <ul className="text-slate-400 space-y-0.5">
                              {phaseInfo.deliverables.map((d, i) => <li key={i}>• {d}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <label className="block text-[10px] font-mono text-slate-600 uppercase mb-1">Notes / Appréciations</label>
                        <textarea
                          defaultValue={sp.notes || ''}
                          onBlur={(e) => {
                            if (e.target.value !== (sp.notes || ''))
                              updatePhase(selectedStartup.id, sp.phase_id, { notes: e.target.value });
                          }}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5eead4]/40 resize-none"
                          placeholder="Ajouter des notes, appréciations..."
                        />
                      </div>

                      {/* Blockers */}
                      <div>
                        <label className="block text-[10px] font-mono text-slate-600 uppercase mb-1">Blockers</label>
                        <textarea
                          defaultValue={sp.blockers || ''}
                          onBlur={(e) => {
                            if (e.target.value !== (sp.blockers || ''))
                              updatePhase(selectedStartup.id, sp.phase_id, { blockers: e.target.value });
                          }}
                          rows={1}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/40 resize-none"
                          placeholder="Blockers éventuels..."
                        />
                      </div>

                      {/* Dates */}
                      <div className="flex gap-6 text-[10px] font-mono text-slate-600">
                        {sp.started_at && <span>Début: {fmtDate(sp.started_at)}</span>}
                        {sp.completed_at && <span>Fin: {fmtDate(sp.completed_at)}</span>}
                        {phaseInfo && <span>Durée typique: {phaseInfo.typical_duration_days}j</span>}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {sp.status === 'pending' && (
                          <button
                            onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'in_progress' })}
                            className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 bg-[#5eead4]/10 text-[#5eead4] border border-[#5eead4]/20 rounded hover:bg-[#5eead4]/20 transition-colors"
                          >
                            Démarrer
                          </button>
                        )}
                        {sp.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'completed' })}
                              className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition-colors"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'blocked' })}
                              className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                            >
                              Bloquer
                            </button>
                          </>
                        )}
                        {sp.status === 'blocked' && (
                          <button
                            onClick={() => updatePhase(selectedStartup.id, sp.phase_id, { status: 'in_progress' })}
                            className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 bg-[#5eead4]/10 text-[#5eead4] border border-[#5eead4]/20 rounded hover:bg-[#5eead4]/20 transition-colors"
                          >
                            Débloquer
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grain text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">Hub Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => loadAll(token)} disabled={loading} className="font-mono text-[10px] text-slate-500 hover:text-[#5eead4] transition-colors uppercase tracking-widest">
            {loading ? 'Sync...' : 'Sync'}
          </button>
          <button onClick={logout} className="font-mono text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest">
            Déconnexion
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="flex gap-0">
          <button
            onClick={() => setTab('projects')}
            className={`px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
              tab === 'projects' ? 'border-[#5eead4] text-[#5eead4]' : 'border-transparent text-slate-500 hover:text-white'
            }`}
          >
            Projets {projectStats && <span className="ml-1 text-slate-600">{projectStats.total}</span>}
          </button>
          <button
            onClick={() => setTab('incubation')}
            className={`px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
              tab === 'incubation' ? 'border-[#5eead4] text-[#5eead4]' : 'border-transparent text-slate-500 hover:text-white'
            }`}
          >
            Incubation {incubationStats && <span className="ml-1 text-slate-600">{incubationStats.total}</span>}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 font-mono flex items-center justify-between">
            <span>ERR: {error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-300 ml-2">×</button>
          </div>
        )}

        {/* ─── PROJECTS TAB ──────────────────────────── */}
        {tab === 'projects' && (
          <>
            {projectStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <StatCard label="Total" value={projectStats.total} />
                <StatCard label="Publiés" value={projectStats.published} accent />
                <StatCard label="Live" value={projectStats.by_status.live?.total || 0} color="cyan" />
                <StatCard label="Pipeline" value={(projectStats.by_status.coming?.total || 0) + (projectStats.by_status.future?.total || 0)} />
              </div>
            )}

            <div className="flex items-center gap-1 mb-6 bg-white/5 rounded p-1 w-fit">
              {(['all', 'live', 'coming', 'future', 'archived'] as const).map(f => (
                <button key={f} onClick={() => setProjectFilter(f)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded transition-colors ${
                    projectFilter === f ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-300'
                  }`}>
                  {f === 'all' ? 'Tous' : f}
                </button>
              ))}
            </div>

            <div className="border border-white/10 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Projet</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Statut</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:table-cell">Catégorie</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:table-cell">Port</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:table-cell">Stack</th>
                    <th className="text-right px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-600 mt-0.5 truncate max-w-[250px]">{p.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${STATUS_BADGE[p.status] || 'border-white/20 text-white/50'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">{p.category}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono hidden lg:table-cell">{p.port || '—'}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.tech_stack.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] font-mono text-slate-600 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                          {p.tech_stack.length > 3 && <span className="text-[9px] text-slate-700">+{p.tech_stack.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => togglePublish(p.id, p.published)}
                            className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded transition-colors ${
                              p.published ? 'text-[#5eead4] hover:bg-[#5eead4]/10' : 'text-slate-600 hover:bg-white/5'
                            }`}>
                            {p.published ? 'Public' : 'Masqué'}
                          </button>
                          <button onClick={() => deleteProject(p.id)}
                            className="text-[10px] font-mono text-slate-700 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors uppercase tracking-widest">
                            Suppr
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-600 font-mono">Aucun projet</div>
              )}
            </div>
          </>
        )}

        {/* ─── INCUBATION TAB ────────────────────────── */}
        {tab === 'incubation' && (
          <>
            {incubationStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <StatCard label="Total startups" value={incubationStats.total} />
                <StatCard label="Actives" value={incubationStats.active} accent />
                <StatCard label="Graduées" value={incubationStats.graduated} color="violet" />
                <StatCard label="Phases" value={phases.length} />
              </div>
            )}

            <div className="flex items-center gap-1 mb-6 bg-white/5 rounded p-1 w-fit flex-wrap">
              {['all', 'applicant', 'screening', 'accepted', 'active', 'graduated', 'alumni', 'rejected'].map(f => (
                <button key={f} onClick={() => setStartupFilter(f)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded transition-colors ${
                    startupFilter === f ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-300'
                  }`}>
                  {f === 'all' ? 'Toutes' : f}
                </button>
              ))}
            </div>

            <div className="border border-white/10 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Startup</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Statut</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:table-cell">Phase courante</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:table-cell">Cohorte</th>
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:table-cell">Score</th>
                    <th className="text-right px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStartups.map(s => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{s.name}</div>
                        <div className="text-[10px] text-slate-600 mt-0.5">{s.founders?.join(', ')}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${STARTUP_STATUS_BADGE[s.status] || 'border-white/20 text-white/50'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">
                        <span className="text-[#5eead4]">{s.current_phase_id || '—'}</span>
                        <span className="text-slate-600 ml-1">/ 28</span>
                        {s.current_phase_name && <span className="block text-[10px] text-slate-600">{s.current_phase_name}</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono hidden lg:table-cell">{s.cohort || '—'}</td>
                      <td className="px-4 py-3 text-xs font-mono hidden lg:table-cell">
                        {s.overall_score != null ? <span className="text-[#5eead4]">{s.overall_score}</span> : <span className="text-slate-700">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => loadStartupDetail(s)}
                          className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-[#5eead4] px-2 py-1 rounded hover:bg-[#5eead4]/10 transition-colors">
                          Ouvrir →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStartups.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-600 font-mono">
                  Aucune startup — créer une startup via POST /api/incubation/startups
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, accent, color }: { label: string; value: number; accent?: boolean; color?: string }) {
  const c = color === 'cyan' ? 'text-[#5eead4]'
    : color === 'violet' ? 'text-violet-400'
    : accent ? 'text-[#5eead4]' : 'text-slate-300';

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded p-4">
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${c}`}>{value}</div>
    </div>
  );
}
