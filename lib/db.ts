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

  // Incubation tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS phases (
      id INTEGER PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      typical_duration_days INTEGER NOT NULL,
      validation_criteria TEXT NOT NULL,
      deliverables TEXT NOT NULL,
      kpis TEXT NOT NULL,
      order_index INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS startups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      founders TEXT NOT NULL,
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
      mentor_ids TEXT,
      cohort TEXT,
      status TEXT NOT NULL CHECK(status IN ('applicant','screening','accepted','active','graduated','alumni','rejected')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (current_phase_id) REFERENCES phases(id)
    );

    CREATE TABLE IF NOT EXISTS startup_phases (
      id TEXT PRIMARY KEY,
      startup_id TEXT NOT NULL,
      phase_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending','in_progress','completed','blocked','skipped')),
      started_at TEXT,
      completed_at TEXT,
      estimated_completion TEXT,
      actual_deliverables TEXT,
      kpi_values TEXT,
      notes TEXT,
      blockers TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE,
      FOREIGN KEY (phase_id) REFERENCES phases(id),
      UNIQUE(startup_id, phase_id)
    );

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

    CREATE INDEX IF NOT EXISTS idx_startups_status ON startups(status);
    CREATE INDEX IF NOT EXISTS idx_startups_cohort ON startups(cohort);
    CREATE INDEX IF NOT EXISTS idx_startup_phases_startup ON startup_phases(startup_id);
    CREATE INDEX IF NOT EXISTS idx_startup_phases_status ON startup_phases(status);
    CREATE INDEX IF NOT EXISTS idx_kpis_startup ON incubation_kpis(startup_id);
  `);

  // Seed phases if empty
  const phaseCount = db.prepare('SELECT COUNT(*) as count FROM phases').get() as any;
  if (!phaseCount || phaseCount.count === 0) {
    seedPhases();
  }

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

function seedPhases() {
  const phases = [
    { id: 1, slug: 'application', name: 'Application', description: 'Collecter une candidature structurée et filtrer les projets sérieux.', typical_duration_days: 14, validation_criteria: ['dossier complet','équipe identifiée','problème/solution clairs','deck ou one-pager'], deliverables: ['formulaire de candidature','profils fondateurs','pitch deck v1','lien produit/repo/démo'], kpis: ['taux de complétion','temps moyen soumission','pièces manquantes','score initial'] },
    { id: 2, slug: 'initial-screening', name: 'Initial Screening', description: 'Premier tri rapide des candidatures.', typical_duration_days: 5, validation_criteria: ['fit programme','qualité équipe','taille marché','faisabilité'], deliverables: ['fiche screening','note reviewer'], kpis: ['taux acceptation/rejet','score moyen','temps review'] },
    { id: 3, slug: 'deep-review', name: 'Deep Review', description: 'Vérifier la crédibilité du projet.', typical_duration_days: 7, validation_criteria: ['cohérence métriques','qualité produit','signaux marché','risques'], deliverables: ['data room minimale','accès produit','KPI sheet'], kpis: ['complétude','red flags','score confiance'] },
    { id: 4, slug: 'interview', name: 'Interview', description: 'Évaluer l\'équipe en direct.', typical_duration_days: 3, validation_criteria: ['clarté vision','coachability','vitesse exécution','capacité commerciale'], deliverables: ['notes interview','scorecard'], kpis: ['score moyen','accord reviewers','no-show'] },
    { id: 5, slug: 'committee-decision', name: 'Committee Decision', description: 'Décider de l\'admission.', typical_duration_days: 4, validation_criteria: ['score global','quorum','vote comité'], deliverables: ['decision memo','log votes','dossier admission'], kpis: ['taux conversion','temps décision','unanimité'] },
    { id: 6, slug: 'onboarding', name: 'Onboarding', description: 'Intégrer le projet dans le programme.', typical_duration_days: 10, validation_criteria: ['signature','accès outils','objectifs validés'], deliverables: ['onboarding checklist','accès outils','roadmap initiale'], kpis: ['temps onboarding','complétion','satisfaction'] },
    { id: 7, slug: 'goal-setting', name: 'Goal Setting / OKRs', description: 'Définir des objectifs clairs.', typical_duration_days: 7, validation_criteria: ['objectifs mesurables','alignement mentor'], deliverables: ['OKRs','roadmap'], kpis: ['qualité OKRs','validation mentor'] },
    { id: 8, slug: 'product-validation', name: 'Product Validation', description: 'Valider le problème et la solution.', typical_duration_days: 21, validation_criteria: ['feedback utilisateurs','tests terrain'], deliverables: ['interviews clients','prototype testé'], kpis: ['nb interviews','taux validation'] },
    { id: 9, slug: 'mvp-iteration', name: 'MVP Iteration', description: 'Construire/améliorer le MVP.', typical_duration_days: 28, validation_criteria: ['fonctionnalité opérationnelle'], deliverables: ['MVP fonctionnel','roadmap technique'], kpis: ['vitesse dev','commits/semaine'] },
    { id: 10, slug: 'user-acquisition', name: 'User Acquisition', description: 'Tester acquisition utilisateurs.', typical_duration_days: 21, validation_criteria: ['premiers utilisateurs'], deliverables: ['campagnes tests','funnel acquisition'], kpis: ['CAC','conversion rate'] },
    { id: 11, slug: 'traction-validation', name: 'Traction Validation', description: 'Prouver l\'intérêt du marché.', typical_duration_days: 30, validation_criteria: ['croissance utilisateurs/revenus'], deliverables: ['KPI traction'], kpis: ['croissance hebdo','rétention'] },
    { id: 12, slug: 'business-model', name: 'Business Model', description: 'Optimiser la monétisation.', typical_duration_days: 21, validation_criteria: ['modèle viable'], deliverables: ['pricing','unit economics'], kpis: ['LTV','marge','conversion'] },
    { id: 13, slug: 'metrics-tracking', name: 'Metrics Tracking', description: 'Structurer les KPIs.', typical_duration_days: 10, validation_criteria: ['tracking en place'], deliverables: ['dashboard KPI'], kpis: ['fiabilité données','fréquence MAJ'] },
    { id: 14, slug: 'weekly-reporting', name: 'Weekly Reporting', description: 'Suivi régulier.', typical_duration_days: 999, validation_criteria: ['reporting complet'], deliverables: ['rapport hebdomadaire'], kpis: ['régularité','qualité'] },
    { id: 15, slug: 'mentor-assignment', name: 'Mentor Assignment', description: 'Assigner mentors adaptés.', typical_duration_days: 7, validation_criteria: ['matching expertise'], deliverables: ['assignation mentors'], kpis: ['satisfaction','matching réussi'] },
    { id: 16, slug: 'mentor-sessions', name: 'Mentor Sessions', description: 'Accompagnement actif.', typical_duration_days: 999, validation_criteria: ['sessions régulières'], deliverables: ['notes sessions'], kpis: ['nb sessions','impact perçu'] },
    { id: 17, slug: 'milestone-tracking', name: 'Milestone Tracking', description: 'Suivre progression.', typical_duration_days: 999, validation_criteria: ['milestones atteints'], deliverables: ['roadmap MAJ'], kpis: ['milestone completion rate'] },
    { id: 18, slug: 'performance-review', name: 'Performance Review', description: 'Évaluer progression mi-programme.', typical_duration_days: 7, validation_criteria: ['KPIs','execution'], deliverables: ['rapport intermédiaire'], kpis: ['score progression'] },
    { id: 19, slug: 'growth-acceleration', name: 'Growth Acceleration', description: 'Accélérer croissance.', typical_duration_days: 30, validation_criteria: ['scaling'], deliverables: ['stratégie croissance'], kpis: ['croissance users','revenus'] },
    { id: 20, slug: 'fundraising-prep', name: 'Fundraising Prep', description: 'Préparer levée.', typical_duration_days: 21, validation_criteria: ['readiness investisseurs'], deliverables: ['materials fundraising'], kpis: ['readiness score'] },
    { id: 21, slug: 'pitch-deck', name: 'Pitch Deck Refinement', description: 'Améliorer pitch.', typical_duration_days: 10, validation_criteria: ['clarté narrative'], deliverables: ['deck final'], kpis: ['score pitch'] },
    { id: 22, slug: 'financial-model', name: 'Financial Model', description: 'Solidifier finances.', typical_duration_days: 10, validation_criteria: ['cohérence projections'], deliverables: ['financial model'], kpis: ['précision projections'] },
    { id: 23, slug: 'data-room', name: 'Data Room', description: 'Préparer investisseurs.', typical_duration_days: 10, validation_criteria: ['documents complets'], deliverables: ['data room'], kpis: ['complétude'] },
    { id: 24, slug: 'investor-outreach', name: 'Investor Outreach', description: 'Contacter investisseurs.', typical_duration_days: 28, validation_criteria: ['meetings obtenus'], deliverables: ['liste investisseurs','emails'], kpis: ['taux réponse','meetings'] },
    { id: 25, slug: 'demo-day-prep', name: 'Demo Day Prep', description: 'Préparer présentation finale.', typical_duration_days: 17, validation_criteria: ['pitch prêt'], deliverables: ['pitch final','répétitions'], kpis: ['readiness score'] },
    { id: 26, slug: 'demo-day', name: 'Demo Day', description: 'Présenter aux investisseurs.', typical_duration_days: 1, validation_criteria: ['performance pitch'], deliverables: ['présentation live'], kpis: ['feedback investisseurs'] },
    { id: 27, slug: 'graduation', name: 'Graduation', description: 'Sortie programme.', typical_duration_days: 1, validation_criteria: ['programme complété'], deliverables: ['rapport final'], kpis: ['taux graduation'] },
    { id: 28, slug: 'alumni-tracking', name: 'Alumni Tracking', description: 'Suivi long terme.', typical_duration_days: 999, validation_criteria: ['activité post-programme'], deliverables: ['profil alumni'], kpis: ['funding','croissance','survie'] },
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO phases (id, slug, name, description, typical_duration_days, validation_criteria, deliverables, kpis, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction(() => {
    for (const p of phases) {
      insert.run(p.id, p.slug, p.name, p.description, p.typical_duration_days,
        JSON.stringify(p.validation_criteria), JSON.stringify(p.deliverables), JSON.stringify(p.kpis), p.id);
    }
  });

  insertAll();
}

initDB();
