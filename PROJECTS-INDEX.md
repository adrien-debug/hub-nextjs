# 🚀 Hearst Projects Index

**Mise à jour**: 21 avril 2026  
**Total**: 15 projets (5 Live | 7 Coming Soon | 1 Future)

---

## 🎯 Accès Rapide

```bash
# Ouvrir l'inventaire web interactif
open public/project-hub.html

# Lancer un projet avec le script
./open-project.sh [nom-du-projet]
./open-project.sh inventory    # Ouvrir l'inventaire web

# Voir l'aide complète
./open-project.sh
```

---

## 🟢 Projets LIVE

### 1. Hub (Frontend Marketing)
- **Port**: 6000
- **Local**: http://localhost:6000
- **Prod**: https://hub-nextjs-b2axjy5ur-adrien-nejkovics-projects.vercel.app
- **Tech**: Next.js 15.1, React 19, Tailwind CSS
- **Commandes**: `npm run dev` (port 6000 via proxy)
- **Chemin**: `/Hub`

### 2. Hearst OS (AI Platform)
- **Port**: 9000
- **Local**: http://localhost:9000
- **Prod**: https://hearst-agents-production.up.railway.app
- **Tech**: Next.js 16, Supabase, OpenAI, Anthropic
- **Features**: Orchestration v2, Missions, Artifacts, 200 tests
- **Chemin**: `/hearst-os`

### 3. Hearst AI (SaaS Desktop)
- **Ports**: Frontend 3000 | Backend 3848 | MCP 3850 | WS 3851
- **Local Frontend**: http://localhost:3000
- **Local Backend**: http://localhost:3848
- **Prod**: https://hearst.app (API: https://api.hearst.app)
- **Tech**: Next.js 16, Express 5, Electron, Supabase, Redis
- **Modules**: Home, Inbox, Calendar, Files, Tasks, Apps
- **Chemin**: `/Hearst app`

### 4. MIND (Marketing Site)
- **Port**: 8001
- **Local**: http://localhost:8001
- **Prod**: https://mind.vercel.app
- **GitHub**: https://github.com/adrien-debug/mind
- **Tech**: Next.js, React, TypeScript
- **Chemin**: `/Live Projects/Mind`

### 5. Netpool (eSIM Infrastructure)
- **Prod**: Vercel + Railway
- **Tech**: Next.js 16, PostgreSQL 16, Redis, Stripe, Polygon
- **Features**: 221 tests, i18n FR/EN, Blockchain, Dual eSIM provider
- **Score**: Production-ready
- **Chemin**: `/Live Projects/netpool`

---

## 🟡 Projets COMING SOON

### 6. Aigent Wallet (Crypto Demo)
- **Port**: 9000
- **Tech**: Next.js 14, Vitest, Playwright
- **Pages**: Marketing + Dashboard
- **Chemin**: `/Projects/Aigent-wallet`

### 7. HashVault (Fintech Vaults)
- **Tech**: Next.js 16, React 19, Tailwind v4
- **Features**: Client space + Admin, Mock DB
- **Pages**: /, /vaults, /invest, /admin
- **Chemin**: `/Projects/HashVault `

### 8. Objection (Legal AI)
- **Port**: 3500
- **Local**: http://localhost:3500
- **Prod Frontend**: https://objection-adrien-nejkovics-projects.vercel.app
- **Prod Backend**: https://hearst-lawyer-ai-production.up.railway.app
- **GitHub**: https://github.com/adrien-debug/lawyer-ai
- **Tech**: Node.js, TypeScript, Anthropic AI
- **Features**: Mémorandum, Analyse juridique, Recherche jurisprudentielle
- **Chemin**: `/Projects/Objection`

### 9. Atlas (DeFi Trading)
- **GitHub**: https://github.com/adrienbeyondcrypto/atlas
- **Tech**: Node.js, TypeScript, AI Agents, Multi-chain
- **Features**: 6 AI agents, Smart routing, DCA/TWAP/limit strategies
- **Agents**: Router, Risk, Liquidity, Market, Strategy, Execution
- **Chemin**: `/Projects/atlas`

### 10. Dropship Platform (E-commerce)
- **Tech**: Next.js, Turborepo, Stripe, Medusa
- **Score**: Opérationnel 9.5/10 | Code 9.0/10
- **Features**: Multi-site, Checkout sécurisé, OpenClaw AI, CI Vitest+Playwright
- **Chemin**: `/Projects/dropship-platform`

### 11. Orchestra (DevTools)
- **Tech**: Electron, React, TypeScript, AI (OpenAI, Anthropic, Ollama)
- **Features**: Live monitoring, 5 AI agents, Global launcher
- **Agents**: Advisor, Preventive, Auto-Fix, Performance, Onboarding
- **Platforms**: macOS, Windows, Linux
- **Chemin**: `/Projects/orchestra`

### 12. Victor (AI Companion)
- **Port**: 3310
- **Local**: http://localhost:3310
- **Tech**: Next.js 16.2.3, React 19.2.4, Tailwind CSS 4
- **Tagline**: "Companion Intelligence. A living extension of your intent."
- **Chemin**: `/Projects/victor-next`

