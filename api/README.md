# 🚀 Hearst Projects API

Backend professionnel pour la gestion des projets Hearst avec CRUD complet, gestion de médias, authentification JWT et permissions par rôle.

## 📋 Fonctionnalités

### Projets
- ✅ Créer, lire, mettre à jour, supprimer des projets
- ✅ Publier / Dépublier des projets
- ✅ Archiver des projets
- ✅ Réorganiser l'ordre des projets
- ✅ Filtrer par statut, catégorie, recherche textuelle
- ✅ Pagination
- ✅ Statistiques globales

### Incubation (Nouveau 🆕)
- ✅ Pipeline de 28 phases structuré (Application → Alumni)
- ✅ Gestion des startups avec tracking complet
- ✅ Suivi de progression par phase
- ✅ KPIs granulaires par phase et par startup
- ✅ Statistiques et analytics
- ✅ Gestion de cohortes
- ✅ Scoring et validation automatique

### Médias
- ✅ Upload d'images (logos, screenshots, banners)
- ✅ Optimisation automatique avec Sharp
- ✅ Redimensionnement intelligent selon le type
- ✅ Gestion par projet
- ✅ Définir le logo principal
- ✅ Statistiques de stockage

### Authentification & Autorisation
- ✅ Login avec JWT
- ✅ Gestion des utilisateurs
- ✅ 3 rôles: admin, editor, viewer
- ✅ Permissions granulaires
- ✅ API Key pour accès externe

### Sécurité
- ✅ Helmet.js (headers sécurisés)
- ✅ CORS configuré
- ✅ Rate limiting
- ✅ Validation Zod
- ✅ Logs Winston
- ✅ SQLite avec foreign keys

---

## 🚀 Quick Start

```bash
# Installation
cd api
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos paramètres

# Démarrage en développement
npm run dev

# Build de production
npm run build
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## 📦 Structure

```
api/
├── src/
│   ├── db/
│   │   ├── database.ts         # Configuration SQLite
│   │   └── schema.sql          # Schéma de base de données
│   ├── middleware/
│   │   ├── auth.ts             # JWT & API Key auth
│   │   └── errorHandler.ts    # Gestion d'erreurs
│   ├── routes/
│   │   ├── projects.ts         # Routes projets
│   │   ├── media.ts            # Routes médias
│   │   └── auth.ts             # Routes authentification
│   ├── services/
│   │   ├── project.service.ts  # Logique métier projets
│   │   └── media.service.ts    # Logique métier médias
│   ├── types/
│   │   └── index.ts            # Types TypeScript
│   ├── utils/
│   │   ├── logger.ts           # Logger Winston
│   │   └── validators.ts       # Schémas Zod
│   └── server.ts               # Point d'entrée
├── data/
│   └── projects.db             # Base de données SQLite
├── uploads/
│   ├── logos/                  # Logos de projets
│   ├── screenshots/            # Captures d'écran
│   └── banners/                # Bannières
├── logs/
│   ├── combined.log            # Tous les logs
│   ├── error.log               # Erreurs uniquement
│   └── http.log                # Logs HTTP
├── package.json
├── tsconfig.json
└── .env
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header d'authentification:

```bash
Authorization: Bearer <JWT_TOKEN>
```

Ou pour l'accès externe:

```bash
x-api-key: <API_KEY>
```

---

## 📚 Endpoints

### Health Check

```bash
GET /api/health
```

Réponse:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-04-21T02:00:00.000Z",
    "uptime": 3600,
    "environment": "development"
  }
}
```

---

### Authentification

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Réponse:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "abc123",
      "username": "admin",
      "email": "admin@hearst.app",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

#### Create User (Admin only)
```bash
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "editor"
}
```

#### List Users (Admin only)
```bash
GET /api/auth/users
Authorization: Bearer <token>
```

---

### Projets

#### List Projects
```bash
GET /api/projects?page=1&limit=20&status=live&category=Frontend&search=hub&published=true
```

Paramètres:
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Résultats par page (défaut: 20, max: 100)
- `status` (optionnel): Filtrer par statut (live, coming, future, archived)
- `category` (optionnel): Filtrer par catégorie
- `search` (optionnel): Recherche textuelle
- `published` (optionnel): true/false

Réponse:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

#### Get Project by ID
```bash
GET /api/projects/:id
```

#### Get Project by Slug
```bash
GET /api/projects/slug/:slug
```

#### Get Statistics
```bash
GET /api/projects/statistics
```

Réponse:
```json
{
  "success": true,
  "data": {
    "total": 15,
    "published": 12,
    "by_status": {
      "live": { "total": 5, "published": 5 },
      "coming": { "total": 7, "published": 5 },
      "future": { "total": 1, "published": 1 },
      "archived": { "total": 2, "published": 1 }
    }
  }
}
```

#### Create Project (Admin/Editor)
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "category": "Frontend",
  "description": "Description du projet...",
  "status": "coming",
  "tech_stack": ["Next.js", "React", "TypeScript"],
  "port": 3000,
  "urls": {
    "local": "http://localhost:3000",
    "production": "https://example.com"
  },
  "location": "/path/to/project",
  "features": ["Feature 1", "Feature 2"],
  "published": true,
  "order_index": 0
}
```

