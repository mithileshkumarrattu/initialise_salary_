"use client";

import { CheckCircle2, Coins, TrendingUp, Wallet, Plus, ArrowRightLeft, Bell, BookOpen } from "lucide-react";
import Link from "next/link";

interface Props {
  profile: {
    id: string;
    name: string;
    email: string;
    role: string;
    progress_percentage: number;
    token_balance: number;
    loan_balance: number;
  };
}

export default function FacultyDashboard({ profile }: Props) {
  const progress = profile.progress_percentage ?? 0;
  const canInitiateSalary = progress >= 85;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {profile.name?.split(" ")[0] ?? "Faculty"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Ring (Left) */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Progress</h2>

          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={canInitiateSalary ? "hsl(var(--success))" : "hsl(var(--primary))"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{Math.round(progress)}%</span>
              <span className="text-xs text-muted-foreground">Overall</span>
            </div>
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Structured (70%)</span>
              <span className="font-medium text-foreground">—</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Unstructured (30%)</span>
              <span className="font-medium text-foreground">—</span>
            </div>
          </div>

          {/* Salary Button */}
          {canInitiateSalary ? (
            <button className="w-full bg-success text-success-foreground hover:bg-success/90 rounded-lg py-2.5 text-sm font-semibold transition shadow-sm">
              🎉 Initiate Salary Transfer
            </button>
          ) : (
            <div className="w-full bg-muted rounded-lg py-2.5 text-sm text-center text-muted-foreground">
              Salary available at 85% progress
            </div>
          )}
        </div>

        {/* Middle Column: Balance + Loan */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Token Balance</span>
              <Coins className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {profile.token_balance ?? 0} <span className="text-primary text-xl">WTK</span>
            </div>
          </div>

          {(profile.loan_balance ?? 0) > 0 && (
            <div className="bg-error/5 border border-error/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-error">Work Loan</span>
                <TrendingUp className="w-4 h-4 text-error" />
              </div>
              <div className="text-2xl font-bold text-error">
                {profile.loan_balance} WTK
              </div>
              <p className="text-xs text-muted-foreground mt-1">Outstanding loan balance</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/my-work" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition text-sm font-medium text-muted-foreground hover:text-primary">
                <BookOpen className="w-5 h-5" />
                My Schedule
              </Link>
              <Link href="/task-pool" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition text-sm font-medium text-muted-foreground hover:text-primary">
                <Plus className="w-5 h-5" />
                Browse Tasks
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Schedule */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {/* Fetched from DB in production — empty state for now */}
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No classes scheduled today</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Your timetable will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Active Commitments</h2>
          <Link href="/my-work" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No active tasks</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            <Link href="/task-pool" className="text-primary hover:underline">Browse the task pool</Link> to get started
          </p>
        </div>
      </div>
    </div>
  );
}
