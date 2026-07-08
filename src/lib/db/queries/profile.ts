import { createClient } from '@/lib/supabase/server';

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
  
  // Get token balance and completed unstructured tasks
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('token_balance')
    .eq('id', userId)
    .single();

  if (userError) throw new Error(`Failed to fetch user stats: ${userError.message}`);

  // Get completed unstructured tasks count
  const { count: tasksCompleted, error: tasksError } = await supabase
    .from('task_nominations')
    .select('*', { count: 'exact', head: true })
    .eq('faculty_id', userId)
    .eq('status', 'COMPLETED');

  // We could fetch hours logged from structured tasks, for now we will aggregate
  const { data: structuredTasks } = await supabase
    .from('structured_tasks')
    .select('duration_minutes')
    .eq('faculty_id', userId)
    .eq('attendance_marked', true);

  const hoursLogged = structuredTasks 
    ? Math.round(structuredTasks.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) / 60)
    : 0;

  // Mock achievements for now since there's no table in schema for it yet
  const achievements = ['Early Adopter'];

  return {
    tasksCompleted: tasksCompleted || 0,
    hoursLogged,
    tokensEarned: user?.token_balance || 0,
    achievements
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
    // If the table doesn't exist yet, return an empty array gracefully rather than crashing the page
    console.error(`Failed to fetch audit logs: ${error.message}`);
    return [];
  }
  
  return (data || []).map(log => ({
    id: log.id,
    action: log.action,
    timestamp: log.created_at,
    metadata: log.metadata
  }));
}
