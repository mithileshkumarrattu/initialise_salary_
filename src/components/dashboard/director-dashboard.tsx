import { Coins, TrendingUp, HandCoins, Users } from "lucide-react";

export default function DirectorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Global Token Supply", value: "25,000 WT", change: "Locked in reserve: 15k", icon: Coins, color: "text-emerald-400 bg-emerald-500/10" },
          { name: "Avg Institution Progress", value: "86.2%", change: "Overall goal met", icon: TrendingUp, color: "text-blue-400 bg-blue-500/10" },
          { name: "Total Outstanding Loans", value: "1,200 WT", change: "Risk Exposure: 4.8%", icon: HandCoins, color: "text-amber-400 bg-amber-500/10" },
          { name: "Registered Departments", value: "8 Branches", change: "240 Faculty members", icon: Users, color: "text-purple-400 bg-purple-500/10" },
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
        <h4 className="text-sm font-bold text-white mb-2">Director's Overview</h4>
        <p className="text-xs text-slate-400 leading-normal">
          Monitor token circulation, institution load distributions, and pending salary batch approvals across all college branches.
        </p>
      </div>
    </div>
  );
}
