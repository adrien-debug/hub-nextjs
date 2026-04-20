# 🛠️ Commandes Utiles - API Backend

Guide de référence rapide pour toutes les commandes importantes.

---

## 🚀 Démarrage & Développement

```bash
# Installation
cd api
npm install

# Développement avec auto-reload
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Migrer les données depuis JSON
npm run migrate
```

---

## 🧪 Tests & Qualité

```bash
# Tests
npm test
npm run test:watch

# Linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🔑 Tests API Curl

### Login
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.data.token')

echo $TOKEN
```

### Health Check
```bash
curl http://localhost:5000/api/health | jq
```

### Lister les projets
```bash
curl http://localhost:5000/api/projects | jq
```

### Lister les projets (filtré)
```bash
curl "http://localhost:5000/api/projects?status=live&published=true" | jq
```

### Obtenir un projet
```bash
curl http://localhost:5000/api/projects/PROJECT_ID | jq
```

### Créer un projet
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Projet",
    "category": "Test",
    "description": "Description du projet",
    "status": "coming",
    "tech_stack": ["Node.js", "TypeScript"],
    "location": "/test"
  }' | jq
```

### Mettre à jour un projet
```bash
curl -X PATCH http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Nom Modifié"}' | jq
```

### Publier un projet
```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/publish \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Dépublier un projet
```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/unpublish \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Archiver un projet
```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/archive \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Supprimer un projet
```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Statistiques
```bash
curl http://localhost:5000/api/projects/statistics | jq
```

### Upload média
```bash
curl -X POST http://localhost:5000/api/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "project_id=PROJECT_ID" \
  -F "type=logo" | jq
```

### Lister médias d'un projet
```bash
curl "http://localhost:5000/api/media?project_id=PROJECT_ID" | jq
```

### Supprimer un média
```bash
curl -X DELETE http://localhost:5000/api/media/MEDIA_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🗃️ Base de Données

### Ouvrir la DB SQLite
```bash
sqlite3 data/projects.db
```

### Commandes SQLite utiles
```sql
-- Lister les tables
.tables

-- Schéma d'une table
.schema projects

-- Compter les projets
SELECT COUNT(*) FROM projects;

-- Lister les projets publiés
SELECT id, name, status, published FROM projects WHERE published = 1;

-- Statistiques par statut
SELECT status, COUNT(*) as count, SUM(published) as published_count 
FROM projects 
GROUP BY status;

-- Quitter
.quit
```

### Backup de la DB
```bash
# Backup
cp data/projects.db data/projects.db.backup

# Restaurer
cp data/projects.db.backup data/projects.db
```

### Reset complet
```bash
# Supprimer la DB
rm -rf data/

# Redémarrer (recrée la DB)
npm run dev

# Ré-importer les données
npm run migrate
```

---

## 📊 Logs

### Voir les logs en temps réel
```bash
# Tous les logs
tail -f logs/combined.log

# Erreurs uniquement
tail -f logs/error.log

# HTTP requests
tail -f logs/http.log
```

### Rechercher dans les logs
```bash
# Rechercher une erreur spécifique
grep "Error" logs/combined.log

# Logs d'aujourd'hui
grep "$(date +%Y-%m-%d)" logs/combined.log
```

### Nettoyer les logs
```bash
# Archiver et nettoyer
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
rm -f logs/*.log
```

---

## 🔧 Maintenance

### Vérifier l'espace disque
```bash
# Taille de la DB
du -h data/projects.db

# Taille des uploads
du -sh uploads/

# Taille des logs
du -sh logs/
```

### Nettoyer les uploads orphelins
```bash
# Lister les médias dans la DB
sqlite3 data/projects.db "SELECT path FROM media;" > db_media.txt

# Comparer avec les fichiers réels
find uploads -type f > disk_media.txt

# Trouver les orphelins (fichiers sans entrée DB)
comm -13 <(sort db_media.txt) <(sort disk_media.txt)
```

### Optimiser la DB
```bash
sqlite3 data/projects.db "VACUUM;"
```

---

## 🐳 Docker (optionnel)

### Créer un Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Build & Run
```bash
# Build
docker build -t hearst-api .

# Run
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  hearst-api
```

---

## 🚀 Production

### Variables d'environnement essentielles
```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=votre-secret-securise
API_KEY=votre-api-key-securisee
DATABASE_PATH=./data/projects.db
UPLOAD_DIR=./uploads
CORS_ORIGIN=https://votredomaine.com
```

### Avec PM2
```bash
# Installer PM2
npm install -g pm2

# Démarrer
pm2 start npm --name "hearst-api" -- start

# Status
pm2 status

# Logs
pm2 logs hearst-api

# Redémarrer
pm2 restart hearst-api

# Arrêter
pm2 stop hearst-api

# Auto-start au boot
pm2 startup
pm2 save
```

### Health Check monitoring
```bash
# Créer un cron pour vérifier la santé
*/5 * * * * curl -s http://localhost:5000/api/health || echo "API DOWN" | mail -s "Alert" admin@hearst.app
```

---

## 📦 NPM Scripts

```bash
npm run dev          # Dev avec auto-reload (tsx watch)
npm run build        # Build TypeScript → dist/
npm start            # Production (node dist/server.js)
npm run lint         # ESLint
npm test             # Tests Vitest
npm run test:watch   # Tests en watch mode
npm run migrate      # Migration JSON → DB
```

---

## 🔍 Debugging

### Debug avec Node Inspector
```bash
# Démarrer en mode debug
node --inspect dist/server.js

# Ou en dev
npx tsx watch --inspect src/server.ts
```

### Variables d'environnement debug
```bash
# Logs verbeux
LOG_LEVEL=debug npm run dev

# Voir toutes les requêtes SQL
NODE_ENV=development npm run dev
```

---

## 🧹 Nettoyage

```bash
# Clean complet
rm -rf node_modules dist data uploads logs
npm install
npm run build

# Clean cache NPM
npm cache clean --force
```

---

## 📈 Monitoring

### Statistiques simples
```bash
# Nombre de projets
curl -s http://localhost:5000/api/projects/statistics | jq '.data.total'

# Nombre de médias
curl -s http://localhost:5000/api/media/statistics \
  -H "Authorization: Bearer $TOKEN" | jq '.data.total'

# Espace disque utilisé
du -sh data uploads logs
```

---

✅ Référence complète des commandes disponibles !
