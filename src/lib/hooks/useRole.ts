'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

type UserRole = 'admin' | 'director' | 'hod' | 'faculty' | 'finance' | null;

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
        const supabase = createClient();
        
        // Fetch user profile with role field
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        
        const userRole = userData?.role?.toLowerCase() as UserRole;
        setRole(userRole || null);
        setError(null);
      } catch (err: any) {
        console.error('[v0] Failed to fetch role:', err);
        setError(err.message);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchRole();
    }
  }, [user, authLoading]);

  const isDirector = role === 'director';
  const isHod = role === 'hod';
  const isFaculty = role === 'faculty';
  const isFinance = role === 'finance';
  const isAdmin = role === 'admin';

  return {
    role,
    isDirector,
    isHod,
    isFaculty,
    isFinance,
    isAdmin,
    loading,
    error,
  };
}
