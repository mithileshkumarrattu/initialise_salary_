'use client';

/**
 * Task Pool Page - Unstructured Task Board
 * 
 * This page shows:
 * - Available tasks to nominate for (OPEN status)
 * - Task nomination form
 * - Filters by priority, department, etc.
 * 
 * Data fetching:
 * - getAvailableTasksForNomination(departmentId)
 * 
 * Data mutation:
 * - Create nomination record when user self-nominates
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { EmptyState } from '@/components/common/EmptyState';

export default function TaskPoolPage() {
  const { user, loading: userLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user || userLoading) return;

      try {
        setLoading(true);
        // TODO: Fetch available tasks for nomination
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load task pool');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, userLoading]);

  if (userLoading || loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} onRetry={() => window.location.reload()} />;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-6 px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Task Pool</h1>
        
        <div className="space-y-6">
          {/* Filter bar */}
          <div className="flex gap-4">
            {/* TODO: Add priority filter, department filter, etc. */}
          </div>

          {/* Task board */}
          <section>
            <EmptyState message="No tasks available to nominate" />
          </section>
        </div>
      </div>
    </main>
  );
}
