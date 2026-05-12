# FIN 317 Analyst Desk — Decision Log

This document records significant architectural and product decisions.

## 2025-01-15: Two-Repository Strategy

**Decision**: Split the project into a public repo (`fin317-analyst-desk`) and a private corpus (`fin317-course-corpus`).

**Rationale**:
- Keeps copyrighted and sensitive course materials out of the public repository.
- Allows open collaboration on application code while restricting raw data access.
- Complies with university academic integrity policies.

**Consequences**:
- Developers must clone two repos and link them locally.
- Documentation must clearly explain the boundary.
- CI must enforce the boundary.

## 2025-01-15: Private Corpus Stores Raw Files

**Decision**: The private corpus is the sole location for raw lecture slides, assignment PDFs, problem sets, and professor-provided data.

**Rationale**:
- Centralizes sensitive material.
- Makes it easy to audit what is private vs. public.

**Consequences**:
- Only approved contributors can access the full context.
- AI prompts and synthetic data must be derived manually.

## 2025-01-15: Public Repo Stores App Code and Synthetic Data

**Decision**: The public repo contains all application code, documentation, tests, and synthetic scenarios.

**Rationale**:
- Enables version control and CI/CD for the application.
- Allows the synthetic dataset to be improved collaboratively.

**Consequences**:
- All scenarios must be written from scratch.
- Rubrics and formulas must be original expressions of knowledge.

## 2025-01-15: No Firebase

**Decision**: Do not use Firebase for any service.

**Rationale**:
- Supabase provides a unified open-source alternative with PostgreSQL.
- Better local development experience with the Supabase CLI.
- Avoids vendor lock-in to Google Cloud.

**Consequences**:
- Auth, database, storage, and edge functions all use Supabase.
- Team must learn Supabase-specific APIs.

## 2025-01-15: Use Supabase

**Decision**: Adopt Supabase as the primary backend platform.

**Rationale**:
- Open-source PostgreSQL with real-time subscriptions.
- Built-in Auth, Storage, and Edge Functions.
- Excellent TypeScript support and local CLI.
- Cost-effective for student projects.

**Consequences**:
- Infrastructure managed via Supabase dashboard and CLI.
- Edge Functions use Deno runtime.

## 2025-01-15: Deterministic Grading for Numbers

**Decision**: Numerical answers are graded by a deterministic TypeScript library, not by AI.

**Rationale**:
- Ensures fairness and reproducibility.
- Eliminates AI hallucination in scoring.
- Fast and cheap to run.

**Consequences**:
- Answer keys must be meticulously maintained.
- Edge cases (rounding, alternative methods) must be coded into the library.

## 2025-01-15: AI Feedback for Reasoning

**Decision**: Use an LLM (OpenAI) to provide qualitative feedback on memo text and reasoning.

**Rationale**:
- AI excels at evaluating prose, structure, and argumentation.
- Provides personalized, scalable feedback beyond what TAs can offer.
- Educational value is high when the AI acts as a mentor.

**Consequences**:
- Requires prompt engineering and output schema enforcement.
- Must be strictly separated from official scoring.
- Costs associated with API usage; may require rate limiting.

## 2025-01-15: Project Falcon First

**Decision**: The MVP mission is "Project Falcon," a capital budgeting scenario.

**Rationale**:
- Capital budgeting is a core, self-contained FIN 317 topic.
- NPV/IRR calculations are well-defined and easy to grade deterministically.
- Memo format is standard and teachable.

**Consequences**:
- All initial engineering efforts prioritize this single end-to-end flow.
- Future missions will follow the same pattern established by Falcon.

## 2026-05-12: Supabase Schema with Local Fallback

**Decision**: Create a full Supabase schema for persistence, but implement graceful fallbacks to localStorage and mock data when Supabase is not configured.

**Rationale**:
- Allows demo and development without live Supabase credentials.
- Ensures the app is never blocked by backend setup.
- Local fallback simplifies onboarding for new contributors.

**Consequences**:
- Data functions must handle both Supabase and local paths.
- Sync logic between local and remote may be needed later.

## 2026-05-12: Mock AI Feedback for Demo

**Decision**: Provide a deterministic mock AI feedback generator (`src/lib/ai/mockFeedback.ts`) that runs when no OpenAI API key is present.

**Rationale**:
- Demonstrates the AI feedback UX without API costs or keys.
- Ensures the feedback page is fully functional in demo mode.
- The mock generator uses score thresholds and flags to produce realistic output.

**Consequences**:
- Mock feedback is less nuanced than real LLM output.
- Must clearly label mock feedback as simulated in the UI.
