import { createClient } from '@/lib/supabase/server';

export type Transaction = {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  title: string;
  description: string;
  amount: number;
  date: string;
};

export type FinanceData = {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  transactions: Transaction[];
};

/**
 * Fetch finance data for a user
 */
export async function getUserFinanceData(userId: string): Promise<FinanceData> {
  const supabase = await createClient();
  
  // 1. Get user balance
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('token_balance')
    .eq('id', userId)
    .single();

  if (userError) throw new Error(`Failed to fetch user balance: ${userError.message}`);

  const availableBalance = Number(user.token_balance) || 0;

  // 2. Get pending transfers (INITIATED or HOD_APPROVED)
  const { data: transfers, error: transferError } = await supabase
    .from('salary_transfers')
    .select('*')
    .eq('faculty_id', userId);

  if (transferError) throw new Error(`Failed to fetch transfers: ${transferError.message}`);

  const pendingTransfers = (transfers || []).filter(t => t.status === 'INITIATED' || t.status === 'HOD_APPROVED');
  const completedTransfers = (transfers || []).filter(t => t.status === 'COMPLETED');

  const pendingBalance = pendingTransfers.reduce((sum, t) => sum + Number(t.amount_tokens), 0);
  
  // Total earned = Current Balance + What has already been withdrawn/transferred
  const totalWithdrawn = completedTransfers.reduce((sum, t) => sum + Number(t.amount_tokens), 0);
  const totalEarned = availableBalance + totalWithdrawn;

  // 3. Compile Transactions (Debits from salary_transfers, Credits from task_nominations)
  const transactions: Transaction[] = [];

  // Add withdrawals
  transfers.forEach(t => {
    transactions.push({
      id: t.id,
      type: 'DEBIT',
      title: 'Withdrawal Request',
      description: `Status: ${t.status.replace('_', ' ')}`,
      amount: Number(t.amount_tokens),
      date: t.created_at
    });
  });

  // Add credits from completed task nominations
  const { data: completedTasks, error: taskError } = await supabase
    .from('task_nominations')
    .select(`
      id, 
      updated_at, 
      task:unstructured_tasks(title, token_value)
    `)
    .eq('faculty_id', userId)
    .eq('status', 'COMPLETED');

  if (!taskError && completedTasks) {
    completedTasks.forEach(t => {
      const taskObj = Array.isArray(t.task) ? t.task[0] : t.task;
      transactions.push({
        id: t.id,
        type: 'CREDIT',
        title: 'Task Reward',
        description: `Completed: ${taskObj?.title || 'Task'}`,
        amount: Number(taskObj?.token_value || 0),
        date: t.updated_at
      });
    });
  }

  // Sort transactions descending by date
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    availableBalance,
    pendingBalance,
    totalEarned,
    transactions
  };
}
