import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDepartmentTeam } from '@/lib/db/queries/team';
import TeamClient from '@/components/team/TeamClient';
import { AlertCircle, UserPlus } from 'lucide-react';
import RoleGate from '@/components/common/RoleGate';

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('department_id, role')
    .eq('id', user.id)
    .single();

  const isGlobalRole = profile?.role === 'admin' || profile?.role === 'director' || profile?.role === 'finance' || profile?.role === 'hr_admin';

  if (profileError || (!profile?.department_id && !isGlobalRole)) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-warning mb-4" />
        <h2 className="text-xl font-bold">Department Not Found</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">You must be assigned to a department to view the team.</p>
      </div>
    );
  }

  let team = [];
  try {
    team = await getDepartmentTeam(profile.department_id);
  } catch (err) {
    console.error("Failed to load team:", err);
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Failed to load team</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">There was a problem communicating with the database.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage members of your department.</p>
        </div>
        
        {/* Only HOD/Director/Admin can invite users */}
        <RoleGate allowedRoles={['hod', 'director', 'admin', 'hr_admin']}>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition shadow-sm">
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </RoleGate>
      </div>

      <TeamClient team={team} />
    </div>
  );
}
