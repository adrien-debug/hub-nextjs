import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { db } from '../db/database';
import { validateData, userLoginSchema, userCreateSchema } from '../utils/validators';
import { authenticateJWT, authorize } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/login - Se connecter
router.post('/login', (req, res, next) => {
  try {
    const { username, password } = validateData(userLoginSchema, req.body);
    
    // Trouver l'utilisateur
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    
    // Vérifier le mot de passe
    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    
    // Générer le JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Mettre à jour last_login
    db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
    
    logger.info(`User logged in: ${username}`);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Obtenir l'utilisateur connecté
router.get('/me', authenticateJWT, (req: any, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register - Créer un utilisateur (admin uniquement)
router.post('/register', authenticateJWT, authorize('admin'), (req, res, next) => {
  try {
    const data = validateData(userCreateSchema, req.body);
    
    // Hasher le mot de passe
    const password_hash = bcrypt.hashSync(data.password, 10);
    
    // Créer l'utilisateur
    const id = nanoid();
    
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.username, data.email, password_hash, data.role);
    
    logger.info(`User created: ${data.username} (${data.role})`);
    
    const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(id);
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/users - Lister les utilisateurs (admin uniquement)
router.get('/users', authenticateJWT, authorize('admin'), (req, res, next) => {
  try {
    const users = db.prepare('SELECT id, username, email, role, created_at, last_login FROM users ORDER BY created_at DESC').all();
    
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/auth/users/:id - Supprimer un utilisateur (admin uniquement)
router.delete('/users/:id', authenticateJWT, authorize('admin'), (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    logger.info(`User deleted: ${req.params.id}`);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
