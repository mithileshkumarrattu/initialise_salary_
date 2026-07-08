"use client";

import { CheckCircle2, XCircle, Users, Clock } from "lucide-react";
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
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          HOD Dashboard — {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Department overview and approval queue.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Pending Approvals</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-3xl font-bold text-foreground">0</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Department Members</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">0</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Avg. Progress</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-foreground">—%</div>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Salary Transfer Approvals</h2>
          <Link href="/approvals" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No pending approvals</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Faculty salary transfer requests will appear here</p>
        </div>
      </div>

      {/* Team Heatmap */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Team Progress</h2>
          <Link href="/team" className="text-sm text-primary hover:underline">Manage team</Link>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Users className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No team members yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            <Link href="/team" className="text-primary hover:underline">Add faculty members</Link> to your department
          </p>
        </div>
      </div>
    </div>
  );
}
