import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

const DB_PATH = process.env.DATABASE_PATH || './data/projects.db';
const DB_DIR = path.dirname(DB_PATH);

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  logger.info(`Created database directory: ${DB_DIR}`);
}

// Initialiser la base de données
export const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? logger.debug.bind(logger) : undefined,
});

// Activer les foreign keys
db.pragma('foreign_keys = ON');

// Optimisations SQLite
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000'); // 64MB

logger.info(`Database initialized at: ${DB_PATH}`);

// Initialiser le schéma
export function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Exécuter le schéma
    db.exec(schema);
    
    logger.info('Database schema initialized successfully');
    
    // Créer un utilisateur admin par défaut si aucun utilisateur n'existe
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    
    if (userCount.count === 0) {
      const bcrypt = require('bcryptjs');
      const { nanoid } = require('nanoid');
      
      const adminPassword = bcrypt.hashSync('admin123', 10);
      
      db.prepare(`
        INSERT INTO users (id, username, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        nanoid(),
        'admin',
        'admin@hearst.app',
        adminPassword,
        'admin'
      );
      
      logger.info('Default admin user created (username: admin, password: admin123)');
    }

    // Seed phases
    const phaseCount = db.prepare('SELECT COUNT(*) as count FROM phases').get() as { count: number };
    if (phaseCount.count === 0) {
      const { seedPhases } = require('./seed-phases');
      seedPhases();
    }
    
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

// Fonction pour fermer la base de données proprement
export function closeDatabase() {
  try {
    db.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database:', error);
  }
}

// Gérer la fermeture propre
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});
