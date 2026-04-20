#!/bin/bash

# Script pour ouvrir rapidement les projets Hearst
# Usage: ./open-project.sh [project-name]

PROJECT_ROOT="/Users/adrienbeyondcrypto/Desktop/cursor-dev/_active"

# Couleurs
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher l'aide
show_help() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║          Hearst Projects - Quick Launcher             ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Usage:${NC} ./open-project.sh [project-name]"
    echo ""
    echo -e "${GREEN}Projets LIVE:${NC}"
    echo "  hub           - Hub (port 6000)"
    echo "  hearst-os     - Hearst OS (port 9000)"
    echo "  hearst-app    - Hearst AI (ports 3000/3848)"
    echo "  mind          - MIND (port 8001)"
    echo "  netpool       - Netpool"
    echo ""
    echo -e "${YELLOW}Projets COMING SOON:${NC}"
    echo "  aigent        - Aigent Wallet"
    echo "  hashvault     - HashVault"
    echo "  objection     - Objection (Legal AI)"
    echo "  atlas         - Atlas (DeFi)"
    echo "  dropship      - Dropship Platform"
    echo "  orchestra     - Orchestra"
    echo "  victor        - Victor (AI Companion)"
    echo ""
    echo -e "${CYAN}Projets FUTURE:${NC}"
    echo "  future-one    - Qatar National Digital Core"
    echo ""
    echo -e "${GREEN}Exemples:${NC}"
    echo "  ./open-project.sh hub"
    echo "  ./open-project.sh hearst-os"
    echo ""
    echo -e "${GREEN}Ouvrir l'inventaire web:${NC}"
    echo "  ./open-project.sh inventory"
    echo ""
}

# Fonction pour ouvrir un projet
open_project() {
    local project_name=$1
    local project_path=""
    
    case $project_name in
        hub)
            project_path="$PROJECT_ROOT/Hub"
            ;;
        hearst-os)
            project_path="$PROJECT_ROOT/hearst-os"
            ;;
        hearst-app)
            project_path="$PROJECT_ROOT/Hearst app"
            ;;
        mind)
            project_path="$PROJECT_ROOT/Live Projects/Mind"
            ;;
        netpool)
            project_path="$PROJECT_ROOT/Live Projects/netpool"
            ;;
        aigent)
            project_path="$PROJECT_ROOT/Projects/Aigent-wallet"
            ;;
        hashvault)
            project_path="$PROJECT_ROOT/Projects/HashVault "
            ;;
        objection)
            project_path="$PROJECT_ROOT/Projects/Objection"
            ;;
        atlas)
            project_path="$PROJECT_ROOT/Projects/atlas"
            ;;
        dropship)
            project_path="$PROJECT_ROOT/Projects/dropship-platform"
            ;;
        orchestra)
            project_path="$PROJECT_ROOT/Projects/orchestra"
            ;;
        victor)
            project_path="$PROJECT_ROOT/Projects/victor-next"
            ;;
        future-one)
            project_path="$PROJECT_ROOT/Qatar/Future One"
            ;;
        inventory)
            echo -e "${GREEN}✓${NC} Ouverture de l'inventaire web..."
            open "$PROJECT_ROOT/Hub/public/project-hub.html"
            exit 0
            ;;
        *)
            echo -e "${RED}✗${NC} Projet inconnu: ${project_name}"
            echo ""
            show_help
            exit 1
            ;;
    esac
    
    # Vérifier si le projet existe
    if [ ! -d "$project_path" ]; then
        echo -e "${RED}✗${NC} Le projet n'existe pas: ${project_path}"
        exit 1
    fi
    
    echo -e "${GREEN}✓${NC} Ouverture du projet: ${CYAN}${project_name}${NC}"
    echo -e "  Chemin: ${project_path}"
    
    # Ouvrir dans Cursor
    if command -v cursor &> /dev/null; then
        echo -e "${GREEN}✓${NC} Ouverture dans Cursor..."
        cursor "$project_path"
    else
        echo -e "${YELLOW}⚠${NC} Cursor non trouvé, ouverture dans Finder..."
        open "$project_path"
    fi
}

# Main
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

open_project "$1"
