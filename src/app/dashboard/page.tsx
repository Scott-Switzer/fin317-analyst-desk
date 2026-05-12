"use client";

import { useEffect, useState } from "react";
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

const mockBadges = [
  { id: "b1", name: "First Submission", icon: Star, earned: true },
  { id: "b2", name: "WACC Whisperer", icon: Trophy, earned: true },
  { id: "b3", name: "DCF Ace", icon: Award, earned: false },
  { id: "b4", name: "Capital Structurist", icon: Target, earned: false },
  { id: "b5", name: "Speed Demon", icon: Flame, earned: true },
];

const mockMissions = [
  {
    id: "m1",
    title: "Project Falcon",
    status: "active",
    progress: 65,
    due: "May 15",
    description: "Evaluate a leveraged buyout target using WACC, NPV, and IRR.",
  },
  {
    id: "m2",
    title: "Merger Modeling I",
    status: "locked",
    progress: 0,
    due: "May 22",
    description: "Build accretion/dilution analysis for a horizontal merger.",
  },
  {
    id: "m3",
    title: "Dividend Policy Lab",
    status: "locked",
    progress: 0,
    due: "Jun 1",
    description: "Compare residual vs. stable dividend policy under uncertainty.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("fin317_user");
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-sm text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-bold tracking-tight text-slate-50">
              FIN 317 Analyst Desk
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="info">{user.rank}</Badge>
            <span className="text-sm text-slate-400">{user.name}</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track your progress, missions, and analyst rank.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-1">
            {/* Rank & XP */}
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
                <ProgressBar
                  value={user.xp}
                  max={user.xpToNext}
                  label={`XP — ${user.xp} / ${user.xpToNext}`}
                />
              </div>
            </Card>

            {/* Badges */}
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
                      <span className="text-[10px] font-medium leading-tight text-slate-300">
                        {badge.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Progress summary */}
            <Card title="Progress Summary">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Missions Completed</span>
                  <span className="font-semibold text-slate-200">1 / 8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Avg. Score</span>
                  <span className="font-semibold text-emerald-400">87.4%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Time on Desk</span>
                  <span className="font-semibold text-slate-200">4h 12m</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Class Rank</span>
                  <span className="font-semibold text-amber-400">#4</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column — Missions */}
          <div className="lg:col-span-2">
            <Card title="Active Missions" action={<Badge variant="success">1 Active</Badge>}>
              <div className="space-y-4">
                {mockMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      mission.status === "active"
                        ? "border-emerald-900/60 bg-emerald-950/20"
                        : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-md ${
                            mission.status === "active"
                              ? "bg-emerald-950 text-emerald-400"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-200">
                              {mission.title}
                            </span>
                            {mission.status === "active" && (
                              <Badge variant="success">Active</Badge>
                            )}
                            {mission.status === "locked" && (
                              <Badge variant="default">Locked</Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{mission.description}</p>
                        </div>
                      </div>
                      {mission.status === "active" ? (
                        <Link
                          href="/missions/project-falcon"
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                        >
                          Resume
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-600">Due {mission.due}</span>
                      )}
                    </div>
                    {mission.status === "active" && (
                      <div className="mt-3">
                        <ProgressBar value={mission.progress} max={100} label="Mission Progress" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
