-- ============================================================================
-- FIN 317 Analyst Desk — Safe Dashboard SQL Setup
-- ============================================================================
-- SAFE TO PASTE into Supabase Dashboard SQL Editor.
--
-- What this file does:
-- 1. Creates schema (idempotent — uses IF NOT EXISTS)
-- 2. Enables Row Level Security on ALL public tables
-- 3. Adds RLS policies (safe demo mode)
-- 4. Inserts seed/demo data (idempotent — uses ON CONFLICT DO NOTHING)
--
-- IMPORTANT RULES:
-- - This file contains DEMO DATA ONLY. No real student data.
-- - RLS is ENABLED before any data is accessible.
-- - anon (unauth) users: read-only on missions, mission_versions, badges.
-- - anon CANNOT insert/update/delete any table.
-- - authenticated writes: students can insert their own submissions only.
-- - This file does NOT include any secrets or service-role keys.
--
-- Application order in Supabase SQL Editor:
-- 1. Paste and run this ENTIRE file at once.
-- 2. Verify: SELECT * FROM missions; should return 1 row.
-- 3. Verify: As anon, trying INSERT INTO submissions ... should be denied.
-- ============================================================================

-- ============================================================================
-- SCHEMA
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'professor', 'admin')) DEFAULT 'student',
  rank TEXT DEFAULT 'Junior Analyst',
  xp INTEGER NOT NULL DEFAULT 0,
  xp_to_next INTEGER NOT NULL DEFAULT 2000,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  course_code TEXT NOT NULL DEFAULT 'FIN317',
  professor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  semester TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Class memberships
CREATE TABLE IF NOT EXISTS class_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_id, student_id)
);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  learning_objectives TEXT[] DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mission versions
CREATE TABLE IF NOT EXISTS mission_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  scenario_json JSONB NOT NULL DEFAULT '{}',
  answer_key_json JSONB NOT NULL DEFAULT '{}',
  rubric_json JSONB NOT NULL DEFAULT '{}',
  messiness_level INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mission_id, version)
);

-- Submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_version_id UUID NOT NULL REFERENCES mission_versions(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  submission_json JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  max_score INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'graded', 'reviewed')) DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculation results
CREATE TABLE IF NOT EXISTS calculation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  student_value NUMERIC,
  correct_value NUMERIC,
  is_correct BOOLEAN,
  tolerance NUMERIC,
  diff NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI feedback
CREATE TABLE IF NOT EXISTS ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  feedback_json JSONB NOT NULL DEFAULT '{}',
  summary TEXT,
  what_went_right TEXT[],
  what_to_fix TEXT[],
  concept_misunderstandings TEXT[],
  next_step TEXT,
  senior_analyst_review TEXT,
  confidence NUMERIC,
  professor_review_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student progress
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  attempts INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, mission_id)
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  criteria_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student badges
CREATE TABLE IF NOT EXISTS student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  UNIQUE (student_id, badge_id)
);

-- Class analytics
CREATE TABLE IF NOT EXISTS class_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  mission_version_id UUID NOT NULL REFERENCES mission_versions(id) ON DELETE CASCADE,
  avg_score NUMERIC,
  median_score NUMERIC,
  completion_rate NUMERIC,
  common_errors_json JSONB NOT NULL DEFAULT '{}',
  concept_weaknesses_json JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_id, mission_version_id)
);

-- Event log
CREATE TABLE IF NOT EXISTS event_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mission_version ON submissions(mission_version_id);
CREATE INDEX IF NOT EXISTS idx_submissions_class ON submissions(class_id);
CREATE INDEX IF NOT EXISTS idx_calc_results_submission ON calculation_results(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_submission ON ai_feedback(submission_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_badges_student ON student_badges(student_id);
CREATE INDEX IF NOT EXISTS idx_class_analytics_class ON class_analytics(class_id);
CREATE INDEX IF NOT EXISTS idx_event_log_user ON event_log(user_id);
CREATE INDEX IF NOT EXISTS idx_event_log_type ON event_log(event_type);

-- ============================================================================
-- ROW LEVEL SECURITY — Enable on ALL tables
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES — Safe demo mode
-- ============================================================================

-- --- anon read-only for safe reference tables ---

DROP POLICY IF EXISTS "anon_read_missions" ON missions;
CREATE POLICY "anon_read_missions" ON missions FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_read_mission_versions" ON mission_versions;
CREATE POLICY "anon_read_mission_versions" ON mission_versions FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_read_badges" ON badges;
CREATE POLICY "anon_read_badges" ON badges FOR SELECT TO anon USING (true);

-- --- authenticated user policies ---

DROP POLICY IF EXISTS "auth_read_own_profile" ON profiles;
CREATE POLICY "auth_read_own_profile" ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_own_profile" ON profiles;
CREATE POLICY "auth_update_own_profile" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "auth_read_classes" ON classes;
CREATE POLICY "auth_read_classes" ON classes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_class_memberships" ON class_memberships;
CREATE POLICY "auth_read_class_memberships" ON class_memberships FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_own_submissions" ON submissions;
CREATE POLICY "auth_read_own_submissions" ON submissions FOR SELECT TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_insert_own_submissions" ON submissions;
CREATE POLICY "auth_insert_own_submissions" ON submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_read_own_calc_results" ON calculation_results;
CREATE POLICY "auth_read_own_calc_results" ON calculation_results FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM submissions s WHERE s.id = calculation_results.submission_id AND s.student_id = auth.uid())
);

