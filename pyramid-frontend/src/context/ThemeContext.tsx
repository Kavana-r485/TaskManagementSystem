'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Mode = 'light' | 'dark';
type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextValue {
  mode: Mode;
  colorMode: ColorMode;
  setMode: (m: Mode) => void;
  setColorMode: (c: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MODE_KEY = 'pyramid-theme-mode';
const COLOR_KEY = 'pyramid-theme-color';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Two independent theme axes, matching the design's separate
  // "Change Theme" (Light/Dark) and "Color Mode" (accent) menus.
  const [mode, setModeState] = useState<Mode>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');
  const [ready, setReady] = useState(false);

  // Load persisted preference once on mount (client-only — avoids
  // hydration mismatch since localStorage isn't available on the server).
  useEffect(() => {
    const savedMode = (localStorage.getItem(MODE_KEY) as Mode | null) ?? 'light';
    const savedColor = (localStorage.getItem(COLOR_KEY) as ColorMode | null) ?? 'blue';
    setModeState(savedMode);
    setColorModeState(savedColor);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.classList.remove(
      'accent-amber',
      'accent-blue',
      'accent-pink',
      'accent-rose',
      'accent-emerald',
      'accent-black',
    );
    root.classList.add(`accent-${colorMode}`);
    localStorage.setItem(MODE_KEY, mode);
    localStorage.setItem(COLOR_KEY, colorMode);
  }, [mode, colorMode, ready]);

  const setMode = (m: Mode) => setModeState(m);
  const setColorMode = (c: ColorMode) => setColorModeState(c);

  return (
    <ThemeContext.Provider value={{ mode, colorMode, setMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
