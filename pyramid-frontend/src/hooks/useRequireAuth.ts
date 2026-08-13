'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Drop this at the top of any page that requires a logged-in user.
// Waits for the initial /users/me check to finish before redirecting,
// so a valid session isn't bounced to "/" during the loading flash.
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  return { user, loading };
}
