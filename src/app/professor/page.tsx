"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import ProgressBar from "@/components/ui/ProgressBar";
import { computeMockAnalytics } from "@/lib/data/professorAnalytics";

interface Submission {
  mission: string;
  score: number;
  flags: Record<string, boolean>;
  submittedAt: string;
  data?: Record<string, string>;
}

const mockSubmissions: Submission[] = [
  {
    mission: "project-falcon",
    score: 92,
    flags: {},
    submittedAt: "2026-05-10T14:30:00Z",
    data: { studentName: "Alex Analyst" },
  },
  {
    mission: "project-falcon",
    score: 74,
    flags: {},
    submittedAt: "2026-05-10T15:12:00Z",
    data: { studentName: "Jordan Lee" },
  },
  {
    mission: "project-falcon",
    score: 68,
    flags: {},
    submittedAt: "2026-05-10T16:45:00Z",
    data: { studentName: "Taylor Smith" },
  },
  {
    mission: "project-falcon",
    score: 85,
    flags: {},
    submittedAt: "2026-05-11T09:20:00Z",
    data: { studentName: "Morgan Chen" },
  },
];

export default function ProfessorPage() {
  const router = useRouter();
  const [submissions] = useState<Submission[]>(() => {
    if (typeof window === "undefined") return mockSubmissions;
    const raw = localStorage.getItem("fin317_submission_project-falcon");
    if (!raw) return mockSubmissions;
    try {
      const parsed: Submission = JSON.parse(raw);
      if (!mockSubmissions.find((s) => s.submittedAt === parsed.submittedAt)) {
        return [parsed, ...mockSubmissions];
      }
      return mockSubmissions;
    } catch {
      return mockSubmissions;
    }
  });

  const analytics = computeMockAnalytics();

  const avgScore =
    submissions.reduce((sum, s) => sum + s.score, 0) / (submissions.length || 1);

  const handleExportCSV = () => {
    const headers = ["Student", "Mission", "Score", "Submitted At"];
    const rows = submissions.map((s) => [
      s.data?.studentName ?? "Anonymous",
      s.mission,
      String(s.score),
      new Date(s.submittedAt).toLocaleString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fin317-submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-slate-50">Professor Dashboard</span>
            <Badge variant="info">Prototype</Badge>
          </div>
          <span className="text-xs text-slate-500">FIN 317 — Spring 2026</span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-950 text-sky-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-50">{submissions.length}</div>
              <div className="text-xs text-slate-500">Submissions</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-50">{avgScore.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">Average Score</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-950 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-50">{analytics.commonErrors.length}</div>
              <div className="text-xs text-slate-500">Common Errors</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-950 text-rose-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-50">{analytics.conceptWeaknesses.length}</div>
              <div className="text-xs text-slate-500">Concept Gaps</div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Common Errors */}
          <div className="space-y-6 lg:col-span-1">
            <Card title="Common Errors">
              <div className="space-y-4">
                {analytics.commonErrors.map((err) => (
                  <div key={err.concept} className="rounded-md border border-slate-800 bg-slate-900/40 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-200">{err.concept}</span>
                      <Badge variant="error">{err.frequency}%</Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">{err.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Concept Weaknesses">
              <div className="space-y-4">
                {analytics.conceptWeaknesses.map((cw) => (
                  <div key={cw.concept}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{cw.concept}</span>
                      <span className="text-xs text-slate-500">{cw.students} students</span>
                    </div>
                    <ProgressBar
                      value={cw.avgScore}
                      max={100}
                      showPercentage={false}
                      barClassName={cw.avgScore < 65 ? "bg-rose-500" : cw.avgScore < 75 ? "bg-amber-500" : "bg-emerald-500"}
                    />
                    <div className="mt-1 text-right text-xs text-slate-500">Avg {cw.avgScore}%</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Submissions Table */}
          <div className="lg:col-span-2">
            <Card
              title="Recent Submissions"
              action={
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
              }
            >
              <DataTable
                columns={[
                  { key: "studentName", header: "Student", render: (row) => <span className="font-medium text-slate-200">{(row.data as Record<string, string>)?.studentName ?? "Anonymous"}</span> },
                  { key: "mission", header: "Mission", render: (row) => <span className="capitalize">{String(row.mission).replace(/-/g, " ")}</span> },
                  {
                    key: "score",
                    header: "Score",
                    render: (row) => (
                      <Badge
                        variant={
                          row.score >= 85 ? "success" : row.score >= 70 ? "warning" : "error"
                        }
                      >
                        {row.score}%
                      </Badge>
                    ),
                  },
                  {
                    key: "submittedAt",
                    header: "Submitted",
                    render: (row) => (
                      <span className="text-xs text-slate-500">
                        {new Date(row.submittedAt as string).toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) =>
                      row.score >= 70 ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Pass</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400">
                          <XCircle className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Review</span>
                        </div>
                      ),
                  },
                ]}
                data={submissions}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
