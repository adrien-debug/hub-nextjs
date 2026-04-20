#!/bin/bash

API_URL="http://localhost:4000/api"

echo "=========================================="
echo "🚀 INCUBATION WORKFLOW DEMO"
echo "=========================================="
echo ""

# 1. Créer une nouvelle startup
echo "1️⃣  Création startup 'AI Health Tech'..."
STARTUP=$(curl -s -X POST "$API_URL/incubation/startups" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Health Tech",
    "founders": ["Dr. Emma Wilson", "Alex Chen"],
    "category": "HealthTech",
    "problem": "Patient diagnosis takes too long",
    "solution": "AI-powered diagnostic assistant",
    "market_size": "$50B",
    "cohort": "2026-Q2",
    "pitch_deck_url": "https://example.com/deck.pdf"
  }')

STARTUP_ID=$(echo $STARTUP | jq -r '.data.id')
echo "✅ Startup créée : $STARTUP_ID"
echo ""

# 2. Vérifier phase actuelle
echo "2️⃣  Phase actuelle..."
curl -s "$API_URL/incubation/startups/$STARTUP_ID" | jq '{name: .data.name, current_phase: .data.current_phase_id, status: .data.status}'
echo ""

# 3. Compléter phase Application
echo "3️⃣  Complétion phase 1 (Application)..."
curl -s -X PATCH "$API_URL/incubation/startups/$STARTUP_ID/phases/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "All documents submitted",
    "actual_deliverables": ["pitch_deck", "team_profiles", "demo_video"]
  }' | jq '{phase: .data.phase_id, status: .data.status, completed_at: .data.completed_at}'
echo ""

# 4. Ajouter KPIs phase 1
echo "4️⃣  Ajout KPIs phase 1..."
curl -s -X POST "$API_URL/incubation/startups/$STARTUP_ID/kpis" \
  -H "Content-Type: application/json" \
  -d '{"phase_id": 1, "kpi_key": "completion_time", "kpi_value": 10}' > /dev/null
curl -s -X POST "$API_URL/incubation/startups/$STARTUP_ID/kpis" \
  -H "Content-Type: application/json" \
  -d '{"phase_id": 1, "kpi_key": "quality_score", "kpi_value": 92}' > /dev/null
echo "✅ 2 KPIs ajoutés"
echo ""

# 5. Vérifier progression
echo "5️⃣  Progression automatique vers phase 2..."
curl -s "$API_URL/incubation/startups/$STARTUP_ID" | jq '{current_phase: .data.current_phase_id}'
echo ""

# 6. Voir toutes les phases
echo "6️⃣  Statut de toutes les phases..."
curl -s "$API_URL/incubation/startups/$STARTUP_ID/phases" | jq '[.data[] | {phase: .phase_id, name: .phase_name, status: .status}] | .[0:5]'
echo ""

# 7. Statistiques
echo "7️⃣  Statistiques globales..."
curl -s "$API_URL/incubation/statistics" | jq '{total: .data.total_startups, active: .data.active_startups, cohorts: .data.cohort_stats}'
echo ""

echo "=========================================="
echo "✅ Demo terminé !"
echo "=========================================="
