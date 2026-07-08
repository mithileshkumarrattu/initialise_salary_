import { createClient } from '@/lib/supabase/client';

/**
 * Get organization details
 * @throws Error if query fails
 */
export async function getOrganization(organizationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single();

  if (error) throw new Error(`Failed to fetch organization: ${error.message}`);
  return data || null;
}

/**
 * Get all departments in organization
 * @throws Error if query fails
 */
export async function getOrgDepartments(organizationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('departments')
    .select(`
      *,
      hod:users!hod_id(id, name, email)
    `)
    .eq('organization_id', organizationId)
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch departments: ${error.message}`);
  return data || [];
}

/**
 * Get department details with HOD info
 * @throws Error if query fails
 */
export async function getDepartmentDetails(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('departments')
    .select(`
      *,
      hod:users!hod_id(id, name, email)
    `)
    .eq('id', departmentId)
    .single();

  if (error) throw new Error(`Failed to fetch department: ${error.message}`);
  return data || null;
}

/**
 * Get department faculty
 * @throws Error if query fails
 */
export async function getDepartmentFaculty(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      role:roles(id, name),
      progress_percentage,
      token_balance
    `)
    .eq('department_id', departmentId)
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch department faculty: ${error.message}`);
  return data || [];
}

/**
 * Get department progress overview
 * @throws Error if query fails
 */
export async function getDepartmentProgress(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      progress_percentage,
      token_balance,
      loan_balance
    `)
    .eq('department_id', departmentId);

  if (error) throw new Error(`Failed to fetch department progress: ${error.message}`);

  if (!data || data.length === 0) {
    return {
      total_faculty: 0,
      avg_progress: 0,
      total_tokens: 0,
      total_loans: 0,
    };
  }

  const avgProgress = data.reduce((sum, u) => sum + (u.progress_percentage || 0), 0) / data.length;
  const totalTokens = data.reduce((sum, u) => sum + (u.token_balance || 0), 0);
  const totalLoans = data.reduce((sum, u) => sum + (u.loan_balance || 0), 0);

  return {
    total_faculty: data.length,
    avg_progress: Math.round(avgProgress),
    total_tokens: totalTokens,
    total_loans: totalLoans,
  };
}

/**
 * Get all users in organization (for director dashboard)
 * @throws Error if query fails
 */
export async function getOrgUsers(organizationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      department_id,
      role:roles(id, name),
      progress_percentage,
      token_balance
    `)
    .eq('organization_id', organizationId)
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch org users: ${error.message}`);
  return data || [];
}
