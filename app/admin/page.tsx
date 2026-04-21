'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

// ─── TYPES ──────────────────────────────────────────────
interface DbProject {
  id: string; name: string; slug: string; status: 'live' | 'coming' | 'future' | 'archived';
  category: string; description: string; published: boolean; created_at: string; tech_stack: string[]; port?: number;
}
interface VercelProject {
  id: string; name: string; framework: string | null; teamId: string;
  url: string; dashboard: string; repo: string | null; repoName: string | null;
  updatedAt: number; createdAt: number;
}
interface GhRepo {
  name: string; full_name: string; url: string; description: string | null;
  language: string | null; pushed_at: string; default_branch: string; visibility: string; topics: string[];
}
interface Deployment {
  id: string; state: string; url: string | null; createdAt: number;
  target: string | null; meta: { githubCommitMessage?: string; githubCommitRef?: string };
}
interface UnifiedProject {
  key: string;
  db: DbProject | null;
  vercel: VercelProject | null;
  github: GhRepo | null;
  name: string;
  hasVercel: boolean;
  hasGithub: boolean;
  hasDb: boolean;
}

const STATUS_BADGE: Record<string, string> = {
  live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  coming: 'bg-amber-50 text-amber-700 border-amber-200',
  future: 'bg-blue-50 text-blue-700 border-blue-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
};
const DEPLOY_STATE: Record<string, { bg: string; text: string; label: string }> = {
  READY: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Live' },
  BUILDING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Building' },
  ERROR: { bg: 'bg-red-50', text: 'text-red-600', label: 'Error' },
  QUEUED: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Queued' },
  CANCELED: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Canceled' },
};
const LANG_COLOR: Record<string, string> = {
  TypeScript: 'bg-blue-500', JavaScript: 'bg-yellow-400', Python: 'bg-green-500',
  Rust: 'bg-orange-500', Go: 'bg-cyan-500',
};

