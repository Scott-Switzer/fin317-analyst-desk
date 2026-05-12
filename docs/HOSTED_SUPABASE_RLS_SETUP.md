# Hosted Supabase RLS Setup Guide

## Why the SQL Warning Appeared

The original migration (`20250512000001_init_schema.sql`) created tables but had
RLS enablement commented out. When you tried to run it in the Supabase Dashboard SQL
Editor, Supabase warned: "New tables will not have Row Level Security enabled."

This is now fixed. The migration has been updated to enable RLS inline, and a second
migration adds granular policies.

## RLS Is Now Enabled

Row Level Security is enabled on **every** public table:

- `profiles`
- `classes`
- `class_memberships`
- `missions`
- `mission_versions`
- `submissions`
- `calculation_results`
- `ai_feedback`
- `student_progress`
- `badges`
- `student_badges`
- `class_analytics`
- `event_log`

## Policy Summary

### anon (unauthenticated) Users
| Can Do | Cannot Do |
|--------|-----------|
| SELECT missions | INSERT/UPDATE/DELETE any table |
| SELECT mission_versions | Read submissions |
| SELECT badges | Read class analytics |
| SELECT profiles (basic info) | Read event logs |
| | Read AI feedback |

### authenticated Students
| Can Do | Cannot Do |
|--------|-----------|
| Read/update own profile | Read other students' submissions |
| Read classes and memberships | Write calculation_results directly |
| Insert own submissions (`auth.uid() = student_id`) | Write ai_feedback directly |
| Read own calculation_results (via submission) | Read class_analytics |
| Read own ai_feedback (via submission) | Write event_log directly |
| Read/update own student_progress | |
| Read own student_badges | |

### authenticated Professors
| Can Do | Cannot Do |
|--------|-----------|
| Everything students can do | Write to student-owned tables |
| Read class_analytics for their own classes | |
| Read memberships for their classes | |

## What Remains Before Production

1. **Server-side submission route**: The client cannot write `calculation_results`,
   `ai_feedback`, or `event_log` directly. A server action or API route using the
   service-role key must handle these writes. This route should:
   - Accept validated submission input (Zod schema)
   - Run deterministic grading server-side
   - Write submissions, calculation_results, ai_feedback, and event_log atomically
   - Never expose the service-role key to the client

2. **Auth integration**: The app currently works in fallback mode (localStorage).
   To use RLS, integrate Supabase Auth (email/password or magic link) so that
   `auth.uid()` resolves to the correct `profiles.id`.

3. **Mission version answer keys**: In production, `mission_versions.answer_key_json`
   should be restricted (not readable by anon). Move answer key access to a
   server-side route.

4. **Professor analytics writes**: Add policies that allow professors to upsert
   `class_analytics` for their own classes.

## Exact Dashboard Application Order

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tgyxeawyihzhrzdwvyuy)
2. Open **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the **entire** contents of:
   ```
   supabase/dashboard_safe_demo_setup.sql
   ```
5. Click **Run** (or Ctrl+Enter)
6. Verify with:
   ```sql
   SELECT count(*) FROM missions;  -- should return 7
   SELECT * FROM badges;           -- should return 5
   ```
7. Return to the app and configure `.env.local` with your Supabase keys.

## Security Notes

- The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS entirely.
  It must NEVER be exposed to the browser (no `NEXT_PUBLIC_` prefix).
- The anon key is safe for client use — it respects RLS policies.
- All client-side data writes (submissions) require auth + RLS ownership checks.
- In demo/fallback mode (no `.env.local`), the app uses localStorage and is
  completely self-contained — no database access occurs.
