'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, FolderOpen, Rocket, LogOut, User } from 'lucide-react';
import { LOGO_URL } from '@/lib/demoAssets';
import { exitDemoMode } from '@/lib/demoData';
import AssetPickerModal from './AssetPickerModal';

const NAV_LINKS = [
  { label: 'Explore',      href: '/dashboard/video' },
  { label: 'Image',        href: '/dashboard/image' },
  { label: 'Video',        href: '/dashboard/video' },
  { label: 'Brand Assets', href: '/dashboard/brand-assets' },
  { label: 'Studio',       href: '/dashboard/studio' },
];

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BG     = '#0d0d0d';
const BORDER = 'rgba(255,255,255,0.07)';

export default function UserAppShell({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const avatarRef  = useRef<HTMLDivElement>(null);
  const [assetsOpen,  setAssetsOpen]  = useState(false);
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const [search, setSearch] = useState('');

  // Close avatar dropdown on outside click
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
    if (href === '/dashboard/video' && (pathname === '/dashboard' || pathname === '/dashboard/video')) return true;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, overflow: 'hidden' }}>

      {/* ── TOP NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ height: 52, background: BG, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 2, flexShrink: 0, zIndex: 100 }}>

        {/* Logo */}
        <Link href="/dashboard/video" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 14, flexShrink: 0 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 26, width: 'auto' }} unoptimized />
        </Link>

        {/* Nav links */}
        {NAV_LINKS.map(l => {
          const active = isActive(l.href);
          return (
            <Link key={l.label} href={l.href}
              style={{
                color: active ? '#fff' : 'rgba(255,255,255,0.48)',
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
                textDecoration: 'none',
                padding: '5px 10px',
                borderBottom: active ? `2px solid ${ORANGE}` : '2px solid transparent',
                transition: 'color 0.12s',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}>
              {l.label}
            </Link>
          );
        })}

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Search */}
          <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '5px 10px', gap: 7 }}>
            <Search size={13} color="rgba(255,255,255,0.3)" strokeWidth={2} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'rgba(255,255,255,0.5)', width: 130, fontFamily: 'inherit' }}
            />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 3, fontWeight: 500 }}>⌘K</span>
          </div>

          {/* Upgrade */}
          <button style={{ background: ORANGE, color: '#fff', border: 'none', padding: '6px 13px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            <Rocket size={13} strokeWidth={2} />
            Upgrade
          </button>

          {/* Assets */}
          <button
            onClick={() => setAssetsOpen(true)}
            style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.65)', padding: '6px 13px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#222'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
          >
            <FolderOpen size={14} strokeWidth={1.75} />
            Assets
          </button>

          {/* Avatar + dropdown */}
          <div ref={avatarRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onClick={() => setAvatarOpen(o => !o)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: avatarOpen ? '2px solid rgba(163,230,53,0.5)' : '2px solid transparent', transition: 'border-color 0.12s' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0d0d0d', lineHeight: 1 }}>D</span>
            </div>

            {avatarOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden', minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 200 }}>
                {/* User info */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#0d0d0d' }}>D</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Demo User</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>demo@ugcfire.ai</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px' }}>
                  <button
                    onClick={() => { setAvatarOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <User size={14} strokeWidth={1.75} />
                    Profile
                  </button>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <LogOut size={14} strokeWidth={1.75} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </div>

      {/* ── ASSETS MODAL ────────────────────────────────────────────────────── */}
      {assetsOpen && (
        <AssetPickerModal
          onClose={() => setAssetsOpen(false)}
          onSelect={null}
        />
      )}
    </div>
  );
}
