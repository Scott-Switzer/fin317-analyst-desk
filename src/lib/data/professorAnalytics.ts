import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AnalyticsSummary {
  totalSubmissions: number;
  avgScore: number;
  commonErrors: { concept: string; frequency: number; description: string }[];
  conceptWeaknesses: { concept: string; avgScore: number; students: number }[];
}

export async function fetchClassAnalytics(classId: string, missionVersionId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("class_analytics")
    .select("*")
    .eq("class_id", classId)
    .eq("mission_version_id", missionVersionId)
    .single();
  if (error) return null;
  return data;
}

export async function fetchSubmissionsWithProfiles(classId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("submissions")
    .select("*, profiles(full_name, email)")
    .eq("class_id", classId)
    .order("submitted_at", { ascending: false });
  if (error) return null;
  return data;
}

export function computeMockAnalytics(): AnalyticsSummary {
  return {
    totalSubmissions: 4,
    avgScore: 79.75,
    commonErrors: [
      {
        concept: "After-Tax Cost of Debt",
        frequency: 34,
        description: "Students applied tax shield to coupon rate instead of yield to maturity.",
      },
      {
        concept: "Market Value Weights",
        frequency: 28,
        description: "Used book values instead of market values for WACC weights.",
      },
      {
        concept: "MIRR Reinvestment Rate",
        frequency: 22,
        description: "Confused MIRR reinvestment rate with WACC or cost of equity.",
      },
      {
        concept: "Discounted Payback",
        frequency: 19,
        description: "Used nominal cash flows instead of discounted cash flows.",
      },
    ],
    conceptWeaknesses: [
      { concept: "Preferred Stock Valuation", avgScore: 62, students: 18 },
      { concept: "MIRR Calculation", avgScore: 58, students: 22 },
      { concept: "Discounted Payback", avgScore: 71, students: 14 },
      { concept: "WACC Weight Selection", avgScore: 74, students: 12 },
    ],
  };
}
