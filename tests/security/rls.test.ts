import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("RLS Security", () => {
  const tablesRequiringRls = [
    "profiles",
    "classes",
    "class_memberships",
    "missions",
    "mission_versions",
    "submissions",
    "calculation_results",
    "ai_feedback",
    "student_progress",
    "badges",
    "student_badges",
    "class_analytics",
    "event_log",
  ];

  it("initial migration enables RLS on all tables", () => {
    const migrationPath = path.resolve(
      __dirname,
      "../../supabase/migrations/20250512000001_init_schema.sql"
    );
    const content = fs.readFileSync(migrationPath, "utf-8");

    for (const table of tablesRequiringRls) {
      const pattern = new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`, "i");
      expect(content).toMatch(pattern);
    }
  });

  it("RLS policies migration exists", () => {
    const policyPath = path.resolve(
      __dirname,
      "../../supabase/migrations/20250512000002_enable_rls_and_demo_policies.sql"
    );
    expect(fs.existsSync(policyPath)).toBe(true);
    const content = fs.readFileSync(policyPath, "utf-8");

    // Should include anon read policies for safe demo tables
    expect(content).toContain("anon_read_missions");
    expect(content).toContain("anon_read_mission_versions");
    expect(content).toContain("anon_read_badges");

    // Should block anon writes
    expect(content).toContain("REVOKE ALL ON submissions FROM anon");
    expect(content).toContain("REVOKE ALL ON calculation_results FROM anon");
  });

  it("dashboard SQL file exists and enables RLS", () => {
    const dashPath = path.resolve(
      __dirname,
      "../../supabase/dashboard_safe_demo_setup.sql"
    );
    expect(fs.existsSync(dashPath)).toBe(true);
    const content = fs.readFileSync(dashPath, "utf-8");

    for (const table of tablesRequiringRls) {
      const pattern = new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`, "i");
      expect(content).toMatch(pattern);
    }
  });

  it("no service-role key in client-side code", () => {
    const clientPath = path.resolve(__dirname, "../../src/lib/supabase/client.ts");
    const content = fs.readFileSync(clientPath, "utf-8");
    expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(content).not.toContain("service_role");
    expect(content).not.toContain("service-role");
  });

  it(".env.example warns about service-role key", () => {
    const envPath = path.resolve(__dirname, "../../.env.example");
    const content = fs.readFileSync(envPath, "utf-8");
    expect(content).toContain("SERVER-SIDE ONLY");
    expect(content).toContain("NEVER");
    expect(content).toContain("NEXT_PUBLIC");
  });
});
