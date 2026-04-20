import { db } from './db';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

export interface Phase {
  id: number;
  slug: string;
  name: string;
  description: string;
  typical_duration_days: number;
  validation_criteria: string[];
  deliverables: string[];
  kpis: string[];
  order_index: number;
}

export interface Startup {
  id: string;
  name: string;
  slug: string;
  founders: string[];
  pitch_deck_url?: string;
  one_pager_url?: string;
  product_url?: string;
  repo_url?: string;
  category?: string;
  problem?: string;
  solution?: string;
  market_size?: string;
  current_phase_id?: number;
  overall_score?: number;
  mentor_ids?: string[];
  cohort?: string;
  status: string;
  created_at: string;
  updated_at: string;
  current_phase_name?: string;
}

export interface StartupPhase {
  id: string;
  startup_id: string;
  phase_id: number;
  status: string;
  started_at?: string;
  completed_at?: string;
  actual_deliverables?: string[];
  kpi_values?: Record<string, any>;
  notes?: string;
  blockers?: string;
  phase_name?: string;
  phase_slug?: string;
  created_at: string;
  updated_at: string;
}

export class IncubationService {
  static getAllPhases(): Phase[] {
    const rows = db.prepare('SELECT * FROM phases ORDER BY order_index ASC').all() as any[];
    return rows.map(r => ({
      ...r,
      validation_criteria: JSON.parse(r.validation_criteria),
      deliverables: JSON.parse(r.deliverables),
      kpis: JSON.parse(r.kpis),
    }));
  }

  static getPhaseById(id: number): Phase | null {
    const row = db.prepare('SELECT * FROM phases WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
      ...row,
      validation_criteria: JSON.parse(row.validation_criteria),
      deliverables: JSON.parse(row.deliverables),
      kpis: JSON.parse(row.kpis),
    };
  }

  static listStartups(filters?: { status?: string; cohort?: string; search?: string }): Startup[] {
    let query = `
      SELECT s.*, p.name as current_phase_name
      FROM startups s
      LEFT JOIN phases p ON s.current_phase_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.status) {
      query += ' AND s.status = ?';
      params.push(filters.status);
    }
    if (filters?.cohort) {
      query += ' AND s.cohort = ?';
      params.push(filters.cohort);
    }
    if (filters?.search) {
      query += ' AND (s.name LIKE ? OR s.problem LIKE ? OR s.solution LIKE ?)';
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY s.created_at DESC';
    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(this.parseStartup);
  }

  static getStartupById(id: string): Startup | null {
    const row = db.prepare(`
      SELECT s.*, p.name as current_phase_name
      FROM startups s
      LEFT JOIN phases p ON s.current_phase_id = p.id
      WHERE s.id = ?
    `).get(id) as any;
    return row ? this.parseStartup(row) : null;
  }

  static createStartup(data: any): Startup {
    const id = nanoid();
    const slug = slugify(data.name || '', { lower: true, strict: true });

    db.prepare(`
      INSERT INTO startups (id, name, slug, founders, pitch_deck_url, one_pager_url,
        product_url, repo_url, category, problem, solution, market_size,
        current_phase_id, overall_score, mentor_ids, cohort, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.name, slug,
      JSON.stringify(data.founders || []),
      data.pitch_deck_url || null,
      data.one_pager_url || null,
      data.product_url || null,
      data.repo_url || null,
      data.category || null,
      data.problem || null,
      data.solution || null,
      data.market_size || null,
      data.current_phase_id || 1,
      data.overall_score || null,
      JSON.stringify(data.mentor_ids || []),
      data.cohort || null,
      data.status || 'applicant'
    );

    this.initializePhases(id);
    return this.getStartupById(id)!;
  }

