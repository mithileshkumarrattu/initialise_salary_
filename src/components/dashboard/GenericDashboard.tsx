"use client";

import { LayoutDashboard, Plus, Users, Wallet, Coins, TrendingUp, AlertTriangle, FileText, RotateCcw } from "lucide-react";
import Link from "next/link";

interface Props {
  userName: string;
  role: string;
}

export default function GenericDashboard({ userName, role }: Props) {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");

  // Finance Admin Dashboard
  if (role === "finance") {
    const transactionLog = [
      { eventType: "MINT EVENT", timestamp: "2h ago", to: "Bxab12...99f0", amount: "+56 WORK" },
      { eventType: "TRANSFER EVENT", timestamp: "15h ago", to: "Bx2849...1c7", amount: "0 WORK" },
      { eventType: "REVERSE EVENT", timestamp: "1h ago", batch: "BATCH_992", total: "-45,200 WORK" },
    ];

    const facultyReadiness = [
      { name: "Dr. A. Sharma", id: "0x71C...382", dept: "CSE", balance: 1200, status: "Ready" },
      { name: "Prof. K. Reddy", id: "0x81...9F4", dept: "MECH", balance: 950, status: "Ready" },
      { name: "Dr. M. Patel", id: "0x284...1c7", dept: "ECE", balance: 1050, status: "Ready" },
      { name: "Lect. S. Rao", id: "0x902...4E1", dept: "CIVIL", balance: 650, status: "Pending Verif." },
    ];

    return (
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Finance Department Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Token balance oversight and salary trigger controls</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Finance Admin</div>
            <div className="text-xs text-muted-foreground">Department Head</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">TOKENS READY FOR REVERSAL</span>
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">71,600</div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting batch processing</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">DIRECTOR WALLET BALANCE</span>
              <Coins className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">78,400</div>
            <p className="text-xs text-muted-foreground mt-2">Institution reserve</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-primary font-medium">PENDING SALARY RELEASE</span>
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">104</div>
            <p className="text-xs text-muted-foreground mt-2">Faculty members</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">TOTAL FACULTY</span>
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-2">In system</p>
          </div>
        </div>

        {/* Salary Control Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Salary Release Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Batch Readiness Score</h3>
              <div className="text-3xl font-bold text-foreground mb-2">100%</div>
              <p className="text-xs text-muted-foreground mb-4">100% of pending faculty are fully verified</p>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Trigger Batch Reverse Transfer
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Execute Batch Reversal</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Initiates the final faculty → Director reverse transfer and releases fiat salary.
                <span className="block text-error font-semibold mt-2">✚ REQUIRES VERIFICATION: Execute batch reversal of verified work tokens to trigger salary processing.</span>
              </p>
              <button className="w-full bg-error text-error-foreground py-3 rounded-lg font-semibold hover:bg-error/90 transition opacity-50 cursor-not-allowed" disabled>
                ✕ Execute (Verify First)
              </button>
            </div>
          </div>
        </div>

        {/* Faculty Readiness & Audit Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faculty Readiness */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Faculty Readiness (By Department)</h2>
              <span className="text-xs px-2 py-1 bg-success/10 text-success font-semibold rounded">4 verified</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
                <div>FACULTY NAME</div>
                <div>DEPARTMENT</div>
                <div>TOKEN BALANCE</div>
                <div>STATUS</div>
              </div>
              {facultyReadiness.map((faculty, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/50 transition text-sm">
                  <div>
                    <div className="font-medium text-foreground">{faculty.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{faculty.id}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{faculty.dept}</div>
                  <div className="font-semibold text-foreground">{faculty.balance} WORK</div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${faculty.status === "Ready" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {faculty.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-sm bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-medium">
              Load More Logs
            </button>
          </div>

          {/* Transaction Audit Log */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Transaction Audit Log
              </h2>
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground font-semibold rounded">2d ago</span>
            </div>
            <div className="space-y-3">
              {transactionLog.map((tx, i) => (
                <div key={i} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-semibold text-primary uppercase">{tx.eventType}</div>
                    <div className="text-xs text-muted-foreground">{tx.timestamp}</div>
                  </div>
                  {tx.eventType !== "REVERSE EVENT" ? (
                    <div className="text-xs text-muted-foreground">
                      <div>To: <span className="font-mono text-foreground">{tx.to}</span></div>
                      <div>Amount: <span className="font-semibold text-foreground">{tx.amount}</span></div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      <div>Batch ID: <span className="font-mono text-foreground">{tx.batch}</span></div>
                      <div>Total: <span className="font-semibold text-error">{tx.total}</span></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-sm bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-medium">
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default dashboard for other roles
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border rounded-2xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {userName?.split(" ")[0] ?? "User"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You are signed in as <span className="font-semibold text-foreground">{roleLabel}</span>.
          </p>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
          {roleLabel}
        </span>
      </div>

      {/* Onboarding tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/my-work" className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">My Work</h3>
          <p className="text-sm text-muted-foreground mt-1">View your assigned tasks and schedule.</p>
        </Link>
        <Link href="/task-pool" className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Task Pool</h3>
          <p className="text-sm text-muted-foreground mt-1">Browse and nominate for available tasks.</p>
        </Link>
        <Link href="/settings" className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Set Up Organisation</h3>
          <p className="text-sm text-muted-foreground mt-1">Configure departments, roles and rate cards.</p>
        </Link>
      </div>
    </div>
  );
}
