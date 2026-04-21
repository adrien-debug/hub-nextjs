# 🚀 Hearst Hub

Plateforme centralisée de gestion des projets Hearst avec système d'incubation de startups.

## 📋 Fonctionnalités

### Projets
- Gestion complète des projets (CRUD)
- Page d’accueil : sections **Live** et **Pipeline** alimentées par `ProjectService` (projets **publiés**, statuts `live` puis `coming` + `future`), ISR `revalidate` 60s sur `app/page.tsx`
- Statuts : live, coming, future, archived
- Médias : logos, screenshots, bannières
- Authentification JWT avec rôles

### Incubation 🆕
- Pipeline structuré de 28 phases (Application → Alumni)
- Gestion des startups avec tracking complet
- KPIs granulaires par phase
- Statistiques et analytics
- Gestion de cohortes

## 🏗️ Architecture

**Mode principal** : Next.js 15 sert le front et les **Route Handlers** `app/api/*`, avec SQLite via `lib/db.ts`. L’admin (`/admin`) appelle `fetch('/api/...')` sur ce même origin (pas le serveur Express sauf configuration proxy externe).

**Dossier `api/`** : backend Express + SQLite **autonome** (`npm run dev` dans `api/`), utile pour déploiement séparé ou scripts. Il n’est **pas** inclus dans le `tsc` du build Next (`tsconfig.json` exclut `api/`).

```
Hub/
├── app/
│   ├── api/                 # REST Next (projets, auth, incubation)
│   ├── admin/
│   └── page.tsx
├── lib/
│   ├── db.ts                # SQLite + schéma (projets, médias, incubation)
│   ├── auth.ts
│   └── incubation.ts
├── components/              # IncubationPipeline = UI statique (données API dispo via GET /api/incubation/phases)
├── data/projects.db
└── api/                     # Express optionnel (routes + services miroir)
    └── src/
```

Scripts : `scripts/test-api.sh`, `scripts/test-incubation.sh`.

## 🚀 Quick Start

### Backend
```bash
cd api
npm install
PORT=4000 npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

### Tester l'incubation
```bash
./scripts/test-incubation.sh
```

## 📊 API Endpoints

Les chemins ci-dessous existent sur **Next** (`app/api/...`) et en parallèle sur **Express** (`api/`). Exception : les routes **KPI** listées plus bas ne sont pour l’instant implémentées que côté **Express** (le service `lib/incubation.ts` côté Next pourrait s’y mapper ultérieurement).

### Incubation

#### Phases
```bash
GET /api/incubation/phases              # Liste des 28 phases
GET /api/incubation/phases/:id          # Détail d'une phase
```

#### Startups
```bash
GET /api/incubation/startups            # Liste startups (+ filtres)
POST /api/incubation/startups           # Créer startup
GET /api/incubation/startups/:id        # Détail startup
PATCH /api/incubation/startups/:id      # Mettre à jour
DELETE /api/incubation/startups/:id     # Supprimer
```

#### Progression
```bash
GET /api/incubation/startups/:id/phases           # Phases startup
PATCH /api/incubation/startups/:id/phases/:phaseId # Update phase
```

#### KPIs (Express `api/` uniquement pour l’instant)
```bash
GET /api/incubation/startups/:id/kpis    # KPIs d'une startup
POST /api/incubation/startups/:id/kpis   # Ajouter KPI
```

#### Stats
```bash
GET /api/incubation/statistics           # Statistiques globales
```

## 🗄️ Base de données

### Tables Incubation
- `phases` : 28 phases du pipeline
- `startups` : Données des startups
- `startup_phases` : Progression par phase
- `incubation_kpis` : Tracking KPIs granulaire

### Pipeline (28 phases)

1. Application (1-3 sem)
2. Initial Screening (2-7 j)
3. Deep Review (3-10 j)
4. Interview (1-5 j)
5. Committee Decision (1-7 j)
6. Onboarding (1-2 sem)
7. Goal Setting (1 sem)
8. Product Validation (2-4 sem)
9. MVP Iteration (2-6 sem)
10. User Acquisition Testing (2-4 sem)
11. Traction Validation (3-6 sem)
12. Business Model Refinement (2-4 sem)
13. Metrics Tracking Setup (1-2 sem)
14. Weekly Reporting (continu)
15. Mentor Assignment (1 sem)
16. Mentor Sessions (continu)
17. Milestone Tracking (continu)
18. Performance Review Mid (1 sem)
19. Growth Acceleration (3-6 sem)
20. Fundraising Prep (2-4 sem)
21. Pitch Deck Refinement (1-2 sem)
22. Financial Model (1-2 sem)
23. Data Room (1-2 sem)
24. Investor Outreach (2-6 sem)
25. Demo Day Prep (2-3 sem)
26. Demo Day (1 j)
27. Graduation (immédiat)
28. Alumni Tracking (continu)

## 🔐 Variables d'environnement

```bash
# Backend
PORT=4000
DATABASE_PATH=./data/projects.db
JWT_SECRET=your-secret
API_KEY=your-api-key

# Frontend (optionnel — l’app utilise par défaut les routes relatives /api/*)
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📝 Logs

- Backend : `api/logs/`
- Combined : `combined.log`
- Errors : `error.log`
- HTTP : `http.log`

## 🛠️ Tech Stack

- **Frontend** : Next.js 15, React 19, TailwindCSS
- **Backend local** : SQLite (better-sqlite3) via `lib/db.ts`
- **Backend cloud** : Express sur [Railway](https://hub-incubator-api-production.up.railway.app/api/health)
- **Database cloud** : PostgreSQL sur [Supabase](https://supabase.com/dashboard/project/xyavsskrzuthgnotbqjm) (schéma identique, 13 projets + 28 phases + admin seedés)
- **Auth** : JWT, bcrypt
- **Validation** : Zod
- **Logs** : Winston

## 📚 Documentation complète

Voir `api/README.md` pour la documentation détaillée de l'API.

---

**Hearst - 2026**
