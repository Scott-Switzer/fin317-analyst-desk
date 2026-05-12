"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Star,
  MessageSquareText,
  Zap,
  Award,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { generateMockFeedback } from "@/lib/ai/mockFeedback";

interface Submission {
  mission: string;
  score: number;
  flags: Record<string, boolean>;
  submittedAt: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [submission] = useState<Submission | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("fin317_submission_project-falcon");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Submission;
    } catch {
      return null;
    }
  });

  const score = submission?.score ?? 0;
  const flags = submission?.flags ?? {};
  const aiFeedback = generateMockFeedback(score, flags);

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
            <span className="text-sm font-bold text-slate-50">Mission Feedback</span>
          </div>
          <span className="text-xs text-slate-500">Project Falcon — Submission 1</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-1">
            <Card title="Score" className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                <Trophy className={`h-10 w-10 ${score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400"}`} />
              </div>
              <div className="text-4xl font-extrabold text-slate-50">{score}%</div>
              <div className="mt-1 text-xs text-slate-500">Overall Grade</div>
              <div className="mt-4">
                <ProgressBar value={score} max={100} showPercentage={false} />
              </div>
            </Card>

            <Card title="XP Earned">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-400" />
                <div>
                  <div className="text-lg font-bold text-slate-50">+{Math.round(score * 1.5)} XP</div>
                  <div className="text-xs text-slate-500">Added to your analyst profile</div>
                </div>
              </div>
            </Card>

            <Card title="Badges Earned">
              <div className="space-y-3">
                {score >= 70 && (
                  <div className="flex items-center gap-3 rounded-md border border-emerald-900/50 bg-emerald-950/20 p-3">
                    <Star className="h-5 w-5 text-emerald-400" />
                    <div className="text-sm font-medium text-emerald-300">Project Falcon Complete</div>
                  </div>
                )}
                {score >= 85 && (
                  <div className="flex items-center gap-3 rounded-md border border-amber-900/50 bg-amber-950/20 p-3">
                    <Award className="h-5 w-5 text-amber-400" />
                    <div className="text-sm font-medium text-amber-300">High Honors</div>
                  </div>
                )}
                {score < 70 && (
                  <div className="text-sm text-slate-500">No new badges this time. Aim for 70%+ to earn the mission badge.</div>
                )}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-2">
            <Card title="Calculation Review">
              <div className="space-y-2">
                {Object.entries(flags).map(([key, ok]) => {
                  if (key === "recommendation") return null;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-4 py-2.5"
                    >
                      <span className="text-sm capitalize text-slate-300">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      {ok ? (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Incorrect</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Recommendation">
              <div className="flex items-center gap-3">
                {flags["recommendation"] ? (
                  <Badge variant="success">Correct Stance</Badge>
                ) : (
                  <Badge variant="error">Incorrect Stance</Badge>
                )}
                <span className="text-sm text-slate-400">
                  {flags["recommendation"]
                    ? "Your recommendation aligned with the quantitative evidence."
                    : "Your recommendation did not align with the quantitative evidence."}
                </span>
              </div>
            </Card>

            <Card title="AI Feedback" action={<MessageSquareText className="h-4 w-4 text-slate-500" />}>
              <div className="space-y-4 text-sm text-slate-300">
                <p className="leading-relaxed">{aiFeedback.summary}</p>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Strengths
                  </div>
                  <ul className="list-disc space-y-1 pl-5">
                    {aiFeedback.what_went_right.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Improvements
                  </div>
                  <ul className="list-disc space-y-1 pl-5">
                    {aiFeedback.what_to_fix.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {aiFeedback.concept_misunderstandings.length > 0 && (
                  <div className="rounded-md border border-amber-900/40 bg-amber-950/20 p-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Concept Gaps Detected
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiFeedback.concept_misunderstandings.map((gap) => (
                        <Badge key={gap} variant="warning">
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-md border border-slate-800 bg-slate-900/40 p-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Senior Analyst Review
                  </div>
                  <p className="text-sm text-slate-300">{aiFeedback.senior_analyst_review}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Confidence: {Math.round(aiFeedback.confidence * 100)}%</span>
                  {aiFeedback.professor_review_recommended && (
                    <Badge variant="warning">Professor Review Recommended</Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
