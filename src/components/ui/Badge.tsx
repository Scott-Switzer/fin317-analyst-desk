import React from "react";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-800 text-slate-300 border-slate-700",
  success: "bg-emerald-950 text-emerald-400 border-emerald-800",
  error: "bg-rose-950 text-rose-400 border-rose-800",
  warning: "bg-amber-950 text-amber-400 border-amber-800",
  info: "bg-sky-950 text-sky-400 border-sky-800",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
