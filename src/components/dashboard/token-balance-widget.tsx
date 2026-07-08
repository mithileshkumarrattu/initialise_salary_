"use client";

import { Coins, HandCoins, AlertTriangle } from "lucide-react";

interface TokenBalanceWidgetProps {
  balance: number;
  loanBalance: number;
}

export function TokenBalanceWidget({ balance, loanBalance }: TokenBalanceWidgetProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Wallet Balance */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between shadow-lg backdrop-blur-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Wallet Balance</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-primary">WORK</span>
          </div>
        </div>
        <span className="rounded-xl bg-primary/10 p-3.5 text-primary drop-shadow-[0_0_6px_rgba(var(--primary),0.2)]">
          <Coins size={22} />
        </span>
      </div>

      {/* Loan Balance */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between shadow-lg backdrop-blur-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Outstanding Advance</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(loanBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-warning">WORK</span>
          </div>
        </div>
        <span className={`rounded-xl p-3.5 shrink-0 ${
          loanBalance > 0 
            ? "bg-warning/10 text-warning drop-shadow-[0_0_6px_rgba(var(--warning),0.2)]" 
            : "bg-muted text-muted-foreground"
        }`}>
          <HandCoins size={22} />
        </span>
      </div>
    </div>
  );
}