export default function AdminProjects() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>([]);
  const [ghRepos, setGhRepos] = useState<GhRepo[]>([]);

  const [selected, setSelected] = useState<UnifiedProject | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [deploymentsLoading, setDeploymentsLoading] = useState(false);

  const authed = useCallback((t: string) => ({ headers: { Authorization: `Bearer ${t}` } }), []);

  useEffect(() => { if (token) loadAll(); }, [token]);

  const loadAll = async () => {
    setLoading(true); setError('');
    try {
      const [dbRes, vcRes, ghRes] = await Promise.all([
        fetch('/api/projects', authed(token)),
        fetch('/api/vercel/projects'),
        fetch('/api/github/repos'),
      ]);
      const [dbD, vcD, ghD] = await Promise.all([dbRes.json(), vcRes.json(), ghRes.json()]);
      if (dbD.success) setDbProjects(dbD.data);
      if (vcD.success) setVercelProjects(vcD.data);
      if (ghD.success) setGhRepos(ghD.data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  // ── Merge all sources by name ──
  const unified: UnifiedProject[] = (() => {
    const map = new Map<string, UnifiedProject>();
    const norm = (n: string) => n.toLowerCase().replace(/[-_\s]/g, '');

    for (const db of dbProjects) {
      const k = norm(db.name);
      const existing = map.get(k);
      if (existing) { existing.db = db; existing.hasDb = true; }
      else map.set(k, { key: k, db, vercel: null, github: null, name: db.name, hasVercel: false, hasGithub: false, hasDb: true });
    }
    for (const vc of vercelProjects) {
      const k = norm(vc.repoName || vc.name);
      const existing = map.get(k);
      if (existing) { existing.vercel = vc; existing.hasVercel = true; }
      else map.set(k, { key: k, db: null, vercel: vc, github: null, name: vc.name, hasVercel: true, hasGithub: false, hasDb: false });
    }
    for (const gh of ghRepos) {
      const k = norm(gh.name);
      const existing = map.get(k);
      if (existing) { existing.github = gh; existing.hasGithub = true; }
      else map.set(k, { key: k, db: null, vercel: null, github: gh, name: gh.name, hasVercel: false, hasGithub: true, hasDb: false });
    }
    return Array.from(map.values()).sort((a, b) => {
      const tA = a.github?.pushed_at || (a.vercel ? new Date(a.vercel.updatedAt).toISOString() : a.db?.created_at || '');
      const tB = b.github?.pushed_at || (b.vercel ? new Date(b.vercel.updatedAt).toISOString() : b.db?.created_at || '');
      return tB.localeCompare(tA);
    });
  })();

  const q = search.toLowerCase();
  const filtered = unified.filter(u => u.name.toLowerCase().includes(q));

  const selectProject = async (p: UnifiedProject) => {
    setSelected(p);
    setDeployments([]);
    if (p.vercel) {
      setDeploymentsLoading(true);
      try {
        const res = await fetch(`/api/vercel/deployments?projectId=${p.vercel.id}&teamId=${p.vercel.teamId}`);
        const data = await res.json();
        if (data.success) setDeployments(data.data);
      } catch (_) {}
      setDeploymentsLoading(false);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try { await fetch(`/api/projects/${id}/${published ? 'unpublish' : 'publish'}`, { method: 'POST', ...authed(token) }); loadAll(); }
    catch (err: any) { setError(err.message); }
  };
  const deleteProject = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try { await fetch(`/api/projects/${id}`, { method: 'DELETE', ...authed(token) }); setSelected(null); loadAll(); }
    catch (err: any) { setError(err.message); }
  };

  const fmtDate = (d?: string | number) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
  const fmtTime = (ts: number) => new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const ago = (d?: string) => {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m`;
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}j`;
  };

  const stats = {
    total: unified.length,
    deployed: unified.filter(u => u.hasVercel).length,
    withRepo: unified.filter(u => u.hasGithub).length,
    dbOnly: unified.filter(u => u.hasDb && !u.hasVercel && !u.hasGithub).length,
  };

  // ─── DETAIL VIEW ──────────────────────────────────────
  if (selected) {
    const p = selected;
    return (
      <div>
        <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="text-sm text-slate-400 hover:text-teal-600 transition-colors">← Projets</button>
            <div className="h-4 w-px bg-slate-200"></div>
            <h2 className="text-sm font-semibold text-slate-800">{p.name}</h2>
            {p.db && <Badge status={p.db.status} />}
            <SourcePills p={p} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

          {/* ── Infos générales ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Informations" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Info label="Nom" value={p.name} />
              <Info label="Catégorie" value={p.db?.category || p.github?.language || '—'} />
              <Info label="Framework" value={p.vercel?.framework || '—'} />
              <Info label="Visibilité" value={p.github?.visibility || (p.db?.published ? 'Public' : 'Masqué')} />
            </div>
            {(p.db?.description || p.github?.description) && (
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">{p.db?.description || p.github?.description}</p>
            )}
            {p.db?.tech_stack && p.db.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.db.tech_stack.map(t => <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{t}</span>)}
              </div>
            )}
          </div>

          {/* ── Accès & Liens ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Accès" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <LinkRow label="GitHub" url={p.github?.url || p.vercel?.repo || null} fallback="Non connecté" />
              <LinkRow label="Vercel Dashboard" url={p.vercel ? `https://vercel.com/${p.vercel.teamId}/${p.vercel.name}` : null} fallback="Non déployé" />
              <LinkRow label="URL Production" url={p.vercel?.url || null} fallback="Aucune URL" />
              <LinkRow label="Branche par défaut" url={null} text={p.github?.default_branch || '—'} />
            </div>
          </div>

          {/* ── Activité ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Activité" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Info label="Dernier push" value={p.github ? `${ago(p.github.pushed_at)} (${fmtDate(p.github.pushed_at)})` : '—'} />
              <Info label="Dernier deploy" value={p.vercel ? fmtDate(p.vercel.updatedAt) : '—'} />
              <Info label="Créé le" value={fmtDate(p.db?.created_at || p.github?.pushed_at || (p.vercel ? p.vercel.createdAt : undefined))} />
              <Info label="Langue" value={p.github?.language || '—'} />
            </div>
          </div>

          {/* ── Déploiements ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionTitle title="Déploiements" count={deployments.length} />
            {!p.vercel ? (
              <p className="text-sm text-slate-400 mt-4">Ce projet n&apos;est pas connecté à Vercel — aucun déploiement disponible.</p>
            ) : deploymentsLoading ? (
              <p className="text-sm text-slate-400 mt-4">Chargement...</p>
            ) : deployments.length === 0 ? (
              <p className="text-sm text-slate-400 mt-4">Aucun déploiement récent.</p>
            ) : (
              <div className="space-y-2 mt-4">
                {deployments.map(d => {
                  const ds = DEPLOY_STATE[d.state] || DEPLOY_STATE.QUEUED;
                  return (
                    <div key={d.id} className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${ds.bg} ${ds.text} w-16 text-center shrink-0`}>{ds.label}</span>
                      <span className="text-[10px] text-slate-400 w-24 shrink-0">{fmtTime(d.createdAt)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 ${d.target === 'production' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{d.target || 'preview'}</span>
                      <span className="text-[10px] text-slate-500 flex-1 truncate">{d.meta?.githubCommitMessage || '—'}</span>
                      {d.meta?.githubCommitRef && <span className="text-[10px] text-slate-400 font-mono shrink-0">{d.meta.githubCommitRef}</span>}
                      {d.url && <a href={d.url} target="_blank" rel="noopener" className="text-[10px] text-teal-500 hover:text-teal-700 shrink-0">↗</a>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          {p.db && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <SectionTitle title="Actions" />
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => togglePublish(p.db!.id, p.db!.published)}
                  className={`text-xs font-medium px-4 py-2 rounded-xl border transition-colors ${p.db.published ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100'}`}>
                  {p.db.published ? 'Masquer' : 'Publier'}
                </button>
                <button onClick={() => deleteProject(p.db!.id)}
                  className="text-xs font-medium px-4 py-2 rounded-xl border bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ────────────────────────────────────────
  return (
    <div>
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-slate-800">Projets</h1>
          <button onClick={loadAll} disabled={loading} className="text-xs text-slate-400 hover:text-teal-600 transition-colors">{loading ? 'Sync...' : 'Sync'}</button>
        </div>
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
          <div className="flex items-center gap-3 text-[10px] text-slate-400 shrink-0">
            <span>Total <b className="text-slate-600">{stats.total}</b></span>
            <span>Vercel <b className="text-teal-600">{stats.deployed}</b></span>
            <span>GitHub <b className="text-slate-600">{stats.withRepo}</b></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between">
            <span>{error}</span><button onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">Chargement des projets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <button key={p.key} onClick={() => selectProject(p)}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col text-left group">
                <div className="flex items-start justify-between mb-3 w-full">
                  <div className="flex items-center gap-2">
                    {p.db && <Badge status={p.db.status} />}
                    {!p.db && p.github && <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg border bg-slate-50 text-slate-500 border-slate-200">{p.github.visibility}</span>}
                  </div>
                  <SourcePills p={p} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 flex-1">{p.db?.description || p.github?.description || p.vercel?.framework || '—'}</p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {p.github?.language && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${LANG_COLOR[p.github.language] || 'bg-slate-300'}`}></span>
                        {p.github.language}
                      </span>
                    )}
                    {p.vercel?.framework && !p.github?.language && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{p.vercel.framework}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{p.github ? ago(p.github.pushed_at) : p.vercel ? fmtDate(p.vercel.updatedAt) : ''}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl mt-4">Aucun projet trouvé</div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────

function Badge({ status }: { status: string }) {
  const m = STATUS_BADGE;
  return <span className={`inline-flex text-[10px] font-medium capitalize px-2 py-0.5 rounded-lg border ${m[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{status}</span>;
}

function SourcePills({ p }: { p: UnifiedProject }) {
  return (
    <div className="flex items-center gap-1">
      {p.hasDb && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" title="Base de données"></span>}
      {p.hasGithub && <span className="w-1.5 h-1.5 rounded-full bg-slate-700" title="GitHub"></span>}
      {p.hasVercel && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" title="Vercel"></span>}
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">{title}</h3>
      {count != null && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  );
}

function LinkRow({ label, url, fallback, text }: { label: string; url: string | null; fallback?: string; text?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-50">
      <span className="text-xs text-slate-500">{label}</span>
      {url ? (
        <a href={url} target="_blank" rel="noopener" className="text-xs text-teal-600 hover:text-teal-700 font-medium truncate max-w-[250px]">{url.replace('https://', '')} ↗</a>
      ) : (
        <span className="text-xs text-slate-400">{text || fallback || '—'}</span>
      )}
    </div>
  );
}
