import { db } from '../db/database';
import { Project, ProjectFilters, PaginationParams } from '../types';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { logger } from '../utils/logger';

export class ProjectService {
  // Créer un projet
  static create(data: Omit<Project, 'id' | 'slug' | 'created_at' | 'updated_at'>): Project {
    const id = nanoid();
    const slug = slugify(data.name, { lower: true, strict: true });
    
    const stmt = db.prepare(`
      INSERT INTO projects (
        id, name, slug, status, category, description, tech_stack,
        port, urls, logo, screenshots, location, features, published, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      slug,
      data.status,
      data.category,
      data.description,
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
    
    logger.info(`Project created: ${id} (${data.name})`);
    
    return this.findById(id)!;
  }
  
  // Trouver un projet par ID
  static findById(id: string): Project | null {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
    return row ? this.parseProject(row) : null;
  }
  
  // Trouver un projet par slug
  static findBySlug(slug: string): Project | null {
    const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as any;
    return row ? this.parseProject(row) : null;
  }
  
  // Lister les projets avec filtres et pagination
  static list(
    filters: ProjectFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20, offset: 0 }
  ): { projects: Project[]; total: number } {
    let query = 'SELECT * FROM projects WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as count FROM projects WHERE 1=1';
    const params: any[] = [];
    
    // Filtres de statut
    if (filters.status && filters.status.length > 0) {
      const placeholders = filters.status.map(() => '?').join(',');
      query += ` AND status IN (${placeholders})`;
      countQuery += ` AND status IN (${placeholders})`;
      params.push(...filters.status);
    }
    
    // Filtre de catégorie
    if (filters.category && filters.category.length > 0) {
      const placeholders = filters.category.map(() => '?').join(',');
      query += ` AND category IN (${placeholders})`;
      countQuery += ` AND category IN (${placeholders})`;
      params.push(...filters.category);
    }
    
    // Recherche textuelle
    if (filters.search) {
      query += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Filtre publié
    if (filters.published !== undefined) {
      query += ` AND published = ?`;
      countQuery += ` AND published = ?`;
      params.push(filters.published ? 1 : 0);
    }
    
    // Compter le total
    const totalRow = db.prepare(countQuery).get(...params) as { count: number };
    const total = totalRow.count;
    
    // Ajouter tri et pagination
    query += ' ORDER BY order_index ASC, created_at DESC LIMIT ? OFFSET ?';
    params.push(pagination.limit, pagination.offset);
    
    // Exécuter la requête
    const rows = db.prepare(query).all(...params) as any[];
    const projects = rows.map(row => this.parseProject(row));
    
    return { projects, total };
  }
  
  // Mettre à jour un projet
  static update(id: string, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Project | null {
    const project = this.findById(id);
    if (!project) return null;
    
    const updates: string[] = [];
    const params: any[] = [];
    
    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
      
      // Mettre à jour le slug si le nom change
      updates.push('slug = ?');
      params.push(slugify(data.name, { lower: true, strict: true }));
    }
    
    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }
    
    if (data.category !== undefined) {
      updates.push('category = ?');
      params.push(data.category);
    }
    
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }
    
    if (data.tech_stack !== undefined) {
      updates.push('tech_stack = ?');
      params.push(JSON.stringify(data.tech_stack));
    }
    
    if (data.port !== undefined) {
      updates.push('port = ?');
      params.push(data.port);
    }
    
    if (data.urls !== undefined) {
      updates.push('urls = ?');
      params.push(JSON.stringify(data.urls));
    }
    
    if (data.logo !== undefined) {
      updates.push('logo = ?');
      params.push(data.logo);
    }
    
    if (data.screenshots !== undefined) {
      updates.push('screenshots = ?');
      params.push(JSON.stringify(data.screenshots));
    }
    
    if (data.location !== undefined) {
      updates.push('location = ?');
      params.push(data.location);
    }
    
    if (data.features !== undefined) {
      updates.push('features = ?');
      params.push(JSON.stringify(data.features));
    }
    
    if (data.published !== undefined) {
      updates.push('published = ?');
      params.push(data.published ? 1 : 0);
    }
    
    if (data.order_index !== undefined) {
      updates.push('order_index = ?');
      params.push(data.order_index);
    }
    
    if (updates.length === 0) {
      return project;
    }
    
    params.push(id);
    const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    logger.info(`Project updated: ${id}`);
    
    return this.findById(id);
  }
  
  // Publier un projet
  static publish(id: string): Project | null {
    return this.update(id, { published: true });
  }
  
  // Dépublier un projet
  static unpublish(id: string): Project | null {
    return this.update(id, { published: false });
  }
  
  // Archiver un projet
  static archive(id: string): Project | null {
    return this.update(id, { status: 'archived', published: false });
  }
  
  // Supprimer un projet
  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      logger.info(`Project deleted: ${id}`);
      return true;
    }
    
    return false;
  }
  
  // Réorganiser les projets (changer l'ordre)
  static reorder(orderedIds: string[]): void {
    const stmt = db.prepare('UPDATE projects SET order_index = ? WHERE id = ?');
    
    const transaction = db.transaction(() => {
      orderedIds.forEach((id, index) => {
        stmt.run(index, id);
      });
    });
    
    transaction();
    logger.info(`Projects reordered: ${orderedIds.length} items`);
  }
  
  // Statistiques
  static getStatistics() {
    const stats = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published_count
      FROM projects
      GROUP BY status
    `).all() as Array<{ status: string; count: number; published_count: number }>;
    
    const total = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    const published = db.prepare('SELECT COUNT(*) as count FROM projects WHERE published = 1').get() as { count: number };
    
    return {
      total: total.count,
      published: published.count,
      by_status: stats.reduce((acc, stat) => {
        acc[stat.status] = {
          total: stat.count,
          published: stat.published_count,
        };
        return acc;
      }, {} as Record<string, { total: number; published: number }>),
    };
  }
  
  // Helper pour parser un projet depuis la DB
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
