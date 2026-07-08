import { createClient } from '@/lib/supabase/server';

// ─── Dashboard Stats ───────────────────────────────────────────────────────

export type FacultyDashboardStats = {
  activeTasks: number;
  completedTasks: number;
  pendingNominations: number;
  tokenBalance: number;
  loanBalance: number;
  progressPercentage: number;
};

export type HodDashboardStats = {
  pendingApprovals: number;
  totalMembers: number;
  avgProgress: number;
  openTasks: number;
};

export type DirectorDashboardStats = {
  totalMinted: number;
  facultyHeld: number;
  belowThreshold: number;
  departmentCount: number;
};

/**
 * Get summary stats for Faculty dashboard
 */
export async function getFacultyDashboardStats(userId: string): Promise<FacultyDashboardStats> {
  const supabase = await createClient();

  // User balance + progress
  const { data: user } = await supabase
    .from('users')
    .select('token_balance, loan_balance, progress_percentage')
    .eq('id', userId)
    .single();

  // Active nominations (ACCEPTED = working on it)
  const { count: activeTasks } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'ACCEPTED');

  // Completed nominations
  const { count: completedTasks } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED');

  // Pending nominations (applied but not yet accepted)
  const { count: pendingNominations } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'PENDING');

  return {
    activeTasks: activeTasks ?? 0,
    completedTasks: completedTasks ?? 0,
    pendingNominations: pendingNominations ?? 0,
    tokenBalance: Number(user?.token_balance ?? 0),
    loanBalance: Number(user?.loan_balance ?? 0),
    progressPercentage: Number(user?.progress_percentage ?? 0),
  };
}

/**
 * Get summary stats for HOD dashboard
 */
export async function getHodDashboardStats(departmentId: string): Promise<HodDashboardStats> {
  const supabase = await createClient();

  // Total members in department
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('department_id', departmentId);

  // Average progress
  const { data: members } = await supabase
    .from('users')
    .select('progress_percentage')
    .eq('department_id', departmentId);

  const avgProgress = members && members.length > 0
    ? Math.round(members.reduce((sum, m) => sum + (Number(m.progress_percentage) || 0), 0) / members.length)
    : 0;

  // Tasks pending approval (COMPLETED but not VERIFIED)
  const { count: pendingApprovals } = await supabase
    .from('unstructured_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('department_id', departmentId)
    .eq('status', 'COMPLETED');

  // Open tasks in pool
  const { count: openTasks } = await supabase
    .from('unstructured_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('department_id', departmentId)
    .eq('status', 'OPEN');

  return {
    totalMembers: totalMembers ?? 0,
    avgProgress,
    pendingApprovals: pendingApprovals ?? 0,
    openTasks: openTasks ?? 0,
  };
}

/**
 * Get summary stats for Director dashboard
 */
export async function getDirectorDashboardStats(orgId: string): Promise<DirectorDashboardStats> {
  const supabase = await createClient();

  // Sum of all token balances = Faculty Held
  const { data: balances } = await supabase
    .from('users')
    .select('token_balance')
    .eq('organization_id', orgId);

  const facultyHeld = (balances || []).reduce((sum, u) => sum + Number(u.token_balance || 0), 0);

  // Users below 85%
  const { count: belowThreshold } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .eq('role', 'faculty')
    .lt('progress_percentage', 85);

  // Departments
  const { count: departmentCount } = await supabase
    .from('departments')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId);

  return {
    totalMinted: 0, // Would need a separate token_ledger table to track this accurately
    facultyHeld: Math.round(facultyHeld),
    belowThreshold: belowThreshold ?? 0,
    departmentCount: departmentCount ?? 0,
  };
}

export type UserProfileStats = {
  tasksCompleted: number;
  hoursLogged: number;
  tokensEarned: number;
  achievements: string[];
};

export type RecentActivity = {
  id: string;
  action: string;
  timestamp: string;
  metadata?: any;
};

/**
 * Fetch profile statistics for a user
 */
export async function getUserProfileStats(userId: string): Promise<UserProfileStats> {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from('users')
    .select('token_balance')
    .eq('id', userId)
    .single();

  const { count: tasksCompleted } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED');

  const { data: structuredTasks } = await supabase
    .from('structured_tasks')
    .select('duration_minutes')
    .eq('user_id', userId)
    .eq('attendance_marked', true);

  const hoursLogged = structuredTasks
    ? Math.round(structuredTasks.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) / 60)
    : 0;

  return {
    tasksCompleted: tasksCompleted ?? 0,
    hoursLogged,
    tokensEarned: Number(user?.token_balance ?? 0),
    achievements: ['Early Adopter'],
  };
}

/**
 * Fetch recent activity logs for a user
 */
export async function getUserRecentActivity(userId: string): Promise<RecentActivity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error(`Failed to fetch audit logs: ${error.message}`);
    return [];
  }

  return (data || []).map(log => ({
    id: log.id,
    action: log.action,
    timestamp: log.created_at,
    metadata: log.metadata,
  }));
}
