CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('live','coming','future','archived')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack JSONB NOT NULL DEFAULT '[]',
  port INTEGER,
  urls JSONB NOT NULL DEFAULT '{}',
  logo TEXT,
  screenshots JSONB NOT NULL DEFAULT '[]',
  location TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('logo','screenshot','banner')),
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS phases (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  typical_duration_days INTEGER NOT NULL,
  validation_criteria JSONB NOT NULL DEFAULT '[]',
  deliverables JSONB NOT NULL DEFAULT '[]',
  kpis JSONB NOT NULL DEFAULT '[]',
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS startups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  founders JSONB NOT NULL DEFAULT '[]',
  pitch_deck_url TEXT,
  one_pager_url TEXT,
  product_url TEXT,
  repo_url TEXT,
  category TEXT,
  problem TEXT,
  solution TEXT,
  market_size TEXT,
  current_phase_id INTEGER REFERENCES phases(id),
  overall_score REAL,
  mentor_ids JSONB NOT NULL DEFAULT '[]',
  cohort TEXT,
  status TEXT NOT NULL CHECK(status IN ('applicant','screening','accepted','active','graduated','alumni','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS startup_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  phase_id INTEGER NOT NULL REFERENCES phases(id),
  status TEXT NOT NULL CHECK(status IN ('pending','in_progress','completed','blocked','skipped')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_completion TIMESTAMPTZ,
  actual_deliverables JSONB DEFAULT '[]',
  kpi_values JSONB DEFAULT '{}',
  notes TEXT,
  blockers TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(startup_id, phase_id)
);

CREATE TABLE IF NOT EXISTS incubation_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  phase_id INTEGER NOT NULL REFERENCES phases(id),
  kpi_key TEXT NOT NULL,
  kpi_value TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  week_number INTEGER
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_startups_status ON startups(status);
CREATE INDEX IF NOT EXISTS idx_startups_cohort ON startups(cohort);
CREATE INDEX IF NOT EXISTS idx_startup_phases_startup ON startup_phases(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_phases_status ON startup_phases(status);
CREATE INDEX IF NOT EXISTS idx_kpis_startup ON incubation_kpis(startup_id);
