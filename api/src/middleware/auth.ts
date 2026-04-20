import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const API_KEY = process.env.API_KEY;

// Interface pour le user dans la requête
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
  };
}

// Vérifier le JWT
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'No authorization header',
    });
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Récupérer l'utilisateur depuis la DB
    const user = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(decoded.userId) as any;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    logger.warn('JWT verification failed:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
}

// Vérifier l'API key (pour accès externe sans JWT)
export function authenticateAPIKey(req: Request, res: Response, next: NextFunction) {
  if (!API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'API key not configured',
    });
  }
  
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
    });
  }
  
  next();
}

// Vérifier les permissions (role-based)
export function authorize(...allowedRoles: Array<'admin' | 'editor' | 'viewer'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }
    
    next();
  };
}

// Middleware optionnel : JWT OU API key
export function authenticateFlexible(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];
  
  // Essayer JWT d'abord
  if (authHeader) {
    return authenticateJWT(req, res, next);
  }
  
  // Sinon essayer API key
  if (apiKey && API_KEY && apiKey === API_KEY) {
    // Mode API key : pas de user dans req, mais autorisé
    return next();
  }
  
  return res.status(401).json({
    success: false,
    error: 'Authentication required (JWT or API key)',
  });
}
