-- Seed data for FIN 317 Analyst Desk demo environment

-- Demo professor
INSERT INTO profiles (id, email, full_name, role, rank, xp, xp_to_next)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'prof@university.edu',
  'Dr. Smith',
  'professor',
  'Senior Partner',
  0,
  0
)
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
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'FIN 317 — Corporate Finance',
  'FIN317',
  '00000000-0000-0000-0000-000000000001',
  'Spring 2026'
)
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
  ARRAY[
    'Calculate market value weights for capital structure',
    'Compute component costs of capital',
    'Calculate WACC',
    'Evaluate capital budgeting metrics (NPV, IRR, MIRR, payback)',
    'Formulate a data-driven investment recommendation'
  ],
  'published'
)
ON CONFLICT (id) DO NOTHING;

-- Project Falcon mission version v1
INSERT INTO mission_versions (id, mission_id, version, scenario_json, answer_key_json, rubric_json, messiness_level, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000020',
  1,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  1,
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Demo badges
INSERT INTO badges (id, slug, name, description, icon, criteria_json)
VALUES
  ('00000000-0000-0000-0000-000000000030', 'perfect-wacc', 'Perfect WACC', 'All WACC fields correct', 'trophy', '{"field_group":"wacc","accuracy":1.0}'),
  ('00000000-0000-0000-0000-000000000031', 'capital-budgeting-pro', 'Capital Budgeting Pro', 'All capital budgeting fields correct', 'target', '{"field_group":"capital_budgeting","accuracy":1.0}'),
  ('00000000-0000-0000-0000-000000000032', 'senior-analyst-memo', 'Senior Analyst Memo', 'Written reasoning score >= 90%', 'star', '{"reasoning_score":0.9}')
ON CONFLICT (id) DO NOTHING;

-- Demo submissions (will be replaced by real submissions)
INSERT INTO submissions (id, student_id, mission_version_id, class_id, submission_json, score, max_score, status, submitted_at)
VALUES
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 92, 100, 'graded', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 74, 100, 'graded', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 68, 100, 'graded', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '{}'::jsonb, 85, 100, 'graded', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
