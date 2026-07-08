import { Users, Layers, TrendingUp, AlertTriangle } from "lucide-react";

export default function HrDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Active Employees", value: "148 Members", change: "+12 this quarter", icon: Users, color: "text-emerald-400 bg-emerald-500/10" },
          { name: "Total Departments", value: "12 Branches", change: "Across 3 sites", icon: Layers, color: "text-blue-400 bg-blue-500/10" },
          { name: "Overall Utilization Index", value: "79.1%", change: "Within optimal range", icon: TrendingUp, color: "text-amber-400 bg-amber-500/10" },
          { name: "Active Dispute Cases", value: "0 Open", change: "All claims verified", icon: AlertTriangle, color: "text-rose-400 bg-rose-500/10" },
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
        <h4 className="text-sm font-bold text-white mb-2">HR & Admin Analytics</h4>
        <p className="text-xs text-slate-400 leading-normal">
          Oversee company-wide resource allocations, investigate under-performing flags, resolve work token disputes, and configure integrations.
        </p>
      </div>
    </div>
  );
}
