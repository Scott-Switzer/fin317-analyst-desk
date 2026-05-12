-- FIN 317 Analyst Desk — RLS Policies (safe demo/development mode)
-- This migration applies row-level security policies that are safe
-- for a hosted Supabase demo environment.
--
-- DESIGN PRINCIPLES:
-- 1. anon (unauthenticated) users can SELECT only safe demo/reference tables.
--    They MUST NOT INSERT/UPDATE/DELETE any row.
-- 2. authenticated users can read their own profile, progress, submissions,
--    results, feedback, and badges.
-- 3. authenticated users can insert their own submissions (user_id = auth.uid()
--    column, or via server-side route with service-role key).
-- 4. authenticated professors can read class-level analytics and memberships
--    for classes they own/teach.
-- 5. The service-role key bypasses RLS for server-side operations.

-- ============================================================
-- SAFE DEMO TABLES: anon read-only
-- ============================================================

-- missions: public demo content, no sensitive data
DROP POLICY IF EXISTS "anon_read_missions" ON missions;
CREATE POLICY "anon_read_missions"
  ON missions
  FOR SELECT
  TO anon
  USING (true);

-- mission_versions: public demo content, scenario/answer-key data may be used
-- for demo mode; in production, answer_key_json should be restricted
DROP POLICY IF EXISTS "anon_read_mission_versions" ON mission_versions;
CREATE POLICY "anon_read_mission_versions"
  ON mission_versions
  FOR SELECT
  TO anon
  USING (true);

-- badges: reference data, safe for anon to see available badges
DROP POLICY IF EXISTS "anon_read_badges" ON badges;
CREATE POLICY "anon_read_badges"
  ON badges
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- AUTHENTICATED USER POLICIES
-- ============================================================

-- profiles: users can read any profile (for display), update only their own
DROP POLICY IF EXISTS "auth_read_own_profile" ON profiles;
CREATE POLICY "auth_read_own_profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_update_own_profile" ON profiles;
CREATE POLICY "auth_update_own_profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- classes: authenticated can read class info
DROP POLICY IF EXISTS "auth_read_classes" ON classes;
CREATE POLICY "auth_read_classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (true);

-- class_memberships: authenticated can read memberships
DROP POLICY IF EXISTS "auth_read_class_memberships" ON class_memberships;
CREATE POLICY "auth_read_class_memberships"
  ON class_memberships
  FOR SELECT
  TO authenticated
  USING (true);

-- submissions: students can read/insert their own
DROP POLICY IF EXISTS "auth_read_own_submissions" ON submissions;
CREATE POLICY "auth_read_own_submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_insert_own_submissions" ON submissions;
CREATE POLICY "auth_insert_own_submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- NOTE: Updates and deletes on submissions are disabled for students.
-- In production, implement a server-side route using service-role key.

-- calculation_results: students can read their own (via submission ownership)
DROP POLICY IF EXISTS "auth_read_own_calc_results" ON calculation_results;
CREATE POLICY "auth_read_own_calc_results"
  ON calculation_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = calculation_results.submission_id
      AND s.student_id = auth.uid()
    )
  );

-- ai_feedback: students can read their own (via submission ownership)
DROP POLICY IF EXISTS "auth_read_own_ai_feedback" ON ai_feedback;
CREATE POLICY "auth_read_own_ai_feedback"
  ON ai_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = ai_feedback.submission_id
      AND s.student_id = auth.uid()
    )
  );

-- student_progress: students can read/insert/update their own
DROP POLICY IF EXISTS "auth_read_own_progress" ON student_progress;
CREATE POLICY "auth_read_own_progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_insert_own_progress" ON student_progress;
CREATE POLICY "auth_insert_own_progress"
  ON student_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_update_own_progress" ON student_progress;
CREATE POLICY "auth_update_own_progress"
  ON student_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- student_badges: students can read their own
DROP POLICY IF EXISTS "auth_read_own_badges" ON student_badges;
CREATE POLICY "auth_read_own_badges"
  ON student_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- class_analytics: professors can read analytics for their own classes
DROP POLICY IF EXISTS "prof_read_own_class_analytics" ON class_analytics;
CREATE POLICY "prof_read_own_class_analytics"
  ON class_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_analytics.class_id
      AND c.professor_id = auth.uid()
    )
  );

-- event_log: only the user themselves or service-role can read
DROP POLICY IF EXISTS "auth_read_own_events" ON event_log;
CREATE POLICY "auth_read_own_events"
  ON event_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- BLOCK anon writes explicitly (DEFENSE IN DEPTH)
-- ============================================================
-- The tables below are sensitive. Even though enable RLS + no policy
-- means "deny by default", we make the intent explicit via REVOKE.

REVOKE ALL ON profiles FROM anon;
GRANT SELECT ON profiles TO anon;  -- anon may see basic profiles (name/role/rank)

REVOKE ALL ON classes FROM anon;
REVOKE ALL ON class_memberships FROM anon;
REVOKE ALL ON submissions FROM anon;
REVOKE ALL ON calculation_results FROM anon;
REVOKE ALL ON ai_feedback FROM anon;
REVOKE ALL ON student_progress FROM anon;
REVOKE ALL ON student_badges FROM anon;
REVOKE ALL ON class_analytics FROM anon;
REVOKE ALL ON event_log FROM anon;

-- ============================================================
-- NOTES FOR PRODUCTION HARDENING
-- ============================================================
-- 1. Add server-side submission route using service-role key for writes
--    to calculation_results, ai_feedback, and event_log.
-- 2. Restrict mission_versions.answer_key_json from anon in production.
-- 3. Add professor-specific write policies for class_analytics.
-- 4. Add student-specific DELETE on their own submissions (if allowed).
-- 5. Verify auth.uid() mapping to profiles.id through Supabase trigger.
