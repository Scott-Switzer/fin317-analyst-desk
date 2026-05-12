"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Trophy,
  Target,
  Briefcase,
  ChevronRight,
  Flame,
  Star,
  Award,
  Compass,
  TrendingUp,
  DollarSign,
  PieChart,
  Calculator,
  Shield,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  rank: string;
  xp: number;
  xpToNext: number;
}

const ranks = [
  "Junior Analyst",
  "Associate Analyst",
  "Senior Analyst",
  "Vice President",
  "Managing Director",
  "Senior Partner",
];

const mockBadges = [
  { id: "b1", name: "First Submission", icon: Star, earned: true },
  { id: "b2", name: "WACC Whisperer", icon: Trophy, earned: true },
  { id: "b3", name: "Bond Pricer", icon: TrendingUp, earned: false },
  { id: "b4", name: "Capital Structurist", icon: Target, earned: false },
  { id: "b5", name: "Stock Valuer", icon: DollarSign, earned: false },
  { id: "b6", name: "Speed Demon", icon: Flame, earned: true },
];

const missionIcons: Record<string, React.ElementType> = {
  "project-falcon": Briefcase,
  "bond-valuation": TrendingUp,
  "stock-valuation": BarChart3,
  "wacc-builder": Calculator,
  "capital-structure": PieChart,
  "dividend-policy": DollarSign,
  "risk-return": Shield,
};

const missionTopics: Record<string, string> = {
  "project-falcon": "Capital Budgeting",
  "bond-valuation": "Bond Valuation",
  "stock-valuation": "Stock Valuation",
  "wacc-builder": "Cost of Capital",
  "capital-structure": "Capital Structure",
  "dividend-policy": "Payout Policy",
  "risk-return": "Risk & Return",
};

const allMissions = [
  { slug: "project-falcon", title: "Project Falcon", description: "WACC, NPV, IRR, MIRR & payback" },
  { slug: "bond-valuation", title: "Bond Valuation Desk", description: "Price bonds, compute yields & YTC" },
  { slug: "stock-valuation", title: "Stock Valuation Desk", description: "Gordon Growth, CAPM, two-stage DDM" },
  { slug: "wacc-builder", title: "WACC Builder", description: "Component costs & market value weights" },
  { slug: "capital-structure", title: "Capital Structure Strategy", description: "Leverage, Hamada & optimal D/E" },
  { slug: "dividend-policy", title: "Dividend Policy Lab", description: "Residual dividend & repurchases" },
  { slug: "risk-return", title: "Risk & Return: CAPM", description: "Beta, SML & portfolio theory" },
];

function computeDynamicRank(xp: number): string {
  const idx = Math.min(Math.floor(xp / 2000), ranks.length - 1);
  return ranks[idx];
}

