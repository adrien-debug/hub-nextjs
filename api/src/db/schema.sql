-- Schema de base de données SQLite pour la gestion des projets Hearst

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('live', 'coming', 'future', 'archived')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT NOT NULL, -- JSON array
  port INTEGER,
  urls TEXT, -- JSON object
  logo TEXT,
  screenshots TEXT, -- JSON array
  location TEXT NOT NULL,
  features TEXT, -- JSON array
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  published INTEGER NOT NULL DEFAULT 1, -- 0 = false, 1 = true
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);

-- Table des médias
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('logo', 'screenshot', 'banner')),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index pour les médias
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'viewer')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login TEXT
);

-- Index pour les utilisateurs
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('project', 'media', 'user')),
  entity_id TEXT NOT NULL,
  details TEXT, -- JSON
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour les logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Table de configuration
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Vue pour les projets avec compte de médias
CREATE VIEW IF NOT EXISTS projects_with_media AS
SELECT 
  p.*,
  COUNT(DISTINCT CASE WHEN m.type = 'logo' THEN m.id END) as logo_count,
  COUNT(DISTINCT CASE WHEN m.type = 'screenshot' THEN m.id END) as screenshot_count,
  COUNT(DISTINCT CASE WHEN m.type = 'banner' THEN m.id END) as banner_count,
  COUNT(DISTINCT m.id) as total_media_count
FROM projects p
LEFT JOIN media m ON p.id = m.project_id
GROUP BY p.id;

-- Triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
AFTER UPDATE ON projects
BEGIN
  UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_config_timestamp 
AFTER UPDATE ON config
BEGIN
  UPDATE config SET updated_at = datetime('now') WHERE key = NEW.key;
END;
