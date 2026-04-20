import { db } from '../db/database';
import { Media } from '../types';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { logger } from '../utils/logger';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Créer les dossiers d'upload
['logos', 'screenshots', 'banners'].forEach(type => {
  const dir = path.join(UPLOAD_DIR, type);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export class MediaService {
  // Uploader un fichier
  static async upload(
    file: Express.Multer.File,
    projectId: string,
    type: 'logo' | 'screenshot' | 'banner'
  ): Promise<Media> {
    const id = nanoid();
    const ext = path.extname(file.originalname);
    const filename = `${id}${ext}`;
    const relativePath = path.join(type + 's', filename);
    const fullPath = path.join(UPLOAD_DIR, relativePath);
    
    // Optimiser l'image avec sharp
    let imageBuffer = file.buffer;
    let width: number | undefined;
    let height: number | undefined;
    
    if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;
      
      // Redimensionner selon le type
      if (type === 'logo') {
        image.resize(400, 400, { fit: 'inside', withoutEnlargement: true });
      } else if (type === 'screenshot') {
        image.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
      } else if (type === 'banner') {
        image.resize(2400, 800, { fit: 'cover' });
      }
      
      // Optimiser
      image.jpeg({ quality: 85 }).png({ compressionLevel: 9 }).webp({ quality: 85 });
      
      imageBuffer = await image.toBuffer();
    }
    
    // Écrire le fichier
    fs.writeFileSync(fullPath, imageBuffer);
    
    const url = `${BASE_URL}/uploads/${relativePath.replace(/\\/g, '/')}`;
    
    // Enregistrer dans la DB
    const stmt = db.prepare(`
      INSERT INTO media (
        id, project_id, type, filename, original_filename,
        path, url, mime_type, size, width, height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      projectId,
      type,
      filename,
      file.originalname,
      relativePath,
      url,
      file.mimetype,
      imageBuffer.length,
      width || null,
      height || null
    );
    
    logger.info(`Media uploaded: ${id} (${type}) for project ${projectId}`);
    
    return this.findById(id)!;
  }
  
  // Trouver un média par ID
  static findById(id: string): Media | null {
    const row = db.prepare('SELECT * FROM media WHERE id = ?').get(id) as any;
    return row ? this.parseMedia(row) : null;
  }
  
  // Lister les médias d'un projet
  static listByProject(projectId: string, type?: 'logo' | 'screenshot' | 'banner'): Media[] {
    let query = 'SELECT * FROM media WHERE project_id = ?';
    const params: any[] = [projectId];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(row => this.parseMedia(row));
  }
  
  // Supprimer un média
  static delete(id: string): boolean {
    const media = this.findById(id);
    if (!media) return false;
    
    // Supprimer le fichier physique
    const fullPath = path.join(UPLOAD_DIR, media.path);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      logger.error(`Failed to delete file: ${fullPath}`, error);
    }
    
    // Supprimer de la DB
    const result = db.prepare('DELETE FROM media WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      logger.info(`Media deleted: ${id}`);
      return true;
    }
    
    return false;
  }
  
  // Supprimer tous les médias d'un projet
  static deleteByProject(projectId: string): number {
    const medias = this.listByProject(projectId);
    let deleted = 0;
    
    for (const media of medias) {
      if (this.delete(media.id)) {
        deleted++;
      }
    }
    
    logger.info(`Deleted ${deleted} media files for project ${projectId}`);
    return deleted;
  }
  
  // Définir comme logo principal
  static setAsLogo(mediaId: string, projectId: string): boolean {
    const media = this.findById(mediaId);
    if (!media || media.project_id !== projectId) return false;
    
    // Mettre à jour le projet avec l'URL du logo
    db.prepare('UPDATE projects SET logo = ? WHERE id = ?').run(media.url, projectId);
    
    logger.info(`Logo set for project ${projectId}: ${mediaId}`);
    return true;
  }
  
  // Statistiques
  static getStatistics() {
    const stats = db.prepare(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(size) as total_size
      FROM media
      GROUP BY type
    `).all() as Array<{ type: string; count: number; total_size: number }>;
    
    const total = db.prepare('SELECT COUNT(*) as count, SUM(size) as total_size FROM media').get() as {
      count: number;
      total_size: number;
    };
    
    return {
      total: total.count,
      total_size: total.total_size,
      by_type: stats.reduce((acc, stat) => {
        acc[stat.type] = {
          count: stat.count,
          total_size: stat.total_size,
        };
        return acc;
      }, {} as Record<string, { count: number; total_size: number }>),
    };
  }
  
  // Helper pour parser un média depuis la DB
  private static parseMedia(row: any): Media {
    return {
      id: row.id,
      project_id: row.project_id,
      type: row.type,
      filename: row.filename,
      original_filename: row.original_filename,
      path: row.path,
      url: row.url,
      mime_type: row.mime_type,
      size: row.size,
      width: row.width,
      height: row.height,
      created_at: row.created_at,
    };
  }
}
