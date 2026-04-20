#!/bin/bash

# Script de test automatique complet pour l'API Hearst Projects
# Usage: ./test-api.sh

set -e

API_URL="http://localhost:5001/api"
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         Test Automatique API Hearst Projects          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Health Check
echo -e "${CYAN}1️⃣  Health Check${NC}"
HEALTH=$(curl -s ${API_URL}/health)
if echo "$HEALTH" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓${NC} API est en ligne"
else
  echo -e "${RED}✗${NC} API ne répond pas"
  exit 1
fi

# 2. Login
echo -e "\n${CYAN}2️⃣  Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST ${API_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓${NC} Login réussi"
  echo "  Token: ${TOKEN:0:30}..."
else
  echo -e "${RED}✗${NC} Échec du login"
  exit 1
fi

# 3. Créer un projet
echo -e "\n${CYAN}3️⃣  Créer un projet${NC}"
CREATE_RESPONSE=$(curl -s -X POST ${API_URL}/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Auto",
    "category": "Test",
    "description": "Projet créé automatiquement pour les tests",
    "status": "coming",
    "tech_stack": ["Test"],
    "location": "/test",
    "published": false
  }')

PROJECT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
if [ "$PROJECT_ID" != "null" ] && [ -n "$PROJECT_ID" ]; then
  echo -e "${GREEN}✓${NC} Projet créé: $PROJECT_ID"
else
  echo -e "${RED}✗${NC} Échec création projet"
  exit 1
fi

# 4. Publier le projet
echo -e "\n${CYAN}4️⃣  Publier le projet${NC}"
PUBLISH_RESPONSE=$(curl -s -X POST ${API_URL}/projects/${PROJECT_ID}/publish \
  -H "Authorization: Bearer $TOKEN")

if echo "$PUBLISH_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓${NC} Projet publié"
else
  echo -e "${RED}✗${NC} Échec publication"
  exit 1
fi

# 5. Vérifier la publication
echo -e "\n${CYAN}5️⃣  Vérifier publication${NC}"
PROJECT=$(curl -s ${API_URL}/projects/${PROJECT_ID})
PUBLISHED=$(echo "$PROJECT" | jq -r '.data.published')
if [ "$PUBLISHED" = "true" ]; then
  echo -e "${GREEN}✓${NC} Projet est bien publié"
else
  echo -e "${RED}✗${NC} Projet n'est pas publié"
  exit 1
fi

# 6. Modifier le projet
echo -e "\n${CYAN}6️⃣  Modifier le projet${NC}"
UPDATE_RESPONSE=$(curl -s -X PATCH ${API_URL}/projects/${PROJECT_ID} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Auto MODIFIÉ"}')

if echo "$UPDATE_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓${NC} Projet modifié"
  NEW_NAME=$(echo "$UPDATE_RESPONSE" | jq -r '.data.name')
  echo "  Nouveau nom: $NEW_NAME"
else
  echo -e "${RED}✗${NC} Échec modification"
  exit 1
fi

# 7. Dépublier le projet
echo -e "\n${CYAN}7️⃣  Dépublier le projet${NC}"
UNPUBLISH_RESPONSE=$(curl -s -X POST ${API_URL}/projects/${PROJECT_ID}/unpublish \
  -H "Authorization: Bearer $TOKEN")

if echo "$UNPUBLISH_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓${NC} Projet dépublié"
else
  echo -e "${RED}✗${NC} Échec dépublication"
  exit 1
fi

# 8. Archiver le projet
echo -e "\n${CYAN}8️⃣  Archiver le projet${NC}"
ARCHIVE_RESPONSE=$(curl -s -X POST ${API_URL}/projects/${PROJECT_ID}/archive \
  -H "Authorization: Bearer $TOKEN")

if echo "$ARCHIVE_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓${NC} Projet archivé"
  STATUS=$(echo "$ARCHIVE_RESPONSE" | jq -r '.data.status')
  echo "  Status: $STATUS"
else
  echo -e "${RED}✗${NC} Échec archivage"
  exit 1
fi

# 9. Supprimer le projet
echo -e "\n${CYAN}9️⃣  Supprimer le projet${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE ${API_URL}/projects/${PROJECT_ID} \
  -H "Authorization: Bearer $TOKEN")

if echo "$DELETE_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓${NC} Projet supprimé"
else
  echo -e "${RED}✗${NC} Échec suppression"
  exit 1
fi

# 10. Statistiques
echo -e "\n${CYAN}🔟 Statistiques${NC}"
STATS=$(curl -s ${API_URL}/projects/statistics)
TOTAL=$(echo "$STATS" | jq -r '.data.total')
PUBLISHED=$(echo "$STATS" | jq -r '.data.published')
echo -e "${GREEN}✓${NC} Total projets: $TOTAL"
echo -e "${GREEN}✓${NC} Projets publiés: $PUBLISHED"

echo -e "\n${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                  ✅ TOUS LES TESTS PASSENT             ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "✅ Créer projet"
echo -e "✅ Publier projet"
echo -e "✅ Dépublier projet"
echo -e "✅ Modifier projet"
echo -e "✅ Archiver projet"
echo -e "✅ Supprimer projet"
echo ""
echo -e "${GREEN}API Backend 100% fonctionnelle !${NC}"
