import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'hearst-jwt-secret-2026';

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  return verifyToken(token);
}

export function login(username: string, password: string): { success: boolean; token?: string; user?: AuthUser; error?: string } {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = bcrypt.compareSync(password, user.password_hash);
  
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    user: { id: user.id, username: user.username, role: user.role },
  };
}

export function requireAuth(req: NextRequest): { authorized: true; user: AuthUser } | { authorized: false; error: string } {
  const user = getAuthUser(req);
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  return { authorized: true, user };
}
