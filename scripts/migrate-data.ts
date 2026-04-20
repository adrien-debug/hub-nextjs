import { ProjectService } from '../lib/projects';
import fs from 'fs';
import path from 'path';

const JSON_PATH = path.join(process.cwd(), 'project-inventory.json');

interface JsonProject {
  id: string;
  name: string;
  status: 'live' | 'coming' | 'future';
  category: string;
  description: string;
  tech_stack: string[];
  port?: number;
  urls: {
    local?: string;
    production?: string;
    github?: string;
    api?: string;
  };
  logo?: string;
  screenshots: string[];
  location: string;
  features?: string[];
}

async function migrate() {
  console.log('🔄 Migration des données JSON vers SQLite...\n');

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ Fichier non trouvé: ${JSON_PATH}`);
    process.exit(1);
  }

  const jsonData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  const allProjects: JsonProject[] = [
    ...(jsonData.projects?.live || []),
    ...(jsonData.projects?.coming || []),
    ...(jsonData.projects?.future || []),
  ];

  console.log(`📦 ${allProjects.length} projets trouvés dans le JSON\n`);

  let created = 0;
  let skipped = 0;

  for (const project of allProjects) {
    try {
      const existing = ProjectService.list().find(p => p.name === project.name);

      if (existing) {
        console.log(`⏭️  ${project.name} - existe déjà (skip)`);
        skipped++;
      } else {
        ProjectService.create({
          name: project.name,
          status: project.status,
          category: project.category,
          description: project.description,
          tech_stack: project.tech_stack,
          port: project.port,
          urls: project.urls || {},
          logo: project.logo,
          screenshots: project.screenshots || [],
          location: project.location,
          features: project.features || [],
          published: project.status === 'live',
          order_index: 0,
        });
        console.log(`✅ ${project.name} - créé`);
        created++;
      }
    } catch (error: any) {
      console.error(`❌ ${project.name} - erreur:`, error.message);
    }
  }

  console.log(`\n🎉 Migration terminée!`);
  console.log(`   ✅ ${created} projets créés`);
  console.log(`   ⏭️  ${skipped} projets existants (ignorés)`);

  const stats = ProjectService.getStatistics();
  console.log(`\n📊 Total en base: ${stats.total} projets`);
}

migrate().catch(console.error);
