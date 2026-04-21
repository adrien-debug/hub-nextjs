'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth-context';

interface Startup {
  id: string; name: string; slug: string; founders: string[]; category?: string; problem?: string; solution?: string;
  market_size?: string; current_phase_id?: number; current_phase_name?: string; overall_score?: number; cohort?: string;
  status: string; repo_url?: string; pitch_deck_url?: string; created_at: string;
}
interface Phase { id: number; slug: string; name: string; description: string; typical_duration_days: number; validation_criteria: string[]; deliverables: string[]; kpis: string[]; }
interface StartupPhase { id: string; startup_id: string; phase_id: number; status: string; started_at?: string; completed_at?: string; actual_deliverables?: string[]; kpi_values?: Record<string, any>; notes?: string; blockers?: string; phase_name?: string; phase_slug?: string; }
interface IncubationStats { total: number; active: number; graduated: number; phase_distribution: any[]; status_breakdown: any[]; }

const STARTUP_STATUS_BADGE: Record<string, string> = {
  applicant: 'bg-slate-100 text-slate-600 border-slate-200',
  screening: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-teal-50 text-teal-700 border-teal-200',
  graduated: 'bg-violet-50 text-violet-700 border-violet-200',
  alumni: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
};
const PHASE_DOT: Record<string, string> = {
  pending: 'bg-slate-300', in_progress: 'bg-teal-500 animate-pulse', completed: 'bg-emerald-500', blocked: 'bg-red-500', skipped: 'bg-slate-300',
};
const PHASE_TEXT: Record<string, string> = {
  pending: 'text-slate-400', in_progress: 'text-teal-600', completed: 'text-emerald-600', blocked: 'text-red-600', skipped: 'text-slate-400',
};

