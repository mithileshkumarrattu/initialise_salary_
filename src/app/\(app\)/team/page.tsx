'use client';

/**
 * Team Page - Department Overview (HOD only)
 * 
 * This page shows (requires permission: manage_team):
 * - Department faculty list
 * - Individual faculty progress
 * - Task assignments
 * - Approval workflows
 * 
 * Data fetching:
 * - getDepartmentFaculty(deptId)
 * - getDepartmentProgress(deptId)
 * - getPendingAttendanceForApproval(deptId)
 * - getPendingTokenTransfers(deptId)
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { RoleGate } from '@/components/layout/RoleGate';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { EmptyState } from '@/components/common/EmptyState';

export default function TeamPage() {
  const { user, loading: userLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user || userLoading) return;

      try {
        setLoading(true);
        // TODO: Fetch department faculty and progress data
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, userLoading]);

  if (userLoading || loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} onRetry={() => window.location.reload()} />;

  return (
    <RoleGate requiredPermission="manage_team" showError>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 lg:px-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Team Overview</h1>
          
          <div className="space-y-6">
            {/* Department faculty table */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Faculty</h2>
              <EmptyState message="No faculty members in this department" />
            </section>

            {/* Pending approvals */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Pending Approvals</h2>
              <EmptyState message="No pending approvals" />
            </section>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
