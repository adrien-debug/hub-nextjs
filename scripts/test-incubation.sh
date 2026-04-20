#!/bin/bash

API_URL="http://localhost:4000/api"

echo "=========================================="
echo "Testing Incubation API"
echo "=========================================="
echo ""

# Test 1: Get all phases
echo "1. GET /api/incubation/phases"
curl -s -X GET "$API_URL/incubation/phases" | jq '.'
echo ""

# Test 2: Get phase by ID
echo "2. GET /api/incubation/phases/1"
curl -s -X GET "$API_URL/incubation/phases/1" | jq '.'
echo ""

# Test 3: Create a startup
echo "3. POST /api/incubation/startups"
STARTUP_ID=$(curl -s -X POST "$API_URL/incubation/startups" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SuperStartup",
    "founders": ["John Doe", "Jane Smith"],
    "category": "SaaS",
    "problem": "Businesses struggle with X",
    "solution": "We provide Y",
    "cohort": "2026-Q2",
    "pitch_deck_url": "https://example.com/deck.pdf"
  }' | jq -r '.data.id')
echo "Created startup with ID: $STARTUP_ID"
echo ""

# Test 4: Get all startups
echo "4. GET /api/incubation/startups"
curl -s -X GET "$API_URL/incubation/startups" | jq '.'
echo ""

# Test 5: Get startup by ID
echo "5. GET /api/incubation/startups/$STARTUP_ID"
curl -s -X GET "$API_URL/incubation/startups/$STARTUP_ID" | jq '.'
echo ""

# Test 6: Get startup phases
echo "6. GET /api/incubation/startups/$STARTUP_ID/phases"
curl -s -X GET "$API_URL/incubation/startups/$STARTUP_ID/phases" | jq '.'
echo ""

# Test 7: Update phase status
echo "7. PATCH /api/incubation/startups/$STARTUP_ID/phases/1"
curl -s -X PATCH "$API_URL/incubation/startups/$STARTUP_ID/phases/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Application completed successfully",
    "actual_deliverables": ["pitch_deck", "founder_profiles", "demo_link"]
  }' | jq '.'
echo ""

# Test 8: Add KPI
echo "8. POST /api/incubation/startups/$STARTUP_ID/kpis"
curl -s -X POST "$API_URL/incubation/startups/$STARTUP_ID/kpis" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": 1,
    "kpi_key": "completion_time",
    "kpi_value": "12",
    "week_number": 1
  }' | jq '.'
echo ""

# Test 9: Get startup KPIs
echo "9. GET /api/incubation/startups/$STARTUP_ID/kpis"
curl -s -X GET "$API_URL/incubation/startups/$STARTUP_ID/kpis" | jq '.'
echo ""

# Test 10: Update startup
echo "10. PATCH /api/incubation/startups/$STARTUP_ID"
curl -s -X PATCH "$API_URL/incubation/startups/$STARTUP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "overall_score": 85,
    "current_phase_id": 2
  }' | jq '.'
echo ""

# Test 11: Get statistics
echo "11. GET /api/incubation/statistics"
curl -s -X GET "$API_URL/incubation/statistics" | jq '.'
echo ""

# Test 12: Filter startups
echo "12. GET /api/incubation/startups?status=active"
curl -s -X GET "$API_URL/incubation/startups?status=active" | jq '.'
echo ""

echo "=========================================="
echo "All tests completed!"
echo "=========================================="
