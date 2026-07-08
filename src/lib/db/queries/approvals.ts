import { createClient } from '@/lib/supabase/server';

export type PendingApproval = {
  id: string;
  type: 'TASK_PROOF' | 'SALARY_TRANSFER';
  title: string;
  description: string;
  requested_by: string;
  requested_at: string;
  amount: number;
  status: string;
  original_record: any;
};

/**
 * Get all pending approvals based on role and department
 * - HOD/Dean: sees COMPLETED nominations in their dept (task proof review)
 * - Finance/Admin/Director: sees salary_transfers pending finance approval
 */
export async function getPendingApprovals(
  role: string,
  departmentId?: string | null
): Promise<PendingApproval[]> {
  const supabase = await createClient();
  const approvals: PendingApproval[] = [];

  const isHod = role === 'hod' || role === 'dean' || role === 'director';
  const isFinance = role === 'finance' || role === 'admin' || role === 'director';

  // ─── HOD: Review completed tasks in their department ───────────────────
  if (isHod && departmentId) {
    const { data: nominations, error: nomError } = await supabase
      .from('nominations')
      .select(`
        id, status, created_at,
        user:users!user_id(id, name),
        task:unstructured_tasks!inner(id, title, description, token_points, department_id)
      `)
      .eq('status', 'COMPLETED') // faculty submitted, waiting HOD approval
      .eq('task.department_id', departmentId);

    if (!nomError && nominations) {
      approvals.push(...nominations.map(n => ({
        id: n.id,
        type: 'TASK_PROOF' as const,
        title: `Task Proof: ${n.task.title}`,
        description: `Proof submitted for review. ${n.task.description ?? ''}`,
        requested_by: n.user?.name ?? 'Unknown User',
        requested_at: n.created_at,
        amount: Number(n.task.token_points ?? 0),
        status: n.status,
        original_record: n,
      })));
    }
  }

  // ─── Finance: Approve salary transfers ────────────────────────────────
  if (isFinance) {
    const statusesToFetch = role === 'hod' || role === 'dean'
      ? ['INITIATED']         // HOD approves first
      : ['HOD_APPROVED'];     // Finance/Director approves after HOD

    if (role === 'director') {
      statusesToFetch.push('INITIATED'); // Director sees everything
    }

    const { data: transfers, error: transferError } = await supabase
      .from('salary_transfers')
      .select(`
        id, status, amount_tokens, created_at,
        faculty:users!faculty_id(id, name, department_id)
      `)
      .in('status', statusesToFetch);

    if (!transferError && transfers) {
      let filtered = transfers;
      // If HOD, filter to own department
      if ((role === 'hod' || role === 'dean') && departmentId) {
        filtered = transfers.filter(t => t.faculty?.department_id === departmentId);
      }

      approvals.push(...filtered.map(t => ({
        id: t.id,
        type: 'SALARY_TRANSFER' as const,
        title: 'Salary Transfer Request',
        description: `User requested to convert ${t.amount_tokens} WTK to salary.`,
        requested_by: t.faculty?.name ?? 'Unknown User',
        requested_at: t.created_at,
        amount: Number(t.amount_tokens ?? 0),
        status: t.status,
        original_record: t,
      })));
    }
  }

  return approvals.sort(
    (a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
  );
}
