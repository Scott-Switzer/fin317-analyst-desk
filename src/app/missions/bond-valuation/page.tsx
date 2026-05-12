"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Send,
  FileText,
  Calculator,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import answerKey from "@/../rubrics/bond-valuation.answer-key.v1.json";

const schema = z.object({
  bondPrice: z.string().min(1, "Required"),
  currentYield: z.string().min(1, "Required"),
  capitalGainsYield: z.string().min(1, "Required"),
  yieldToCall: z.string().min(1, "Required"),
  memo: z.string().min(10, "Please provide a brief memo."),
});

type FormData = z.infer<typeof schema>;

const bondDetails = [
  { label: "Face Value", value: "$1,000" },
  { label: "Coupon Rate", value: "7.00% (semiannual)" },
  { label: "Years to Maturity", value: "10" },
  { label: "Market YTM", value: "6.25%" },
  { label: "Credit Rating", value: "BBB" },
  { label: "Call Feature", value: "Callable after 5 years at $1,050" },
];

const formulaHints = [
  { label: "Bond Price", formula: "PV(Coupons) + PV(Face Value)" },
  { label: "Current Yield", formula: "Annual Coupon / Bond Price" },
  { label: "Capital Gains Yield", formula: "YTM - Current Yield" },
  { label: "YTC", formula: "Solve: Price = PV(coupons to call) + PV(Call Price)" },
];

export default function BondValuationPage() {
  const router = useRouter();
  const [showHints, setShowHints] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function withinTolerance(user: string, expected: number, tol = 0.02) {
    const val = parseFloat(user.replace(/[$,%]/g, ""));
    if (Number.isNaN(val)) return false;
    if (expected === 0) return Math.abs(val) < 0.01;
    return Math.abs(val - expected) / Math.max(Math.abs(expected), 0.01) <= tol;
  }

  const onSubmit = async (data: FormData) => {
    const expected: Record<string, number> = {
      bondPrice: answerKey.bondPrice,
      currentYield: answerKey.currentYield,
      capitalGainsYield: answerKey.capitalGainsYield,
      yieldToCall: answerKey.yieldToCall,
    };

    const newFlags: Record<string, boolean> = {};
    let correct = 0;
    const keys = Object.keys(expected);
    keys.forEach((k) => {
      const ok = withinTolerance((data as Record<string, string>)[k], expected[k]);
      newFlags[k] = ok;
      if (ok) correct++;
    });

    const memoOk = data.memo.toLowerCase().includes("buy") || data.memo.toLowerCase().includes("hold") || data.memo.toLowerCase().includes("premium");
    newFlags["memo"] = memoOk;
    if (memoOk) correct++;

    const total = keys.length + 1;
    const pct = Math.round((correct / total) * 100);
    setScore(pct);
    setFlags(newFlags);
    setShowModal(true);

    const submission = {
      mission: "bond-valuation",
      score: pct,
      flags: newFlags,
      data,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem("fin317_submission_bond-valuation", JSON.stringify(submission));
  };

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
            <span className="text-sm font-bold text-slate-50">Bond Valuation Desk</span>
            <Badge variant="success">Active</Badge>
          </div>
          <span className="text-xs text-slate-500">Fixed Income — Mission</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Difficulty & Mode */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="info">Difficulty: Moderate</Badge>
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? "Hide Formula Hints" : "Guided Mode: Show Hints"}
          </button>
        </div>

        {showHints && (
          <Card title="Formula Reference" className="mb-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {formulaHints.map((h) => (
                <div key={h.label} className="rounded-md border border-slate-800 bg-slate-900/40 p-3">
                  <div className="text-xs font-semibold text-emerald-400">{h.label}</div>
                  <div className="mt-1 text-xs text-slate-400 font-mono">{h.formula}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Briefing */}
        <Card title="Mission Briefing" className="mb-6">
          <div className="space-y-3 text-sm text-slate-300">
            <p>Meridian Capital Partners manages a $2.8 billion fixed-income portfolio. Price a newly issued 10-year corporate bond from Apex Manufacturing (rated BBB) and analyze its return profile.</p>
            <div className="rounded-md bg-slate-800/50 p-3 text-xs text-slate-400">
              <strong className="text-slate-200">Context:</strong> The bond has a $1,000 face value, pays 7% coupons semiannually, and the market requires a 6.25% YTM for this risk profile. The bond is callable after 5 years at $1,050.
            </div>
          </div>
        </Card>

        {/* Bond Details */}
        <Card title="Bond Data" className="mb-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {bondDetails.map((d) => (
              <div key={d.label} className="rounded-md border border-slate-800 bg-slate-900/40 p-3 text-center">
                <div className="text-[10px] uppercase text-slate-500">{d.label}</div>
                <div className="mt-1 text-sm font-semibold text-slate-200">{d.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Calculation Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card title="Your Calculations" action={<Calculator className="h-4 w-4 text-slate-500" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                { name: "bondPrice", label: "Bond Price ($)" },
                { name: "currentYield", label: "Current Yield (decimal, e.g. 0.0663)" },
                { name: "capitalGainsYield", label: "Capital Gains Yield (decimal)" },
                { name: "yieldToCall", label: "Yield to Call (decimal, e.g. 0.0655)" },
              ] as { name: keyof FormData; label: string }[]).map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">{field.label}</label>
                  <input
                    {...register(field.name)}
                    className={`w-full rounded-md border bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 ${
                      errors[field.name] ? "border-rose-700" : "border-slate-700"
                    }`}
                    placeholder="0.00"
                  />
                  {errors[field.name] && (
                    <p className="text-xs text-rose-400">{errors[field.name]?.message}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Investment Memo" action={<FileText className="h-4 w-4 text-slate-500" />}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">
                Write a brief memo: Is this bond attractive? Why? (mention price vs par, YTM vs coupon, call risk)
              </label>
              <textarea
                {...register("memo")}
                rows={4}
                className={`w-full rounded-md border bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 ${
                  errors.memo ? "border-rose-700" : "border-slate-700"
                }`}
                placeholder="This BBB bond trades at a premium because..."
              />
              {errors.memo && <p className="text-xs text-rose-400">{errors.memo.message}</p>}
            </div>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-md border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Submit Analysis
            </button>
          </div>
        </form>
      </main>

      {/* Score Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              {score >= 80 ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-500" />
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-50">Bond Analysis Graded</h3>
                <p className="text-xs text-slate-400">Deterministic scoring complete</p>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-slate-800/50 p-4 text-center">
              <div className="text-3xl font-extrabold text-slate-50">{score}%</div>
              <div className="text-xs text-slate-500">Overall Score</div>
            </div>

            <div className="space-y-2 text-sm">
              {Object.entries(flags).map(([key, ok]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize text-slate-400">
                    {key === "bondPrice" ? "Bond Price" : key === "currentYield" ? "Current Yield" : key === "capitalGainsYield" ? "Capital Gains Yield" : key === "yieldToCall" ? "Yield to Call" : "Memo"}
                  </span>
                  <Badge variant={ok ? "success" : "error"}>{ok ? "Correct" : "Incorrect"}</Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.push("/missions/bond-valuation/feedback")}
                className="flex-1 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                View Feedback
              </button>
              <button
                onClick={() => router.push("/missions")}
                className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Mission Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
