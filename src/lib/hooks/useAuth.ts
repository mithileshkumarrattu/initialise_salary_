'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name,
          });
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch auth user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading, error };
}
