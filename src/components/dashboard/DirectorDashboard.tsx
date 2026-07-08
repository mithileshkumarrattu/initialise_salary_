"use client";

import { Coins, Users, TrendingUp, AlertTriangle } from "lucide-react";

interface Props {
  profile: { id: string; name: string; organization_id: string; };
}

export default function DirectorDashboard({ profile }: Props) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Director Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Organisation-wide token circulation and performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Total Minted</span>
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">0 <span className="text-primary text-xl">WTK</span></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Faculty Held</span>
            <Users className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div className="text-3xl font-bold text-foreground">0 <span className="text-[#00D4FF] text-xl">WTK</span></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Below Threshold</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <div className="text-3xl font-bold text-foreground">0</div>
          <p className="text-xs text-muted-foreground mt-1">Faculty below 85%</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Reversed This Month</span>
            <TrendingUp className="w-4 h-4 text-error" />
          </div>
          <div className="text-3xl font-bold text-foreground">0 <span className="text-error text-xl">WTK</span></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Department Progress Heatmap</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Users className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No departments configured yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Set up your organisation in Settings → Departments</p>
        </div>
      </div>
    </div>
  );
}
