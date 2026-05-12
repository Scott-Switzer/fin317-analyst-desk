# FIN 317 Analyst Desk — Architecture

## Overview

FIN 317 Analyst Desk is a modern web application built on a serverless architecture. It separates concerns between a deterministic grading system (for numerical accuracy) and an AI feedback system (for qualitative reasoning).

## Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Server Components + Server Actions where possible; client-side state for UI interactivity.

### Backend & Services
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (email/password, OAuth)
- **Storage**: Supabase Storage (for scenario attachments, exports)
- **Edge Functions**: Supabase Edge Functions (Deno runtime) for AI feedback and sensitive operations.
- **Deployment**: Vercel (frontend), Supabase (backend services)

## Key Architectural Decisions

### No Firebase
We use Supabase exclusively. This provides a unified Postgres database, auth, storage, and edge functions in one platform with excellent local development support.

### Deterministic Grading Library
A TypeScript library (`src/lib/grading`) that:
- Accepts student numerical answers and scenario answer keys.
- Compares values with configurable tolerance (e.g., ±0.01% for NPV).
- Applies rubric rules to compute official scores.
- Returns structured results: `score`, `maxScore`, `breakdown`, `passed`.
- Runs entirely on the client or in a secure server context. No AI involved.

### AI Feedback Edge Function
A Supabase Edge Function (`ai-feedback`) that:
- Receives the student's memo text and scenario metadata.
- Calls the OpenAI API (or similar) with a carefully engineered prompt.
- Instructs the AI to evaluate reasoning, compare the recommendation against the deterministic calculation, and identify conceptual errors.
- **Does NOT calculate the official score**. The AI is advisory only.
- Returns structured JSON conforming to `docs/AI_FEEDBACK_SPEC.md`.

### Data Formats

#### Scenario JSON
Each scenario is defined as a JSON file containing:
- `id`, `title`, `mission`, `tier`, `learningObjectives`
- `narrative`: structured text sections
- `data`: financial figures, tables, assumptions
- `deliverables`: what the student must produce
- `attachments`: references to stored files

#### Answer Key JSON
A companion JSON file containing:
- `scenarioId`
- `expectedValues`: map of question/field → expected numerical answer + tolerance
- `rubric`: scoring rules and weights
- `gradingRules`: special rules (e.g., partial credit, required sections)

## Data Access Layer

Located in `src/lib/data/`:
- `missions.ts` — scenario loading, mission fetching from Supabase or local JSON fallback.
- `submissions.ts` — save and fetch submissions with Supabase or localStorage fallback.
- `professorAnalytics.ts` — analytics computation with mock fallback when Supabase is unavailable.

All data functions gracefully degrade to local demo data if Supabase env vars are absent.

## Supabase Schema

Key tables:
- `profiles` — extends auth.users with role, rank, xp.
- `classes` / `class_memberships` — course enrollment.
- `missions` / `mission_versions` — scenario and answer key versioning.
- `submissions` / `calculation_results` — student work and deterministic grading output.
- `ai_feedback` — formative AI feedback JSON.
- `student_progress` / `badges` / `student_badges` — gamification state.
- `class_analytics` — precomputed class-level analytics.
- `event_log` — audit trail.

Migrations live in `supabase/migrations/`.
Seed data lives in `supabase/seed.sql`.

## Professor Dashboard
A protected set of routes (`/professor/*`) that provide:
- Class overview: average scores, completion rates, time-on-task.
- Submission review: view individual student memos and scores.
- Flagged reviews: submissions where AI confidence is low or professor review is recommended.
- Scenario management: upload/edit scenarios and answer keys (future).

## AI Feedback Scaffolding
- `src/lib/ai/feedbackPrompt.ts` — prompt template for formative AI feedback.
- `src/lib/ai/mockFeedback.ts` — deterministic mock feedback generator for demo environments without OpenAI keys.

## Local Development Workflow
1. Clone the public repo.
2. Install dependencies with `pnpm`.
3. Start local Supabase stack with `npx supabase start`.
4. Apply migrations: `npx supabase migration up`.
5. Run Next.js dev server with `pnpm dev`.
6. Run tests with `pnpm test`.
7. Run data boundary check with `pnpm check:raw-files`.

## Deployment
- **Frontend**: Deploy to Vercel on every push to `main`.
- **Backend**: Supabase project with migrations managed via Supabase CLI.
- **Edge Functions**: Deployed via `supabase functions deploy`.
