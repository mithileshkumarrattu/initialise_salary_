"use client";

import { CheckCircle2, XCircle, Users, Clock, AlertCircle, TrendingUp, Coins } from "lucide-react";
import Link from "next/link";

interface Props {
  profile: {
    id: string;
    name: string;
    role: string;
    organization_id: string;
    department_id: string;
  };
}

export default function HodDashboard({ profile }: Props) {
  // Mock data for Data Engineering HOD
  const departmentStats = {
    totalTokensMinted: 150000,
    tokensWithFaculty: 78400,
    tokensBelowThreshold: 12,
    tokensReversedThisMonth: 71600,
  };

  const approvals = [
    { facultyName: "Dr. A. Raghavendro", dept: "CSE", tokens: 15, status: "Open", action: "Flag for Review" },
    { facultyName: "Mrs. B. Lakshmi", dept: "ECE", tokens: 8, status: "Partial", action: "Flag for Review" },
  ];

  const departmentProgress = [
    { dept: "CSE", progress: 85, status: "On Track", color: "bg-success/20" },
    { dept: "ECE", progress: 92, status: "On Track", color: "bg-success/20" },
    { dept: "MECH", progress: 74, status: "Watch", color: "bg-warning/20" },
    { dept: "EEE", progress: 91, status: "On Track", color: "bg-success/20" },
    { dept: "CIVIL", progress: 63, status: "Critical", color: "bg-error/20" },
    { dept: "CHEM", progress: 58, status: "Critical", color: "bg-error/20" },
  ];

  const facultyList = [
    { name: "Dr. A. Raghavendro", dept: "CSE", loanAmount: 15, monthsInDebt: "3 months", status: "Open", color: "text-error" },
    { name: "Mrs. B. Lakshmi", dept: "ECE", loanAmount: 8, monthsInDebt: "1 month", status: "Partial", color: "text-warning" },
    { name: "Mr. C. Venkat", dept: "MECH", loanAmount: 22, monthsInDebt: "4 months", status: "Partial", color: "text-warning" },
    { name: "Dr. D. Srinivas", dept: "CIVIL", loanAmount: 19, monthsInDebt: "1 month", status: "Open", color: "text-error" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            HOD Dashboard — Data Engineering
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Dr. F. Satheeash</div>
          <div className="text-xs text-muted-foreground">HOD - Computer Science & Engineering</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Total Tokens Minted</span>
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">1,50,000</div>
          <p className="text-xs text-muted-foreground mt-2">This semester</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Tokens with Faculty</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">78,409</div>
          <p className="text-xs text-muted-foreground mt-2">52.3% of minted</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Tokens Reversed This Month</span>
            <TrendingUp className="w-4 h-4 text-error" />
          </div>
          <div className="text-2xl font-bold text-foreground">71,600</div>
          <p className="text-xs text-muted-foreground mt-2">67.7% returned</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-warning font-medium">Faculty Below Threshold</span>
            <AlertCircle className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">12</div>
          <p className="text-xs text-muted-foreground mt-2">Needs attention</p>
        </div>
      </div>

      {/* Department Progress Heatmap */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Department Progress Heatmap</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {departmentProgress.map((dept) => (
            <div key={dept.dept} className={`${dept.color} border border-border rounded-lg p-4 text-center`}>
              <div className="text-sm font-bold text-foreground">{dept.dept}</div>
              <div className="text-2xl font-bold text-foreground mt-2">{dept.progress}%</div>
              <div className={`text-xs font-semibold mt-2 ${dept.status === "On Track" ? "text-success" : dept.status === "Watch" ? "text-warning" : "text-error"}`}>
                {dept.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Loan Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approvals */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Salary Transfer Approvals</h2>
            <span className="text-xs px-2 py-1 bg-warning/10 text-warning font-semibold rounded">2 pending</span>
          </div>
          <div className="space-y-3">
            {approvals.map((approval, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{approval.facultyName}</div>
                    <div className="text-xs text-muted-foreground">{approval.dept}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${approval.status === "Open" ? "bg-error/10 text-error" : "bg-warning/10 text-warning"}`}>
                    {approval.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-foreground mb-3">{approval.tokens} WORK Tokens</div>
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

        {/* Active Work Loans */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Active Work Loans</h2>
            <span className="text-xs px-2 py-1 bg-error/10 text-error font-semibold rounded">7 open</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {facultyList.map((faculty, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition">
                <div>
                  <div className="text-sm font-medium text-foreground">{faculty.name}</div>
                  <div className="text-xs text-muted-foreground">{faculty.dept}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${faculty.color}`}>{faculty.loanAmount} WORK</div>
                  <div className="text-xs text-muted-foreground">{faculty.monthsInDebt}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-sm bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-medium">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