DROP POLICY IF EXISTS "auth_read_own_ai_feedback" ON ai_feedback;
CREATE POLICY "auth_read_own_ai_feedback" ON ai_feedback FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM submissions s WHERE s.id = ai_feedback.submission_id AND s.student_id = auth.uid())
);

DROP POLICY IF EXISTS "auth_read_own_progress" ON student_progress;
CREATE POLICY "auth_read_own_progress" ON student_progress FOR SELECT TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_insert_own_progress" ON student_progress;
CREATE POLICY "auth_insert_own_progress" ON student_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_update_own_progress" ON student_progress;
CREATE POLICY "auth_update_own_progress" ON student_progress FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "auth_read_own_badges" ON student_badges;
CREATE POLICY "auth_read_own_badges" ON student_badges FOR SELECT TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "prof_read_own_class_analytics" ON class_analytics;
CREATE POLICY "prof_read_own_class_analytics" ON class_analytics FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM classes c WHERE c.id = class_analytics.class_id AND c.professor_id = auth.uid())
);

DROP POLICY IF EXISTS "auth_read_own_events" ON event_log;
CREATE POLICY "auth_read_own_events" ON event_log FOR SELECT TO authenticated USING (user_id = auth.uid());

-- --- Explicit anon write blocks (defense in depth) ---

REVOKE ALL ON profiles FROM anon;
GRANT SELECT ON profiles TO anon;

REVOKE ALL ON classes FROM anon;
REVOKE ALL ON class_memberships FROM anon;
REVOKE ALL ON submissions FROM anon;
REVOKE ALL ON calculation_results FROM anon;
REVOKE ALL ON ai_feedback FROM anon;
REVOKE ALL ON student_progress FROM anon;
REVOKE ALL ON student_badges FROM anon;
REVOKE ALL ON class_analytics FROM anon;
REVOKE ALL ON event_log FROM anon;

-- ============================================================================
-- SEED / DEMO DATA (idempotent — ON CONFLICT DO NOTHING)
-- ============================================================================

-- Demo professor
INSERT INTO profiles (id, email, full_name, role, rank, xp, xp_to_next)
VALUES ('00000000-0000-0000-0000-000000000001', 'prof@university.edu', 'Dr. Smith', 'professor', 'Senior Partner', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Demo students
INSERT INTO profiles (id, email, full_name, role, rank, xp, xp_to_next)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'alex@university.edu', 'Alex Analyst', 'student', 'Junior Analyst', 1250, 2000),
  ('00000000-0000-0000-0000-000000000003', 'jordan@university.edu', 'Jordan Lee', 'student', 'Junior Analyst', 800, 2000),
  ('00000000-0000-0000-0000-000000000004', 'taylor@university.edu', 'Taylor Smith', 'student', 'Junior Analyst', 600, 2000),
  ('00000000-0000-0000-0000-000000000005', 'morgan@university.edu', 'Morgan Chen', 'student', 'Junior Analyst', 1500, 2000)
ON CONFLICT (id) DO NOTHING;

-- Demo class
INSERT INTO classes (id, name, course_code, professor_id, semester)
VALUES ('00000000-0000-0000-0000-000000000010', 'FIN 317 — Corporate Finance', 'FIN317', '00000000-0000-0000-0000-000000000001', 'Spring 2026')
ON CONFLICT (id) DO NOTHING;

