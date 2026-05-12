'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Shield, Briefcase, Clapperboard, Check } from 'lucide-react';
import { enterDemoMode, type DemoRole } from '@/lib/demoData';

const BORDER = 'var(--border)';

const WORKSPACES: {
  role: DemoRole;
  label: string;
  description: string;
  route: string;
  color: string;
  bgColor: string;
  badgeLabel: string;
  Icon: React.FC<{ size: number; color: string; strokeWidth: number }>;
}[] = [
  {
    role:       'admin',
    label:      'Admin',
    description:'Manage marketplace, projects, creators, payments, and quality.',
    route:      '/admin',
    color:      '#FF5C00',
    bgColor:    'rgba(255,92,0,0.12)',
    badgeLabel: 'Admin Mode',
    Icon:       Shield,
  },
  {
    role:       'client',
    label:      'UGC Fire Agency',
    description:'Post projects, manage deliverables, review creator work.',
    route:      '/client',
    color:      '#22d3ee',
    bgColor:    'rgba(34,211,238,0.1)',
    badgeLabel: 'Client Mode',
    Icon:       Briefcase,
  },
  {
    role:       'creator',
    label:      'Creator',
    description:'Use Studio, build your profile, apply to opportunities.',
    route:      '/dashboard',
    color:      '#a3e635',
    bgColor:    'rgba(163,230,53,0.1)',
    badgeLabel: 'Creator Mode',
    Icon:       Clapperboard,
  },
];

interface Props {
  currentRole: DemoRole;
}

export default function WorkspaceSwitcher({ currentRole }: Props) {
  const router  = useRouter();
  const ref     = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const current = WORKSPACES.find(w => w.role === currentRole) ?? WORKSPACES[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function switchTo(ws: typeof WORKSPACES[number]) {
    setOpen(false);
    enterDemoMode(ws.role);
    router.push(ws.route);
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Trigger badge */}
      <button onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: current.bgColor,
          border: `1px solid ${current.color}30`,
          borderRadius: 8, padding: '5px 10px',
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'border-color 0.12s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${current.color}60`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${current.color}30`; }}>
        <current.Icon size={12} color={current.color} strokeWidth={2} />
        <span style={{ fontSize: 11, fontWeight: 700, color: current.color, letterSpacing: '0.03em' }}>
          {current.badgeLabel}
        </span>
        <ChevronDown size={11} color={current.color} strokeWidth={2.5}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#161616', border: `1px solid ${BORDER}`,
          borderRadius: 14, minWidth: 280, boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
          zIndex: 300, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px 8px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Switch Workspace
            </span>
          </div>

          <div style={{ padding: '6px' }}>
            {WORKSPACES.map(ws => {
              const active = ws.role === currentRole;
              return (
                <button key={ws.role} onClick={() => switchTo(ws)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit',
                    background: active ? `${ws.color}10` : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                  {/* Icon */}
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: ws.bgColor, border: `1px solid ${ws.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ws.Icon size={14} color={ws.color} strokeWidth={2} />
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                        {ws.label}
                      </span>
                      {active && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: ws.color, background: ws.bgColor, border: `1px solid ${ws.color}25`, borderRadius: 20, padding: '1px 7px' }}>
                          <Check size={9} strokeWidth={3} /> Active
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5, display: 'block' }}>
                      {ws.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
