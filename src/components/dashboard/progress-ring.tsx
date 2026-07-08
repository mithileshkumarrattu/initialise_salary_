"use client";

import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export function ProgressRing({ percentage }: { percentage: number }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;
  const isEligible = percentage >= 85;

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-1.5 self-start text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Sparkles size={14} className="text-primary" />
        <span>Monthly Attendance Progress</span>
      </div>

      <div className="relative flex items-center justify-center">
        <svg width="160" height="160" className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-muted"
            strokeWidth="10"
            fill="none"
          />
          {/* Foreground Meter */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`transition-all duration-1000 ease-out ${
              isEligible ? "stroke-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]" : "stroke-warning drop-shadow-[0_0_8px_rgba(var(--warning),0.3)]"
            }`}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-foreground tracking-tight">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5">
            Verified
          </span>
        </div>
      </div>

      {/* Threshold Status */}
      <div className="flex items-center gap-2 rounded-lg bg-background px-4 py-2 border border-border w-full justify-center">
        {isEligible ? (
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <CheckCircle2 size={14} /> 85% Target Reached
          </span>
        ) : (
          <span className="text-xs font-bold text-warning flex items-center gap-1.5">
            <AlertCircle size={14} /> Below 85% Release Threshold
          </span>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground leading-normal">
        Log daily attendance batches to increase your verified score. Salary payouts require an 85% completion rate.
      </p>
    </div>
  );
}
