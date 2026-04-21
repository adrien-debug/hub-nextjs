'use client';

import { createContext, useContext } from 'react';

interface AuthCtx { token: string; logout: () => void; }

export const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthContext');
  return ctx;
}
