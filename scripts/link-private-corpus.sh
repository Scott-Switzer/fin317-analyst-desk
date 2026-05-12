#!/bin/bash
set -euo pipefail

if [ -L "private_corpus" ]; then
  rm private_corpus
fi

ln -s ../fin317-course-corpus/ai_context private_corpus
echo "Linked private_corpus -> ../fin317-course-corpus/ai_context"
