import { TrendingUp, ListTodo, AlertTriangle, Coins } from "lucide-react";

export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Team Average Utilization", value: "78.5%", change: "Healthy load", icon: TrendingUp, color: "text-blue-400 bg-blue-500/10" },
          { name: "Unassigned Ad-hoc Tasks", value: "8 Tasks", change: "Matching skills available", icon: ListTodo, color: "text-amber-400 bg-amber-500/10" },
          { name: "Overloaded Team Members", value: "1 Member", change: "Jira load > 90%", icon: AlertTriangle, color: "text-rose-400 bg-rose-500/10" },
          { name: "Tokens Awarded to Team", value: "3,200 WT", change: "Budget remaining: 1.8k", icon: Coins, color: "text-emerald-400 bg-emerald-500/10" },
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
        <h4 className="text-sm font-bold text-white mb-2">Manager Board</h4>
        <p className="text-xs text-slate-400 leading-normal">
          Monitor team members' weekly capacity and token totals, approve ad-hoc work proof submissions, and allocate tasks using our workload filters.
        </p>
      </div>
    </div>
  );
}
