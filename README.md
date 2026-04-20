# Hub - Frontend Next.js

Application Next.js frontend configurée pour tourner sur le port 6000 (via proxy).

## Configuration

- **Framework**: Next.js 15.1
- **TypeScript**: Oui
- **Styling**: Tailwind CSS
- **Icônes**: `lucide-react` (flèches Hero / projets) ; réseaux sociaux en SVG inline dans `Footer.tsx` (Lucide ne fournit plus les pictos de marques)
- **Thème**: fond clair institutionnel — `app/globals.css` définit `--background` blanc et `--foreground` slate ; l’ancien thème sombre global (body noir + texte blanc) cassait le contraste avec les sections `slate-*`
- **Port Local**: 6000 (proxy) → 3000 (Next.js)
- **Architecture**: Proxy Node.js contourne la restriction X11 du port 6000

## Commandes

```bash
# Installer les dépendances
npm install

# ⭐ Lancer en développement sur PORT 6000 (RÈGLE ABSOLUE)
npm run dev

# Lancer Next.js seul sur port 3000 (développement backend uniquement)
npm run dev:next

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
│   ├── page.tsx      # Page d'accueil (orchestration des sections)
│   └── globals.css   # Styles globaux
├── components/
│   ├── Hero.tsx      # Section Hero avec gradient animé
│   ├── About.tsx     # Section "Qui nous sommes"
│   ├── Methodology.tsx # Sections méthode d'incubation & maîtrise
│   ├── ProjectsLive.tsx # 5 projets LIVE (Onyx Pay, WeMine, NetPool, Agora, Bull21)
│   ├── ProjectsComing.tsx # 2 projets COMING (Thynk, Atlas)
│   └── Footer.tsx    # Footer avec liens et socials
├── public/
│   └── grid.svg      # Background pattern pour Hero
├── proxy-server.js   # Serveur proxy pour port 6000
├── package.json      # Dépendances
├── tsconfig.json     # Config TypeScript
├── tailwind.config.ts # Config Tailwind
└── next.config.ts    # Config Next.js
```

## Sections

1. **Hero** - Grande section d'accueil avec tagline et CTA
2. **About** - Explication de Hearst et statistiques clés
3. **Methodology** - Processus d'incubation et maîtrise opérationnelle
4. **Projects Live** - 5 projets opérationnels avec descriptions
5. **Projects Coming** - 2 projets en développement (pipeline)
6. **Footer** - Navigation, liens sociaux et légal

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
- `npm run dev` lance automatiquement sur PORT 6000
- Port 6000 via proxy Node.js (contourne restriction X11 de Next.js)
- TypeScript strict activé
- Tailwind CSS pour le styling
- App Router (Next.js 13+)
- Déploiement automatique sur Vercel
- HMR/WebSocket fonctionnel via proxy
