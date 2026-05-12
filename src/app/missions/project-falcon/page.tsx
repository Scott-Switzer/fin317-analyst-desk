"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Send,
  FileText,
  Building2,
  ArrowLeft,
  Calculator,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";

const schema = z.object({
  marketValueDebt: z.string().min(1, "Required"),
  marketValuePreferred: z.string().min(1, "Required"),
  marketValueEquity: z.string().min(1, "Required"),
  wd: z.string().min(1, "Required"),
  wp: z.string().min(1, "Required"),
  ws: z.string().min(1, "Required"),
  afterTaxCostOfDebt: z.string().min(1, "Required"),
  costOfPreferred: z.string().min(1, "Required"),
  costOfEquity: z.string().min(1, "Required"),
  wacc: z.string().min(1, "Required"),
  npv: z.string().min(1, "Required"),
  irr: z.string().min(1, "Required"),
  mirr: z.string().min(1, "Required"),
  payback: z.string().min(1, "Required"),
  discountedPayback: z.string().min(1, "Required"),
  recommendation: z.string().min(10, "Please provide a detailed recommendation."),
});

type FormData = z.infer<typeof schema>;

const capitalStructure = [
  { source: "Senior Term Loan", bookValue: "$45,000,000", coupon: "6.50%", maturity: "7 years", rating: "BB" },
  { source: "Subordinated Notes", bookValue: "$20,000,000", coupon: "9.00%", maturity: "10 years", rating: "B+" },
  { source: "Preferred Stock", bookValue: "$10,000,000", coupon: "8.00% (div)", maturity: "Perpetual", rating: "-" },
  { source: "Common Equity", bookValue: "$25,000,000", coupon: "N/A", maturity: "N/A", rating: "-" },
];

const cashFlows = [
  { year: 0, fcf: "-$100,000,000", capex: "$0", wcChange: "$0", netCF: "-$100,000,000" },
  { year: 1, fcf: "$18,500,000", capex: "$2,000,000", wcChange: "$500,000", netCF: "$16,000,000" },
  { year: 2, fcf: "$22,000,000", capex: "$2,500,000", wcChange: "$600,000", netCF: "$18,900,000" },
  { year: 3, fcf: "$26,500,000", capex: "$3,000,000", wcChange: "$700,000", netCF: "$22,800,000" },
  { year: 4, fcf: "$30,000,000", capex: "$3,500,000", wcChange: "$800,000", netCF: "$25,700,000" },
  { year: 5, fcf: "$34,000,000", capex: "$4,000,000", wcChange: "$900,000", netCF: "$29,100,000" },
];

const answerKey: Record<string, number> = {
  marketValueDebt: 65000000,
  marketValuePreferred: 12000000,
  marketValueEquity: 45000000,
  wd: 0.52,
  wp: 0.1,
  ws: 0.38,
  afterTaxCostOfDebt: 0.0455,
  costOfPreferred: 0.08,
  costOfEquity: 0.135,
  wacc: 0.0871,
  npv: 8450000,
  irr: 0.127,
  mirr: 0.112,
  payback: 4.2,
  discountedPayback: 4.8,
};

function withinTolerance(user: string, expected: number, tol = 0.02) {
  const val = parseFloat(user.replace(/[$,%]/g, ""));
  if (Number.isNaN(val)) return false;
  if (expected === 0) return Math.abs(val) < 0.01;
  return Math.abs((val - expected) / expected) <= tol;
}

