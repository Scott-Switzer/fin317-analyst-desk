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
} from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

interface Submission {
  mission: string;
  score: number;
  flags: Record<string, boolean>;
  submittedAt: string;
}

export default function StockFeedbackPage() {
  const router = useRouter();
  const [submission] = useState<Submission | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("fin317_submission_stock-valuation");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Submission;
    } catch {
      return null;
    }
  });

  if (!submission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No submission found.</p>
          <button
            onClick={() => router.push("/missions/stock-valuation")}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Start Stock Valuation
          </button>
        </div>
      </div>
    );
  }

  const { score, flags } = submission;

  const fieldLabels: Record<string, string> = {
    costOfEquityCAPM: "Cost of Equity (CAPM)",
    costOfEquityDGM: "Cost of Equity (DGM)",
    intrinsicValueConstantGrowth: "Intrinsic Value (Constant Growth)",
    intrinsicValueTwoStage: "Intrinsic Value (Two-Stage)",
  };

  const correctCount = Object.entries(flags).filter(([, v]) => v).length;
  const totalFields = Object.keys(flags).length;

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
            <span className="text-sm font-bold text-slate-50">Stock Valuation Feedback</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card title="Score" className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                <Trophy className={`h-10 w-10 ${score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400"}`} />
              </div>
              <div className="text-4xl font-extrabold text-slate-50">{score}%</div>
              <div className="mt-1 text-xs text-slate-500">{correctCount}/{totalFields} correct</div>
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
                    <div className="text-sm font-medium text-emerald-300">Stock Valuation Complete</div>
                  </div>
                )}
                {score >= 85 && (
                  <div className="flex items-center gap-3 rounded-md border border-amber-900/50 bg-amber-950/20 p-3">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <div className="text-sm font-medium text-amber-300">Stock Valuer Badge</div>
                  </div>
                )}
              </div>
            </Card>

            <button
              onClick={() => router.push("/missions")}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Mission Map
            </button>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card title="Calculation Review">
              <div className="space-y-2">
                {Object.entries(flags)
                  .filter(([key]) => key !== "memo")
                  .map(([key, ok]) => (
                    <div key={key} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-4 py-2.5">
                      <span className="text-sm text-slate-300">{fieldLabels[key] || key}</span>
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
                  ))}
              </div>
            </Card>

            <Card title="Concept Check: Key Insights" action={<MessageSquareText className="h-4 w-4 text-slate-500" />}>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="rounded-md border border-emerald-900/40 bg-emerald-950/20 p-4">
                  <div className="mb-1 text-xs font-semibold text-emerald-400">CAPM vs DGM</div>
                  <p className="text-xs">CAPM cost of equity = 11.8% (4% + 1.2 x 6.5%). DGM cost = 9.85% ((2.52/52) + 5%). The difference reflects that DGM embeds the market price assumption, while CAPM is risk-based. Use CAPM for valuation; DGM cost is more of a check.</p>
                </div>
                <div className="rounded-md border border-amber-900/40 bg-amber-950/20 p-4">
                  <div className="mb-1 text-xs font-semibold text-amber-400">Overvaluation Signal</div>
                  <p className="text-xs">Both models suggest NCB is overvalued at $52. Even the more optimistic constant growth model gives $37.06, and the two-stage model gives $31.15. The recommendation is to sell/underweight.</p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-900/40 p-4">
                  <div className="mb-1 text-xs font-semibold text-slate-400">Gordon Growth Model Cautions</div>
                  <p className="text-xs">The Gordon Growth Model requires r greater than g. If growth exceeds the required return, the model breaks. Always check this condition. Also, small changes in g dramatically affect valuation &mdash; this is a key limitation of the model.</p>
                </div>
              </div>
            </Card>

            <button
              onClick={() => router.push("/missions/stock-valuation")}
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Retry Mission
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
