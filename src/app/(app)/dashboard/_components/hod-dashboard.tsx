import { Coins, UserCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export default function HodDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Department Circulation", value: "4,250 WT", change: "Minted 5,000 WT max", icon: Coins, color: "text-emerald-400 bg-emerald-500/10" },
          { name: "Faculty Weekly Attendance", value: "92.4%", change: "+2.1% from last week", icon: UserCheck, color: "text-blue-400 bg-blue-500/10" },
          { name: "Pending Approvals Queue", value: "14 Requests", change: "Requires digital signature", icon: CheckCircle2, color: "text-amber-400 bg-amber-500/10" },
          { name: "Underperforming Faculty Flags", value: "2 Members", change: "Progress below 85%", icon: AlertTriangle, color: "text-rose-400 bg-rose-500/10" },
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
        <h4 className="text-sm font-bold text-white mb-2">HOD Dashboard</h4>
        <p className="text-xs text-slate-400 leading-normal">
          Upload weekly schedules, verify faculty attendance claims, assign ad-hoc department tasks, and manage salary threshold signatures.
        </p>
      </div>
    </div>
  );
}
