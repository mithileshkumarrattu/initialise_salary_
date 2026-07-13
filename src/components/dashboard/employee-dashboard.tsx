import { Coins, Sparkles, UserCheck, CheckCircle2 } from "lucide-react";

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Earned Reputation Tokens", value: "540 Tokens", change: "+120 this month", icon: Coins, color: "text-emerald-400 bg-emerald-500/10" },
          { name: "Auto-detected Activities", value: "18 Events", change: "14 confirmed, 4 pending", icon: Sparkles, color: "text-blue-400 bg-blue-500/10" },
          { name: "My Capacity Score", value: "72% (Optimal)", change: "12 focus hrs scheduled", icon: UserCheck, color: "text-amber-400 bg-amber-500/10" },
          { name: "Burnout Risk Level", value: "Low Risk", change: "Focus time is healthy", icon: CheckCircle2, color: "text-purple-400 bg-purple-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border border-slate-900 bg-slate-900/40 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">{stat.name}</span>
                <span className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon size={18} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="block text-xs text-slate-500 mt-1">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-6">
        <h4 className="text-sm font-bold text-white mb-2">Employee Workspace</h4>
        <p className="text-xs text-slate-400 leading-normal">
          Review integrations, confirm auto-detected meeting or git commit actions, monitor utilization scores, and self-nominate for ad-hoc tasks.
        </p>
      </div>
    </div>
  );
}
