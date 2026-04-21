'use client';

import { useState, useEffect } from 'react';

interface Repo {
  name: string; full_name: string; url: string; description: string | null;
  language: string | null; pushed_at: string; created_at: string;
  default_branch: string; visibility: string; topics: string[];
}

interface VercelProject {
  id: string; name: string; framework: string | null; teamId: string;
  url: string; dashboard: string; repo: string | null; repoName: string | null;
  updatedAt: number; createdAt: number;
}

interface Deployment {
  id: string; state: string; url: string | null; createdAt: number;
  target: string | null; meta: { githubCommitMessage?: string; githubCommitRef?: string };
}

const DEPLOY_STATE: Record<string, { bg: string; text: string; label: string }> = {
  READY: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Live' },
  BUILDING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Building' },
  ERROR: { bg: 'bg-red-50', text: 'text-red-600', label: 'Error' },
  QUEUED: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Queued' },
  CANCELED: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Canceled' },
};

const LANG_COLOR: Record<string, string> = {
  TypeScript: 'bg-blue-500', JavaScript: 'bg-yellow-400', Python: 'bg-green-500',
  Rust: 'bg-orange-500', Go: 'bg-cyan-500', HTML: 'bg-red-400', CSS: 'bg-purple-400',
};

export default function DeploymentsPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [deployments, setDeployments] = useState<Record<string, Deployment[]>>({});
  const [deploymentsLoading, setDeploymentsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const [ghRes, vcRes] = await Promise.all([fetch('/api/github/repos'), fetch('/api/vercel/projects')]);
      const [ghData, vcData] = await Promise.all([ghRes.json(), vcRes.json()]);
      if (ghData.success) setRepos(ghData.data);
      if (vcData.success) setVercelProjects(vcData.data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const loadDeployments = async (projectId: string, teamId: string) => {
    if (deployments[projectId]) return;
    setDeploymentsLoading(p => ({ ...p, [projectId]: true }));
    try {
      const res = await fetch(`/api/vercel/deployments?projectId=${projectId}&teamId=${teamId}`);
      const data = await res.json();
      if (data.success) setDeployments(p => ({ ...p, [projectId]: data.data }));
    } catch (_) {}
    setDeploymentsLoading(p => ({ ...p, [projectId]: false }));
  };

  const toggleExpand = (vp: VercelProject) => {
    const key = vp.id;
    if (expandedProject === key) { setExpandedProject(null); return; }
    setExpandedProject(key);
    loadDeployments(key, vp.teamId);
  };

  const fmtDate = (d: string | number) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
  const fmtTime = (ts: number) => new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const ago = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m`;
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}j`;
  };

  const matched = new Set<string>();
  const unified = vercelProjects.map(vp => {
    const matchedRepo = repos.find(r => r.name.toLowerCase() === (vp.repoName || vp.name).toLowerCase() || r.name.toLowerCase() === vp.name.toLowerCase());
    if (matchedRepo) matched.add(matchedRepo.name);
    return { vercel: vp, repo: matchedRepo || null };
  });
  const unmatchedRepos = repos.filter(r => !matched.has(r.name));

  const q = search.toLowerCase();
  const filteredUnified = unified.filter(u => u.vercel.name.toLowerCase().includes(q) || u.repo?.name.toLowerCase().includes(q));
  const filteredUnmatched = unmatchedRepos.filter(r => r.name.toLowerCase().includes(q));

  return (
    <div>
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-slate-800">Deployments</h1>
          <button onClick={loadData} disabled={loading} className="text-xs text-slate-400 hover:text-teal-600 transition-colors">{loading ? 'Chargement...' : 'Rafraîchir'}</button>
        </div>
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Rechercher un projet..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Vercel {vercelProjects.length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-slate-700 rounded-full"></span>GitHub {repos.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">Chargement des données GitHub & Vercel...</div>
        ) : (
          <>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Projets Vercel ({filteredUnified.length})</p>
            <div className="space-y-3 mb-10">
              {filteredUnified.map(({ vercel: vp, repo }) => {
                const isExpanded = expandedProject === vp.id;
                const deps = deployments[vp.id] || [];
                const latestDep = deps[0];
                const stateInfo = latestDep ? (DEPLOY_STATE[latestDep.state] || DEPLOY_STATE.QUEUED) : null;

                return (
                  <div key={vp.id} className={`bg-white border rounded-2xl shadow-sm transition-all ${isExpanded ? 'border-teal-200 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                    <button onClick={() => toggleExpand(vp)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800 truncate">{vp.name}</span>
                          {vp.framework && <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{vp.framework}</span>}
                          {stateInfo && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${stateInfo.bg} ${stateInfo.text}`}>{stateInfo.label}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          {repo && <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${LANG_COLOR[repo.language || ''] || 'bg-slate-300'}`}></span>{repo.language}</span>}
                          {repo && <span>{ago(repo.pushed_at)} ago</span>}
                          {vp.repoName && <span className="text-slate-300">→ {vp.repoName}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {repo && <a href={repo.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-[10px] text-slate-400 hover:text-slate-700 px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white transition-colors">GitHub</a>}
                        <a href={vp.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-[10px] text-teal-500 hover:text-teal-700 px-2 py-1 border border-teal-200 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors">Vercel</a>
                        <span className={`text-slate-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                        {deploymentsLoading[vp.id] ? (
                          <p className="text-xs text-slate-400 py-4">Chargement des déploiements...</p>
                        ) : deps.length === 0 ? (
                          <p className="text-xs text-slate-400 py-4">Aucun déploiement récent</p>
                        ) : (
                          <div className="space-y-2 pt-3">
                            {deps.map(d => {
                              const ds = DEPLOY_STATE[d.state] || DEPLOY_STATE.QUEUED;
                              return (
                                <div key={d.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${ds.bg} ${ds.text} w-16 text-center`}>{ds.label}</span>
                                  <span className="text-[10px] text-slate-400 w-20 shrink-0">{fmtTime(d.createdAt)}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${d.target === 'production' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{d.target || 'preview'}</span>
                                  <span className="text-[10px] text-slate-500 flex-1 truncate">{d.meta?.githubCommitMessage || '—'}</span>
                                  {d.meta?.githubCommitRef && <span className="text-[10px] text-slate-400 font-mono">{d.meta.githubCommitRef}</span>}
                                  {d.url && <a href={d.url} target="_blank" rel="noopener" className="text-[10px] text-teal-500 hover:text-teal-700">↗</a>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredUnmatched.length > 0 && (
              <>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Repos GitHub uniquement ({filteredUnmatched.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredUnmatched.map(r => (
                    <a key={r.name} href={r.url} target="_blank" rel="noopener"
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all block">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${LANG_COLOR[r.language || ''] || 'bg-slate-300'}`}></span>
                        <span className="text-sm font-medium text-slate-800 truncate">{r.name}</span>
                        <span className="text-[10px] text-slate-400 ml-auto">{ago(r.pushed_at)}</span>
                      </div>
                      {r.description && <p className="text-xs text-slate-400 line-clamp-2">{r.description}</p>}
                      <div className="flex items-center gap-2 mt-3">
                        {r.language && <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{r.language}</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded-md ${r.visibility === 'public' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{r.visibility}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
