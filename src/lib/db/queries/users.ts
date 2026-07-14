import { createClient } from '@/lib/supabase/client';

/**
 * Fetch current user with role and permissions
 * @throws Error if query fails
 */
export async function getCurrentUser(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      organization_id,
      department_id,
      role_id,
      progress_percentage,
      token_balance,
      loan_balance,
      created_at
    `)
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Failed to fetch user: ${error.message}`);
  return data;
}

/**
 * Fetch user's role and permissions
 * @throws Error if query fails
 */
export async function getUserPermissions(userId: string) {
  const supabase = createClient();
  
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('role_id')
    .eq('id', userId)
    .single();

  if (userError) throw new Error(`Failed to fetch user role: ${userError.message}`);

  if (!user?.role_id) {
    throw new Error('User has no role assigned');
  }

  const { data: permissions, error: permError } = await supabase
    .from('role_permissions')
    .select('permission:permissions(id, name)')
    .eq('role_id', user.role_id);

  if (permError) throw new Error(`Failed to fetch permissions: ${permError.message}`);
  
  return permissions?.map((p: any) => p.permission?.name).filter(Boolean) || [];
}

/**
 * Check if user has specific permission
 * @throws Error if query fails
 */
export async function checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    return permissions.includes(permissionName);
  } catch {
    return false;
  }
}

/**
 * Get user's department details
 * @throws Error if query fails
 */
export async function getUserDepartment(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      department:departments(
        id,
        name,
        hod_id,
        organization_id
      )
    `)
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Failed to fetch user department: ${error.message}`);
  return data?.department || null;
}