#### Update Project (Admin/Editor)
```bash
PATCH /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Publish Project (Admin/Editor)
```bash
POST /api/projects/:id/publish
Authorization: Bearer <token>
```

#### Unpublish Project (Admin/Editor)
```bash
POST /api/projects/:id/unpublish
Authorization: Bearer <token>
```

#### Archive Project (Admin)
```bash
POST /api/projects/:id/archive
Authorization: Bearer <token>
```

#### Delete Project (Admin)
```bash
DELETE /api/projects/:id
Authorization: Bearer <token>
```

#### Reorder Projects (Admin/Editor)
```bash
POST /api/projects/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": ["id1", "id2", "id3", ...]
}
```

---

### Médias

#### List Media
```bash
GET /api/media?project_id=abc123&type=logo
```

Paramètres:
- `project_id` (requis): ID du projet
- `type` (optionnel): logo, screenshot, banner

#### Get Media by ID
```bash
GET /api/media/:id
```

#### Get Statistics (Auth required)
```bash
GET /api/media/statistics
Authorization: Bearer <token>
```

#### Upload Media (Admin/Editor)
```bash
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- file: <image file>
- project_id: abc123
- type: logo|screenshot|banner
```

Types de fichiers acceptés:
- image/jpeg
- image/png
- image/webp
- image/svg+xml

Taille max: 10MB (configurable)

Optimisations automatiques:
- **Logo**: Redimensionné à 400x400px max
- **Screenshot**: Redimensionné à 1920x1080px max
- **Banner**: Recadré à 2400x800px

#### Set as Logo (Admin/Editor)
```bash
POST /api/media/:id/set-as-logo
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_id": "abc123"
}
```

#### Delete Media (Admin/Editor)
```bash
DELETE /api/media/:id
Authorization: Bearer <token>
```

---

## 🔐 Permissions

| Route | Viewer | Editor | Admin |
|-------|--------|--------|-------|
| GET projets | ✅ | ✅ | ✅ |
| POST projet | ❌ | ✅ | ✅ |
| PATCH projet | ❌ | ✅ | ✅ |
| DELETE projet | ❌ | ❌ | ✅ |
| Publish/Unpublish | ❌ | ✅ | ✅ |
| Archive | ❌ | ❌ | ✅ |
| Upload média | ❌ | ✅ | ✅ |
| Delete média | ❌ | ✅ | ✅ |
| Gestion users | ❌ | ❌ | ✅ |

---

## 🚀 Incubation System

### Vue d'ensemble

Le système d'incubation gère un pipeline structuré de **28 phases** pour accompagner les startups depuis la candidature jusqu'au statut alumni.

### Phases du pipeline

1. **Application** (1-3 sem) - Candidature initiale
2. **Initial Screening** (2-7 j) - Premier tri
3. **Deep Review** (3-10 j) - Due diligence
4. **Interview** (1-5 j) - Entretien équipe
5. **Committee Decision** (1-7 j) - Décision admission
6. **Onboarding** (1-2 sem) - Intégration
7. **Goal Setting** (1 sem) - Définition OKRs
8. **Product Validation** (2-4 sem) - Validation problème/solution
9. **MVP Iteration** (2-6 sem) - Construction MVP
10. **User Acquisition Testing** (2-4 sem) - Tests acquisition
11. **Traction Validation** (3-6 sem) - Preuve marché
12. **Business Model Refinement** (2-4 sem) - Optimisation monétisation
13. **Metrics Tracking Setup** (1-2 sem) - Setup KPIs
14. **Weekly Reporting** (continu) - Suivi régulier
15. **Mentor Assignment** (1 sem) - Attribution mentors
16. **Mentor Sessions** (continu) - Accompagnement
17. **Milestone Tracking** (continu) - Suivi progression
18. **Performance Review Mid** (1 sem) - Évaluation intermédiaire
19. **Growth Acceleration** (3-6 sem) - Accélération croissance
20. **Fundraising Prep** (2-4 sem) - Préparation levée
21. **Pitch Deck Refinement** (1-2 sem) - Amélioration pitch
22. **Financial Model** (1-2 sem) - Modèle financier
23. **Data Room** (1-2 sem) - Préparation investisseurs
24. **Investor Outreach** (2-6 sem) - Contact investisseurs
25. **Demo Day Prep** (2-3 sem) - Préparation présentation
26. **Demo Day** (1 j) - Présentation finale
27. **Graduation** (immédiat) - Sortie programme
28. **Alumni Tracking** (continu) - Suivi long terme

### API Endpoints

#### Phases
```bash
GET /api/incubation/phases              # Liste toutes les phases
GET /api/incubation/phases/:id          # Détail d'une phase
```

#### Startups
```bash
GET /api/incubation/startups            # Liste startups (+ filtres)
GET /api/incubation/startups/:id        # Détail startup
POST /api/incubation/startups           # Créer startup
PATCH /api/incubation/startups/:id      # Mettre à jour
DELETE /api/incubation/startups/:id     # Supprimer
```

Filtres disponibles :
- `status` : applicant, screening, accepted, active, graduated, alumni, rejected
- `cohort` : ex. "2026-Q2"
- `search` : recherche textuelle

#### Progression phases
```bash
GET /api/incubation/startups/:id/phases           # Toutes les phases d'une startup
PATCH /api/incubation/startups/:id/phases/:phaseId # Mettre à jour une phase
```

#### KPIs
```bash
GET /api/incubation/startups/:id/kpis    # KPIs d'une startup
POST /api/incubation/startups/:id/kpis   # Ajouter un KPI
```

#### Statistics
```bash
GET /api/incubation/statistics           # Stats globales
```

### Exemples

#### Créer une startup
```bash
POST /api/incubation/startups
Content-Type: application/json

