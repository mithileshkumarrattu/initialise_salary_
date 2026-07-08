'use client';

import { useEffect, useState } from 'react';
import { checkUserPermission, getUserPermissions } from '@/lib/db/queries/users';
import { useAuth } from './useAuth';

export function usePermissions() {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || authLoading) return;

      try {
        setLoading(true);
        const perms = await getUserPermissions(user.id);
        setPermissions(perms);
        setError(null);
      } catch (err: any) {
        console.error('[v0] Failed to fetch permissions:', err);
        setError(err.message);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPermissions();
    }
  }, [user, authLoading]);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permList: string[]): boolean => {
    return permList.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (permList: string[]): boolean => {
    return permList.every(p => permissions.includes(p));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    error,
  };
}
