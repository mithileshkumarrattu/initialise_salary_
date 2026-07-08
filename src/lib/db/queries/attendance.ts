import { createClient } from '@/lib/supabase/client';

/**
 * Get pending attendance records for HOD approval
 * @throws Error if query fails
 */
export async function getPendingAttendanceForApproval(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      user:users(id, name),
      task:structured_tasks(id, subject, date)
    `)
    .eq('department_id', departmentId)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch pending attendance: ${error.message}`);
  return data || [];
}

/**
 * Get user's attendance records for a date range
 * @throws Error if query fails
 */
export async function getUserAttendance(
  userId: string,
  startDate: string,
  endDate: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw new Error(`Failed to fetch user attendance: ${error.message}`);
  return data || [];
}

/**
 * Get department attendance summary
 * @throws Error if query fails
 */
export async function getDepartmentAttendanceSummary(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      user_id,
      status,
      date
    `)
    .eq('department_id', departmentId)
    .order('date', { ascending: false });

  if (error) throw new Error(`Failed to fetch attendance summary: ${error.message}`);
  return data || [];
}

/**
 * Mark attendance for a task
 * @throws Error if query fails
 */
export async function markAttendance(data: {
  user_id: string;
  task_id: string;
  department_id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'PENDING';
  hours_worked?: number;
}) {
  const supabase = createClient();

  const { data: result, error } = await supabase
    .from('attendance')
    .insert([data])
    .select();

  if (error) throw new Error(`Failed to mark attendance: ${error.message}`);
  return result?.[0] || null;
}

/**
 * Update attendance status (for HOD approval)
 * @throws Error if query fails
 */
export async function updateAttendanceStatus(
  attendanceId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .update({ status, approved_notes: notes })
    .eq('id', attendanceId)
    .select();

  if (error) throw new Error(`Failed to update attendance: ${error.message}`);
  return data?.[0] || null;
}
