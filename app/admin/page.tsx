'use client';

import { useState, useEffect } from 'react';

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

interface Stats {
  total: number;
  published: number;
  by_status: Record<string, { total: number; published: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  live: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  coming: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  future: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  archived: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const STATUS_DOT: Record<string, string> = {
  live: 'bg-emerald-400',
  coming: 'bg-amber-400',
  future: 'bg-blue-400',
  archived: 'bg-slate-500',
};

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'coming' | 'future' | 'archived'>('all');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      loadData(savedToken);
    }
  }, []);

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
        await loadData(data.data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (authToken: string) => {
    setLoading(true);
    try {
      const [projectsRes, statsRes] = await Promise.all([
        fetch('/api/projects', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/projects/statistics', { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);
      const projectsData = await projectsRes.json();
      const statsData = await statsRes.json();
      if (projectsData.success) setProjects(projectsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'unpublish' : 'publish';
      const res = await fetch(`/api/projects/${id}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) await loadData(token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Supprimer ce projet ? Cette action est irréversible.')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) await loadData(token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken('');
    localStorage.removeItem('admin_token');
  };

  const filteredProjects = projects.filter(p => filter === 'all' || p.status === filter);

  // ─── LOGIN ────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-lg font-semibold text-white">Hub Admin</h1>
            <p className="text-sm text-slate-500 mt-1">Connexion requise</p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-2.5 transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#111]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span className="text-sm font-semibold">Hub Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => loadData(token)}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Sync...' : 'Sync'}
          </button>
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-300">×</button>
          </div>
        )}

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Publiés" value={stats.published} accent />
            <StatCard label="Live" value={stats.by_status.live?.total || 0} color="emerald" />
            <StatCard label="Pipeline" value={(stats.by_status.coming?.total || 0) + (stats.by_status.future?.total || 0)} color="amber" />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
          {(['all', 'live', 'coming', 'future', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors capitalize ${
                filter === f
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f === 'all' ? 'Tous' : f}
              {f !== 'all' && stats?.by_status[f] && (
                <span className="ml-1.5 text-[10px] text-slate-600">{stats.by_status[f].total}</span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Projet</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 hidden lg:table-cell">Port</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 hidden lg:table-cell">Stack</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{project.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[250px]">{project.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`}></span>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">{project.category}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono hidden lg:table-cell">{project.port || '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="text-[10px] text-slate-600">+{project.tech_stack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(project.id, project.published)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          project.published
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-slate-500 hover:bg-white/5'
                        }`}
                        title={project.published ? 'Dépublier' : 'Publier'}
                      >
                        {project.published ? 'Public' : 'Masqué'}
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-xs text-slate-600 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                      >
                        Suppr.
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-600">
              Aucun projet trouvé
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-slate-600 text-right">
          {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent, color }: { label: string; value: number; accent?: boolean; color?: string }) {
  const valueColor = color
    ? color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
    : accent ? 'text-white' : 'text-slate-300';

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${valueColor}`}>{value}</div>
    </div>
  );
}
