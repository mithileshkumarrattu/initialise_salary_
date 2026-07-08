'use client';

/**
 * Finance Dashboard - Token Management (Finance/Director only)
 * 
 * This page shows (requires permission: manage_finance):
 * - All faculty token balances
 * - Pending token transfer approvals
 * - Token transaction history
 * - Payroll readiness
 * - Smart contract interactions
 * 
 * Data fetching:
 * - getOrgTokenBalances(orgId)
 * - getPendingTokenTransfers(deptId)
 * - getUserTokenTransactions(userId)
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { RoleGate } from '@/components/layout/RoleGate';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { EmptyState } from '@/components/common/EmptyState';

export default function FinancePage() {
  const { user, loading: userLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user || userLoading) return;

      try {
        setLoading(true);
        // TODO: Fetch token balances and transfer data
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load finance data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, userLoading]);

  if (userLoading || loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} onRetry={() => window.location.reload()} />;

  return (
    <RoleGate requiredPermission="manage_finance" showError>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 lg:px-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Finance Dashboard</h1>
          
          <div className="space-y-6">
            {/* Token pool overview */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Token Pool</h2>
              <EmptyState message="Loading token pool information..." />
            </section>

            {/* Faculty token balances */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Faculty Token Balances</h2>
              <EmptyState message="No faculty members found" />
            </section>

            {/* Pending transfers */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Pending Approvals</h2>
              <EmptyState message="No pending token transfers" />
            </section>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
