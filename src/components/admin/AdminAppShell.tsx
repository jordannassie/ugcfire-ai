'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Film, FolderOpen, CreditCard, LifeBuoy,
  Search, Bell, Shield, LogOut, Sparkles, Briefcase, ClipboardList,
  Upload, DollarSign, AlertTriangle, UserCheck,
} from 'lucide-react';
import AppFooter from '@/components/shared/AppFooter';
import { LOGO_URL } from '@/lib/demoAssets';
import { exitDemoMode } from '@/lib/demoData';

const NAV_SECTIONS = [
  {
    label: 'Marketplace',
    items: [
      { label: 'Overview',      href: '/admin',                icon: LayoutDashboard },
      { label: 'Projects',      href: '/admin/projects',       icon: Briefcase       },
      { label: 'Applications',  href: '/admin/applications',   icon: ClipboardList   },
      { label: 'Submissions',   href: '/admin/submissions',    icon: Upload          },
      { label: 'Creators',      href: '/admin/creators',       icon: UserCheck       },
      { label: 'Clients',       href: '/admin/clients',        icon: Users           },
      { label: 'Payments',      href: '/admin/payments',       icon: DollarSign      },
      { label: 'Disputes',      href: '/admin/disputes',       icon: AlertTriangle   },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Generations',   href: '/admin/generations',    icon: Film            },
      { label: 'Assets',        href: '/admin/assets',         icon: FolderOpen      },
      { label: 'Billing',       href: '/admin/billing',        icon: CreditCard      },
      { label: 'Support',       href: '/admin/support',        icon: LifeBuoy        },
    ],
  },
];

const ORANGE  = '#FF5C00';
const LIME    = '#a3e635';
const BORDER  = 'rgba(255,255,255,0.07)';

export default function AdminAppShell({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const avatarRef  = useRef<HTMLDivElement>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    exitDemoMode();
    router.push('/');
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d0d0d', overflow: 'hidden' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside style={{ width: 198, background: '#0a0a0a', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>

        {/* Logo */}
        <div style={{ padding: '16px 14px 14px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <Link href="/admin" style={{ textDecoration: 'none', display: 'block' }}>
            <Image src={LOGO_URL} alt="UGCFire.ai" width={120} height={28} style={{ objectFit: 'contain', height: 26, width: 'auto' }} unoptimized />
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>
                {section.label}
              </div>
              {section.items.map(item => {
                const active = isActive(item.href);
                return (
                  <Link key={item.label} href={item.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 9, marginBottom: 1,
                      textDecoration: 'none',
                      background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                      borderLeft: active ? `3px solid ${ORANGE}` : '3px solid transparent',
                      color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      transition: 'all 0.12s',
                      fontFamily: 'inherit',
                    }}>
                    <item.icon size={14} strokeWidth={1.75} color={active ? ORANGE : 'rgba(255,255,255,0.38)'} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Usage card */}
        <div style={{ padding: '14px 12px', borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {/* Credits */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5, fontWeight: 500 }}>Credits Used Today</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>12,450</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>/ 50,000</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 3 }}>
              <div style={{ height: '100%', width: '24.9%', background: LIME, borderRadius: 4 }} />
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>24.9%</p>
          </div>

          {/* Storage */}
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5, fontWeight: 500 }}>Storage Used</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>1.2 TB</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>/ 5 TB</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 3 }}>
              <div style={{ height: '100%', width: '24%', background: LIME, borderRadius: 4 }} />
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>24%</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ height: 54, background: '#0d0d0d', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>

          {/* Search */}
          <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 9, display: 'flex', alignItems: 'center', padding: '6px 12px', gap: 8, flex: 1, maxWidth: 380 }}>
            <Search size={13} color="rgba(255,255,255,0.3)" strokeWidth={2} />
            <input placeholder="Search users, videos, images…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'rgba(255,255,255,0.5)', width: '100%', fontFamily: 'inherit' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 3, fontWeight: 500 }}>⌘K</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Admin badge */}
            <div style={{ background: 'rgba(255,92,0,0.12)', border: '1px solid rgba(255,92,0,0.28)', borderRadius: 8, padding: '5px 13px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={13} color={ORANGE} strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE }}>Admin</span>
            </div>

            {/* Bell */}
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1a1a1a', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={15} color="rgba(255,255,255,0.5)" strokeWidth={1.75} />
              <span style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: '50%', background: ORANGE }} />
            </div>

            {/* Avatar + dropdown */}
            <div ref={avatarRef} style={{ position: 'relative' }}>
              <div onClick={() => setAvatarOpen(o => !o)}
                style={{ width: 34, height: 34, borderRadius: '50%', background: '#2d1a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: avatarOpen ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'border-color 0.12s' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE }}>A</span>
              </div>

              {avatarOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden', minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 200 }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2, marginBottom: 2 }}>Demo Admin</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>admin@ugcfire.ai</p>
                  </div>
                  <div style={{ padding: '6px' }}>
                    <button onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
                      <LogOut size={14} strokeWidth={1.75} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>{children}</div>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
