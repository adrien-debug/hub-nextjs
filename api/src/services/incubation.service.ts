import { db } from '../db/database';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { logger } from '../utils/logger';
import type { Startup, StartupPhase, Phase, IncubationKPI, PhaseStatus } from '../types';

export class IncubationService {
  // ========== PHASES ==========

  getAllPhases(): Phase[] {
    try {
      const rows = db.prepare(`
        SELECT * FROM phases ORDER BY order_index ASC
      `).all();

      return rows.map((row: any) => ({
        ...row,
        validation_criteria: JSON.parse(row.validation_criteria),
        deliverables: JSON.parse(row.deliverables),
        kpis: JSON.parse(row.kpis)
      }));
    } catch (error) {
      logger.error('Error getting phases:', error);
      throw error;
    }
  }

  getPhaseById(id: number): Phase | null {
    try {
      const row = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
      if (!row) return null;

      return {
        ...row,
        validation_criteria: JSON.parse((row as any).validation_criteria),
        deliverables: JSON.parse((row as any).deliverables),
        kpis: JSON.parse((row as any).kpis)
      } as Phase;
    } catch (error) {
      logger.error('Error getting phase:', error);
      throw error;
    }
  }

  // ========== STARTUPS ==========

  getAllStartups(filters?: { status?: string[]; cohort?: string; search?: string }) {
    try {
      let query = `
        SELECT s.*, 
               p.name as current_phase_name,
               p.slug as current_phase_slug
        FROM startups s
        LEFT JOIN phases p ON s.current_phase_id = p.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filters?.status && filters.status.length > 0) {
        query += ` AND s.status IN (${filters.status.map(() => '?').join(',')})`;
        params.push(...filters.status);
      }

      if (filters?.cohort) {
        query += ` AND s.cohort = ?`;
        params.push(filters.cohort);
      }

      if (filters?.search) {
        query += ` AND (s.name LIKE ? OR s.problem LIKE ? OR s.solution LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ` ORDER BY s.created_at DESC`;

      const rows = db.prepare(query).all(...params);

      return rows.map((row: any) => ({
        ...row,
        founders: JSON.parse(row.founders),
        mentor_ids: row.mentor_ids ? JSON.parse(row.mentor_ids) : []
      }));
    } catch (error) {
      logger.error('Error getting startups:', error);
      throw error;
    }
  }

  getStartupById(id: string): Startup | null {
    try {
      const row = db.prepare('SELECT * FROM startups WHERE id = ?').get(id);
      if (!row) return null;

      return {
        ...row,
        founders: JSON.parse((row as any).founders),
        mentor_ids: (row as any).mentor_ids ? JSON.parse((row as any).mentor_ids) : []
      } as Startup;
    } catch (error) {
      logger.error('Error getting startup:', error);
      throw error;
    }
  }

  createStartup(data: Partial<Startup>): Startup {
    try {
      const id = nanoid();
      const slug = slugify(data.name || '', { lower: true, strict: true });

      db.prepare(`
        INSERT INTO startups (
          id, name, slug, founders, pitch_deck_url, one_pager_url,
          product_url, repo_url, category, problem, solution, market_size,
          current_phase_id, overall_score, mentor_ids, cohort, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        data.name,
        slug,
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

      logger.info(`Created startup: ${id}`);
      return this.getStartupById(id)!;
    } catch (error) {
      logger.error('Error creating startup:', error);
      throw error;
    }
  }

  updateStartup(id: string, data: Partial<Startup>): Startup {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
      }
      if (data.founders !== undefined) {
        fields.push('founders = ?');
        values.push(JSON.stringify(data.founders));
      }
      if (data.pitch_deck_url !== undefined) {
        fields.push('pitch_deck_url = ?');
        values.push(data.pitch_deck_url);
      }
      if (data.one_pager_url !== undefined) {
        fields.push('one_pager_url = ?');
        values.push(data.one_pager_url);
      }
      if (data.product_url !== undefined) {
        fields.push('product_url = ?');
        values.push(data.product_url);
      }
      if (data.repo_url !== undefined) {
        fields.push('repo_url = ?');
        values.push(data.repo_url);
      }
      if (data.category !== undefined) {
        fields.push('category = ?');
        values.push(data.category);
      }
      if (data.problem !== undefined) {
        fields.push('problem = ?');
        values.push(data.problem);
      }
      if (data.solution !== undefined) {
        fields.push('solution = ?');
        values.push(data.solution);
      }
      if (data.market_size !== undefined) {
        fields.push('market_size = ?');
        values.push(data.market_size);
      }
      if (data.current_phase_id !== undefined) {
        fields.push('current_phase_id = ?');
        values.push(data.current_phase_id);
      }
      if (data.overall_score !== undefined) {
        fields.push('overall_score = ?');
        values.push(data.overall_score);
      }
      if (data.mentor_ids !== undefined) {
        fields.push('mentor_ids = ?');
        values.push(JSON.stringify(data.mentor_ids));
      }
      if (data.cohort !== undefined) {
        fields.push('cohort = ?');
        values.push(data.cohort);
      }
      if (data.status !== undefined) {
        fields.push('status = ?');
        values.push(data.status);
      }

      if (fields.length === 0) {
        return this.getStartupById(id)!;
      }

      values.push(id);
      db.prepare(`UPDATE startups SET ${fields.join(', ')} WHERE id = ?`).run(...values);

      logger.info(`Updated startup: ${id}`);
      return this.getStartupById(id)!;
    } catch (error) {
      logger.error('Error updating startup:', error);
      throw error;
    }
  }

  deleteStartup(id: string): void {
    try {
      db.prepare('DELETE FROM startups WHERE id = ?').run(id);
      logger.info(`Deleted startup: ${id}`);
    } catch (error) {
      logger.error('Error deleting startup:', error);
      throw error;
    }
  }

  // ========== STARTUP PHASES ==========

  getStartupPhases(startupId: string): StartupPhase[] {
    try {
      const rows = db.prepare(`
        SELECT sp.*, p.name as phase_name, p.slug as phase_slug
        FROM startup_phases sp
        JOIN phases p ON sp.phase_id = p.id
        WHERE sp.startup_id = ?
        ORDER BY p.order_index ASC
      `).all(startupId);

      return rows.map((row: any) => ({
        ...row,
        actual_deliverables: row.actual_deliverables ? JSON.parse(row.actual_deliverables) : [],
        kpi_values: row.kpi_values ? JSON.parse(row.kpi_values) : {}
      }));
    } catch (error) {
      logger.error('Error getting startup phases:', error);
      throw error;
    }
  }

  initializeStartupPhases(startupId: string): void {
    try {
      const phases = this.getAllPhases();
      const insert = db.prepare(`
        INSERT OR IGNORE INTO startup_phases (
          id, startup_id, phase_id, status
        ) VALUES (?, ?, ?, ?)
      `);

      const insertMany = db.transaction(() => {
        for (const phase of phases) {
          insert.run(
            nanoid(),
            startupId,
            phase.id,
            phase.id === 1 ? 'in_progress' : 'pending'
          );
        }
      });

      insertMany();
      logger.info(`Initialized phases for startup: ${startupId}`);
    } catch (error) {
      logger.error('Error initializing startup phases:', error);
      throw error;
    }
  }

  updateStartupPhase(startupId: string, phaseId: number, data: Partial<StartupPhase>): StartupPhase {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (data.status !== undefined) {
        fields.push('status = ?');
        values.push(data.status);

        if (data.status === 'in_progress' && !data.started_at) {
          fields.push(`started_at = datetime('now')`);
        }
        if (data.status === 'completed' && !data.completed_at) {
          fields.push(`completed_at = datetime('now')`);
        }
      }
      if (data.started_at !== undefined) {
        fields.push('started_at = ?');
        values.push(data.started_at);
      }
      if (data.completed_at !== undefined) {
        fields.push('completed_at = ?');
        values.push(data.completed_at);
      }
      if (data.estimated_completion !== undefined) {
        fields.push('estimated_completion = ?');
        values.push(data.estimated_completion);
      }
      if (data.actual_deliverables !== undefined) {
        fields.push('actual_deliverables = ?');
        values.push(JSON.stringify(data.actual_deliverables));
      }
      if (data.kpi_values !== undefined) {
        fields.push('kpi_values = ?');
        values.push(JSON.stringify(data.kpi_values));
      }
      if (data.notes !== undefined) {
        fields.push('notes = ?');
        values.push(data.notes);
      }
      if (data.blockers !== undefined) {
        fields.push('blockers = ?');
        values.push(data.blockers);
      }

      if (fields.length === 0) {
        const row = db.prepare('SELECT * FROM startup_phases WHERE startup_id = ? AND phase_id = ?').get(startupId, phaseId);
        return this.parseStartupPhaseRow(row);
      }

      values.push(startupId, phaseId);
      db.prepare(`UPDATE startup_phases SET ${fields.join(', ')} WHERE startup_id = ? AND phase_id = ?`).run(...values);

      // Update current_phase_id on startup if status changed
      if (data.status === 'completed') {
        const nextPhase = db.prepare(`
          SELECT phase_id FROM startup_phases 
          WHERE startup_id = ? AND status = 'pending'
          ORDER BY phase_id ASC LIMIT 1
        `).get(startupId) as { phase_id: number } | undefined;

        if (nextPhase) {
          db.prepare('UPDATE startups SET current_phase_id = ? WHERE id = ?').run(nextPhase.phase_id, startupId);
          db.prepare('UPDATE startup_phases SET status = ? WHERE startup_id = ? AND phase_id = ?').run('in_progress', startupId, nextPhase.phase_id);
        }
      }

      const row = db.prepare('SELECT * FROM startup_phases WHERE startup_id = ? AND phase_id = ?').get(startupId, phaseId);
      logger.info(`Updated phase ${phaseId} for startup: ${startupId}`);
      return this.parseStartupPhaseRow(row);
    } catch (error) {
      logger.error('Error updating startup phase:', error);
      throw error;
    }
  }

  private parseStartupPhaseRow(row: any): StartupPhase {
    return {
      ...row,
      actual_deliverables: row.actual_deliverables ? JSON.parse(row.actual_deliverables) : [],
      kpi_values: row.kpi_values ? JSON.parse(row.kpi_values) : {}
    };
  }

  // ========== KPIs ==========

  addKPI(startupId: string, phaseId: number, kpiKey: string, kpiValue: string | number, weekNumber?: number): IncubationKPI {
    try {
      const id = nanoid();

      db.prepare(`
        INSERT INTO incubation_kpis (id, startup_id, phase_id, kpi_key, kpi_value, week_number)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, startupId, phaseId, kpiKey, String(kpiValue), weekNumber || null);

      logger.info(`Added KPI ${kpiKey} for startup: ${startupId}`);
      return db.prepare('SELECT * FROM incubation_kpis WHERE id = ?').get(id) as IncubationKPI;
    } catch (error) {
      logger.error('Error adding KPI:', error);
      throw error;
    }
  }

  getStartupKPIs(startupId: string, phaseId?: number): IncubationKPI[] {
    try {
      if (phaseId) {
        return db.prepare(`
          SELECT * FROM incubation_kpis 
          WHERE startup_id = ? AND phase_id = ? 
          ORDER BY recorded_at DESC
        `).all(startupId, phaseId) as IncubationKPI[];
      } else {
        return db.prepare(`
          SELECT * FROM incubation_kpis 
          WHERE startup_id = ? 
          ORDER BY recorded_at DESC
        `).all(startupId) as IncubationKPI[];
      }
    } catch (error) {
      logger.error('Error getting KPIs:', error);
      throw error;
    }
  }

  // ========== STATISTICS ==========

  getIncubationStats() {
    try {
      const totalStartups = db.prepare('SELECT COUNT(*) as count FROM startups').get() as { count: number };
      const activeStartups = db.prepare(`SELECT COUNT(*) as count FROM startups WHERE status IN ('active', 'accepted')`).get() as { count: number };
      const graduatedStartups = db.prepare(`SELECT COUNT(*) as count FROM startups WHERE status = 'graduated'`).get() as { count: number };

      const phaseDistribution = db.prepare(`
        SELECT p.name, COUNT(s.id) as count
        FROM phases p
        LEFT JOIN startups s ON s.current_phase_id = p.id AND s.status IN ('active', 'accepted')
        GROUP BY p.id, p.name
        ORDER BY p.order_index
      `).all();

      const cohortStats = db.prepare(`
        SELECT cohort, COUNT(*) as count, status
        FROM startups
        WHERE cohort IS NOT NULL
        GROUP BY cohort, status
        ORDER BY cohort DESC
      `).all();

      return {
        total_startups: totalStartups.count,
        active_startups: activeStartups.count,
        graduated_startups: graduatedStartups.count,
        phase_distribution: phaseDistribution,
        cohort_stats: cohortStats
      };
    } catch (error) {
      logger.error('Error getting stats:', error);
      throw error;
    }
  }
}

export const incubationService = new IncubationService();
