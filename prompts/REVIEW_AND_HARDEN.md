# Prompt Template: Review and Harden

## Context

The FIN 317 Analyst Desk codebase has grown. You are performing a code review and hardening pass before merging to `main`.

## Instructions

1. **Run Tests**
   - Execute the full test suite: `pnpm test`.
   - Fix any failing tests.
   - Identify and add missing tests for edge cases (e.g., division by zero in financial formulas, empty memo submissions).

2. **Fix Bugs**
   - Review error handling in API routes and edge functions.
   - Ensure Supabase RLS policies are correct and restrictive.
   - Check for TypeScript `any` types and replace with strict types.
   - Validate all environment variables at startup.

3. **Improve Accessibility**
   - Run axe-core or Lighthouse accessibility audit.
   - Ensure all interactive elements have proper ARIA labels.
   - Ensure color contrast meets WCAG AA standards (especially in dark mode).
   - Add keyboard navigation support for the memo composition interface.

4. **Improve Performance**
   - Audit bundle size with `@next/bundle-analyzer`.
   - Lazy load heavy components (e.g., charts, analytics dashboard).
   - Optimize Supabase queries (add indexes, reduce N+1 queries).
   - Add React Server Components where possible to reduce client JS.

5. **Verify Data Boundary**
   - Run `pnpm check:raw-files`.
   - Manually review any new files added in the PR for raw course material.
   - Ensure `.gitignore` covers all forbidden file types.
   - Check that no API keys or secrets are committed.

## Constraints

- Do not introduce breaking changes to the existing scenario JSON schema.
- Do not degrade test coverage.
- Maintain the dark finance dashboard aesthetic.

## Output

Return a summary of issues found, fixes applied, and any new tests or configurations added. Include specific file paths and code snippets.
