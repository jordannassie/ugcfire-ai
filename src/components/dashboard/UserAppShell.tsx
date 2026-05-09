'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, FolderOpen, Rocket, LogOut, User,
  ImageIcon, Video, Package, Layers, LayoutDashboard, Menu, X,
} from 'lucide-react';
import { LOGO_URL } from '@/lib/demoAssets';
import { exitDemoMode } from '@/lib/demoData';
import AssetPickerModal from './AssetPickerModal';

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Explore',      href: '/dashboard/video',        icon: LayoutDashboard },
  { label: 'Image',        href: '/dashboard/image',         icon: ImageIcon       },
  { label: 'Video',        href: '/dashboard/video',         icon: Video           },
  { label: 'Brand Assets', href: '/dashboard/brand-assets',  icon: Package         },
  { label: 'Studio',       href: '/dashboard/studio',        icon: Layers          },
];

// Bottom mobile nav — deduplicated (Explore & Video share the same href, show Video only)
const MOBILE_NAV = [
  { label: 'Image',        href: '/dashboard/image',         icon: ImageIcon  },
  { label: 'Video',        href: '/dashboard/video',         icon: Video      },
  { label: 'Brand Assets', href: '/dashboard/brand-assets',  icon: Package    },
  { label: 'Studio',       href: '/dashboard/studio',        icon: Layers     },
];

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BG     = '#0d0d0d';
const BORDER = 'rgba(255,255,255,0.07)';

export default function UserAppShell({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const avatarRef  = useRef<HTMLDivElement>(null);
  const drawerRef  = useRef<HTMLDivElement>(null);

  const [assetsOpen,  setAssetsOpen]  = useState(false);
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [search,      setSearch]      = useState('');
  const [mobile,      setMobile]      = useState(false);

  // Detect mobile
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (mobile && drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobile, drawerOpen]);

  function handleLogout() {
    exitDemoMode();
    router.push('/');
  }

  function isActive(href: string) {
    if (href === '/dashboard/video' && (pathname === '/dashboard' || pathname === '/dashboard/video')) return true;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: BG, overflow: 'hidden' }}>

      {/* ── TOP NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ height: mobile ? 52 : 52, background: BG, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: mobile ? 0 : 2, flexShrink: 0, zIndex: 100 }}>

        {/* Hamburger (mobile only) */}
        {mobile && (
          <button onClick={() => setDrawerOpen(o => !o)}
            style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0 }}>
            <Menu size={20} color="rgba(255,255,255,0.7)" />
          </button>
        )}

        {/* Logo */}
        <Link href="/dashboard/video" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: mobile ? 'auto' : 14, flexShrink: 0 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 26, width: 'auto' }} unoptimized />
        </Link>

        {/* Desktop nav links */}
        {!mobile && NAV_LINKS.map(l => {
          const active = isActive(l.href);
          return (
            <Link key={l.label} href={l.href}
              style={{ color: active ? '#fff' : 'rgba(255,255,255,0.48)', fontWeight: active ? 700 : 500, fontSize: 13.5, textDecoration: 'none', padding: '5px 10px', borderBottom: active ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'color 0.12s', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
              {l.label}
            </Link>
          );
        })}

        {/* Right side */}
        <div style={{ marginLeft: mobile ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: mobile ? 8 : 8 }}>

          {/* Search (desktop only) */}
          {!mobile && (
            <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '5px 10px', gap: 7 }}>
              <Search size={13} color="rgba(255,255,255,0.3)" strokeWidth={2} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'rgba(255,255,255,0.5)', width: 130, fontFamily: 'inherit' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 3, fontWeight: 500 }}>⌘K</span>
            </div>
          )}

          {/* Upgrade (desktop only) */}
          {!mobile && (
            <button style={{ background: ORANGE, color: '#fff', border: 'none', padding: '6px 13px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              <Rocket size={13} strokeWidth={2} />
              Upgrade
            </button>
          )}

          {/* Assets (desktop only) */}
          {!mobile && (
            <button onClick={() => setAssetsOpen(true)}
              style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.65)', padding: '6px 13px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
              <FolderOpen size={14} strokeWidth={1.75} />
              Assets
            </button>
          )}

          {/* Avatar */}
          <div ref={avatarRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div onClick={() => setAvatarOpen(o => !o)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: avatarOpen ? '2px solid rgba(163,230,53,0.5)' : '2px solid transparent', transition: 'border-color 0.12s' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0d0d0d', lineHeight: 1 }}>D</span>
            </div>

            {avatarOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden', minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 200 }}>
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
                <div style={{ padding: '6px' }}>
                  <button onClick={() => setAvatarOpen(false)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}>
                    <User size={14} strokeWidth={1.75} />
                    Profile
                  </button>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  <button onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}>
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
      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: mobile ? 56 : 0 }}>
        {children}
      </div>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────────────────── */}
      {mobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: '#0d0d0d', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {MOBILE_NAV.map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.label} href={item.href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '6px 16px', minWidth: 56, flex: 1 }}>
                <item.icon size={20} color={active ? ORANGE : 'rgba(255,255,255,0.38)'} strokeWidth={active ? 2.25 : 1.75} />
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? ORANGE : 'rgba(255,255,255,0.38)', letterSpacing: '0.01em' }}>
                  {item.label === 'Brand Assets' ? 'Assets' : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── MOBILE DRAWER MENU ──────────────────────────────────────────────── */}
      {mobile && drawerOpen && (
        <>
          {/* Backdrop */}
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150, backdropFilter: 'blur(4px)' }} />

          {/* Drawer */}
          <div ref={drawerRef}
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 240, background: '#111', borderRight: `1px solid ${BORDER}`, zIndex: 160, display: 'flex', flexDirection: 'column', padding: '16px 0', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 16px', borderBottom: `1px solid ${BORDER}` }}>
              <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 24, width: 'auto' }} unoptimized />
              <button onClick={() => setDrawerOpen(false)}
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color="rgba(255,255,255,0.6)" />
              </button>
            </div>
            <nav style={{ flex: 1, padding: '12px 8px' }}>
              {NAV_LINKS.filter((l, i, arr) => arr.findIndex(x => x.href === l.href) === i).map(item => {
                const active = isActive(item.href);
                return (
                  <Link key={item.label} href={item.href} onClick={() => setDrawerOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 10, marginBottom: 4, textDecoration: 'none', background: active ? 'rgba(255,92,0,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: 15, fontWeight: active ? 700 : 400, fontFamily: 'inherit' }}>
                    <item.icon size={17} color={active ? ORANGE : 'rgba(255,255,255,0.4)'} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}` }}>
              <button onClick={() => setAssetsOpen(true)}
                style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.6)', padding: '10px 14px', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', marginBottom: 8 }}>
                <FolderOpen size={15} />
                Assets
              </button>
              <button onClick={handleLogout}
                style={{ width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                <LogOut size={15} />
                Log out
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── ASSETS MODAL ────────────────────────────────────────────────────── */}
      {assetsOpen && (
        <AssetPickerModal onClose={() => setAssetsOpen(false)} onSelect={null} />
      )}
    </div>
  );
}
