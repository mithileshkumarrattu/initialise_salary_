"use client";

import { CheckCircle2, Coins, TrendingUp, Wallet, Plus, ArrowRightLeft, Bell, BookOpen, AlertCircle } from "lucide-react";
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
  const progress = profile.progress_percentage ?? 82;
  const canInitiateSalary = progress >= 85;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;
  const tokensEarned = 41;
  const tokensRequired = 50;

  // Mock schedule data - will be fetched from DB
  const todayClasses = [
    { time: "09:00-10:30", subject: "Advanced DBMS", room: "Room 301", status: "Done", tokens: "1 token" },
    { time: "10:30-11:30", subject: "Software Engineering", room: "Seminar Hall", status: "Done", tokens: "1 token" },
    { time: "11:30-12:30", subject: "Lab – Operating Systems", room: "CS Lab 2", status: "Upcoming", tokens: "1 token" },
    { time: "02:00-03:00", subject: "Software Engg.", room: "Room 205", status: "Upcoming", tokens: "1 token" },
  ];

  // Mock active commitments
  const activeCommitments = [
    { title: "Freshers' Day Event Coordination", tokens: 3, dueDate: "23 Mar 2026", status: "4 days left" },
    { title: "NPTEL Course Completion", tokens: 8, dueDate: "21 Mar 2026", status: "Overdue" },
    { title: "Mid-Term Paper Evaluation", tokens: 7, dueDate: "31 Mar 2026", status: "7 days left" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, Dr. {profile.name?.split(" ").slice(1).join(" ") ?? "Faculty"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg">
            Monthly Target: 50 tokens
          </span>
          <span className="px-4 py-2 bg-success/10 text-success text-sm font-semibold rounded-lg">
            Earned: 41 tokens
          </span>
          <span className="px-4 py-2 bg-warning/10 text-warning text-sm font-semibold rounded-lg">
            Progress: 82%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Progress Ring */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 lg:col-span-1">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Progress</h2>

          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={canInitiateSalary ? "#22c55e" : "hsl(var(--primary))"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{Math.round(progress)}%</span>
              <span className="text-xs text-muted-foreground">Overall</span>
            </div>
          </div>

          <div className="w-full space-y-3 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Semester 2025-26</span>
              <span className="font-medium text-foreground">{tokensEarned} of {tokensRequired} tokens</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(tokensEarned / tokensRequired) * 100}%` }}
              />
            </div>
          </div>

          {canInitiateSalary ? (
            <button className="w-full bg-success text-success-foreground hover:bg-success/90 rounded-lg py-2.5 text-sm font-semibold transition shadow-sm">
              🎉 Initiate Salary Transfer
            </button>
          ) : (
            <div className="w-full bg-warning/10 rounded-lg py-2.5 text-sm text-center text-warning font-medium">
              {50 - tokensEarned} tokens needed for salary release
            </div>
          )}
        </div>

        {/* Middle: Token Balance & Loan */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Token Balance</span>
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground">
              41 <span className="text-primary text-lg">WORK</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Current balance</p>
          </div>

          <div className="bg-error/5 border border-error/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-error flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Raise Loan Request
              </span>
            </div>
            <p className="text-xs text-muted-foreground">3 more tokens needed to reach salary threshold</p>
            <button className="mt-3 w-full text-xs bg-error text-error-foreground py-2 rounded-lg hover:bg-error/90 transition font-medium">
              Request Loan
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Actions</h2>
            <div className="space-y-2">
              <Link href="/my-work" className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition text-sm font-medium text-muted-foreground hover:text-primary">
                <BookOpen className="w-4 h-4" />
                Mark Attendance
              </Link>
              <Link href="/task-pool" className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition text-sm font-medium text-muted-foreground hover:text-primary">
                <Plus className="w-4 h-4" />
                Browse Tasks
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Today's Schedule */}
        <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">This Week's Schedule</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todayClasses.map((cls, i) => (
              <div key={i} className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition cursor-pointer">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-muted-foreground">{cls.time}</div>
                  <div className="text-sm font-medium text-foreground mt-1">{cls.subject}</div>
                  <div className="text-xs text-muted-foreground">{cls.room}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${cls.status === "Done" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {cls.status === "Done" ? "✓ Done" : "⏱ Upcoming"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Commitments */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">My Active Commitments</h2>
          <Link href="/my-work" className="text-sm text-primary hover:underline">Browse all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeCommitments.map((task, i) => (
            <div key={i} className="border border-border rounded-lg p-4 hover:border-primary/40 transition cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase"># {i + 1} tokens</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${task.status.includes("Overdue") ? "bg-error/10 text-error" : "bg-warning/10 text-warning"}`}>
                  {task.status}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-2">{task.title}</h3>
              <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
              <button className="mt-3 w-full text-xs bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition font-medium">
                Submit Proof
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
