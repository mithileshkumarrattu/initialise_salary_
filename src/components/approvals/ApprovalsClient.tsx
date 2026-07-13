'use client';

import { useState } from 'react';
import { Search, CheckCircle2, XCircle, Clock, FileText, Landmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PendingApproval } from '@/lib/db/queries/approvals';

export default function ApprovalsClient({ approvals }: { approvals: PendingApproval[] }) {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApprovals = approvals.filter(app => {
    return app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           app.requested_by.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Tabs & Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'PENDING' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Pending ({approvals.length})
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'HISTORY' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            History
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="w-12 h-12 text-success/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">All caught up!</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">There are no pending approvals requiring your attention.</p>
          </div>
        ) : (
          filteredApprovals.map((approval) => (
            <div key={approval.id} className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-1">
                  {approval.type === 'TASK_PROOF' ? <FileText className="w-5 h-5 text-warning" /> : <Landmark className="w-5 h-5 text-warning" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-lg">{approval.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${approval.type === 'TASK_PROOF' ? 'bg-primary/10 text-primary' : 'bg-[#00D4FF]/10 text-[#00D4FF]'}`}>
                      {approval.type === 'TASK_PROOF' ? 'Work Proof' : 'Finance'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{approval.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Requested by: <strong className="text-foreground">{approval.requested_by}</strong></span>
                    <span>{formatDistanceToNow(new Date(approval.requested_at), { addSuffix: true })}</span>
                    <span className="font-medium text-primary">{approval.amount} Tokens</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-success text-success-foreground hover:bg-success/90 font-medium text-sm rounded-lg transition shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-error text-error-foreground hover:bg-error/90 font-medium text-sm rounded-lg transition shadow-sm">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
