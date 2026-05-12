#!/bin/bash
set -euo pipefail

echo "=== FIN 317 Local Environment Check ==="
echo ""

PASS=0
FAIL=0
WARN=0

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

warn_check() {
  local label="$1"
  if eval "$2" &>/dev/null; then
    echo "  PASS  $label"
    PASS=$((PASS + 1))
  else
    echo "  WARN  $label (optional)"
    WARN=$((WARN + 1))
  fi
}

echo "--- Directory ---"
check "Current directory has package.json" "[ -f package.json ]"

echo ""
echo "--- Docker ---"
# Docker check with 3-second timeout to avoid hanging
if command -v timeout &>/dev/null; then
  timeout 3 docker info &>/dev/null && echo "  PASS  Docker daemon is running" && PASS=$((PASS + 1)) || echo "  WARN  Docker daemon not responding (needed for local Supabase)"
elif command -v perl &>/dev/null; then
  perl -e 'alarm 3; exec @ARGV' -- docker info &>/dev/null && echo "  PASS  Docker daemon is running" && PASS=$((PASS + 1)) || echo "  WARN  Docker daemon not responding (needed for local Supabase)"
else
  echo "  WARN  Docker check skipped (no timeout tool available)"
fi
WARN=$((WARN + 1))
echo "  INFO  Hosted Supabase mode does not require Docker"

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
HAS_ENV=0
if [ -f .env.local ]; then
  echo "  PASS  .env.local exists"
  PASS=$((PASS + 1))
  HAS_ENV=1
  if grep -q 'NEXT_PUBLIC_SUPABASE_URL=..' .env.local; then
    echo "  PASS  .env.local has NEXT_PUBLIC_SUPABASE_URL"
    PASS=$((PASS + 1))
    HAS_ENV=1
  else
    echo "  FAIL  .env.local missing NEXT_PUBLIC_SUPABASE_URL"
    FAIL=$((FAIL + 1))
  fi
  if grep -q 'NEXT_PUBLIC_SUPABASE_ANON_KEY=..' .env.local; then
    echo "  PASS  .env.local has NEXT_PUBLIC_SUPABASE_ANON_KEY"
    PASS=$((PASS + 1))
    HAS_ENV=1
  else
    echo "  FAIL  .env.local missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
    FAIL=$((FAIL + 1))
  fi
else
  echo "  WARN  .env.local not found (app runs in fallback mode)"
  WARN=$((WARN + 1))
fi

if [ "$HAS_ENV" -eq 1 ]; then
  echo "  INFO  App will connect to Supabase (hosted or local)"
else
  echo "  INFO  App will run in fallback mode (local JSON + mock data)"
fi

echo ""
echo "--- installed deps ---"
check "node_modules/ exists" "[ -d node_modules ]"

echo ""
echo "=== Result: $PASS passed, $FAIL failed, $WARN warnings ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
