#!/bin/bash

# Script de validation de l'inventaire des projets Hearst
# Vérifie que tous les fichiers nécessaires sont présents et valides

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Validation de l'Inventaire des Projets Hearst     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Fonction de validation
check_file() {
    local file=$1
    local name=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} ${name}"
        return 0
    else
        echo -e "${RED}✗${NC} ${name} - MANQUANT"
        ((ERRORS++))
        return 1
    fi
}

check_dir() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} ${name}"
        return 0
    else
        echo -e "${RED}✗${NC} ${name} - MANQUANT"
        ((ERRORS++))
        return 1
    fi
}

# Validation des fichiers JSON
echo -e "${CYAN}📂 Fichiers JSON${NC}"
check_file "project-inventory.json" "Base de données complète"
check_file "projects-quick-reference.json" "Référence rapide"

# Validation JSON
if command -v jq &> /dev/null; then
    if [ -f "project-inventory.json" ]; then
        if jq empty project-inventory.json 2>/dev/null; then
            echo -e "${GREEN}✓${NC} JSON valide (project-inventory.json)"
        else
            echo -e "${RED}✗${NC} JSON invalide (project-inventory.json)"
            ((ERRORS++))
        fi
    fi
else
    echo -e "${YELLOW}⚠${NC} jq non installé - validation JSON sautée"
    ((WARNINGS++))
fi

echo ""

# Validation des fichiers HTML
echo -e "${CYAN}🌐 Fichiers HTML${NC}"
check_file "public/project-hub.html" "Hub principal"
check_file "public/projects/hub.html" "Page détaillée Hub"
check_dir "public/projects" "Dossier pages projets"

echo ""

# Validation de la documentation
echo -e "${CYAN}📚 Documentation${NC}"
check_file "README.md" "README principal"
check_file "PROJECT-INVENTORY-SUMMARY.md" "Résumé de la mission"
check_file "PROJECTS-INDEX.md" "Index rapide"
check_file "public/projects/README.md" "README pages projets"

echo ""

# Validation des scripts
echo -e "${CYAN}🛠️  Scripts${NC}"
check_file "open-project.sh" "Script de lancement"

if [ -f "open-project.sh" ]; then
    if [ -x "open-project.sh" ]; then
        echo -e "${GREEN}✓${NC} Script exécutable"
    else
        echo -e "${YELLOW}⚠${NC} Script non exécutable (chmod +x open-project.sh)"
        ((WARNINGS++))
    fi
fi

echo ""

# Statistiques des projets
echo -e "${CYAN}📊 Statistiques${NC}"

if [ -f "project-inventory.json" ]; then
    if command -v jq &> /dev/null; then
        TOTAL=$(jq '.metadata.total_projects' project-inventory.json)
        LIVE=$(jq '.statistics.by_status.live' project-inventory.json)
        COMING=$(jq '.statistics.by_status.coming' project-inventory.json)
        FUTURE=$(jq '.statistics.by_status.future' project-inventory.json)
        
        echo -e "${GREEN}✓${NC} Total de projets: ${CYAN}${TOTAL}${NC}"
        echo -e "${GREEN}✓${NC} Live: ${CYAN}${LIVE}${NC}"
        echo -e "${GREEN}✓${NC} Coming Soon: ${CYAN}${COMING}${NC}"
        echo -e "${GREEN}✓${NC} Future: ${CYAN}${FUTURE}${NC}"
    fi
fi

echo ""

# Vérification des tailles de fichiers
echo -e "${CYAN}💾 Tailles des fichiers${NC}"

if [ -f "project-inventory.json" ]; then
    SIZE=$(wc -c < project-inventory.json | tr -d ' ')
    if [ $SIZE -gt 1000 ]; then
        echo -e "${GREEN}✓${NC} project-inventory.json: $(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo "${SIZE} bytes")"
    else
        echo -e "${YELLOW}⚠${NC} project-inventory.json trop petit: ${SIZE} bytes"
        ((WARNINGS++))
    fi
fi

if [ -f "public/project-hub.html" ]; then
    SIZE=$(wc -c < public/project-hub.html | tr -d ' ')
    if [ $SIZE -gt 10000 ]; then
        echo -e "${GREEN}✓${NC} project-hub.html: $(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo "${SIZE} bytes")"
    else
        echo -e "${YELLOW}⚠${NC} project-hub.html trop petit: ${SIZE} bytes"
        ((WARNINGS++))
    fi
fi

echo ""

# Résumé
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                       RÉSUMÉ                           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
    echo ""
    echo -e "${CYAN}Prochaines étapes:${NC}"
    echo "  1. Ouvrir l'inventaire: open public/project-hub.html"
    echo "  2. Lancer un projet: ./open-project.sh [nom]"
    echo "  3. Voir l'index: cat PROJECTS-INDEX.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  ${WARNINGS} avertissement(s)${NC}"
    echo ""
    echo "L'inventaire est fonctionnel mais pourrait être amélioré."
    exit 0
else
    echo -e "${RED}❌ ${ERRORS} erreur(s) détectée(s)${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  ${WARNINGS} avertissement(s)${NC}"
    fi
    echo ""
    echo "Certains fichiers sont manquants. Veuillez les créer."
    exit 1
fi
