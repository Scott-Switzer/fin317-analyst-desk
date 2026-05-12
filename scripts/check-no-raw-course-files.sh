#!/bin/bash
set -euo pipefail

echo "Checking for raw course file types in public repo..."

FOUND=$(find . -type f \( -name "*.pdf" -o -name "*.pptx" -o -name "*.docx" -o -name "*.xlsx" -o -name "*.xls" -o -name "*.csv" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/.next/*" \
  -not -path "*/supabase/*" \
  2>/dev/null || true)

if [ -n "$FOUND" ]; then
  echo "ERROR: Found raw course files in public repo:"
  echo "$FOUND"
  exit 1
else
  echo "OK: No raw course files found."
  exit 0
fi
