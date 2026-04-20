import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'projects.db');
const DB_DIR = path.dirname(DB_PATH);

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('live', 'coming', 'future', 'archived')),
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      port INTEGER,
      urls TEXT,
      logo TEXT,
      screenshots TEXT,
      location TEXT NOT NULL,
      features TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      published INTEGER NOT NULL DEFAULT 1,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('logo', 'screenshot', 'banner')),
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      url TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
    CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
  `);

  const tableCheck = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='users'").get() as any;
  
  if (!tableCheck || tableCheck.count === 0) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    const bcrypt = require('bcryptjs');
    const { nanoid } = require('nanoid');
    const hash = bcrypt.hashSync('admin123', 10);
    
    db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
      nanoid(),
      'admin',
      hash,
      'admin'
    );
  }
}

initDB();
