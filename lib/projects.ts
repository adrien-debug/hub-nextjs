import { db } from './db';
import { Project } from './types';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

export class ProjectService {
  static list(filters: { status?: string; published?: boolean } = {}): Project[] {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.published !== undefined) {
      query += ' AND published = ?';
      params.push(filters.published ? 1 : 0);
    }

    query += ' ORDER BY order_index ASC, created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(this.parseProject);
  }

  static findById(id: string): Project | null {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
    return row ? this.parseProject(row) : null;
  }

  static create(data: Omit<Project, 'id' | 'slug' | 'created_at' | 'updated_at'>): Project {
    const id = nanoid();
    const slug = slugify(data.name, { lower: true, strict: true });

    db.prepare(`
      INSERT INTO projects (id, name, slug, status, category, description, tech_stack,
        port, urls, logo, screenshots, location, features, published, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.name, slug, data.status, data.category, data.description,
      JSON.stringify(data.tech_stack),
      data.port || null,
      JSON.stringify(data.urls || {}),
      data.logo || null,
      JSON.stringify(data.screenshots || []),
      data.location,
      JSON.stringify(data.features || []),
      data.published ? 1 : 0,
      data.order_index || 0
    );

    return this.findById(id)!;
  }

  static update(id: string, data: Partial<Project>): Project | null {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.name) {
      updates.push('name = ?', 'slug = ?');
      params.push(data.name, slugify(data.name, { lower: true, strict: true }));
    }

    Object.entries(data).forEach(([key, value]) => {
      if (['name', 'id', 'slug', 'created_at', 'updated_at'].includes(key)) return;
      
      if (key === 'tech_stack' || key === 'urls' || key === 'screenshots' || key === 'features') {
        updates.push(`${key} = ?`);
        params.push(JSON.stringify(value));
      } else if (key === 'published') {
        updates.push('published = ?');
        params.push(value ? 1 : 0);
      } else {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updates.length === 0) return this.findById(id);

    params.push(id);
    db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    return this.findById(id);
  }

  static publish(id: string): Project | null {
    db.prepare('UPDATE projects SET published = 1 WHERE id = ?').run(id);
    return this.findById(id);
  }

  static unpublish(id: string): Project | null {
    db.prepare('UPDATE projects SET published = 0 WHERE id = ?').run(id);
    return this.findById(id);
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static getStatistics() {
    const stats = db.prepare(`
      SELECT status, COUNT(*) as count, SUM(published) as published_count
      FROM projects GROUP BY status
    `).all() as Array<{ status: string; count: number; published_count: number }>;

    const total = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    const published = db.prepare('SELECT COUNT(*) as count FROM projects WHERE published = 1').get() as { count: number };

    return {
      total: total.count,
      published: published.count,
      by_status: stats.reduce((acc, s) => {
        acc[s.status] = { total: s.count, published: s.published_count };
        return acc;
      }, {} as Record<string, { total: number; published: number }>),
    };
  }

  private static parseProject(row: any): Project {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      status: row.status,
      category: row.category,
      description: row.description,
      tech_stack: JSON.parse(row.tech_stack),
      port: row.port,
      urls: JSON.parse(row.urls || '{}'),
      logo: row.logo,
      screenshots: JSON.parse(row.screenshots || '[]'),
      location: row.location,
      features: JSON.parse(row.features || '[]'),
      created_at: row.created_at,
      updated_at: row.updated_at,
      published: row.published === 1,
      order_index: row.order_index,
    };
  }
}