  static updateStartup(id: string, data: any): Startup | null {
    const fields: string[] = [];
    const values: any[] = [];

    const directFields = ['name', 'pitch_deck_url', 'one_pager_url', 'product_url',
      'repo_url', 'category', 'problem', 'solution', 'market_size',
      'current_phase_id', 'overall_score', 'cohort', 'status'];

    for (const key of directFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (data.founders !== undefined) {
      fields.push('founders = ?');
      values.push(JSON.stringify(data.founders));
    }
    if (data.mentor_ids !== undefined) {
      fields.push('mentor_ids = ?');
      values.push(JSON.stringify(data.mentor_ids));
    }

    if (fields.length === 0) return this.getStartupById(id);

    values.push(id);
    db.prepare(`UPDATE startups SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getStartupById(id);
  }

  static deleteStartup(id: string): boolean {
    const result = db.prepare('DELETE FROM startups WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static initializePhases(startupId: string): void {
    const phases = this.getAllPhases();
    const insert = db.prepare(`
      INSERT OR IGNORE INTO startup_phases (id, startup_id, phase_id, status)
      VALUES (?, ?, ?, ?)
    `);

    const insertAll = db.transaction(() => {
      for (const phase of phases) {
        insert.run(nanoid(), startupId, phase.id, phase.id === 1 ? 'in_progress' : 'pending');
      }
    });
    insertAll();
  }

  static getStartupPhases(startupId: string): StartupPhase[] {
    const rows = db.prepare(`
      SELECT sp.*, p.name as phase_name, p.slug as phase_slug
      FROM startup_phases sp
      JOIN phases p ON sp.phase_id = p.id
      WHERE sp.startup_id = ?
      ORDER BY p.order_index ASC
    `).all(startupId) as any[];

    return rows.map(r => ({
      ...r,
      actual_deliverables: r.actual_deliverables ? JSON.parse(r.actual_deliverables) : [],
      kpi_values: r.kpi_values ? JSON.parse(r.kpi_values) : {},
    }));
  }

  static updateStartupPhase(startupId: string, phaseId: number, data: any): StartupPhase {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
      if (data.status === 'in_progress') fields.push(`started_at = datetime('now')`);
      if (data.status === 'completed') fields.push(`completed_at = datetime('now')`);
    }
    if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }
    if (data.blockers !== undefined) { fields.push('blockers = ?'); values.push(data.blockers); }
    if (data.actual_deliverables !== undefined) {
      fields.push('actual_deliverables = ?');
      values.push(JSON.stringify(data.actual_deliverables));
    }
    if (data.kpi_values !== undefined) {
      fields.push('kpi_values = ?');
      values.push(JSON.stringify(data.kpi_values));
    }

    if (fields.length > 0) {
      values.push(startupId, phaseId);
      db.prepare(`UPDATE startup_phases SET ${fields.join(', ')} WHERE startup_id = ? AND phase_id = ?`).run(...values);

      if (data.status === 'completed') {
        const next = db.prepare(`
          SELECT phase_id FROM startup_phases
          WHERE startup_id = ? AND status = 'pending'
          ORDER BY phase_id ASC LIMIT 1
        `).get(startupId) as any;

        if (next) {
          db.prepare(`UPDATE startups SET current_phase_id = ? WHERE id = ?`).run(next.phase_id, startupId);
          db.prepare(`UPDATE startup_phases SET status = 'in_progress', started_at = datetime('now') WHERE startup_id = ? AND phase_id = ?`).run(startupId, next.phase_id);
        }
      }
    }

    const row = db.prepare(`
      SELECT sp.*, p.name as phase_name, p.slug as phase_slug
      FROM startup_phases sp
      JOIN phases p ON sp.phase_id = p.id
      WHERE sp.startup_id = ? AND sp.phase_id = ?
    `).get(startupId, phaseId) as any;

    return {
      ...row,
      actual_deliverables: row.actual_deliverables ? JSON.parse(row.actual_deliverables) : [],
      kpi_values: row.kpi_values ? JSON.parse(row.kpi_values) : {},
    };
  }

  static addKPI(startupId: string, phaseId: number, kpiKey: string, kpiValue: string | number, weekNumber?: number) {
    const id = nanoid();
    db.prepare(`
      INSERT INTO incubation_kpis (id, startup_id, phase_id, kpi_key, kpi_value, week_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, startupId, phaseId, kpiKey, String(kpiValue), weekNumber || null);
    return db.prepare('SELECT * FROM incubation_kpis WHERE id = ?').get(id);
  }

  static getStartupKPIs(startupId: string, phaseId?: number) {
    if (phaseId) {
      return db.prepare('SELECT * FROM incubation_kpis WHERE startup_id = ? AND phase_id = ? ORDER BY recorded_at DESC').all(startupId, phaseId);
    }
    return db.prepare('SELECT * FROM incubation_kpis WHERE startup_id = ? ORDER BY recorded_at DESC').all(startupId);
  }

  static getStats() {
    const total = db.prepare('SELECT COUNT(*) as count FROM startups').get() as any;
    const active = db.prepare(`SELECT COUNT(*) as count FROM startups WHERE status IN ('active','accepted')`).get() as any;
    const graduated = db.prepare(`SELECT COUNT(*) as count FROM startups WHERE status = 'graduated'`).get() as any;

    const phaseDistribution = db.prepare(`
      SELECT p.name, p.id as phase_id, COUNT(s.id) as count
      FROM phases p
      LEFT JOIN startups s ON s.current_phase_id = p.id AND s.status IN ('active','accepted','screening','applicant')
      GROUP BY p.id, p.name
      ORDER BY p.order_index
    `).all();

    const cohorts = db.prepare(`
      SELECT cohort, status, COUNT(*) as count
      FROM startups WHERE cohort IS NOT NULL
      GROUP BY cohort, status ORDER BY cohort DESC
    `).all();

    const statusBreakdown = db.prepare(`
      SELECT status, COUNT(*) as count FROM startups GROUP BY status
    `).all();

    return {
      total: total.count,
      active: active.count,
      graduated: graduated.count,
      phase_distribution: phaseDistribution,
      cohorts,
      status_breakdown: statusBreakdown,
    };
  }

  private static parseStartup(row: any): Startup {
    return {
      ...row,
      founders: JSON.parse(row.founders || '[]'),
      mentor_ids: row.mentor_ids ? JSON.parse(row.mentor_ids) : [],
    };
  }
}
