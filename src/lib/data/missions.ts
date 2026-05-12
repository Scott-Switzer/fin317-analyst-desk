import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import scenario from "@/../scenarios/project-falcon.v1.json";

export interface MissionScenario {
  missionId: string;
  title: string;
  briefing: string;
  studentRole: string;
  learningObjectives: string[];
  capitalStructure: {
    debt: {
      bookValue: number;
      couponRate: number;
      ytm: number;
      yearsToMaturity: number;
      faceValue: number;
    };
    preferred: {
      dividendPerShare: number;
      requiredReturn: number;
      sharesOutstanding: number;
    };
    equity: {
      sharesOutstanding: number;
      pricePerShare: number;
      beta: number;
      riskFreeRate: number;
      marketRiskPremium: number;
      dividendPerShare: number;
      growthRate: number;
    };
  };
  projectCashFlows: {
    initialOutlay: number;
    annualFlows: number[];
    projectLife: number;
  };
  decisionRule: string;
  messinessLevel: number;
  tolerance: {
    default: number;
    percentage: number;
  };
}

export function getActiveScenario(): MissionScenario {
  return scenario as MissionScenario;
}

export async function fetchMissionBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("missions")
    .select("*, mission_versions(*)")
    .eq("slug", slug)
    .eq("mission_versions.is_active", true)
    .single();
  if (error) return null;
  return data;
}

export async function fetchMissionVersion(id: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from("mission_versions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}
