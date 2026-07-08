'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle2, Clock, AlertCircle, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

export default function MyWorkClient({ tasks }: { tasks: any[] }) {
  const [filter, setFilter] = useState('ALL');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN' && task.nomination_status === 'ASSIGNED') return true;
    if (filter === 'COMPLETED' && task.nomination_status === 'COMPLETED') return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
          <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground transition">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filter === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-foreground hover:bg-muted'}`}
          >
            All Tasks
          </button>
          <button 
            onClick={() => setFilter('OPEN')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filter === 'OPEN' ? 'bg-warning text-warning-foreground' : 'bg-background border border-border text-foreground hover:bg-muted'}`}
          >
            Open
          </button>
          <button 
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filter === 'COMPLETED' ? 'bg-success text-success-foreground' : 'bg-background border border-border text-foreground hover:bg-muted'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-success/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">You're all caught up!</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">You have no tasks matching this filter. Check the Task Pool to nominate for new work.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-foreground">Task <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tokens</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-foreground">Assigned <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map((task, i) => (
                  <tr key={task.id || i} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{task.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 max-w-md truncate">{task.description || "No description"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {task.nomination_status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : task.nomination_status === 'PROOF_SUBMITTED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <AlertCircle className="w-3.5 h-3.5" /> Under Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Award className="w-3.5 h-3.5" /> {task.token_value}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {task.nominated_at ? format(new Date(task.nominated_at), 'MMM dd, yyyy') : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {task.nomination_status === 'ASSIGNED' && (
                        <button className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-medium rounded-md transition mr-2">
                          Submit Proof
                        </button>
                      )}
                      <button className="text-muted-foreground hover:text-foreground transition p-1 align-middle">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
