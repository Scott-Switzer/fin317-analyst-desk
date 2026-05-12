import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  barClassName = "",
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-emerald-600 transition-all duration-500 ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
