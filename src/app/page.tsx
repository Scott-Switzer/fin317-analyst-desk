import Link from "next/link";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Top nav */}
      <nav className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-bold tracking-tight text-slate-50">
              FIN 317 Analyst Desk
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            Corporate Finance Analytics Platform
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-50 sm:text-6xl">
            Master the Numbers.
            <br />
            <span className="text-emerald-500">Prove Your Edge.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-8 text-slate-400">
            Analyze real-world capital structure scenarios, run DCF models, and
            earn analyst ranks through structured missions. Built for FIN 317.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-emerald-500"
            >
              <ShieldCheck className="h-4 w-4" />
              Enter the Desk
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500">
        FIN 317 Analyst Desk — Educational use only. Not financial advice.
      </footer>
    </div>
  );
}
