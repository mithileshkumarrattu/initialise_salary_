import { createClient } from '@/lib/supabase/server';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  progress_percentage: number;
  token_balance: number;
};

/**
 * Get all team members in a department (or all if no departmentId)
 * @throws Error if query fails
 */
export async function getDepartmentTeam(departmentId?: string | null): Promise<TeamMember[]> {
  const supabase = await createClient();

  let query = supabase
    .from('users')
    .select('id, name, email, role, progress_percentage, token_balance');

  if (departmentId) {
    query = query.eq('department_id', departmentId);
  }

  const { data, error } = await query
    .order('role', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('getDepartmentTeam error:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch department team: ${error.message}`);
  }

  return (data || []) as TeamMember[];
}
