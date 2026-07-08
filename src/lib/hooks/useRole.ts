'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/db/queries/users';
import { useAuth } from './useAuth';

type UserRole = 'DIRECTOR' | 'HOD' | 'FACULTY' | 'FINANCE' | 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN' | null;

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user || authLoading) return;

      try {
        setLoading(true);
        const userData = await getCurrentUser(user.id);
        
        // Map role_id to role name - this is a simplified example
        // In real app, you'd fetch from roles table
        setRole(null); // Will be populated from DB data
        setError(null);
      } catch (err: any) {
        console.error('[v0] Failed to fetch role:', err);
        setError(err.message);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRole();
    }
  }, [user, authLoading]);

  const isDirector = role === 'DIRECTOR';
  const isHod = role === 'HOD';
  const isFaculty = role === 'FACULTY';
  const isFinance = role === 'FINANCE';
  const isManager = role === 'MANAGER';

  return {
    role,
    isDirector,
    isHod,
    isFaculty,
    isFinance,
    isManager,
    loading,
    error,
  };
}
