import { createClient } from '@/lib/supabase/client';

/**
 * Get unstructured tasks for a department with optional filters
 * @throws Error if query fails
 */
export async function getUnstructuredTasks(
  departmentId: string,
  options?: {
    status?: 'OPEN' | 'NOMINATED' | 'ASSIGNED' | 'COMPLETED';
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  }
) {
  const supabase = createClient();
  
  let query = supabase
    .from('unstructured_tasks')
    .select('*')
    .eq('department_id', departmentId);

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  
  if (options?.priority) {
    query = query.eq('priority', options.priority);
  }

  const { data, error } = await query.order('priority', { ascending: false });

  if (error) throw new Error(`Failed to fetch unstructured tasks: ${error.message}`);
  return data || [];
}

/**
 * Get structured tasks (classes/labs) for a user on a specific date
 * @throws Error if query fails
 */
export async function getStructuredTasks(userId: string, date?: string) {
  const supabase = createClient();
  const queryDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('structured_tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('date', queryDate)
    .order('time_slot', { ascending: true });

  if (error) throw new Error(`Failed to fetch structured tasks: ${error.message}`);
  return data || [];
}

/**
 * Get tasks assigned to a user
 * @throws Error if query fails
 */
export async function getAssignedTasks(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select('*')
    .eq('assigned_to_id', userId)
    .in('status', ['ASSIGNED', 'IN_PROGRESS'])
    .order('priority', { ascending: false });

  if (error) throw new Error(`Failed to fetch assigned tasks: ${error.message}`);
  return data || [];
}

/**
 * Get tasks for user's nomination (OPEN status)
 * @throws Error if query fails
 */
export async function getAvailableTasksForNomination(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select('*')
    .eq('department_id', departmentId)
    .eq('status', 'OPEN')
    .order('priority', { ascending: false });

  if (error) throw new Error(`Failed to fetch available tasks: ${error.message}`);
  return data || [];
}

/**
 * Get task details with all related data
 * @throws Error if query fails
 */
export async function getTaskDetails(taskId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select(`
      *,
      created_by_user:users!created_by_id(id, name),
      assigned_to_user:users!assigned_to_id(id, name),
      department:departments(id, name)
    `)
    .eq('id', taskId)
    .single();

  if (error) throw new Error(`Failed to fetch task details: ${error.message}`);
  return data || null;
}
