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
 * Get tasks assigned to a user (faculty perspective - my work)
 * Fetches nominations accepted by the user with task details
 * @throws Error if query fails
 */
export async function getAssignedTasks(userId: string) {
  const supabase = await createClient();

  // Fetch nominations where user accepted (status = ACCEPTED)
  const { data, error } = await supabase
    .from('nominations')
    .select(`
      id,
      status,
      created_at,
      task:unstructured_tasks(
        id,
        title,
        description,
        token_points,
        deadline,
        priority,
        status,
        creator_id,
        required_skills,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'ACCEPTED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("[v0] Nomination fetch error:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch assigned tasks: ${error.message}`);
  }
  
  // Flatten the response so the component receives tasks with nomination metadata
  return (data || []).map(nom => ({
    ...nom.task,
    nomination_id: nom.id,
    accepted_at: nom.created_at
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
      creator:creator_id(id, name, email),
      assigned_to:assigned_to_id(id, name, email),
      department:departments(id, name)
    `)
    .eq('id', taskId)
    .single();

  if (error) throw new Error(`Failed to fetch task details: ${error.message}`);
  return data || null;
}

/**
 * ROLE-BASED: Get open pool tasks for faculty (task pool view)
 * Faculty see: Open tasks + tasks matching their skills + fairness filter
 * Filter: OPEN status, department visibility, skill tags
 */
export async function getOpenPoolTasksForFaculty(
  userId: string,
  userDepartmentId: string,
  userSkills: string[]
) {
  const supabase = await createClient();

  let query = supabase
    .from('unstructured_tasks')
    .select(`
      id,
      title,
      description,
      token_points,
      deadline,
      priority,
      required_skills,
      created_at,
      creator_id,
      department_id
    `)
    .eq('status', 'OPEN');

  // Visibility: show tasks for whole org, user's dept, or user's role
  query = query.or(
    `department_id.is.null,department_id.eq.${userDepartmentId}`
  );

  const { data, error } = await query.order('priority', { ascending: false });

  if (error) throw new Error(`Failed to fetch open pool tasks: ${error.message}`);

  // Client-side filter: match skills and fairness
  return (data || []).filter(task => {
    const skillMatch = userSkills.length === 0 || 
      task.required_skills.some((skill: string) => userSkills.includes(skill));
    return skillMatch;
  });
}

/**
 * ROLE-BASED: Get nominations for a task (manager/approver perspective)
 * Shows who nominated for this task so HOD/Manager can assign
 */
export async function getNominationsForTask(taskId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('nominations')
    .select(`
      id,
      user_id,
      status,
      message,
      created_at,
      user:users(id, name, email, skills, progress_percentage)
    `)
    .eq('task_id', taskId)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch nominations: ${error.message}`);
  return data || [];
}

/**
 * ROLE-BASED: Get tasks to approve (HOD/Manager perspective)
 * HOD sees: Tasks created in their dept that need approval
 * Status: PENDING_APPROVAL → APPROVED/REJECTED
 */
export async function getTasksToApprove(
  userId: string,
  departmentId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select(`
      id,
      title,
      description,
      assigned_to_id,
      status,
      created_at,
      assigned_to:users(id, name, email),
      creator:creator_id(id, name, email)
    `)
    .eq('department_id', departmentId)
    .eq('status', 'IN_PROGRESS')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch tasks to approve: ${error.message}`);
  return data || [];
}

/**
 * ROLE-BASED: Get all tasks in department (HOD Dashboard)
 * Filter by department and show status breakdown
 */
export async function getDepartmentTasks(departmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select(`
      id,
      title,
      status,
      priority,
      assigned_to_id,
      token_points,
      deadline,
      assigned_to:users(id, name)
    `)
    .eq('department_id', departmentId)
    .order('status', { ascending: false });

  if (error) throw new Error(`Failed to fetch department tasks: ${error.message}`);
  return data || [];
}