---

## 🔵 Projets FUTURE

### 13. Future One (Qatar Data Center)
- **Nom complet**: Qatar National Digital Core
- **Entité**: HEARST AI
- **JV Local**: Earth Qatar (HEARST AI + Al Thani)
- **Pays**: 🇶🇦 Qatar
- **Site**: Umm Alhoul Free Zone (QFZA)
- **Capacité**: 1 GW IT (5 phases × 200 MW)
- **CAPEX**: ~7.7 Bn USD (range 5.4–10.0 Bn)
- **Timeline**: 60 mois | Premier revenu à M24
- **Designer**: Lord Norman Foster
- **Construction**: Pastor Construction (Monaco)
- **Chemin**: `/Qatar/Future One`

---

## 📊 Statistiques

### Par Statut
| Statut | Nombre |
|--------|--------|
| Live | 5 |
| Coming Soon | 7 |
| Future | 1 |
| **TOTAL** | **15** |

### Par Technologie
| Tech | Projets |
|------|---------|
| Next.js | 11 |
| TypeScript | 11 |
| React | 9 |
| AI/LLM | 6 |
| Supabase | 3 |
| PostgreSQL | 2 |
| Redis | 2 |
| Stripe | 2 |
| Blockchain | 2 |
| Electron | 2 |

### Par Catégorie
- Frontend / Marketing: 1
- AI Platform / Agent System: 1
- SaaS Dashboard / AI Desktop: 1
- Marketing Site: 1
- eSIM Infrastructure / Fintech: 1
- Crypto Wallet / Demo: 1
- Fintech / Yield Vaults: 1
- Legal AI / Agent: 1
- DeFi / Trading Platform: 1
- E-commerce / Dropshipping: 1
- DevTools / Orchestrator: 1
- AI Companion: 1
- Infrastructure / Data Center: 1

---

## 📂 Fichiers d'Inventaire

| Fichier | Description |
|---------|-------------|
| `project-inventory.json` | Base de données JSON complète (12 KB) |
| `projects-quick-reference.json` | Référence rapide compacte (2 KB) |
| `public/project-hub.html` | Interface web interactive (26 KB) |
| `public/projects/hub.html` | Page détaillée exemple (15 KB) |
| `PROJECT-INVENTORY-SUMMARY.md` | Résumé détaillé de la mission (7 KB) |
| `PROJECTS-INDEX.md` | Ce fichier - index rapide |
| `open-project.sh` | Script de lancement rapide |

---

## 🛠 Commandes Utiles

```bash
# Ouvrir l'inventaire web
open public/project-hub.html

# Lancer Hub (port 6000)
cd /Users/adrienbeyondcrypto/Desktop/cursor-dev/_active/Hub
npm run dev

# Lancer Hearst OS (port 9000)
cd /Users/adrienbeyondcrypto/Desktop/cursor-dev/_active/hearst-os
npm run dev

# Lancer Hearst AI (backend + frontend)
cd /Users/adrienbeyondcrypto/Desktop/cursor-dev/_active/Hearst\ app
HEARST_NO_CLUSTER=1 npm run dev -w @openclaw/backend   # port 3848
npm run dev -w @openclaw/frontend                       # port 3000

# Script de lancement rapide
./open-project.sh hub
./open-project.sh hearst-os
./open-project.sh inventory
```

---

## 🔗 URLs de Production Actives

### Live
- **Hub**: https://hub-nextjs-b2axjy5ur-adrien-nejkovics-projects.vercel.app
- **Hearst OS**: https://hearst-agents-production.up.railway.app
- **Hearst AI**: https://hearst.app | API: https://api.hearst.app
- **MIND**: https://mind.vercel.app
- **Netpool**: Live on Vercel + Railway

### Coming Soon (Déjà déployés)
- **Objection**: 
  - Frontend: https://objection-adrien-nejkovics-projects.vercel.app
  - Backend: https://hearst-lawyer-ai-production.up.railway.app

---

## 📝 Notes

### Ports Utilisés
- **6000**: Hub (via proxy)
- **9000**: Hearst OS, Aigent Wallet
- **3000**: Hearst AI Frontend
- **3848**: Hearst AI Backend
- **3850**: Hearst AI MCP Server
- **3851**: Hearst AI WebSocket
- **8001**: MIND
- **3500**: Objection
- **3310**: Victor

### Logos Identifiés
- Hub: `/public/grid.svg`
- Hearst AI: `/packages/frontend/public/logo.svg`
- Netpool: `/morpho-style/*/logo.svg`

**Note**: Plusieurs projets n'ont pas encore de logo. À compléter.

---

## ✅ Checklist Complétée

- [x] Analyse de tous les dossiers projets
- [x] Classification par statut
- [x] Extraction des informations techniques
- [x] Base de données JSON complète
- [x] Interface web élégante
- [x] Pages détaillées (exemple Hub)
- [x] Script de lancement rapide
- [x] Documentation complète
- [x] README mis à jour

---

**Chef du Hub**: Adrien Nejkovic  
**Date**: 21 avril 2026  
**Contexte conservé**: Oui (inventaire dans `/Hub`)
