import { createClient } from '@/lib/supabase/server';

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
  const supabase = await createClient();
  
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
  const supabase = await createClient();
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
 * Get tasks assigned to a user via task_nominations
 * @throws Error if query fails
 */
export async function getAssignedTasks(userId: string) {
  const supabase = await createClient();

  // Fetch the nominations and join the unstructured_tasks data
  const { data, error } = await supabase
    .from('task_nominations')
    .select(`
      *,
      task:unstructured_tasks(*)
    `)
    .eq('faculty_id', userId)
    .in('status', ['ASSIGNED', 'IN_PROGRESS', 'PROOF_SUBMITTED'])
    .order('nominated_at', { ascending: false });

  if (error) {
    console.error("Task fetch error:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch assigned tasks: ${error.message}`);
  }
  
  // Flatten the response so the component receives tasks directly with nomination data attached
  return (data || []).map(nom => ({
    ...nom.task,
    nomination_id: nom.id,
    nomination_status: nom.status,
    nominated_at: nom.nominated_at
  }));
}

/**
 * Get tasks for user's nomination (OPEN status)
 * @throws Error if query fails
 */
export async function getAvailableTasksForNomination(departmentId?: string | null) {
  const supabase = await createClient();

  let query = supabase
    .from('unstructured_tasks')
    .select('*')
    .eq('status', 'OPEN');

  if (departmentId) {
    query = query.eq('department_id', departmentId);
  }

  const { data, error } = await query.order('priority', { ascending: false });

  if (error) throw new Error(`Failed to fetch available tasks: ${error.message}`);
  return data || [];
}

/**
 * Get task details with all related data
 * @throws Error if query fails
 */
export async function getTaskDetails(taskId: string) {
  const supabase = await createClient();

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
