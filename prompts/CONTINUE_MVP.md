# Prompt Template: Continue MVP Development

## Context

The FIN 317 Analyst Desk MVP is partially built. You are adding features, tests, and integrations on top of the existing Next.js + Supabase codebase.

## Instructions

1. **Add Features**
   - Implement the next mission after Project Falcon (e.g., a WACC/cost of capital scenario).
   - Follow the same JSON scenario + answer key pattern.
   - Add mission prerequisites (e.g., must pass Project Falcon to unlock).
   - Add a basic XP and badge system to the student dashboard.

2. **Add Tests**
   - Write unit tests for any new financial functions.
   - Write component tests for new UI pages using React Testing Library.
   - Ensure all tests pass (`pnpm test`).
   - Aim for >70% coverage on new `src/lib/` code.

3. **Add Analytics**
   - Add a lightweight analytics table in Supabase to track:
     - Time spent per mission
     - Number of attempts
     - Common error patterns (from deterministic grading breakdown)
   - Create a simple professor dashboard route (`/professor/analytics`) that queries this data.
   - Protect the route with role-based access (professor role in Supabase Auth).

4. **Add AI Feedback Integration**
   - Create the Supabase Edge Function `ai-feedback` in `supabase/functions/ai-feedback/`.
   - It should accept `{ scenarioId, studentMemo, deterministicResult }`.
   - Call OpenAI with the structured prompt from `docs/AI_FEEDBACK_SPEC.md`.
   - Parse and validate the JSON response against the spec schema.
   - Store the feedback in the database linked to the submission.
   - Display the feedback on the submission results page.

## Constraints

- Do not change existing deterministic grading logic.
- Do not store OpenAI API keys in code; use Supabase secrets.
- Maintain the data boundary: no raw course files.
- Keep the dark finance dashboard aesthetic.

## Output

Return the complete file changes (new files, edits) needed to accomplish the above. Write code, not pseudocode.
