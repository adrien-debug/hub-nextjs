#!/bin/bash

echo "🧪 Test API Hub Next.js"
echo "======================="
echo ""

API_URL="http://localhost:3000/api"
TOKEN=""

echo "1️⃣  Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "$LOGIN_RESPONSE" | python3 -m json.tool

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Login échoué"
  exit 1
fi

echo "✅ Token obtenu: ${TOKEN:0:20}..."
echo ""

echo "2️⃣  Statistiques..."
curl -s "$API_URL/projects/statistics" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo "3️⃣  Liste des projets..."
curl -s "$API_URL/projects?published=true" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps(data, indent=2))
if data.get('success'):
    print(f\"\n✅ {len(data['data'])} projets trouvés\")
"
echo ""

echo "4️⃣  Création d'un projet test..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test API Project",
    "status": "coming",
    "category": "Test",
    "description": "Projet de test créé via API",
    "tech_stack": ["Next.js", "TypeScript"],
    "location": "/test",
    "published": false,
    "order_index": 0,
    "urls": {},
    "screenshots": []
  }')

echo "$CREATE_RESPONSE" | python3 -m json.tool

PROJECT_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Création échouée"
  exit 1
fi

echo "✅ Projet créé: $PROJECT_ID"
echo ""

echo "5️⃣  Publication du projet..."
curl -s -X POST "$API_URL/projects/$PROJECT_ID/publish" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo "6️⃣  Dépublication du projet..."
curl -s -X POST "$API_URL/projects/$PROJECT_ID/unpublish" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo "7️⃣  Suppression du projet..."
curl -s -X DELETE "$API_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo "✅ Tests terminés avec succès!"