-- Class memberships
INSERT INTO class_memberships (class_id, student_id)
VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- Project Falcon mission
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000020',
  'project-falcon',
  'Project Falcon: Expansion Funding Decision',
  'Evaluate a leveraged buyout target using WACC, NPV, and IRR.',
  ARRAY['Calculate market value weights for capital structure','Compute component costs of capital','Calculate WACC','Evaluate capital budgeting metrics (NPV, IRR, MIRR, payback)','Formulate a data-driven investment recommendation'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- Bond Valuation mission (demo)
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000022',
  'bond-valuation',
  'Bond Valuation Desk: Yield & Price Analysis',
  'Price corporate bonds, compute yields, and assess interest rate risk.',
  ARRAY['Compute bond price given coupon, YTM, and maturity','Calculate current yield and capital gains yield','Compute yield to call','Explain relationship between coupon rate, YTM, and price'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- Stock Valuation mission (demo)
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000023',
  'stock-valuation',
  'Stock Valuation Desk: Gordon Growth & CAPM',
  'Value equities using dividend growth models and the Capital Asset Pricing Model.',
  ARRAY['Apply the Gordon Growth Model to value a stock','Compute cost of equity using CAPM','Value a stock with non-constant growth','Calculate cost of equity using the dividend growth approach'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- WACC Builder mission (demo)
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000024',
  'wacc-builder',
  'WACC Builder: Cost of Capital Workshop',
  'Build a firm''s weighted average cost of capital from component costs.',
  ARRAY['Compute market value weights for debt, preferred, and equity','Calculate after-tax cost of debt','Estimate cost of equity using CAPM and DGM','Apply the Hamada equation to unlever and relever beta'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- Capital Structure mission (demo)
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000025',
  'capital-structure',
  'Capital Structure Strategy: Leverage Decisions',
  'Analyze the trade-offs between debt and equity financing.',
  ARRAY['Apply the Hamada equation to estimate levered beta','Calculate the impact of leverage on WACC','Evaluate optimal capital structure trade-offs','Assess financial risk with different D/E ratios'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- Dividend Policy mission (demo)
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000026',
  'dividend-policy',
  'Dividend Policy Lab: Payout Decisions',
  'Evaluate residual dividend policy, share repurchases, and payout trade-offs.',
  ARRAY['Apply the residual dividend model','Compute dividend per share under constraints','Compare dividends vs. share repurchases','Assess signaling and clientele effects'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- Risk & Return mission (demo)
INSERT INTO missions (id, slug, title, description, learning_objectives, status)
VALUES (
  '00000000-0000-0000-0000-000000000027',
  'risk-return',
  'Risk & Return: CAPM & Portfolio Theory',
  'Apply the Capital Asset Pricing Model and assess portfolio risk.',
  ARRAY['Calculate expected return using CAPM','Compute beta and interpret systematic risk','Evaluate the Security Market Line','Assess portfolio diversification benefits'],
  'published'
) ON CONFLICT (id) DO NOTHING;

-- Project Falcon mission version v1
INSERT INTO mission_versions (id, mission_id, version, scenario_json, answer_key_json, rubric_json, messiness_level, is_active)
VALUES ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000020', 1, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, 1, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Demo badges
INSERT INTO badges (id, slug, name, description, icon, criteria_json)
VALUES
  ('00000000-0000-0000-0000-000000000030', 'perfect-wacc', 'Perfect WACC', 'All WACC fields correct', 'trophy', '{"field_group":"wacc","accuracy":1.0}'),
  ('00000000-0000-0000-0000-000000000031', 'capital-budgeting-pro', 'Capital Budgeting Pro', 'All capital budgeting fields correct', 'target', '{"field_group":"capital_budgeting","accuracy":1.0}'),
  ('00000000-0000-0000-0000-000000000032', 'senior-analyst-memo', 'Senior Analyst Memo', 'Written reasoning score >= 90%', 'star', '{"reasoning_score":0.9}'),
  ('00000000-0000-0000-0000-000000000033', 'bond-pricer', 'Bond Pricer', 'All bond valuation fields correct', 'trending-up', '{"field_group":"bond_valuation","accuracy":1.0}'),
  ('00000000-0000-0000-0000-000000000034', 'stock-valuer', 'Stock Valuer', 'All stock valuation fields correct', 'bar-chart', '{"field_group":"stock_valuation","accuracy":1.0}')
ON CONFLICT (id) DO NOTHING;

-- Demo submissions
INSERT INTO submissions (id, student_id, mission_version_id, class_id, submission_json, score, max_score, status, submitted_at)
VALUES
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 92, 100, 'graded', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 74, 100, 'graded', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 68, 100, 'graded', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 85, 100, 'graded', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (optional, run after setup)
-- ============================================================================
-- SELECT count(*) AS mission_count FROM missions;
-- Should return 7 (Project Falcon + Bond + Stock + WACC Builder + Capital Structure + Dividend + Risk & Return)
-- SELECT * FROM badges;
-- Should return 5 badges.
-- As anon (unauthenticated), try: INSERT INTO submissions (...) VALUES (...);
-- Should be denied by RLS.
-- ============================================================================
