import { createClient } from '@/lib/supabase/client';

/**
 * Get current token balance for a user
 * @throws Error if query fails
 */
export async function getUserTokenBalance(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('token_balance, loan_balance')
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Failed to fetch token balance: ${error.message}`);
  return data || { token_balance: 0, loan_balance: 0 };
}

/**
 * Get all token transactions for a user
 * @throws Error if query fails
 */
export async function getUserTokenTransactions(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('token_transactions')
    .select(`
      *,
      from_user:users!from_user_id(id, name),
      to_user:users!to_user_id(id, name)
    `)
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch token transactions: ${error.message}`);
  return data || [];
}

/**
 * Get pending salary transfer requests for HOD approval
 * @throws Error if query fails
 */
export async function getPendingTokenTransfers(departmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('token_transactions')
    .select(`
      *,
      from_user:users!from_user_id(id, name, progress_percentage),
      to_user:users!to_user_id(id, name)
    `)
    .eq('department_id', departmentId)
    .eq('status', 'PENDING')
    .in('type', ['SALARY_TRANSFER', 'TRANSFER_BACK'])
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch pending transfers: ${error.message}`);
  return data || [];
}

/**
 * Create salary transfer request
 * @throws Error if query fails
 */
export async function createSalaryTransferRequest(data: {
  from_user_id: string;
  to_user_id: string;
  amount: number;
  department_id: string;
  reason: string;
}) {
  const supabase = createClient();

  const { data: result, error } = await supabase
    .from('token_transactions')
    .insert([
      {
        ...data,
        type: 'SALARY_TRANSFER',
        status: 'PENDING',
      },
    ])
    .select();

  if (error) throw new Error(`Failed to create transfer request: ${error.message}`);
  return result?.[0] || null;
}

/**
 * Approve or reject token transfer
 * @throws Error if query fails
 */
export async function updateTokenTransferStatus(
  transactionId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('token_transactions')
    .update({ status, approval_notes: notes })
    .eq('id', transactionId)
    .select();

  if (error) throw new Error(`Failed to update transfer status: ${error.message}`);
  return data?.[0] || null;
}

/**
 * Get organization token pool
 * @throws Error if query fails
 */
export async function getOrgTokenPool(organizationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .select('total_tokens, tokens_minted, tokens_available')
    .eq('id', organizationId)
    .single();

  if (error) throw new Error(`Failed to fetch token pool: ${error.message}`);
  return data || null;
}

/**
 * Get all users' token balances in organization (for finance dashboard)
 * @throws Error if query fails
 */
export async function getOrgTokenBalances(organizationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      token_balance,
      loan_balance,
      progress_percentage,
      department_id
    `)
    .eq('organization_id', organizationId)
    .order('token_balance', { ascending: false });

  if (error) throw new Error(`Failed to fetch org token balances: ${error.message}`);
  return data || [];
}
