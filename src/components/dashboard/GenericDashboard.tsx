"use client";

import { LayoutDashboard, Plus, Users, Wallet } from "lucide-react";
import Link from "next/link";

interface Props {
  userName: string;
  role: string;
}

export default function GenericDashboard({ userName, role }: Props) {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");

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
