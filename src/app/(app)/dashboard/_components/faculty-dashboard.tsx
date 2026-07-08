"use client";

import { ProgressRing } from "./progress-ring";
import { ActionButton } from "./action-button";
import { TodaySchedule } from "./today-schedule";
import { ActiveCommitments } from "./active-commitments";
import { TokenBalanceWidget } from "./token-balance-widget";
import { LoanAlert } from "./loan-alert";

interface Props {
  userData: {
    id: string;
    orgId: string;
    name: string;
    progress: number;
    tokenBalance: number;
    loanBalance: number;
  };
  structuredTasks: any[];
  unstructuredTasks: any[];
  onRefresh: () => void;
}

export default function FacultyDashboard({ userData, structuredTasks, unstructuredTasks, onRefresh }: Props) {
  const threshold = 85; // monthly verified task target percentage
  const eligible = userData.progress >= threshold;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Welcome back, {userData.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Faculty member dashboard & active ledger controls</p>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-lg shrink-0 self-start">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3 width) - Status meters and Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Progress Display */}
            <ProgressRing percentage={userData.progress} />
            
            {/* Action Controller */}
            <ActionButton 
              eligible={eligible} 
              loanBalance={userData.loanBalance} 
              userId={userData.id}
              userOrgId={userData.orgId}
              onRefresh={onRefresh}
            />
          </div>

          {/* Token Wealth Info */}
          <TokenBalanceWidget balance={userData.tokenBalance} loanBalance={userData.loanBalance} />
          
          {/* Timetable schedule */}
          <TodaySchedule tasks={structuredTasks} onRefresh={onRefresh} />
        </div>

        {/* Right Column (1/3 width) - Warnings & Task Commitments */}
        <div className="space-y-6">
          {/* Loan Warning */}
          {userData.loanBalance > 0 && <LoanAlert loanBalance={userData.loanBalance} />}
          
          {/* Active Work Load */}
          <ActiveCommitments tasks={unstructuredTasks} userId={userData.id} onRefresh={onRefresh} />
        </div>
      </div>
    </div>
  );
}
