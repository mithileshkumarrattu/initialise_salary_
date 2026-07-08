'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { RoleGate } from '@/components/layout/RoleGate';

/**
 * APPROVALS PAGE
 * 
 * Purpose: Central approval hub for HODs and Finance roles
 * 
 * Permissions:
 * - HOD: Can approve attendance, task completions, and salary transfer requests within their department
 * - Finance: Can approve all token transfers and view all transactions
 * - Others: No access (403)
 * 
 * Data Fetching Pattern:
 * 1. Fetch current user + role
 * 2. Based on role, fetch relevant approvals (attendance, tasks, salary transfers)
 * 3. Display in role-specific sections
 * 4. On approve/deny action, trigger API call to update DB + smart contract (if tokens)
 * 5. Refetch data or subscribe to real-time updates
 * 
 * TODO: Build role-specific approval components
 */

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const { hasPermission, loading: permLoading } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalData, setApprovalData] = useState<any>(null);

  // Check if user has permission to view approvals
  const canAccess = role === 'HOD' || role === 'FINANCE';

  useEffect(() => {
    if (authLoading || permLoading) return;

    if (!user || !canAccess) {
      router.push('/dashboard');
      return;
    }

    const fetchApprovals = async () => {
      try {
        setLoading(true);
        // TODO: Fetch approvals based on role
        // const data = await getApprovalsForRole(role, user.id);
        // setApprovalData(data);
        setApprovalData(null); // Blank until query implemented
      } catch (err: any) {
        setError(err.message || 'Failed to load approvals');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [user, role, authLoading, permLoading, router, canAccess]);

  if (authLoading || permLoading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} />;

  return (
    <RoleGate requiredPermission="APPROVE_TASKS">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve pending tasks, attendance, and salary transfers
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : !approvalData ? (
          <EmptyState
            title="No Approvals"
            description="All approvals are up to date. Check back later."
          />
        ) : (
          <div className="space-y-6">
            {/* TODO: Add role-specific approval sections here */}
            {/* e.g., <AttendanceApprovals data={approvalData.attendance} /> */}
            {/* e.g., <TaskApprovals data={approvalData.tasks} /> */}
            {/* e.g., <SalaryTransferApprovals data={approvalData.salaryTransfers} /> */}
          </div>
        )}
      </div>
    </RoleGate>
  );
}
