# Prompt Template: Build the MVP

## Context

You are building the FIN 317 Analyst Desk MVP. The stack is Next.js + Supabase + TypeScript. The first mission is Project Falcon (capital budgeting).

## Instructions

1. **Initialize App**
   - Ensure Next.js App Router structure is clean.
   - Set up Tailwind CSS with a dark finance dashboard theme.
   - Configure shadcn/ui base components.
   - Set up Supabase client (SSR-safe).

2. **Create Finance Library**
   - Create `src/lib/finance/` with pure functions for:
     - NPV, IRR, payback period, discounted payback
     - WACC, CAPM
     - Basic ratio calculations
   - All functions must accept typed inputs and return typed outputs.
   - Add unit tests in `tests/lib/finance/` using Vitest.

3. **Create Deterministic Grading**
   - Create `src/lib/grading/` with a grading engine that:
     - Accepts a student submission object and an answer key object.
     - Compares numerical answers with tolerance.
     - Applies rubric weights.
     - Returns `{ score, maxScore, breakdown, passed }`.
   - Add comprehensive tests.

4. **Create Scenario: Project Falcon**
   - Create `src/scenarios/project-falcon.json` with:
     - Narrative, data, deliverables, learning objectives
   - Create `src/scenarios/project-falcon-answer-key.json` with:
     - Expected values, rubric, grading rules

5. **Create UI Pages**
   - `/missions` — List available missions.
   - `/missions/project-falcon` — Scenario narrative and data display.
   - `/missions/project-falcon/memo` — Memo composition interface.
   - `/missions/project-falcon/submit` — Submit and view deterministic score.
   - `/dashboard` — Student progress overview.

6. **Connect Supabase**
   - Set up Auth (email/password).
   - Create database schema for users, missions, submissions, scores.
   - Write a seed script for local development.
   - Ensure RLS policies are in place.

## Constraints

- No Firebase.
- No raw course files in the repo.
- All financial logic must be deterministic and tested.
- AI feedback is out of scope for this prompt; just prepare the memo text storage.

## Output

Return the complete file changes (new files, edits) needed to accomplish the above. Write code, not pseudocode.
