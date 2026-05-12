'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeCtx {
  theme:    Theme;
  resolved: 'dark' | 'light';
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme:    'dark',
  resolved: 'dark',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function resolveTheme(t: Theme): 'dark' | 'light' {
  if (t === 'system') {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return t;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme,    setThemeState] = useState<Theme>('dark');
  const [resolved, setResolved]   = useState<'dark' | 'light'>('dark');
  const [mounted,  setMounted]    = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('ugc-theme') as Theme) ?? 'dark';
    const r     = resolveTheme(saved);
    setThemeState(saved);
    setResolved(r);
    document.documentElement.setAttribute('data-theme', r);
    setMounted(true);

    // Watch OS preference when theme is 'system'
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    function onSystem() {
      if ((localStorage.getItem('ugc-theme') as Theme) === 'system') {
        const r2 = mq.matches ? 'light' : 'dark';
        setResolved(r2);
        document.documentElement.setAttribute('data-theme', r2);
      }
    }
    mq.addEventListener('change', onSystem);
    return () => mq.removeEventListener('change', onSystem);
  }, []);

  function setTheme(t: Theme) {
    const r = resolveTheme(t);
    setThemeState(t);
    setResolved(r);
    localStorage.setItem('ugc-theme', t);
    document.documentElement.setAttribute('data-theme', r);
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {/* Suppress hydration warning: data-theme may differ until client mount */}
      <div suppressHydrationWarning style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
