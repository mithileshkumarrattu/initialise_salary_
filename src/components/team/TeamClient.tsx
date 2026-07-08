'use client';

import { useState } from 'react';
import { Search, Filter, Mail, Award, TrendingUp, MoreHorizontal, AlertCircle } from 'lucide-react';
import { TeamMember } from '@/lib/db/queries/team';

export default function TeamClient({ team }: { team: TeamMember[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeam = team.filter(member => 
    (member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase()))
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
              placeholder="Search team members..." 
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

      {/* Team Grid */}
      {filteredTeam.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No team members found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">There are no members matching your search query in this department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => {
            const initials = member.name
              ? member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
              : 'U';
            
            return (
              <div key={member.id} className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col relative group">
                <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition p-1 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center shadow-sm relative overflow-hidden mb-3">
                    <span className="font-bold text-xl text-primary">{initials}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{member.name || 'Anonymous User'}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary mt-1">{member.role}</p>
                </div>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Monthly Progress</span>
                      <span className="text-foreground font-bold">{member.progress_percentage || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${(member.progress_percentage || 0) >= 85 ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${Math.min(member.progress_percentage || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Award className="w-4 h-4 text-warning" />
                    {member.token_balance || 0} WTK
                  </div>
                  <button className="text-primary hover:text-primary/80 font-medium text-xs transition">
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
