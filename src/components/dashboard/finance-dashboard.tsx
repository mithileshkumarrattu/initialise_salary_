import { ShieldCheck, Coins, HandCoins, CheckCircle2 } from "lucide-react";

export default function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Director Wallet Balance", value: "12,500 WT", change: "Fully Reconciled", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/10" },
          { name: "Circulating Faculty Wallets", value: "11,300 WT", change: "To be reversed on salary day", icon: Coins, color: "text-blue-400 bg-blue-500/10" },
          { name: "Loans Disbursed Current Month", value: "1,200 WT", change: "Due for settlement", icon: HandCoins, color: "text-amber-400 bg-amber-500/10" },
          { name: "Reconciliation Status", value: "100% Match", change: "Ready for Bank Transfer", icon: CheckCircle2, color: "text-indigo-400 bg-indigo-500/10" },
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
        <h4 className="text-sm font-bold text-white mb-2">Finance Dashboard</h4>
        <p className="text-xs text-slate-400 leading-normal">
          Review total token minting limits, monitor department circulating ledger balances, and release real salary payments after digital signature verification.
        </p>
      </div>
    </div>
  );
}
