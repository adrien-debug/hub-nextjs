import fs from 'fs';
import path from 'path';
import { initializeDatabase, db } from './database';
import { ProjectService } from '../services/project.service';
import { logger } from '../utils/logger';

// Chemin vers l'inventaire JSON existant
const INVENTORY_PATH = path.join(__dirname, '../../../project-inventory.json');

interface OldProject {
  id: string;
  name: string;
  status: 'live' | 'coming' | 'future';
  category: string;
  description: string;
  tech_stack: string[];
  port?: number;
  urls?: {
    local?: string;
    production?: string;
    github?: string;
    api?: string;
  };
  logo?: string | null;
  location: string;
  features?: string[];
}

async function migrateFromJSON() {
  logger.info('Starting migration from JSON inventory...');
  
  try {
    // Lire l'inventaire existant
    if (!fs.existsSync(INVENTORY_PATH)) {
      logger.error(`Inventory file not found: ${INVENTORY_PATH}`);
      return;
    }
    
    const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf-8'));
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    // Importer les projets live
    if (inventory.projects?.live) {
      for (const project of inventory.projects.live) {
        try {
          await importProject(project);
          imported++;
        } catch (error: any) {
          if (error.message.includes('UNIQUE constraint')) {
            logger.warn(`Project already exists: ${project.name}`);
            skipped++;
          } else {
            logger.error(`Failed to import project ${project.name}:`, error);
            errors++;
          }
        }
      }
    }
    
    // Importer les projets coming
    if (inventory.projects?.coming) {
      for (const project of inventory.projects.coming) {
        try {
          await importProject(project);
          imported++;
        } catch (error: any) {
          if (error.message.includes('UNIQUE constraint')) {
            logger.warn(`Project already exists: ${project.name}`);
            skipped++;
          } else {
            logger.error(`Failed to import project ${project.name}:`, error);
            errors++;
          }
        }
      }
    }
    
    // Importer les projets future
    if (inventory.projects?.future) {
      for (const project of inventory.projects.future) {
        try {
          await importProject(project);
          imported++;
        } catch (error: any) {
          if (error.message.includes('UNIQUE constraint')) {
            logger.warn(`Project already exists: ${project.name}`);
            skipped++;
          } else {
            logger.error(`Failed to import project ${project.name}:`, error);
            errors++;
          }
        }
      }
    }
    
    logger.info('Migration complete!');
    logger.info(`✅ Imported: ${imported}`);
    logger.info(`⏭️  Skipped: ${skipped}`);
    logger.info(`❌ Errors: ${errors}`);
    
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

function importProject(oldProject: OldProject) {
  // Transformer le format ancien vers le nouveau
  const projectData = {
    name: oldProject.name,
    status: oldProject.status,
    category: oldProject.category,
    description: oldProject.description,
    tech_stack: oldProject.tech_stack || [],
    port: oldProject.port,
    urls: oldProject.urls || {},
    logo: oldProject.logo || undefined,
    screenshots: [],
    location: oldProject.location,
    features: oldProject.features || [],
    published: oldProject.status === 'live', // Live = publié par défaut
    order_index: 0,
  };
  
  const project = ProjectService.create(projectData as any);
  logger.info(`Imported project: ${project.name} (${project.id})`);
  
  return project;
}

// Exécuter la migration
if (require.main === module) {
  initializeDatabase();
  migrateFromJSON()
    .then(() => {
      logger.info('Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateFromJSON };
