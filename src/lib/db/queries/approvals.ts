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
 * Get all pending approvals for a user based on their role and department
 * @throws Error if query fails
 */
export async function getPendingApprovals(
  role: string, 
  departmentId?: string
): Promise<PendingApproval[]> {
  const supabase = await createClient();
  const approvals: PendingApproval[] = [];

  // HODs approve task proofs in their department and initiate salary transfers
  if (role === 'hod' || role === 'dean' || role === 'director') {
    // 1. Task Nominations pending proof approval
    if (departmentId) {
      // Find task nominations where status is 'PROOF_SUBMITTED' for tasks in this department
      // Since task_nominations doesn't have department_id, we need to join through unstructured_tasks
      const { data: nominations, error: nomError } = await supabase
        .from('task_nominations')
        .select(`
          *,
          faculty:users!faculty_id(name),
          task:unstructured_tasks!inner(title, description, token_value, department_id)
        `)
        .eq('status', 'PROOF_SUBMITTED')
        .eq('task.department_id', departmentId);

      if (!nomError && nominations) {
        approvals.push(...nominations.map(n => ({
          id: n.id,
          type: 'TASK_PROOF' as const,
          title: `Task Proof: ${n.task.title}`,
          description: `User submitted proof for task. ${n.task.description}`,
          requested_by: n.faculty?.name || 'Unknown User',
          requested_at: n.updated_at || n.nominated_at,
          amount: n.task.token_value,
          status: n.status,
          original_record: n
        })));
      }

      // 2. Salary Transfers pending HOD approval
      const { data: transfers, error: transferError } = await supabase
        .from('salary_transfers')
        .select(`
          *,
          faculty:users!faculty_id(name, department_id)
        `)
        .eq('status', 'INITIATED');
        
      if (!transferError && transfers) {
        // Filter by department in memory if RLS doesn't handle it
        const deptTransfers = transfers.filter(t => t.faculty?.department_id === departmentId);
        approvals.push(...deptTransfers.map(t => ({
          id: t.id,
          type: 'SALARY_TRANSFER' as const,
          title: 'Salary Transfer Request',
          description: `User requested to convert tokens to salary.`,
          requested_by: t.faculty?.name || 'Unknown User',
          requested_at: t.created_at || new Date().toISOString(),
          amount: t.amount_tokens,
          status: t.status,
          original_record: t
        })));
      }
    }
  }

  // Finance/Admin approve salary transfers that have passed HOD
  if (role === 'finance' || role === 'admin' || role === 'director') {
    const { data: transfers, error: transferError } = await supabase
      .from('salary_transfers')
      .select(`
        *,
        faculty:users!faculty_id(name, department_id)
      `)
      .in('status', ['HOD_APPROVED']);
      
    if (!transferError && transfers) {
      approvals.push(...transfers.map(t => ({
        id: t.id,
        type: 'SALARY_TRANSFER' as const,
        title: 'Final Salary Payout',
        description: `HOD Approved salary transfer ready for payout.`,
        requested_by: t.faculty?.name || 'Unknown User',
        requested_at: t.created_at || new Date().toISOString(),
        amount: t.amount_tokens,
        status: t.status,
        original_record: t
      })));
    }
  }

  // Sort by date requested (newest first)
  return approvals.sort((a, b) => 
    new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
  );
}
