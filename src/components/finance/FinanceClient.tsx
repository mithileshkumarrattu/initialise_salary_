'use client';

import { ArrowUpRight, ArrowDownRight, Wallet, History, CreditCard, Plus, Clock, TrendingUp } from 'lucide-react';
import { FinanceData } from '@/lib/db/queries/finance';
import { formatDistanceToNow, format } from 'date-fns';

export default function FinanceClient({ data }: { data: FinanceData }) {
  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Available Balance</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {data.availableBalance.toLocaleString()} <span className="text-primary text-2xl">WTK</span>
            </div>
          </div>
          <div className="mt-6">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition shadow-sm">
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pending Balance</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {data.pendingBalance.toLocaleString()} <span className="text-warning text-xl">WTK</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Total Earned</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {data.totalEarned.toLocaleString()} <span className="text-[#00D4FF] text-xl">WTK</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" />
              Transaction History
            </h2>
          </div>
          
          <div className="space-y-4">
            {data.transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-foreground">No transactions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Your rewards and withdrawals will appear here.</p>
              </div>
            ) : (
              data.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      {tx.type === 'CREDIT' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.title}</p>
                      <p className="text-xs text-muted-foreground max-w-sm truncate">{tx.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'CREDIT' ? 'text-success' : 'text-foreground'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'} {tx.amount.toLocaleString()} WTK
                    </p>
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment Methods
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border bg-background flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  💳
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Pending Setup</p>
                  <p className="text-xs text-muted-foreground">Add wallet address</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-warning bg-warning/10 px-2 py-1 rounded">Action Required</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition bg-background">
              <Plus className="w-4 h-4" /> Setup Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
