"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Calculator,
  PieChart,
  BarChart3,
  DollarSign,
  Shield,
  ChevronRight,
  Lock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

interface MissionCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType;
  difficulty: "Foundational" | "Moderate" | "Challenging";
  topic: string;
  learningObjectives: string[];
  status: "completed" | "available" | "locked";
}

const allMissions: MissionCard[] = [
  {
    id: "m1",
    slug: "project-falcon",
    title: "Project Falcon",
    description: "Evaluate a capital investment using WACC, NPV, IRR, MIRR, and payback analysis.",
    icon: Briefcase,
    difficulty: "Challenging",
    topic: "Capital Budgeting",
    learningObjectives: [
      "Calculate WACC from component costs",
      "Apply NPV and IRR decision rules",
      "Compute MIRR and payback period",
      "Write a professional recommendation memo",
    ],
    status: "available",
  },
  {
    id: "m2",
    slug: "bond-valuation",
    title: "Bond Valuation Desk",
    description: "Price corporate bonds, compute yields, and assess interest rate and call risk.",
    icon: TrendingUp,
    difficulty: "Moderate",
    topic: "Bond Valuation",
    learningObjectives: [
      "Compute bond price given coupon, YTM, maturity",
      "Calculate current yield and capital gains yield",
      "Compute yield to call for callable bonds",
      "Interpret premium vs. discount bonds",
    ],
    status: "available",
  },
  {
    id: "m3",
    slug: "stock-valuation",
    title: "Stock Valuation Desk",
    description: "Value equities using dividend growth models and the Capital Asset Pricing Model.",
    icon: BarChart3,
    difficulty: "Challenging",
    topic: "Stock Valuation",
    learningObjectives: [
      "Apply Gordon Growth Model (constant growth)",
      "Value stocks with multi-stage growth",
      "Compute cost of equity via CAPM and DGM",
      "Compare intrinsic value to market price",
    ],
    status: "available",
  },
  {
    id: "m4",
    slug: "wacc-builder",
    title: "WACC Builder",
    description: "Build a firm's weighted average cost of capital from component costs with market value weights.",
    icon: Calculator,
    difficulty: "Moderate",
    topic: "Cost of Capital",
    learningObjectives: [
      "Compute market value weights for debt, preferred, equity",
      "Calculate after-tax cost of debt",
      "Estimate cost of equity using CAPM and DGM",
      "Apply Hamada equation for levered beta",
    ],
    status: "locked",
  },
  {
    id: "m5",
    slug: "capital-structure",
    title: "Capital Structure Strategy",
    description: "Analyze the trade-offs between debt and equity financing using Hamada and leverage analysis.",
    icon: PieChart,
    difficulty: "Challenging",
    topic: "Capital Structure",
    learningObjectives: [
      "Apply Hamada equation for levered/unlevered beta",
      "Calculate impact of leverage on WACC",
      "Evaluate optimal capital structure trade-offs",
      "Assess financial risk with different D/E ratios",
    ],
    status: "locked",
  },
  {
    id: "m6",
    slug: "dividend-policy",
    title: "Dividend Policy Lab",
    description: "Evaluate residual dividend policy, share repurchases, and payout strategy trade-offs.",
    icon: DollarSign,
    difficulty: "Moderate",
    topic: "Payout Policy",
    learningObjectives: [
      "Apply the residual dividend model",
      "Compute dividend per share under constraints",
      "Compare dividends vs. share repurchases",
      "Assess signaling and clientele effects",
    ],
    status: "locked",
  },
  {
    id: "m7",
    slug: "risk-return",
    title: "Risk & Return: CAPM",
    description: "Apply the Capital Asset Pricing Model and assess portfolio risk and diversification.",
    icon: Shield,
    difficulty: "Foundational",
    topic: "Risk & Return",
    learningObjectives: [
      "Calculate expected return using CAPM",
      "Compute and interpret beta",
      "Evaluate the Security Market Line",
      "Assess portfolio diversification benefits",
    ],
    status: "locked",
  },
];

const topicColors: Record<string, string> = {
  "Capital Budgeting": "border-emerald-800 bg-emerald-950/20",
  "Bond Valuation": "border-sky-800 bg-sky-950/20",
  "Stock Valuation": "border-violet-800 bg-violet-950/20",
  "Cost of Capital": "border-amber-800 bg-amber-950/20",
  "Capital Structure": "border-rose-800 bg-rose-950/20",
  "Payout Policy": "border-cyan-800 bg-cyan-950/20",
  "Risk & Return": "border-indigo-800 bg-indigo-950/20",
};

export default function MissionMapPage() {
  const router = useRouter();
  const [missions] = useState(() => {
    if (typeof window === "undefined") return allMissions;
    const unlocked = new Set<string>();
    if (localStorage.getItem("fin317_submission_project-falcon")) unlocked.add("project-falcon");
    if (localStorage.getItem("fin317_submission_bond-valuation")) unlocked.add("bond-valuation");
    if (localStorage.getItem("fin317_submission_stock-valuation")) unlocked.add("stock-valuation");
    return allMissions.map((m) => ({
      ...m,
      status: unlocked.has(m.slug) ? ("completed" as const) : m.status,
    }));
  });

  const completedCount = missions.filter((m) => m.status === "completed").length;

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-slate-50">Analyst Training Path</span>
          </div>
          <span className="text-xs text-slate-500">
            {completedCount} / {missions.length} Complete
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">Mission Map</h1>
          <p className="mt-1 text-sm text-slate-400">
            Your FIN 317 analyst training path. Complete missions to unlock advanced topics.
          </p>
          <div className="mt-4">
            <ProgressBar value={completedCount} max={missions.length} label="Overall Completion" />
          </div>
        </div>

        {/* Topic filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(topicColors).map((topic) => (
            <Badge key={topic} variant="default">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Mission grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`rounded-xl border p-5 transition-colors ${
                mission.status === "completed"
                  ? "border-emerald-900/60 bg-emerald-950/10"
                  : mission.status === "available"
                  ? `${topicColors[mission.topic] || "border-slate-800"} bg-slate-900/40`
                  : "border-slate-800 bg-slate-900/20 opacity-60"
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  mission.status === "completed" ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}>
                  {mission.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : mission.status === "locked" ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <mission.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={mission.difficulty === "Foundational" ? "info" : mission.difficulty === "Moderate" ? "warning" : "error"} className="text-[10px]">
                    {mission.difficulty}
                  </Badge>
                </div>
              </div>

              <h3 className="mb-1 text-sm font-semibold text-slate-200">{mission.title}</h3>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">{mission.description}</p>

              <div className="mb-4 space-y-1">
                {mission.learningObjectives.slice(0, 2).map((obj, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <BookOpen className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-600" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>

              {mission.status === "completed" ? (
                <Link
                  href={`/missions/${mission.slug}`}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-900/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/60"
                >
                  Review <ChevronRight className="h-3 w-3" />
                </Link>
              ) : mission.status === "available" ? (
                <Link
                  href={`/missions/${mission.slug}`}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                >
                  Start Mission <ChevronRight className="h-3 w-3" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <Lock className="h-3 w-3" /> Complete Prerequisites
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
