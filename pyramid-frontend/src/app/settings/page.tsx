'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { apiFetch } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const COLOR_OPTIONS = [
  { key: 'amber', label: 'Amber', hex: '#D97706' },
  { key: 'blue', label: 'Blue', hex: '#635BFF' },
  { key: 'pink', label: 'Pink', hex: '#DB2777' },
  { key: 'rose', label: 'Rose', hex: '#E11D48' },
  { key: 'emerald', label: 'Emerald', hex: '#059669' },
  { key: 'black', label: 'Black', hex: '#171717' },
] as const;

export default function SettingsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { refreshUser } = useAuth();
  const { mode, colorMode, setMode, setColorMode } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<'profile' | 'theme' | 'color'>('profile');

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTitle(user.title || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ fullName, title, username }),
      });
      await refreshUser();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted md:flex-row">
      <aside className="w-full border-b border-gray-100 p-3 md:w-56 md:border-b-0 md:border-r">
        <button
          onClick={() => router.push('/tasks')}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to app
        </button>

        <nav className="space-y-0.5">
          <button
            onClick={() => setTab('profile')}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${tab === 'profile' ? 'bg-surface font-medium' : 'text-gray-600 hover:bg-surface'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setTab('theme')}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${tab === 'theme' ? 'bg-surface font-medium' : 'text-gray-600 hover:bg-surface'}`}
          >
            Theme
          </button>
          <button
            onClick={() => setTab('color')}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${tab === 'color' ? 'bg-surface font-medium' : 'text-gray-600 hover:bg-surface'}`}
          >
            Color
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        {tab === 'profile' && (
          <div className="max-w-md">
            <h1 className="mb-4 text-lg font-semibold">Profile</h1>
            <div className="space-y-4 rounded-card border border-gray-100 bg-surface p-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Email</label>
                <p className="text-sm text-gray-400">{user?.email || 'Guest session — no email'}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Title <span className="text-gray-300">Your job title or role</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Username <span className="text-gray-300">One word, like a nickname</span>
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                {saved && <span className="text-xs text-emerald-600">Saved</span>}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-card border border-gray-100 bg-surface p-4">
              <p className="text-sm text-gray-500">Remove yourself from the workspace</p>
              <Link href="/" className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-500">
                Leave Workspace
              </Link>
            </div>
          </div>
        )}

        {tab === 'theme' && (
          <div className="max-w-md">
            <h1 className="mb-4 text-lg font-semibold">Theme</h1>
            <div className="flex gap-3">
              {(['light', 'dark'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-card border p-4 text-sm capitalize ${
                    mode === m ? 'border-accent font-medium' : 'border-gray-200 text-gray-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'color' && (
          <div className="max-w-md">
            <h1 className="mb-4 text-lg font-semibold">Color</h1>
            <div className="grid grid-cols-3 gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setColorMode(c.key)}
                  className={`flex flex-col items-center gap-2 rounded-card border p-4 ${
                    colorMode === c.key ? 'border-accent' : 'border-gray-200'
                  }`}
                >
                  <span className="h-6 w-6 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
