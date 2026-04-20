# Hub - Frontend Next.js

Application Next.js frontend configurée pour tourner sur le port 3000.

## Configuration

- **Framework**: Next.js 15.1
- **TypeScript**: Oui
- **Styling**: Tailwind CSS
- **Port**: 3000 (6000 est réservé par Next.js pour X11)

## Commandes

```bash
# Installer les dépendances
npm install

# Lancer en développement (port 3000)
npm run dev

# Build de production
npm run build

# Lancer en production (port 3000)
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
- **Dev**: http://localhost:3000
- **API Test**: http://localhost:3000/api

### Production
- **Vercel**: https://hub-nextjs-b2axjy5ur-adrien-nejkovics-projects.vercel.app
- **GitHub**: https://github.com/adrien-debug/hub-nextjs

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

- Port 3000 configuré dans `package.json` (scripts dev et start)
- TypeScript strict activé
- Tailwind CSS pour le styling
- App Router (Next.js 13+)
- Déploiement automatique sur Vercel
