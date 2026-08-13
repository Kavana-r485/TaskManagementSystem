'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Triangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { loginAsGuest } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuest = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsGuest();
      router.push('/tasks');
    } catch (e) {
      setError('Could not start a guest session. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
            <Triangle size={14} fill="white" />
          </span>
          <span className="font-medium">Pyramid</span>
        </div>

        <div className="w-[340px] rounded-2xl border border-gray-100 bg-surface p-6 shadow-sm">
          <h1 className="text-center text-lg font-semibold">Let&apos;s get back on track</h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Enter your email below to login to your account.
          </p>

          <button
            onClick={handleGuest}
            disabled={loading}
            className="mt-5 w-full rounded-full bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? 'Starting session…' : 'Continue as Guest'}
          </button>

          <button
            disabled
            title="Google login not implemented for this assessment — see README"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-400"
          >
            <span className="font-semibold">G</span> Login with Google
          </button>

          {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
        </div>

        <p className="max-w-[280px] text-center text-xs text-gray-400">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </main>
  );
}
