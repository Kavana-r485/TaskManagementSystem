'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
  _id: string;
  fullName: string;
  email?: string;
  title?: string;
  username?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = 'pyramid-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await apiFetch<User>('/users/me');
      setUser(me);
    } catch {
      // token invalid/expired — clear it so the login page shows again
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginAsGuest = async () => {
    const data = await apiFetch<{ accessToken: string; user: User }>('/auth/guest', {
      method: 'POST',
    });
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAsGuest, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