export default function IncubationPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [stats, setStats] = useState<IncubationStats | null>(null);
  const [selected, setSelected] = useState<Startup | null>(null);
  const [startupPhases, setStartupPhases] = useState<StartupPhase[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const authed = useCallback((t: string) => ({ headers: { Authorization: `Bearer ${t}` } }), []);
  useEffect(() => { if (token) loadAll(); }, [token]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [sRes, phRes, isRes] = await Promise.all([fetch('/api/incubation/startups', authed(token)), fetch('/api/incubation/phases'), fetch('/api/incubation/statistics')]);
      const [sD, phD, isD] = await Promise.all([sRes.json(), phRes.json(), isRes.json()]);
      if (sD.success) setStartups(sD.data); if (phD.success) setPhases(phD.data); if (isD.success) setStats(isD.data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const loadDetail = async (s: Startup) => {
    setSelected(s);
    try { const res = await fetch(`/api/incubation/startups/${s.id}/phases`, authed(token)); const data = await res.json(); if (data.success) setStartupPhases(data.data); }
    catch (err: any) { setError(err.message); }
  };

  const updatePhase = async (startupId: string, phaseId: number, data: any) => {
    try { await fetch(`/api/incubation/startups/${startupId}/phases/${phaseId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }); await loadDetail(selected!); }
    catch (err: any) { setError(err.message); }
  };

  const q = search.toLowerCase();
  const filtered = startups.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter;
    const matchSearch = s.name.toLowerCase().includes(q) || s.founders?.some(f => f.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
  const completedPhases = startupPhases.filter(sp => sp.status === 'completed').length;
  const totalPhases = startupPhases.length || 28;
  const progressPct = Math.round((completedPhases / totalPhases) * 100);

  // ─── DETAIL ───────────────────────────────────────────
  if (selected) {
    return (
      <div>
        <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="text-sm text-slate-400 hover:text-teal-600 transition-colors">← Startups</button>
            <div className="h-4 w-px bg-slate-200"></div>
            <h2 className="text-sm font-semibold text-slate-800">{selected.name}</h2>
            <Badge status={selected.status} />
          </div>
          <span className="text-xs text-slate-500">Phase <b className="text-teal-600">{selected.current_phase_id || 1}</b> / 28</span>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          {/* ── Infos générales ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Informations" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Info label="Fondateurs" value={selected.founders?.join(', ') || '—'} />
              <Info label="Catégorie" value={selected.category || '—'} />
              <Info label="Cohorte" value={selected.cohort || '—'} />
              <Info label="Score" value={String(selected.overall_score ?? '—')} accent />
            </div>
          </div>

          {/* ── Progression ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Progression" />
            <div className="flex items-end justify-between mb-3 mt-4">
              <p className="text-xs text-slate-400">{completedPhases} / {totalPhases} phases complétées</p>
              <span className="text-lg font-semibold text-teal-600">{progressPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>

          {/* ── Problème / Solution ── */}
          {(selected.problem || selected.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selected.problem && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <SectionTitle title="Problème" />
                  <p className="text-sm text-slate-600 leading-relaxed mt-4">{selected.problem}</p>
                </div>
              )}
              {selected.solution && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <SectionTitle title="Solution" />
                  <p className="text-sm text-slate-600 leading-relaxed mt-4">{selected.solution}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Pipeline ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Pipeline — 28 phases" />
            <div className="space-y-2 mt-4">
              {startupPhases.map((sp) => {
                const phaseInfo = phases.find(p => p.id === sp.phase_id);
                const isExpanded = expandedPhase === sp.phase_id;
                return (
                  <div key={sp.phase_id} className={`bg-white border rounded-xl transition-all shadow-sm ${isExpanded ? 'border-teal-200 shadow-teal-100/40' : 'border-slate-200 hover:border-slate-300'}`}>
                    <button onClick={() => setExpandedPhase(isExpanded ? null : sp.phase_id)} className="w-full flex items-center gap-3 px-5 py-3.5 text-left">
                      <span className="text-xs text-slate-400 font-mono w-6">{sp.phase_id}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${PHASE_DOT[sp.status] || PHASE_DOT.pending}`}></span>
                      <span className="text-sm text-slate-700 flex-1 font-medium">{sp.phase_name}</span>
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${PHASE_TEXT[sp.status] || PHASE_TEXT.pending}`}>{sp.status.replace('_', ' ')}</span>
                      {sp.started_at && <span className="text-[10px] text-slate-400 hidden md:inline">{fmtDate(sp.started_at)}</span>}
                      <span className={`text-slate-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                        {phaseInfo && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4 text-xs">
                            <div><p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Objectif</p><p className="text-slate-600">{phaseInfo.description}</p></div>
                            <div><p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Validation</p><ul className="text-slate-600 space-y-1">{phaseInfo.validation_criteria.map((c, i) => <li key={i}>• {c}</li>)}</ul></div>
                            <div><p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Livrables</p><ul className="text-slate-600 space-y-1">{phaseInfo.deliverables.map((d, i) => <li key={i}>• {d}</li>)}</ul></div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">Notes</label>
                            <textarea defaultValue={sp.notes || ''} onBlur={(e) => { if (e.target.value !== (sp.notes || '')) updatePhase(selected.id, sp.phase_id, { notes: e.target.value }); }} rows={3}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="Observations..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-red-400 uppercase tracking-wider mb-1.5">Blockers</label>
                            <textarea defaultValue={sp.blockers || ''} onBlur={(e) => { if (e.target.value !== (sp.blockers || '')) updatePhase(selected.id, sp.phase_id, { blockers: e.target.value }); }} rows={3}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-300 resize-none" placeholder="Obstacles..." />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
                            {sp.started_at && <span>Début : {fmtDate(sp.started_at)}</span>}
                            {sp.completed_at && <span>Fin : {fmtDate(sp.completed_at)}</span>}
                            {phaseInfo && <span>~{phaseInfo.typical_duration_days}j</span>}
                          </div>
                          <div className="flex gap-2">
                            {sp.status === 'pending' && <Btn label="Démarrer" onClick={() => updatePhase(selected.id, sp.phase_id, { status: 'in_progress' })} color="teal" />}
                            {sp.status === 'in_progress' && <><Btn label="Valider" onClick={() => updatePhase(selected.id, sp.phase_id, { status: 'completed' })} color="emerald" /><Btn label="Bloquer" onClick={() => updatePhase(selected.id, sp.phase_id, { status: 'blocked' })} color="red" /></>}
                            {sp.status === 'blocked' && <Btn label="Débloquer" onClick={() => updatePhase(selected.id, sp.phase_id, { status: 'in_progress' })} color="teal" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST ─────────────────────────────────────────────
  return (
    <div>
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-slate-800">Incubation</h1>
          <button onClick={loadAll} disabled={loading} className="text-xs text-slate-400 hover:text-teal-600 transition-colors">{loading ? 'Sync...' : 'Sync'}</button>
        </div>
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Rechercher une startup..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
          {stats && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 shrink-0">
              <span>Total <b className="text-slate-600">{stats.total}</b></span>
              <span>Actives <b className="text-teal-600">{stats.active}</b></span>
              <span>Graduées <b className="text-violet-600">{stats.graduated}</b></span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between">
            <span>{error}</span><button onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {['all', 'applicant', 'screening', 'accepted', 'active', 'graduated', 'alumni', 'rejected'].map(o => (
              <button key={o} onClick={() => setFilter(o)}
                className={`px-3 py-1.5 text-[10px] font-medium rounded-lg capitalize transition-colors ${filter === o ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {o === 'all' ? 'Toutes' : o}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">Chargement des startups...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <button key={s.id} onClick={() => loadDetail(s)}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col text-left group">
                <div className="flex items-start justify-between mb-3 w-full">
                  <Badge status={s.status} />
                  {s.overall_score != null && <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-lg">{s.overall_score}</span>}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">{s.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 flex-1">{s.founders?.join(', ')}</p>
                <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Phase {s.current_phase_id || 1}/28</span>
                  <span className="text-[10px] text-teal-600 font-medium truncate max-w-[140px]">{s.current_phase_name || '—'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl mt-4">Aucune startup trouvée</div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────

function Badge({ status }: { status: string }) {
  return <span className={`inline-flex text-[10px] font-medium capitalize px-2 py-0.5 rounded-lg border ${STARTUP_STATUS_BADGE[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{status}</span>;
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">{title}</h3>
      {count != null && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}

function Info({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm ${accent ? 'text-teal-700 font-semibold' : 'text-slate-700'}`}>{value}</p>
    </div>
  );
}

function Btn({ label, onClick, color }: { label: string; onClick: () => void; color: 'teal' | 'emerald' | 'red' }) {
  const styles = { teal: 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100', red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' };
  return <button onClick={onClick} className={`text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${styles[color]}`}>{label}</button>;
}
