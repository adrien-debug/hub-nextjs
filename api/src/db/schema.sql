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

-- ============= INCUBATION SYSTEM =============

-- Table des phases (28 phases du pipeline)
CREATE TABLE IF NOT EXISTS phases (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  typical_duration_days INTEGER NOT NULL,
  validation_criteria TEXT NOT NULL, -- JSON array
  deliverables TEXT NOT NULL, -- JSON array
  kpis TEXT NOT NULL, -- JSON array
  order_index INTEGER NOT NULL
);

-- Index phases
CREATE INDEX IF NOT EXISTS idx_phases_slug ON phases(slug);
CREATE INDEX IF NOT EXISTS idx_phases_order ON phases(order_index);

-- Table des startups
CREATE TABLE IF NOT EXISTS startups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  founders TEXT NOT NULL, -- JSON array
  pitch_deck_url TEXT,
  one_pager_url TEXT,
  product_url TEXT,
  repo_url TEXT,
  category TEXT,
  problem TEXT,
  solution TEXT,
  market_size TEXT,
  current_phase_id INTEGER,
  overall_score REAL,
  mentor_ids TEXT, -- JSON array
  cohort TEXT,
  status TEXT NOT NULL CHECK(status IN ('applicant', 'screening', 'accepted', 'active', 'graduated', 'alumni', 'rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (current_phase_id) REFERENCES phases(id)
);

-- Index startups
CREATE INDEX IF NOT EXISTS idx_startups_slug ON startups(slug);
CREATE INDEX IF NOT EXISTS idx_startups_status ON startups(status);
CREATE INDEX IF NOT EXISTS idx_startups_cohort ON startups(cohort);
CREATE INDEX IF NOT EXISTS idx_startups_current_phase ON startups(current_phase_id);

-- Table de progression des phases par startup
CREATE TABLE IF NOT EXISTS startup_phases (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL,
  phase_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed', 'blocked', 'skipped')),
  started_at TEXT,
  completed_at TEXT,
  estimated_completion TEXT,
  actual_deliverables TEXT, -- JSON array
  kpi_values TEXT, -- JSON object
  notes TEXT,
  blockers TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE,
  FOREIGN KEY (phase_id) REFERENCES phases(id),
  UNIQUE(startup_id, phase_id)
);

-- Index startup_phases
CREATE INDEX IF NOT EXISTS idx_startup_phases_startup ON startup_phases(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_phases_phase ON startup_phases(phase_id);
CREATE INDEX IF NOT EXISTS idx_startup_phases_status ON startup_phases(status);

-- Table des KPIs (tracking granulaire)
CREATE TABLE IF NOT EXISTS incubation_kpis (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL,
  phase_id INTEGER NOT NULL,
  kpi_key TEXT NOT NULL,
  kpi_value TEXT NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  week_number INTEGER,
  FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE,
  FOREIGN KEY (phase_id) REFERENCES phases(id)
);

-- Index KPIs
CREATE INDEX IF NOT EXISTS idx_kpis_startup ON incubation_kpis(startup_id);
CREATE INDEX IF NOT EXISTS idx_kpis_phase ON incubation_kpis(phase_id);
CREATE INDEX IF NOT EXISTS idx_kpis_key ON incubation_kpis(kpi_key);
CREATE INDEX IF NOT EXISTS idx_kpis_week ON incubation_kpis(week_number);

-- Triggers
CREATE TRIGGER IF NOT EXISTS update_startups_timestamp 
AFTER UPDATE ON startups
BEGIN
  UPDATE startups SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_startup_phases_timestamp 
AFTER UPDATE ON startup_phases
BEGIN
  UPDATE startup_phases SET updated_at = datetime('now') WHERE id = NEW.id;
END;
