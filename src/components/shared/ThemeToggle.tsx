'use client';

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/components/shared/ThemeProvider';

const OPTIONS: { value: Theme; label: string; Icon: React.FC<{ size: number; strokeWidth: number }> }[] = [
  { value: 'dark',   label: 'Dark',   Icon: Moon    },
  { value: 'light',  label: 'Light',  Icon: Sun     },
  { value: 'system', label: 'System', Icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ padding: '8px 10px 6px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        Theme
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {OPTIONS.map(opt => {
          const active = theme === opt.value;
          return (
            <button key={opt.value} onClick={() => setTheme(opt.value)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '5px 4px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                background: active ? 'var(--card-2, rgba(255,255,255,0.10))' : 'transparent',
                color: active ? 'var(--text)' : 'var(--text-muted)',
                outline: active ? '1px solid var(--border-strong)' : 'none',
                outlineOffset: '-1px',
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--card-2, rgba(255,255,255,0.05))'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
              <opt.Icon size={11} strokeWidth={2} />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
