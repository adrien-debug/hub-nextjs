'use client';

import { useState, useEffect } from 'react';
import HubLogo from '@/components/HubLogo';

interface Project {
  id: string;
  name: string;
  status: 'live' | 'coming' | 'future' | 'archived';
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

export default function AdminDashboard() {
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'coming' | 'future'>('all');

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
        fetch('/api/projects', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch('/api/projects/statistics', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
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
      if (data.success) {
        await loadData(token);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('TERMINATE NODE? This action is irreversible.')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        await loadData(token);
      }
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] bg-grain flex flex-col justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#5eead4] opacity-[0.015] blur-[150px] rounded-full pointer-events-none"></div>

        <header className="absolute top-12 left-6 md:left-12 lg:left-24 z-10 flex justify-between items-start w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] lg:w-[calc(100%-12rem)]">
          <HubLogo textColor="#ffffff" className="h-12 md:h-16" />
          <div className="text-right font-mono text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">
            <span className="flex items-center justify-end gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              AUTH_REQUIRED
            </span>
            Hearst Infrastructure
          </div>
        </header>

        <div className="relative z-10 max-w-6xl mt-24">
          <div className="flex items-center gap-3 font-mono text-slate-500 text-[10px] md:text-xs tracking-widest uppercase mb-8">
            <span>[ SYS.ADMIN // LOGIN ]</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white leading-[0.9] uppercase mb-16">
            System<br />
            <span className="text-outline-white">Access</span><span className="text-[#5eead4] font-light animate-blink">_</span>
          </h1>

          <div className="max-w-md border-t border-white/10 pt-12 relative">
            <div className="absolute top-0 left-0 w-12 h-px bg-[#5eead4]/80"></div>

            {error && (
              <div className="font-mono text-[10px] text-red-500 uppercase tracking-widest mb-8 border-l border-red-500/50 pl-4 py-2">
                ERR: {error}
              </div>
            )}

            <div className="space-y-12">
              <div>
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Username</div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-2xl text-white focus:outline-none focus:border-[#5eead4] transition-colors"
                />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Password</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && login()}
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-2xl text-white focus:outline-none focus:border-[#5eead4] transition-colors"
                />
              </div>
              <button
                onClick={login}
                disabled={loading}
                className="group relative text-white hover:text-[#5eead4] transition-colors py-4 w-full text-left"
              >
                <span className="font-mono text-sm uppercase tracking-widest">
                  {loading ? 'AUTHENTICATING...' : 'INITIATE CONNECTION'}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grain text-white relative overflow-hidden flex flex-col">
      {/* Ambient Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#5eead4] opacity-[0.015] blur-[150px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="px-6 md:px-12 lg:px-24 py-12 flex justify-between items-start relative z-10">
        <HubLogo textColor="#ffffff" className="h-12 md:h-16" />
        <div className="text-right font-mono text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">
          <span className="flex items-center justify-end gap-2 mb-1">
            <span className="w-2 h-2 bg-[#5eead4] rounded-full cyan-glow animate-pulse"></span>
            SYS.ADMIN // ONLINE
          </span>
          <div className="flex items-center justify-end gap-6 mt-4">
            <button onClick={() => loadData(token)} className="hover:text-[#5eead4] transition-colors">SYNC</button>
            <button onClick={logout} className="hover:text-red-500 transition-colors">TERMINATE</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-12 lg:px-24 py-12 relative z-10 max-w-7xl mx-auto w-full">
        
        <div className="flex items-center gap-4 mb-24 border-b border-white/10 pb-8">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">SYS.ADMIN</span>
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/80">Infrastructure Console</h2>
        </div>

        <div className="mb-24">
          <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter text-white leading-[0.85] uppercase mb-4">
            Control<br />
            <span className="text-outline-white">Center.</span>
          </h1>
          <div className="text-4xl md:text-6xl lg:text-[5rem] font-light tracking-[0.15em] text-white/20 uppercase">
            Node Management
          </div>
        </div>

        {error && (
          <div className="font-mono text-[10px] text-red-500 uppercase tracking-widest mb-12 border-l border-red-500/50 pl-4 py-2">
            ERR: {error}
          </div>
        )}

        {/* Stats Grid - Brutalist */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-32">
            <div className="bg-[#0A0A0A] p-10 lg:p-16 relative group cursor-crosshair">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">Total Nodes</div>
              <div className="text-5xl md:text-7xl font-bold tracking-tighter text-white">{stats.total}</div>
            </div>
            <div className="bg-[#0A0A0A] p-10 lg:p-16 relative group cursor-crosshair">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">Published</div>
              <div className="text-5xl md:text-7xl font-bold tracking-tighter text-white">{stats.published}</div>
            </div>
            <div className="bg-[#0A0A0A] p-10 lg:p-16 relative group cursor-crosshair">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">Live</div>
              <div className="text-5xl md:text-7xl font-bold tracking-tighter text-[#5eead4]">{stats.by_status.live?.total || 0}</div>
            </div>
            <div className="bg-[#0A0A0A] p-10 lg:p-16 relative group cursor-crosshair">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#5eead4] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">Pipeline</div>
              <div className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-600">{stats.by_status.coming?.total || 0}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-8 border-b border-white/10 pb-6 mb-16 font-mono text-[10px] uppercase tracking-widest">
          {['all', 'live', 'coming', 'future'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`transition-colors relative py-2 ${filter === f ? 'text-[#5eead4]' : 'text-slate-500 hover:text-white'}`}
            >
              {f === 'all' ? 'ALL_NODES' : `STAT_${f}`}
              {filter === f && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5eead4]"></div>}
            </button>
          ))}
        </div>

        {/* Projects List - Brutalist Style */}
        <div className="border-t border-white/10">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group border-b border-white/5 py-16 flex flex-col lg:flex-row justify-between gap-12 relative hover:bg-white/[0.02] transition-colors -mx-6 px-6 cursor-crosshair">
              <div className="font-mono text-[9px] text-slate-600 absolute left-6 top-4 tracking-widest">
                ID.{project.id}
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline mt-6 lg:mt-0 lg:w-1/2">
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'live' ? 'bg-[#5eead4] cyan-glow animate-pulse' : 'bg-slate-600'}`}></span>
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${project.status === 'live' ? 'text-[#5eead4]' : 'text-slate-500'}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="lg:w-1/4 flex flex-col justify-end">
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map(t => (
                    <span key={t} className="text-[9px] font-mono text-slate-500 border border-white/10 px-2 py-1 uppercase tracking-widest bg-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/4 flex flex-col justify-between items-start lg:items-end text-left lg:text-right mt-8 lg:mt-0">
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-8">
                  PORT: <span className="text-white">{project.port || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => togglePublish(project.id, project.published)} 
                    className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${project.published ? 'text-[#5eead4] hover:text-white' : 'text-slate-600 hover:text-[#5eead4]'}`}
                  >
                    {project.published ? '[ PUBLIC ]' : '[ HIDDEN ]'}
                  </button>
                  <button 
                    onClick={() => deleteProject(project.id)} 
                    className="font-mono text-[10px] text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    TERMINATE
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="py-32 text-center font-mono text-[10px] text-slate-600 uppercase tracking-widest">
              NO_DATA_FOUND
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
