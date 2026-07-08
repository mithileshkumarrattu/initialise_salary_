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
 * Fetch finance data for a user using correct table names
 */
export async function getUserFinanceData(userId: string): Promise<FinanceData> {
  const supabase = await createClient();

  // 1. User's current token balance
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('token_balance')
    .eq('id', userId)
    .single();

  if (userError) throw new Error(`Failed to fetch user balance: ${userError.message}`);

  const availableBalance = Number(user?.token_balance ?? 0);

  // 2. Salary transfers (pending & completed)
  const { data: transfers, error: transferError } = await supabase
    .from('salary_transfers')
    .select('*')
    .eq('faculty_id', userId)
    .order('created_at', { ascending: false });

  if (transferError) throw new Error(`Failed to fetch transfers: ${transferError.message}`);

  const pendingTransfers = (transfers || []).filter(
    t => t.status === 'INITIATED' || t.status === 'HOD_APPROVED'
  );
  const completedTransfers = (transfers || []).filter(t => t.status === 'COMPLETED');

  const pendingBalance = pendingTransfers.reduce((sum, t) => sum + Number(t.amount_tokens ?? 0), 0);
  const totalWithdrawn = completedTransfers.reduce((sum, t) => sum + Number(t.amount_tokens ?? 0), 0);
  const totalEarned = availableBalance + totalWithdrawn;

  // 3. Build transaction list
  const transactions: Transaction[] = [];

  // Salary transfer debits
  (transfers || []).forEach(t => {
    transactions.push({
      id: t.id,
      type: 'DEBIT',
      title: 'Salary Transfer',
      description: `Status: ${t.status.replace(/_/g, ' ')}`,
      amount: Number(t.amount_tokens ?? 0),
      date: t.created_at,
    });
  });

  // Credits from completed task nominations (nominations table, not task_nominations)
  const { data: completedNominations, error: nomError } = await supabase
    .from('nominations')
    .select(`
      id,
      updated_at,
      task:unstructured_tasks(title, token_points)
    `)
    .eq('user_id', userId)
    .eq('status', 'COMPLETED');

  if (!nomError && completedNominations) {
    completedNominations.forEach(n => {
      if (n.task) {
        transactions.push({
          id: n.id,
          type: 'CREDIT',
          title: 'Task Reward',
          description: `Completed: ${n.task.title}`,
          amount: Number(n.task.token_points ?? 0),
          date: n.updated_at,
        });
      }
    });
  }

  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { availableBalance, pendingBalance, totalEarned, transactions };
}
