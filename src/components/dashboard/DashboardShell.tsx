'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRole } from '@/lib/hooks/useRole';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';

/**
 * Main dashboard shell component
 * - Fetches user role
 * - Routes to appropriate role-specific dashboard
 * - Handles loading/error states
 * 
 * NOTE: This is a blank shell. Role-specific dashboards will be created separately.
 */
export function DashboardShell() {
  const { user, loading: userLoading } = useAuth();
  const { role, loading: roleLoading, error: roleError } = useRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Still loading
  if (!mounted || userLoading || roleLoading) {
    return <LoadingSkeleton />;
  }

  // Error fetching role
  if (roleError) {
    return (
      <ErrorFallback 
        message={roleError} 
        title="Failed to Load Dashboard"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // No user (not authenticated)
  if (!user) {
    return (
      <ErrorFallback 
        message="You must be logged in to access the dashboard."
        title="Not Authenticated"
      />
    );
  }

  // No role assigned
  if (!role) {
    return (
      <ErrorFallback 
        message="Your account does not have a role assigned. Please contact support."
        title="No Role Assigned"
      />
    );
  }

  // SUCCESS: Render role-specific dashboard
  return (
    <div className="space-y-6">
      {/* Placeholder for role-specific dashboard content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Loading...
        </h1>
        <p className="text-muted-foreground mt-2">
          Role-specific dashboard for {role} will render here.
        </p>
      </div>
    </div>
  );
}