{
  "name": "SuperStartup",
  "founders": ["John Doe", "Jane Smith"],
  "category": "SaaS",
  "problem": "Businesses struggle with X",
  "solution": "We provide Y",
  "cohort": "2026-Q2",
  "pitch_deck_url": "https://example.com/deck.pdf",
  "product_url": "https://demo.example.com",
  "repo_url": "https://github.com/user/repo"
}
```

#### Compléter une phase
```bash
PATCH /api/incubation/startups/:id/phases/1
Content-Type: application/json

{
  "status": "completed",
  "notes": "Application completed successfully",
  "actual_deliverables": ["pitch_deck", "founder_profiles", "demo_link"],
  "kpi_values": {
    "completion_time": 12,
    "quality_score": 85
  }
}
```

#### Ajouter un KPI
```bash
POST /api/incubation/startups/:id/kpis
Content-Type: application/json

{
  "phase_id": 11,
  "kpi_key": "weekly_growth_rate",
  "kpi_value": "15.5",
  "week_number": 4
}
```

### Test du système
```bash
# Lancer le script de test
./scripts/test-incubation.sh
```

---

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch
```

---

## 🔧 Configuration (.env)

```bash
# Server
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# Database
DATABASE_PATH=./data/projects.db

# Auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
API_KEY=your-api-key-for-external-access

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/svg+xml

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:6000,http://localhost:3000

# Logs
LOG_LEVEL=info
LOG_DIR=./logs
```

---

## 🌐 Intégration Frontend

### Exemple avec fetch

```typescript
const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// Get projects
const response = await fetch(`${API_URL}/projects?status=live`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { success, data } = await response.json();

// Upload media
const formData = new FormData();
formData.append('file', file);
formData.append('project_id', projectId);
formData.append('type', 'logo');

await fetch(`${API_URL}/media/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

---

## 📝 Logs

Tous les logs sont stockés dans `./logs/`:
- `combined.log`: Tous les logs
- `error.log`: Erreurs uniquement
- `http.log`: Requêtes HTTP

---

## 🚀 Production

```bash
# Build
npm run build

# Démarrer
NODE_ENV=production npm start
```

Recommandations production:
- Utiliser PostgreSQL au lieu de SQLite
- Configurer un reverse proxy (Nginx)
- Activer HTTPS
- Configurer un système de backup
- Monitorer avec PM2 ou similaire

---

## 📄 License

MIT

---

## 👨‍💻 Auteur

Hearst - 2026
