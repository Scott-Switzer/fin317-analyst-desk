-- FIN 317 Analyst Desk schema
-- Enable UUID extension
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

-- Enable Row Level Security on all public tables
-- RLS is enabled inline to prevent any window of unprotected access.
-- Granular policies are created in the next migration:
--   supabase/migrations/20250512000002_enable_rls_and_demo_policies.sql

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
