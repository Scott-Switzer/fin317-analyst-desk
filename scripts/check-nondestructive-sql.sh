#!/bin/bash
set -euo pipefail

# Check that the nondestructive SQL file contains no forbidden destructive operations
# or fake auth-dependent UUIDs.
# This script scans supabase/dashboard_safe_demo_setup_nondestructive.sql for:
#   DROP TABLE, DROP SCHEMA, DELETE FROM, TRUNCATE,
#   ALTER TABLE ... DROP, DROP POLICY, fake auth UUIDs

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

check_forbidden_string() {
  local str="$1"
  local label="$2"
  local matches
  matches=$(grep -v '^\s*--' "$SQL_FILE" | grep -F "$str" || true)
  if [ -n "$matches" ]; then
    echo "  FAIL  Found '$label' (fake auth-dependent UUID):"
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
echo "--- Fake auth-dependent UUIDs (must NOT appear) ---"

# Fake auth user UUIDs — these IDs don't exist in auth.users on a blank project.
# Inserting them into profiles would fail with FK constraint error.
# They also indicate downstream inserts (classes, memberships, submissions)
# that depend on nonexistent profiles.
check_forbidden_string "00000000-0000-0000-0000-000000000001" "professor UUID (000...001)"
check_forbidden_string "00000000-0000-0000-0000-000000000002" "student UUID (000...002)"
check_forbidden_string "00000000-0000-0000-0000-000000000003" "student UUID (000...003)"
check_forbidden_string "00000000-0000-0000-0000-000000000004" "student UUID (000...004)"
check_forbidden_string "00000000-0000-0000-0000-000000000005" "student UUID (000...005)"
check_forbidden_string "00000000-0000-0000-0000-000000000010" "class UUID (000...010, depends on prof profile)"
check_forbidden_string "00000000-0000-0000-0000-000000000040" "submission UUID (000...040, depends on profiles)"
check_forbidden_string "00000000-0000-0000-0000-000000000041" "submission UUID (000...041, depends on profiles)"
check_forbidden_string "00000000-0000-0000-0000-000000000042" "submission UUID (000...042, depends on profiles)"
check_forbidden_string "00000000-0000-0000-0000-000000000043" "submission UUID (000...043, depends on profiles)"

echo ""
echo "=== Result: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  echo "Nondestructive SQL file contains forbidden operations or fake auth UUIDs!"
  exit 1
fi

echo "Nondestructive SQL file is clean."
exit 0
