#!/bin/bash
set -euo pipefail

echo "=== FIN 317 Local Environment Check ==="
echo ""

PASS=0
FAIL=0

check() {
  local label="$1"
  if eval "$2" &>/dev/null; then
    echo "  PASS  $label"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $label"
    FAIL=$((FAIL + 1))
  fi
}

echo "--- Directory ---"
check "Current directory has package.json" "[ -f package.json ]"

echo ""
echo "--- Docker ---"
check "Docker daemon is running" "docker info"

echo ""
echo "--- Node / pnpm ---"
check "Node.js is installed" "node -v"
check "pnpm is installed" "pnpm -v"

echo ""
echo "--- Supabase ---"
check "supabase/ directory exists" "[ -d supabase ]"
check "supabase/config.toml exists" "[ -f supabase/config.toml ]"
check "supabase/migrations/ directory exists" "[ -d supabase/migrations ]"
check "supabase/seed.sql exists" "[ -f supabase/seed.sql ]"

echo ""
echo "--- Environment ---"
check ".env.local exists" "[ -f .env.local ]"
if [ -f .env.local ]; then
  check ".env.local has NEXT_PUBLIC_SUPABASE_URL" "grep -q 'NEXT_PUBLIC_SUPABASE_URL=' .env.local"
  check ".env.local has NEXT_PUBLIC_SUPABASE_ANON_KEY" "grep -q 'NEXT_PUBLIC_SUPABASE_ANON_KEY=' .env.local"
fi

echo ""
echo "--- installed deps ---"
check "node_modules/ exists" "[ -d node_modules ]"

echo ""
echo "=== Result: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