function computeTotalXp(): number {
  let totalXp = 0;
  ["project-falcon", "bond-valuation", "stock-valuation"].forEach((slug) => {
    try {
      const sub = localStorage.getItem(`fin317_submission_${slug}`);
      if (sub) {
        const s = JSON.parse(sub);
        totalXp += Math.round((s.score || 0) * 1.5);
      }
    } catch { /* ignore parse errors */ }
  });
  return totalXp;
}

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem("fin317_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    const totalXp = computeTotalXp();
    return { ...parsed, xp: totalXp || parsed.xp || 200, rank: computeDynamicRank(totalXp || parsed.xp || 200) };
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<User | null>(loadUserFromStorage);

  if (!user && typeof window !== "undefined") {
    router.replace("/login");
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-sm text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-sm text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  const completedMissions = allMissions.filter((m) => {
    try {
      return !!localStorage.getItem(`fin317_submission_${m.slug}`);
    } catch { return false; }
  });

  const unlockedMissions = allMissions.filter((m) => {
    try {
      return !localStorage.getItem(`fin317_submission_${m.slug}`);
    } catch { return true; }
  });

  const displayMissions = [
    ...completedMissions.map((m) => ({ ...m, status: "completed" as const })),
    ...unlockedMissions.map((m) => ({ ...m, status: m.slug === "wacc-builder" || m.slug === "capital-structure" || m.slug === "dividend-policy" || m.slug === "risk-return" ? "locked" as const : "available" as const })),
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-bold tracking-tight text-slate-50">FIN 317 Analyst Desk</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="info">{user.rank}</Badge>
            <span className="text-sm text-slate-400">{user.name}</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Track your progress, missions, and analyst rank.</p>
          </div>
          <Link
            href="/missions"
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-950/60"
          >
            <Compass className="h-4 w-4" />
            Mission Map
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card title="Analyst Profile">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 text-emerald-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{user.rank}</div>
                    <div className="text-xs text-slate-500">Current Rank</div>
                  </div>
                </div>
                <ProgressBar value={user.xp} max={user.xpToNext} label={`XP — ${user.xp} / ${user.xpToNext}`} />
                <div className="text-[10px] text-slate-600">
                  {ranks[ranks.indexOf(user.rank) + 1] ? `Next rank: ${ranks[ranks.indexOf(user.rank) + 1]}` : "Max rank achieved!"}
                </div>
              </div>
            </Card>

            <Card title="Badges" action={<span className="text-xs text-slate-500">{mockBadges.filter((b) => b.earned).length} earned</span>}>
              <div className="grid grid-cols-3 gap-3">
                {mockBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-2 rounded-md border p-3 text-center ${
                        badge.earned
                          ? "border-slate-700 bg-slate-800/40"
                          : "border-slate-800 bg-slate-900/30 opacity-40"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${badge.earned ? "text-amber-400" : "text-slate-600"}`} />
                      <span className="text-[10px] font-medium leading-tight text-slate-300">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Progress Summary">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Missions Completed</span>
                  <span className="font-semibold text-slate-200">{completedMissions.length} / {allMissions.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total XP</span>
                  <span className="font-semibold text-emerald-400">{user.xp}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Rank Progress</span>
                  <span className="font-semibold text-amber-400">{user.rank}</span>
                </div>
              </div>
            </Card>

            <Link
              href="/professor"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900/40 px-4 py-3 text-xs font-medium text-slate-400 hover:bg-slate-800/60"
            >
              <Award className="h-4 w-4" />
              Professor Dashboard
            </Link>
          </div>

          <div className="lg:col-span-2">
            <Card
              title="Missions"
              action={
                <Link href="/missions" className="text-xs text-emerald-400 hover:text-emerald-300">
                  View All
                </Link>
              }
            >
              <div className="space-y-3">
                {displayMissions.slice(0, 7).map((mission) => {
                  const Icon = missionIcons[mission.slug] || Briefcase;
                  return (
                    <div
                      key={mission.slug}
                      className={`rounded-lg border p-4 transition-colors ${
                        mission.status === "completed"
                          ? "border-emerald-900/40 bg-emerald-950/10"
                          : mission.status === "locked"
                          ? "border-slate-800 bg-slate-900/20 opacity-60"
                          : "border-slate-800 bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                            mission.status === "completed" ? "bg-emerald-950 text-emerald-400" :
                            mission.status === "locked" ? "bg-slate-800 text-slate-500" :
                            "bg-slate-800 text-slate-400"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-200">{mission.title}</span>
                              {mission.status === "completed" && <Badge variant="success">Done</Badge>}
                              {mission.status === "locked" && <Badge variant="default">Locked</Badge>}
                              <span className="text-[10px] text-slate-600">{missionTopics[mission.slug]}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">{mission.description}</p>
                          </div>
                        </div>
                        {mission.status === "completed" ? (
                          <Link
                            href={`/missions/${mission.slug}/feedback`}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                          >
                            Feedback <ChevronRight className="h-3 w-3" />
                          </Link>
                        ) : mission.status === "available" ? (
                          <Link
                            href={`/missions/${mission.slug}`}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                          >
                            Start <ChevronRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
