import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import HodDashboard from '@/components/dashboard/HodDashboard';
import DirectorDashboard from '@/components/dashboard/DirectorDashboard';
import GenericDashboard from '@/components/dashboard/GenericDashboard';
import {
  getFacultyDashboardStats,
  getHodDashboardStats,
  getDirectorDashboardStats,
} from '@/lib/db/queries/dashboard';
import { getAssignedTasks } from '@/lib/db/queries/tasks';
import RoleGate from '@/components/common/RoleGate';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, name, email, role, organization_id, department_id, progress_percentage, token_balance, loan_balance')
    .eq('id', user.id)
    .single();

  // If no profile yet (new user / DB not set up), show generic
  if (profileError || !profile) {
    return (
      <RoleGate>
        <div className="p-6 lg:p-8">
          <GenericDashboard userName={user.user_metadata?.full_name ?? user.email ?? 'User'} role="admin" />
        </div>
      </RoleGate>
    );
  }

  const { role } = profile;

  // ─── Faculty Dashboard ────────────────────────────────────────────────
  if (role === 'faculty') {
    let stats = null;
    let activeTasks: any[] = [];

    try {
      [stats, activeTasks] = await Promise.all([
        getFacultyDashboardStats(user.id),
        getAssignedTasks(user.id),
      ]);
    } catch (e) {
      console.error('Faculty dashboard data fetch failed:', e);
    }

    return (
      <RoleGate>
        <div className="p-6 lg:p-8">
          <FacultyDashboard
            profile={profile}
            stats={stats}
            activeTasks={activeTasks}
          />
        </div>
      </RoleGate>
    );
  }

  // ─── HOD / Dean Dashboard ─────────────────────────────────────────────
  if (role === 'hod' || role === 'dean') {
    let hodStats = null;

    if (profile.department_id) {
      try {
        hodStats = await getHodDashboardStats(profile.department_id);
      } catch (e) {
        console.error('HOD dashboard data fetch failed:', e);
      }
    }

    return (
      <RoleGate>
        <div className="p-6 lg:p-8">
          <HodDashboard profile={profile} stats={hodStats} />
        </div>
      </RoleGate>
    );
  }

  // ─── Director Dashboard ───────────────────────────────────────────────
  if (role === 'director') {
    let directorStats = null;

    if (profile.organization_id) {
      try {
        directorStats = await getDirectorDashboardStats(profile.organization_id);
      } catch (e) {
        console.error('Director dashboard data fetch failed:', e);
      }
    }

    return (
      <RoleGate>
        <div className="p-6 lg:p-8">
          <DirectorDashboard profile={profile} stats={directorStats} />
        </div>
      </RoleGate>
    );
  }

  // ─── Generic (Admin, Manager, Finance, HR, Employee) ─────────────────
  return (
    <RoleGate>
      <div className="p-6 lg:p-8">
        <GenericDashboard userName={profile.name} role={role} />
      </div>
    </RoleGate>
  );
}