export default function ProjectFalconPage() {
  const router = useRouter();
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

  const onSubmit = (data: FormData) => {
    const newFlags: Record<string, boolean> = {};
    let correct = 0;
    const keys = Object.keys(answerKey);
    keys.forEach((k) => {
      const ok = withinTolerance(data[k as keyof FormData] as string, answerKey[k]);
      newFlags[k] = ok;
      if (ok) correct++;
    });

    const recCorrect = data.recommendation.toLowerCase().includes("accept");
    newFlags["recommendation"] = recCorrect;
    if (recCorrect) correct++;

    const total = keys.length + 1;
    const pct = Math.round((correct / total) * 100);
    setScore(pct);
    setFlags(newFlags);
    setShowModal(true);

    const submission = {
      mission: "project-falcon",
      score: pct,
      flags: newFlags,
      data,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem("fin317_submission_project-falcon", JSON.stringify(submission));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/missions/project-falcon/feedback");
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
            <span className="text-sm font-bold text-slate-50">Project Falcon</span>
            <Badge variant="success">Active</Badge>
          </div>
          <span className="text-xs text-slate-500">FIN 317 — Mission 1</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Mission Briefing */}
        <Card title="Mission Briefing" className="mb-6" action={<FileText className="h-4 w-4 text-slate-500" />}>
          <div className="space-y-3 text-sm leading-relaxed text-slate-300">
            <p>
              <strong className="text-slate-100">Objective:</strong> Evaluate the acquisition of Falcon Industries,
              a mid-market manufacturing target. Compute WACC using the provided capital structure,
              then run project cash flows through NPV, IRR, MIRR, and payback analyses.
            </p>
            <p>
              <strong className="text-slate-100">Deliverable:</strong> Submit your calculated inputs,
              a one-paragraph recommendation memo, and supporting rationale.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="rounded-md bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400">
                Tax Rate: <span className="font-semibold text-slate-200">30%</span>
              </div>
              <div className="rounded-md bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400">
                Risk-Free: <span className="font-semibold text-slate-200">4.0%</span>
              </div>
              <div className="rounded-md bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400">
                Market Premium: <span className="font-semibold text-slate-200">6.5%</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Capital Structure */}
          <Card title="Capital Structure" action={<Building2 className="h-4 w-4 text-slate-500" />}>
            <DataTable
              columns={[
                { key: "source", header: "Source" },
                { key: "bookValue", header: "Book Value" },
                { key: "coupon", header: "Rate / Dividend" },
                { key: "maturity", header: "Maturity" },
                { key: "rating", header: "Rating" },
              ]}
              data={capitalStructure}
            />
          </Card>

          {/* Cash Flows */}
          <Card title="Project Cash Flows" action={<Calculator className="h-4 w-4 text-slate-500" />}>
            <DataTable
              columns={[
                { key: "year", header: "Year" },
                { key: "fcf", header: "FCF" },
                { key: "capex", header: "CapEx" },
                { key: "wcChange", header: "Δ NWC" },
                { key: "netCF", header: "Net CF" },
              ]}
              data={cashFlows}
            />
          </Card>
        </div>

        {/* Calculation Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <Card title="Calculations" action={<Calculator className="h-4 w-4 text-slate-500" />}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {([
                { name: "marketValueDebt", label: "Market Value Debt ($)" },
                { name: "marketValuePreferred", label: "Market Value Preferred ($)" },
                { name: "marketValueEquity", label: "Market Value Equity ($)" },
                { name: "wd", label: "Weight of Debt (wd)" },
                { name: "wp", label: "Weight of Preferred (wp)" },
                { name: "ws", label: "Weight of Equity (ws)" },
                { name: "afterTaxCostOfDebt", label: "After-Tax Cost of Debt" },
                { name: "costOfPreferred", label: "Cost of Preferred" },
                { name: "costOfEquity", label: "Cost of Equity" },
                { name: "wacc", label: "WACC" },
                { name: "npv", label: "NPV ($)" },
                { name: "irr", label: "IRR" },
                { name: "mirr", label: "MIRR" },
                { name: "payback", label: "Payback (years)" },
                { name: "discountedPayback", label: "Discounted Payback (years)" },
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

          <Card title="Recommendation Memo" action={<FileText className="h-4 w-4 text-slate-500" />}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">
                Provide a 1–2 paragraph recommendation (accept / reject) with supporting rationale.
              </label>
              <textarea
                {...register("recommendation")}
                rows={6}
                className={`w-full rounded-md border bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 ${
                  errors.recommendation ? "border-rose-700" : "border-slate-700"
                }`}
                placeholder="Based on the WACC of X% and NPV of $Y, I recommend..."
              />
              {errors.recommendation && (
                <p className="text-xs text-rose-400">{errors.recommendation.message}</p>
              )}
            </div>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-md border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
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
                <h3 className="text-lg font-bold text-slate-50">Submission Received</h3>
                <p className="text-xs text-slate-400">Deterministic grading complete</p>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-slate-800/50 p-4 text-center">
              <div className="text-3xl font-extrabold text-slate-50">{score}%</div>
              <div className="text-xs text-slate-500">Overall Score</div>
            </div>

            <div className="space-y-2 text-sm">
              {Object.entries(flags).map(([key, ok]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize text-slate-400">{key.replace(/([A-Z])/g, " $1")}</span>
                  <Badge variant={ok ? "success" : "error"}>{ok ? "Correct" : "Incorrect"}</Badge>
                </div>
              ))}
            </div>

            <button
              onClick={handleCloseModal}
              className="mt-6 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              View Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
