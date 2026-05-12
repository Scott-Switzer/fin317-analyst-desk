"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogIn, User } from "lucide-react";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("fin317_user");
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleDemoLogin = () => {
    const mockUser = {
      id: "demo-001",
      name: "Alex Analyst",
      email: "alex@university.edu",
      role: "student",
      rank: "Junior Analyst",
      xp: 1250,
      xpToNext: 2000,
    };
    localStorage.setItem("fin317_user", JSON.stringify(mockUser));
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-50">FIN 317 Analyst Desk</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to access your missions and dashboard.</p>
        </div>

        <Card className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              placeholder="alex@university.edu"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <button
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            <LogIn className="h-4 w-4" />
            Demo Login
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
          >
            <User className="h-4 w-4" />
            Continue as Guest
          </button>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500">
          This is a demo environment. No real authentication is enforced.
        </p>
      </div>
    </div>
  );
}
