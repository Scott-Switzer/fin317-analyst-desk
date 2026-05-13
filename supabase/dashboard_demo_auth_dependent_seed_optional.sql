-- ============================================================================
-- FIN 317 Analyst Desk — OPTIONAL Auth-Dependent Demo Seed
-- ============================================================================
--
-- WARNING: THIS FILE REQUIRES REAL SUPABASE AUTH USERS TO ALREADY EXIST.
--
-- The `public.profiles` table has:
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
--
-- So every profile row's `id` MUST match a real `auth.users.id`.
-- Inserting fake/placeholder UUIDs will fail with FK constraint error.
--
-- PREREQUISITES:
-- 1. Run supabase/dashboard_safe_demo_setup_nondestructive.sql first
--    (creates schema, enables RLS, creates policies, seeds missions/badges).
-- 2. Create real Supabase Auth users. You can do this via:
--    a. Supabase Dashboard → Authentication → Users → Add User
--    b. Your app's sign-up flow
-- 3. Copy each user's `id` from auth.users (UUID format).
-- 4. Replace the PLACEHOLDER_* values below with the real UUIDs.
-- 5. Run THIS file in the Supabase Dashboard SQL Editor.
--
-- WHAT THIS FILE SEEDS:
--   - profiles (demo professor + 4 students)
--   - classes (1 demo class)
--   - class_memberships (4 student memberships)
--   - submissions (4 demo graded submissions)
--
-- All INSERTs use ON CONFLICT DO NOTHING (safe for repeated runs).
--
-- SERVE THIS FILE FROM A PRIVATE LOCATION. It should NOT be tracked
-- in a public repository if you fill in real auth user IDs.
-- ============================================================================

-- ============================================================================
-- STEP 1: Replace each PLACEHOLDER_* below with a real auth.users.id
-- ============================================================================

-- Example query to find your auth user IDs (run in SQL Editor first):
--   SELECT id, email FROM auth.users;

-- Demo professor — REPLACE PLACEHOLDER_PROFESSOR_ID
INSERT INTO profiles (id, email, full_name, role, rank, xp, xp_to_next)
VALUES ('PLACEHOLDER_PROFESSOR_ID', 'prof@university.edu', 'Dr. Smith', 'professor', 'Senior Partner', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Demo students — REPLACE each PLACEHOLDER_STUDENT_*_ID
INSERT INTO profiles (id, email, full_name, role, rank, xp, xp_to_next)
VALUES
  ('PLACEHOLDER_STUDENT_1_ID', 'alex@university.edu', 'Alex Analyst', 'student', 'Junior Analyst', 1250, 2000),
  ('PLACEHOLDER_STUDENT_2_ID', 'jordan@university.edu', 'Jordan Lee', 'student', 'Junior Analyst', 800, 2000),
  ('PLACEHOLDER_STUDENT_3_ID', 'taylor@university.edu', 'Taylor Smith', 'student', 'Junior Analyst', 600, 2000),
  ('PLACEHOLDER_STUDENT_4_ID', 'morgan@university.edu', 'Morgan Chen', 'student', 'Junior Analyst', 1500, 2000)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Replace PLACEHOLDER_PROFESSOR_ID and PLACEHOLDER_CLASS_ID below
-- ============================================================================

-- Demo class — REPLACE PLACEHOLDER_PROFESSOR_ID and PLACEHOLDER_CLASS_ID
INSERT INTO classes (id, name, course_code, professor_id, semester)
VALUES ('PLACEHOLDER_CLASS_ID', 'FIN 317 — Corporate Finance', 'FIN317', 'PLACEHOLDER_PROFESSOR_ID', 'Spring 2026')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 3: Replace student/class IDs in class_memberships
-- ============================================================================

-- Class memberships — REPLACE IDs
INSERT INTO class_memberships (class_id, student_id)
VALUES
  ('PLACEHOLDER_CLASS_ID', 'PLACEHOLDER_STUDENT_1_ID'),
  ('PLACEHOLDER_CLASS_ID', 'PLACEHOLDER_STUDENT_2_ID'),
  ('PLACEHOLDER_CLASS_ID', 'PLACEHOLDER_STUDENT_3_ID'),
  ('PLACEHOLDER_CLASS_ID', 'PLACEHOLDER_STUDENT_4_ID')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- ============================================================================
-- STEP 4: Replace submission IDs and student/class/version IDs
-- ============================================================================
-- mission_version_id '00000000-0000-0000-0000-000000000021' is for Project Falcon
-- and was created by dashboard_safe_demo_setup_nondestructive.sql.

-- Demo submissions — REPLACE PLACEHOLDER_SUBMISSION_*_ID and student/class IDs
INSERT INTO submissions (id, student_id, mission_version_id, class_id, submission_json, score, max_score, status, submitted_at)
VALUES
  ('PLACEHOLDER_SUBMISSION_1_ID', 'PLACEHOLDER_STUDENT_1_ID', '00000000-0000-0000-0000-000000000021', 'PLACEHOLDER_CLASS_ID', '{}'::jsonb, 92, 100, 'graded', NOW() - INTERVAL '2 days'),
  ('PLACEHOLDER_SUBMISSION_2_ID', 'PLACEHOLDER_STUDENT_2_ID', '00000000-0000-0000-0000-000000000021', 'PLACEHOLDER_CLASS_ID', '{}'::jsonb, 74, 100, 'graded', NOW() - INTERVAL '2 days'),
  ('PLACEHOLDER_SUBMISSION_3_ID', 'PLACEHOLDER_STUDENT_3_ID', '00000000-0000-0000-0000-000000000021', 'PLACEHOLDER_CLASS_ID', '{}'::jsonb, 68, 100, 'graded', NOW() - INTERVAL '1 day'),
  ('PLACEHOLDER_SUBMISSION_4_ID', 'PLACEHOLDER_STUDENT_4_ID', '00000000-0000-0000-0000-000000000021', 'PLACEHOLDER_CLASS_ID', '{}'::jsonb, 85, 100, 'graded', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION (optional)
-- ============================================================================
-- SELECT count(*) FROM profiles;        -- should return 5 (1 prof + 4 students)
-- SELECT count(*) FROM classes;         -- should return 1
-- SELECT count(*) FROM class_memberships; -- should return 4
-- SELECT count(*) FROM submissions;     -- should return 4
-- ============================================================================
