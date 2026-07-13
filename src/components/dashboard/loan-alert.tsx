"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LoanAlertProps {
  loanBalance: number;
}

export function LoanAlert({ loanBalance }: LoanAlertProps) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 flex gap-3.5 items-start shadow-lg shadow-destructive/10 backdrop-blur-sm animate-pulse-slow">
      <span className="rounded-lg bg-destructive/10 p-2 text-destructive shrink-0">
        <AlertTriangle size={18} />
      </span>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-destructive uppercase tracking-wider">Active Loan Balance Warning</h4>
        <p className="text-[11px] text-destructive/80 leading-normal">
          You currently have an outstanding token advance of **{loanBalance.toFixed(2)} WORK** on your account.
        </p>
        <p className="text-[10px] text-muted-foreground leading-normal">
          10% of earnings from subsequent ad-hoc task payouts will be automatically redirected to settle this loan.
        </p>
        <div className="pt-2">
          <Link
            href="/task-pool"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive hover:text-destructive/80 hover:underline transition"
          >
            Find ad-hoc tasks in the Task Pool <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
