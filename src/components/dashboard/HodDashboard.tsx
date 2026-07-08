"use client";

import { CheckCircle2, Users, Clock, FileText } from "lucide-react";
import Link from "next/link";
import type { HodDashboardStats } from "@/lib/db/queries/dashboard";

interface Props {
  profile: {
    id: string;
    name: string;
    role: string;
    organization_id: string;
    department_id: string;
  };
  stats: HodDashboardStats | null;
}

export default function HodDashboard({ profile, stats }: Props) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          HOD Dashboard — {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Department overview and approval queue.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Pending Approvals</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats?.pendingApprovals ?? 0}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Department Members</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats?.totalMembers ?? 0}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Avg. Progress</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats?.avgProgress ?? 0}%</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Open Tasks</span>
            <FileText className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats?.openTasks ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Queue */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Pending Approvals</h2>
            <Link href="/approvals" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-xl">
            <Clock className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">
              {stats?.pendingApprovals ? `${stats.pendingApprovals} items waiting for review` : "No pending approvals"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Task proofs and salary requests will appear here
            </p>
          </div>
        </div>

        {/* Team Heatmap */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Team Overview</h2>
            <Link href="/team" className="text-sm text-primary hover:underline">Manage team</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-xl">
            <Users className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">
              {stats?.totalMembers ? `${stats.totalMembers} active department members` : "No team members yet"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              <Link href="/team" className="text-primary hover:underline">View team progress</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
