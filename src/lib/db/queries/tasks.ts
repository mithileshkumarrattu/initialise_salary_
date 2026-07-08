import { createClient } from '@/lib/supabase/server';

// ─── Type Definitions ─────────────────────────────────────────────────────

export type AssignedTask = {
  id: string;
  title: string;
  description: string | null;
  token_points: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  due_date: string | null;
  status: string;
  department_id: string | null;
  // nomination fields attached
  nomination_id: string;
  nomination_status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  nominated_at: string;
};

export type OpenTask = {
  id: string;
  title: string;
  description: string | null;
  token_points: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  due_date: string | null;
  status: string;
  department_id: string | null;
  creator_id: string | null;
  // Has user already nominated?
  my_nomination_status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
};

// ─── Faculty: Tasks assigned to me ────────────────────────────────────────

/**
 * Faculty view: Get all tasks I've been accepted for (nominations.status = 'ACCEPTED')
 * @throws Error if query fails
 */
export async function getAssignedTasks(userId: string): Promise<AssignedTask[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('nominations')
    .select(`
      id,
      status,
      created_at,
      task:unstructured_tasks(
        id, title, description, token_points, priority, due_date, status, department_id
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'ACCEPTED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAssignedTasks error:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch assigned tasks: ${error.message}`);
  }

  return (data || [])
    .filter(nom => nom.task) // filter out orphan nominations
    .map(nom => ({
      ...nom.task,
      nomination_id: nom.id,
      nomination_status: nom.status as 'ACCEPTED',
      nominated_at: nom.created_at,
    })) as AssignedTask[];
}

// ─── Faculty: Open tasks I can nominate for ───────────────────────────────

/**
 * Faculty view: Open tasks in their department. Also marks which ones they've already nominated.
 * @throws Error if query fails
 */
export async function getOpenPoolTasksForFaculty(
  userId: string,
  departmentId?: string | null
): Promise<OpenTask[]> {
  const supabase = await createClient();

  let taskQuery = supabase
    .from('unstructured_tasks')
    .select('id, title, description, token_points, priority, due_date, status, department_id, creator_id')
    .in('status', ['OPEN', 'NOMINATED']); // NOMINATED means others applied but still open

  if (departmentId) {
    taskQuery = taskQuery.eq('department_id', departmentId);
  }

  const { data: tasks, error: taskError } = await taskQuery.order('priority', { ascending: false });
  if (taskError) throw new Error(`Failed to fetch task pool: ${taskError.message}`);

  // Get my nominations to mark which I already applied for
  const { data: myNominations } = await supabase
    .from('nominations')
    .select('task_id, status')
    .eq('user_id', userId);

  const nominationMap = new Map<string, string>();
  (myNominations || []).forEach(n => nominationMap.set(n.task_id, n.status));

  return (tasks || []).map(task => ({
    ...task,
    my_nomination_status: nominationMap.get(task.id) ?? null,
  })) as OpenTask[];
}

// ─── HOD: Department tasks needing approval ───────────────────────────────

/**
 * HOD/Manager view: All tasks in department with COMPLETED status (needing approval)
 * @throws Error if query fails
 */
export async function getTasksToApprove(departmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select(`
      id, title, description, token_points, priority, due_date, status, department_id,
      nominations(id, user_id, status, created_at, users(id, name, email))
    `)
    .eq('department_id', departmentId)
    .eq('status', 'COMPLETED')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('getTasksToApprove error:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch tasks to approve: ${error.message}`);
  }

  return data || [];
}

// ─── HOD: Department overview ─────────────────────────────────────────────

/**
 * HOD/Manager view: All tasks in department (any status) for overview
 * @throws Error if query fails
 */
export async function getDepartmentTasks(departmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select('id, title, status, priority, token_points, due_date')
    .eq('department_id', departmentId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch department tasks: ${error.message}`);
  return data || [];
}

// ─── HOD: Nominations for a task ─────────────────────────────────────────

/**
 * HOD/Manager view: Who has nominated for a specific task
 */
export async function getNominationsForTask(taskId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('nominations')
    .select(`
      id, status, created_at,
      users(id, name, email, role, progress_percentage)
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch nominations: ${error.message}`);
  return data || [];
}

// ─── Director: Org-wide structured tasks query ────────────────────────────

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

// ─── Task details ─────────────────────────────────────────────────────────

export async function getTaskDetails(taskId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unstructured_tasks')
    .select(`
      *,
      creator:users!creator_id(id, name),
      department:departments(id, name)
    `)
    .eq('id', taskId)
    .single();

  if (error) throw new Error(`Failed to fetch task details: ${error.message}`);
  return data || null;
}
