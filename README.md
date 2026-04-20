# Hub - Frontend Next.js

Application Next.js frontend configurée pour tourner sur le port 6000 (via proxy).

## Configuration

- **Framework**: Next.js 15.1
- **TypeScript**: Oui
- **Styling**: Tailwind CSS
- **Port Local**: 6000 (proxy) → 3000 (Next.js)
- **Architecture**: Proxy Node.js contourne la restriction X11 du port 6000

## Commandes

```bash
# Installer les dépendances
npm install

# Lancer en développement sur PORT 6000 (recommandé)
npm run dev:6000

# Lancer Next.js seul sur port 3000
npm run dev

# Lancer uniquement le proxy sur port 6000
npm run proxy

# Build de production
npm run build

# Lancer en production
npm start

# Linter
npm run lint
```

## Structure

```
Hub/
├── app/
│   ├── api/          # API Routes
│   ├── layout.tsx    # Layout principal
│   ├── page.tsx      # Page d'accueil
│   └── globals.css   # Styles globaux
├── public/           # Fichiers statiques
├── package.json      # Dépendances
├── tsconfig.json     # Config TypeScript
├── tailwind.config.ts # Config Tailwind
└── next.config.ts    # Config Next.js
```

## URL

### Local
- **Dev (Port 6000)**: http://localhost:6000 ⭐ **RÈGLE ABSOLUE**
- **API Test**: http://localhost:6000/api
- **Next.js Direct**: http://localhost:3000 (backend)

### Production
- **Vercel**: https://hub-nextjs-b2axjy5ur-adrien-nejkovics-projects.vercel.app
- **GitHub**: https://github.com/adrien-debug/hub-nextjs

## Architecture

### Proxy sur Port 6000
Le port 6000 est réservé par Next.js pour X11. Pour respecter la règle absolue du port 6000, un proxy Node.js a été mis en place:

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│  Browser    │─────▶│  Proxy 6000  │─────▶│ Next.js    │
│ :6000       │      │ proxy-server │      │ :3000      │
└─────────────┘      └──────────────┘      └────────────┘
```

Le fichier `proxy-server.js` écoute sur le port 6000 et redirige toutes les requêtes vers Next.js sur le port 3000, incluant WebSocket pour le HMR (Hot Module Reload).

## Déploiement

### GitHub
```bash
git add .
git commit -m "votre message"
git push
```

### Vercel
Le projet est connecté à Vercel. Chaque push sur `main` déclenche un déploiement automatique.

Pour redéployer manuellement:
```bash
vercel --prod
```

## Règles

- **PORT 6000 EN LOCAL - RÈGLE ABSOLUE** ⭐
- Port 6000 via proxy (`npm run dev:6000`)
- TypeScript strict activé
- Tailwind CSS pour le styling
- App Router (Next.js 13+)
- Déploiement automatique sur Vercel
- HMR/WebSocket fonctionnel via proxy
