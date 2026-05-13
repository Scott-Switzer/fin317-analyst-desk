# Hosted Supabase RLS Setup Guide

## IMPORTANT: SQL File Choice

This project provides **three** SQL setup files for the Supabase Dashboard SQL Editor:

| File | Use Case | Supabase Warning? | Requires Auth Users? |
|------|----------|-------------------|---------------------|
| `dashboard_safe_demo_setup_nondestructive.sql` | **First-time setup** on a BLANK hosted Supabase project | **No** | **No** |
| `dashboard_demo_auth_dependent_seed_optional.sql` | Seed demo profiles/classes/submissions | **No** | **Yes** |
| `dashboard_safe_demo_setup.sql` | Reset/repair (if policies need replacement) | **Yes** ("destructive operations") | No |

**Always use `dashboard_safe_demo_setup_nondestructive.sql` first.**
Only use `dashboard_safe_demo_setup.sql` if you understand every `DROP POLICY`
statement and need to replace existing policies.

## Why the FK Error Occurs

The `public.profiles` table has:
```sql
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
```

This means **every** profile row's `id` must match a real `auth.users.id`.
Inserting fake/placeholder UUIDs (e.g., `00000000-0000-0000-0000-000000000001`)
will fail with:

```
ERROR: 23503: insert or update on table "profiles" violates foreign key
constraint "profiles_id_fkey"
DETAIL: Key (id)=(...) is not present in table "users".
```

**This is expected behavior on a blank Supabase project.** The
`dashboard_safe_demo_setup_nondestructive.sql` file does NOT insert into
`profiles` — it only creates the table and enables RLS. Profiles, classes,
memberships, and submissions are seeded separately (see Setup Order below).

## Understanding the Supabase SQL Warnings

### What Triggers the Warning

Supabase's SQL Editor flags these keywords as potentially destructive:
- `DROP` (any DROP statement: TABLE, POLICY, SCHEMA, FUNCTION, TRIGGER)
- `DELETE` (data deletion)
- `TRUNCATE` (table truncation)
- `ALTER TABLE ... DROP` (column/constraint removal)

### Warnings That Are ACCEPTABLE

If you are running `dashboard_safe_demo_setup.sql` (the reset-capable file),
the `DROP POLICY IF EXISTS` statements are **safe/idempotent**:
- `IF EXISTS` means they won't fail if the policy doesn't exist
- They are immediately followed by `CREATE POLICY` (replacement, not removal)
- They only affect RLS policies, not your data or schema

### Warnings You MUST NOT IGNORE

Never ignore warnings for:
- `DROP TABLE` without `IF EXISTS` guard
- `DELETE FROM` without a WHERE clause (or with `WHERE true`)
- `TRUNCATE` on tables with real data
- `ALTER TABLE ... DROP COLUMN` on columns you need
- Any operation you don't fully understand

### The Nondestructive File (Recommended)

`dashboard_safe_demo_setup_nondestructive.sql` avoids ALL of these patterns:
- Uses `DO $$ BEGIN IF NOT EXISTS ... END $$` blocks instead of `DROP POLICY`
- Uses `CREATE TABLE IF NOT EXISTS` for schema
- Uses `INSERT ... ON CONFLICT DO NOTHING` for seed data
- Contains zero DROP, DELETE, or TRUNCATE statements
- Contains zero INSERTs into profiles (avoids FK errors on blank projects)
- Should run without triggering Supabase's "destructive operations" warning

## RLS Is Enabled

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

## Setup Order (Recommended)

### Step 1: Run the schema/RLS/reference setup

1. Go to your Supabase Dashboard SQL Editor
2. Click **New Query**
3. Copy and paste the **entire** contents of:
   ```
   supabase/dashboard_safe_demo_setup_nondestructive.sql
   ```
4. Click **Run** (or Ctrl+Enter)

This creates all tables, enables RLS, creates all policies, and seeds
**reference data only** (missions, mission_versions, badges).

5. Verify with:
   ```sql
   SELECT count(*) FROM missions;       -- should return 7
   SELECT * FROM badges;                -- should return 5
   SELECT count(*) FROM profiles;       -- should return 0 (expected!)
   ```
6. Verify RLS is active:
   ```sql
   -- Should be denied (Permission denied for table submissions)
   INSERT INTO submissions (student_id, mission_version_id)
   VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021');
   ```

### Step 2: Create real demo users

Create real Supabase Auth users via **one** of:
- Supabase Dashboard → Authentication → Users → Add User
- Your app's sign-up flow
- A service-role API call (server-side only)

After creating users, note their `id` values (UUIDs from `auth.users`).

### Step 3: (Optional) Seed auth-dependent demo data

1. Copy `supabase/dashboard_demo_auth_dependent_seed_optional.sql`
2. Replace every `PLACEHOLDER_*_ID` with the real `auth.users.id` values from Step 2
3. Run the modified file in the SQL Editor

This seeds profiles, classes, memberships, and demo submissions.

### Step 4: Configure the app

Return to the app and configure `.env.local` with your Supabase keys:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

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

## Professor Dashboard & Fallback Mode

Until real auth users and submissions are created:
- The professor dashboard and analytics views will show empty/mocked data.
- The app may continue in fallback mode (localStorage + mock JSON).
- This is normal — no real data is accessible until auth users exist.
- The mission list, badges, and reference content are available for browsing.

## Security Notes

- **RLS must remain enabled before any browser use.** Never disable RLS on tables
  that contain real student data.
- The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS entirely.
  It must NEVER be exposed to the browser (no `NEXT_PUBLIC_` prefix).
- The anon key is safe for client use — it respects RLS policies.
- Service-role keys must never go in browser code or `NEXT_PUBLIC_` variables.
- All client-side data writes (submissions) require auth + RLS ownership checks.
- In demo/fallback mode (no `.env.local`), the app uses localStorage and is
  completely self-contained — no database access occurs.
- Never commit `.env.local` or any file containing real Supabase keys.
