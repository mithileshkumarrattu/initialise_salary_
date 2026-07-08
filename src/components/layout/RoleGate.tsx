'use client';

import { useEffect, useState } from 'react';
import { checkUserPermission } from '@/lib/db/queries/users';
import { useAuth } from '@/lib/hooks/useAuth';
import { ErrorFallback } from '@/components/common/ErrorFallback';

interface RoleGateProps {
  requiredPermission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

/**
 * Permission wrapper component
 * - Checks if current user has required permission
 * - Silently hides content if no permission (default)
 * - Shows error message if showError={true}
 * - Shows fallback UI if provided
 */
export function RoleGate({ 
  requiredPermission, 
  children, 
  fallback,
  showError = false,
}: RoleGateProps) {
  const { user, loading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const result = await checkUserPermission(user.id, requiredPermission);
        setHasPermission(result);
        setError(null);
      } catch (err: any) {
        console.error('[v0] Permission check failed:', err);
        setError(err.message || 'Permission check failed');
        setHasPermission(false);
      } finally {
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkPermission();
    }
  }, [user, requiredPermission, authLoading]);

  // Still loading auth or checking permissions
  if (authLoading || checking) {
    return null;
  }

  // No user (not authenticated)
  if (!user) {
    return showError ? (
      <ErrorFallback message="You must be logged in to access this feature." />
    ) : null;
  }

  // Permission denied
  if (!hasPermission) {
    if (error && showError) {
      return <ErrorFallback message={error} title="Permission Error" />;
    }
    if (!hasPermission && fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  // Permission granted
  return <>{children}</>;
}
