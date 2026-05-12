<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FIN 317 Analyst Desk — Agent Instructions

## Product Concept

FIN 317 Analyst Desk is a gamified financial analysis training platform. Students act as junior investment analysts, receive scenarios, perform calculations, write investment memos, and get instant deterministic grading plus AI-powered qualitative feedback.

When writing code, always keep the student experience in mind: fast, clear, and motivating.

## Technology Constraints

- **No Firebase**. Do not use Firebase Auth, Firestore, Cloud Functions, or any Firebase service.
- **Use Supabase** for authentication, PostgreSQL database, file storage, and edge functions.
- **Next.js** is the frontend framework. Follow the App Router conventions and heed the Next.js warning above.

## Grading Architecture

- **Deterministic Grading for Numbers**: All numerical scoring is done by a deterministic TypeScript library (`src/lib/grading` or similar). It compares student answers against answer keys with configurable tolerance. No AI is involved in scoring.
- **AI Feedback for Reasoning Only**: The AI feedback engine (OpenAI via Supabase Edge Function) evaluates memo text, reasoning quality, and conceptual understanding. It does NOT calculate scores. It outputs structured JSON per `docs/AI_FEEDBACK_SPEC.md`.

## Data Boundary

- **No Raw Course Materials in Public Repo**: The public repository must never contain raw FIN 317 files (PDFs, PPTX, DOCX, XLSX, CSV, etc.).
- **Synthetic Data Only in Public Repo**: All scenarios, datasets, and problem statements in the public repo must be fabricated by the team.
- **Private Corpus**: Raw materials live in the adjacent private repo. Link locally with `scripts/link-private-corpus.sh`.

## Aesthetic & UX

- **Dark Finance Dashboard**: The UI should evoke a modern Bloomberg terminal or investment bank workstation. Dark mode is default. Use muted greens, reds, and amber for financial indicators.
- **Professional Tone**: Error messages, feedback, and UI copy should sound like a serious (but supportive) financial institution, not a casual game.

## Code Quality

- **Testable**: All business logic (especially grading and financial calculations) must be pure functions with unit tests. Use Vitest.
- **Type-Safe**: Write strict TypeScript. Avoid `any`.
- **Documented**: When adding features, update the relevant docs in `docs/` and this file if needed.

## File Organization

- `src/lib/grading/` — Deterministic grading engine
- `src/lib/finance/` — Financial calculation utilities
- `src/app/` — Next.js App Router pages
- `supabase/functions/` — Edge functions (Deno)
- `docs/` — Product and architecture documentation
- `scripts/` — Development and validation scripts

## When in Doubt

1. Check `docs/` first.
2. Keep the data boundary sacred.
3. Prefer deterministic logic over AI for anything involving scores.
4. Ask before introducing new dependencies.
