# 📄 Pages Projets Détaillées

Ce dossier contient les pages HTML détaillées pour chaque projet Hearst.

## 🎯 Pages Disponibles

### Live
- [x] `hub.html` - Hub (Frontend Marketing)
- [ ] `hearst-os.html` - Hearst OS (AI Platform)
- [ ] `hearst-ai.html` - Hearst AI (SaaS Desktop)
- [ ] `mind.html` - MIND (Marketing Site)
- [ ] `netpool.html` - Netpool (eSIM Infrastructure)

### Coming Soon
- [ ] `aigent.html` - Aigent Wallet
- [ ] `hashvault.html` - HashVault
- [ ] `objection.html` - Objection (Legal AI)
- [ ] `atlas.html` - Atlas (DeFi)
- [ ] `dropship.html` - Dropship Platform
- [ ] `orchestra.html` - Orchestra (DevTools)
- [ ] `victor.html` - Victor (AI Companion)

### Future
- [ ] `future-one.html` - Qatar National Digital Core

---

## 🛠 Template

Chaque page suit le même template avec:

1. **Header** - Lien retour vers l'inventaire
2. **Hero Section** - Badge statut, nom, catégorie, description
3. **Info Grid** - Port, framework, langage, styling
4. **Stack Technique** - Tags technologiques
5. **URLs & Déploiement** - Local, production, GitHub
6. **Sections spécifiques** - Features, commandes, architecture
7. **Footer** - (optionnel)

---

## 🎨 Design System

### Couleurs
```css
--bg-primary: #0a0a0f;
--bg-secondary: #13131a;
--bg-card: #1a1a24;
--text-primary: #ffffff;
--text-secondary: #a0a0b0;
--accent-cyan: #00d4ff;
--accent-blue: #4a90ff;
--success: #00ff88;
--warning: #ffaa00;
--border: #2a2a38;
```

### Badges de Statut
- **Live**: `rgba(0, 255, 136, 0.2)` + border `#00ff88`
- **Coming**: `rgba(255, 170, 0, 0.2)` + border `#ffaa00`
- **Future**: `rgba(74, 144, 255, 0.2)` + border `#4a90ff`

---

## 📝 Génération Automatique

Pour générer automatiquement toutes les pages à partir du JSON:

```javascript
// Script Node.js à créer
const inventory = require('../../project-inventory.json');

// Pour chaque projet, générer une page HTML
// en utilisant hub.html comme template
```

---

## 🔗 Liens

- [← Retour à l'inventaire principal](../project-hub.html)
- [📊 JSON Complet](../../project-inventory.json)
- [📋 Index Rapide](../../PROJECTS-INDEX.md)

---

**Note**: Les pages manquantes seront créées progressivement en utilisant `hub.html` comme référence.
