"use client";

import { Coins, Users, TrendingUp, AlertTriangle, PieChart, BookOpen } from "lucide-react";
import Link from "next/link";

interface Props {
  profile: { id: string; name: string; organization_id: string; };
}

export default function DirectorDashboard({ profile }: Props) {
  // Mock institution-wide data
  const totals = {
    minted: 1500000,
    withFaculty: 785000,
    belowThreshold: 12,
    reversedThisMonth: 716000,
  };

  const departmentStats = [
    { dept: "CSE", progress: 85, status: "Watch", color: "bg-success/20" },
    { dept: "ECE", progress: 92, status: "On Track", color: "bg-success/20" },
    { dept: "MECH", progress: 74, status: "Watch", color: "bg-warning/20" },
    { dept: "EEE", progress: 91, status: "On Track", color: "bg-success/20" },
    { dept: "CIVIL", progress: 63, status: "Needs Attention", color: "bg-error/20" },
    { dept: "CHEM", progress: 58, status: "Needs Attention", color: "bg-error/20" },
  ];

  const tokenCirculation = [
    { label: "Reversed", amount: 71600, color: "#22c55e" },
    { label: "With Faculty", amount: 78400, color: "#3b82f6" },
    { label: "Loan Debt", amount: 9300, color: "#f97316" },
  ];

  const activeLoans = [
    { name: "Dr. A. Raghavendro", dept: "CSE", amount: 15, status: "Open" },
    { name: "Mrs. B. Lakshmi", dept: "ECE", amount: 8, status: "Partial" },
    { name: "Mr. C. Venkat", dept: "MECH", amount: 22, status: "Partial" },
    { name: "Dr. D. Srinivas", dept: "CIVIL", amount: 19, status: "Open" },
  ];

  const pendingApprovals = [
    { name: "Dr. A. Raghavendro", dept: "CSE", tokens: 25, reason: "Missed 3 sessions due to medical leave" },
    { name: "Mrs. B. Lakshmi", dept: "ECE", tokens: 8, reason: "Conference attendance approved by department" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Director Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-Department Overview — Semester 2025-26</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Dr. K. S. Rao</div>
          <div className="text-xs text-muted-foreground">Director</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Total Tokens Minted</span>
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            15,00,000 <span className="text-primary text-lg">WORK</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">This semester</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Faculty Held</span>
            <Users className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            7,85,000 <span className="text-cyan-500 text-lg">WORK</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">52.3% of minted</p>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-warning font-medium">Faculty Below Threshold</span>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">12</div>
          <p className="text-xs text-muted-foreground mt-2">Needs attention</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Reversed This Month</span>
            <TrendingUp className="w-5 h-5 text-error" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            7,16,000 <span className="text-error text-lg">WORK</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">67.7% returned</p>
        </div>
      </div>

      {/* Token Circulation & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Circulation */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Token Circulation — Live
          </h2>
          <div className="space-y-4">
            {tokenCirculation.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm font-bold text-foreground">{item.amount.toLocaleString()} WORK</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${(item.amount / 1500000) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground p-3 bg-muted rounded">
            All amounts in WORK tokens | Updated in real-time
          </div>
        </div>

        {/* Department Progress Heatmap */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">Department Progress Heatmap</h2>
          <div className="grid grid-cols-3 gap-2">
            {departmentStats.map((dept) => (
              <div key={dept.dept} className={`${dept.color} border border-border rounded-lg p-3 text-center`}>
                <div className="text-xs font-bold text-foreground">{dept.dept}</div>
                <div className="text-lg font-bold text-foreground mt-1">{dept.progress}%</div>
                <div className={`text-xs font-semibold mt-1 ${dept.status === "On Track" ? "text-success" : dept.status === "Watch" ? "text-warning" : "text-error"}`}>
                  {dept.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Loans & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Work Loans */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Active Work Loans</h2>
            <span className="text-xs px-2 py-1 bg-error/10 text-error font-semibold rounded">7 open</span>
          </div>
          <div className="space-y-2">
            {activeLoans.map((loan, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition">
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{loan.name}</div>
                  <div className="text-xs text-muted-foreground">{loan.dept} Department</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{loan.amount} WORK</div>
                  <div className={`text-xs font-semibold ${loan.status === "Open" ? "text-error" : "text-warning"}`}>
                    {loan.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-sm bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-medium">
            View Full Report
          </button>
        </div>

        {/* Pending Loan Approvals */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Pending Loan Approvals</h2>
            <span className="text-xs px-2 py-1 bg-warning/10 text-warning font-semibold rounded">2 pending</span>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((approval, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{approval.name}</div>
                    <div className="text-xs text-muted-foreground">{approval.dept} Department</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 italic">{approval.reason}</p>
                <div className="text-sm font-bold text-foreground mb-3">Request: {approval.tokens} WORK</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="text-xs bg-success text-success-foreground py-2 rounded font-medium hover:bg-success/90">
                    ✓ Approve
                  </button>
                  <button className="text-xs bg-error text-error-foreground py-2 rounded font-medium hover:bg-error/90">
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
