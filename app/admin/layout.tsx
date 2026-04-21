'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from './auth-context';

const NAV = [
  { href: '/admin', label: 'Projets', icon: '▦' },
  { href: '/admin/incubation', label: 'Incubation', icon: '◉' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => { const saved = localStorage.getItem('admin_token'); if (saved) { setToken(saved); setIsLoggedIn(true); } }, []);

  const login = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (data.success) { setToken(data.data.token); setIsLoggedIn(true); localStorage.setItem('admin_token', data.data.token); }
      else setError(data.error || 'Login failed');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const logout = () => { setIsLoggedIn(false); setToken(''); localStorage.removeItem('admin_token'); };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span className="text-sm font-semibold text-slate-800 tracking-tight">Hub Admin</span>
          </div>
          {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Identifiant</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" placeholder="admin" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" placeholder="••••••••" />
            </div>
            <button onClick={login} disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl px-4 py-3 transition-colors shadow-sm shadow-teal-500/20 mt-2">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, logout }}>
      <div className="min-h-screen bg-slate-50 flex">
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen">
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span className="text-sm font-semibold text-slate-800 tracking-tight">Hub Admin</span>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map(n => {
              const active = n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                  <span className="text-base">{n.icon}</span>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 py-4 border-t border-slate-100">
            <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              Déconnexion
            </button>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </AuthContext.Provider>
  );
}
