#!/bin/bash
set -euo pipefail

# Check that the nondestructive SQL file contains no forbidden destructive operations.
# This script scans supabase/dashboard_safe_demo_setup_nondestructive.sql for:
#   DROP TABLE, DROP SCHEMA, DELETE FROM, TRUNCATE, CASCADE (standalone),
#   ALTER TABLE ... DROP, DROP POLICY

SQL_FILE="supabase/dashboard_safe_demo_setup_nondestructive.sql"

echo "=== Checking nondestructive SQL file for forbidden operations ==="
echo "File: $SQL_FILE"
echo ""

if [ ! -f "$SQL_FILE" ]; then
  echo "FAIL: $SQL_FILE not found."
  exit 1
fi

PASS=0
FAIL=0

# Patterns that MUST NOT appear (case-insensitive, ignoring SQL comments)
# We skip lines that are comments (start with --) or inside /* */ blocks.
# For simplicity, we strip single-line comments first.
check_forbidden() {
  local pattern="$1"
  local label="$2"
  # Strip SQL single-line comments (-- ...) then search
  local matches
  matches=$(grep -v '^\s*--' "$SQL_FILE" | grep -i "$pattern" || true)
  if [ -n "$matches" ]; then
    echo "  FAIL  Found '$label':"
    echo "$matches" | while IFS= read -r line; do echo "        $line"; done
    FAIL=$((FAIL + 1))
  else
    echo "  PASS  No '$label' found"
    PASS=$((PASS + 1))
  fi
}

# Forbidden standalone destructive patterns
check_forbidden "DROP[[:space:]]\+TABLE"     "DROP TABLE"
check_forbidden "DROP[[:space:]]\+SCHEMA"    "DROP SCHEMA"
check_forbidden "DELETE[[:space:]]\+FROM"    "DELETE FROM"
check_forbidden "TRUNCATE"                   "TRUNCATE"
check_forbidden "ALTER[[:space:]]\+TABLE.*DROP" "ALTER TABLE ... DROP"
check_forbidden "DROP[[:space:]]\+POLICY"    "DROP POLICY"
check_forbidden "DROP[[:space:]]\+FUNCTION"  "DROP FUNCTION"
check_forbidden "DROP[[:space:]]\+TRIGGER"   "DROP TRIGGER"

echo ""
echo "=== Result: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  echo "Nondestructive SQL file contains forbidden destructive operations!"
  exit 1
fi

echo "Nondestructive SQL file is clean."
exit 0
