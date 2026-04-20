# 🚀 Quick Start Guide

Guide rapide pour démarrer l'API en 5 minutes.

## 1. Installation

```bash
cd api
npm install
```

## 2. Configuration

```bash
cp .env.example .env
```

Éditer `.env` avec les paramètres minimum:

```bash
PORT=5000
JWT_SECRET=changez-ce-secret-en-production
API_KEY=votre-cle-api-securisee
```

## 3. Démarrage

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## 4. Test

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Login (utilisateur par défaut)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Vous recevrez un token JWT à utiliser pour les requêtes authentifiées.

### Lister les projets

```bash
curl http://localhost:5000/api/projects
```

## 5. Migration des données existantes

Pour importer les projets depuis `project-inventory.json`:

```bash
npm run migrate
```

## 6. Test avec Postman/Thunder Client

Importer la collection:
- Fichier: `api-collection.json`
- Contient tous les endpoints pré-configurés

---

## 📚 Prochaines étapes

- Lire la [documentation complète](README.md)
- Explorer les [endpoints API](#)
- Configurer le [frontend](#)

---

## 🔑 Credentials par défaut

**⚠️ À changer en production !**

```
Username: admin
Password: admin123
Role: admin
```

Créer de nouveaux utilisateurs:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "editor",
    "email": "editor@hearst.app",
    "password": "password123",
    "role": "editor"
  }'
```

---

## 🛠️ Commandes utiles

```bash
# Développement avec auto-reload
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Migrer les données
npm run migrate

# Tests
npm test

# Linter
npm run lint
```

---

## 📁 Structure de base

```
api/
├── src/
│   ├── server.ts           # Point d'entrée
│   ├── routes/             # Endpoints API
│   ├── services/           # Logique métier
│   ├── middleware/         # Auth, erreurs, etc.
│   └── db/                 # Base de données
├── data/                   # SQLite DB (auto-créé)
├── uploads/                # Médias uploadés (auto-créé)
└── logs/                   # Logs (auto-créé)
```

---

## 🔗 URLs importantes

- API: http://localhost:5000/api
- Health: http://localhost:5000/api/health
- Uploads: http://localhost:5000/uploads

---

## ❓ Problèmes courants

### Port déjà utilisé

```bash
# Changer le port dans .env
PORT=5001
```

### Erreur de permissions

```bash
# Vérifier les permissions des dossiers
chmod -R 755 api/
```

### Base de données corrompue

```bash
# Supprimer et recréer
rm -rf data/
npm run dev  # Recrée automatiquement
npm run migrate  # Ré-importer les données
```

---

## 🎯 Test rapide complet

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.data.token')

# 2. Créer un projet
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "category": "Test",
    "description": "This is a test project",
    "status": "coming",
    "tech_stack": ["Node.js", "Express"],
    "location": "/test"
  }'

# 3. Lister les projets
curl http://localhost:5000/api/projects

# 4. Statistiques
curl http://localhost:5000/api/projects/statistics
```

---

✅ Vous êtes prêt à utiliser l'API !
