'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Users, Award, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskPoolClient({ tasks }: { tasks: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search available tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
          <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground transition">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No tasks available</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">There are currently no open tasks in your department's pool to nominate for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, i) => (
            <div key={task.id || i} className="bg-card rounded-xl border border-border shadow-sm p-5 hover:border-primary/50 transition flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Award className="w-3.5 h-3.5" /> {task.token_value} Tokens
                </span>
                {task.priority && (
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${task.priority === 'HIGH' ? 'text-error' : task.priority === 'MEDIUM' ? 'text-warning' : 'text-success'}`}>
                    {task.priority} Priority
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition mb-2">{task.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {task.description || "No description provided."}
              </p>
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {task.created_at ? format(new Date(task.created_at), 'MMM dd') : 'Posted recently'}
                </div>
                <button className="flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md">
                  <Users className="w-3.5 h-3.5" /> Nominate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
