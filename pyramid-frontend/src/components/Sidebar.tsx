'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutGrid, FolderKanban, ChevronsUpDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const COLOR_OPTIONS = [
  { key: 'amber', label: 'Amber', hex: '#D97706' },
  { key: 'blue', label: 'Blue', hex: '#635BFF' },
  { key: 'pink', label: 'Pink', hex: '#DB2777' },
  { key: 'rose', label: 'Rose', hex: '#E11D48' },
  { key: 'emerald', label: 'Emerald', hex: '#059669' },
  { key: 'black', label: 'Black', hex: '#171717' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { mode, colorMode, setMode, setColorMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeSubmenu, setThemeSubmenu] = useState<'mode' | 'color' | null>(null);

  const navItem = (href: string, label: string, Icon: typeof LayoutGrid) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
          active ? 'bg-surface font-medium text-accent' : 'text-gray-600 hover:bg-surface'
        }`}
      >
        <Icon size={16} />
        {label}
      </Link>
    );
  };

  return (
    <aside className="flex w-full flex-row items-center justify-between border-b border-gray-100 bg-surface-muted p-3 md:h-screen md:w-56 md:flex-col md:items-stretch md:justify-between md:border-b-0 md:border-r">
      <div className="flex flex-1 items-center gap-4 md:block md:gap-0">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-surface"
          >
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-accent to-purple-400" />
            <span className="text-sm font-medium">Workspace</span>
            <ChevronsUpDown size={14} className="ml-auto text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-100 bg-surface p-1 shadow-lg">
              <div className="relative">
                <button
                  onMouseEnter={() => setThemeSubmenu('mode')}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-surface-muted"
                >
                  Change Theme <span>›</span>
                </button>
                {themeSubmenu === 'mode' && (
                  <div className="absolute left-full top-0 ml-1 w-32 rounded-lg border border-gray-100 bg-surface p-1 shadow-lg">
                    {(['light', 'dark'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm capitalize hover:bg-surface-muted"
                      >
                        {m}
                        {mode === m && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onMouseEnter={() => setThemeSubmenu('color')}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-surface-muted"
                >
                  Color Mode <span>›</span>
                </button>
                {themeSubmenu === 'color' && (
                  <div className="absolute left-full top-0 ml-1 w-36 rounded-lg border border-gray-100 bg-surface p-1 shadow-lg">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setColorMode(c.key)}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface-muted"
                      >
                        <span
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.label}
                        {colorMode === c.key && <span className="ml-auto">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/settings"
                className="block rounded px-2 py-1.5 text-sm hover:bg-surface-muted"
              >
                Settings
              </Link>
            </div>
          )}
        </div>

        <nav className="mt-0 flex gap-1 md:mt-4 md:flex-col md:space-y-0.5 md:gap-0">
          {navItem('/tasks', 'Tasks', LayoutGrid)}
          {navItem('/projects', 'Projects', FolderKanban)}
        </nav>
      </div>
    </aside>
  );
}
