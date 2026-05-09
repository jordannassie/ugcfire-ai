'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, FolderOpen, Rocket, LogOut, User,
  ImageIcon, Video, Package, Layers, LayoutDashboard, Menu, X,
  Zap, CreditCard,
} from 'lucide-react';
import { LOGO_URL, getCredits, INITIAL_CREDITS } from '@/lib/demoAssets';
import { exitDemoMode } from '@/lib/demoData';
import AssetPickerModal from './AssetPickerModal';

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Image',        href: '/dashboard/image',         icon: ImageIcon       },
  { label: 'Video',        href: '/dashboard/video',         icon: Video           },
  { label: 'Brand Assets', href: '/dashboard/brand-assets',  icon: Package         },
  { label: 'Studio',       href: '/dashboard/studio',        icon: Layers          },
  { label: 'Discover',     href: '/discover',                icon: LayoutDashboard },
];

// Bottom mobile nav — deduplicated (Explore & Video share the same href, show Video only)
const MOBILE_NAV = [
  { label: 'Image',   href: '/dashboard/image',        icon: ImageIcon       },
  { label: 'Video',   href: '/dashboard/video',         icon: Video           },
  { label: 'Assets',  href: '/dashboard/brand-assets',  icon: Package         },
  { label: 'Studio',  href: '/dashboard/studio',        icon: Layers          },
  { label: 'Discover',href: '/discover',                icon: LayoutDashboard },
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

  const [assetsOpen,   setAssetsOpen]   = useState(false);
  const [avatarOpen,   setAvatarOpen]   = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [upgradeOpen,  setUpgradeOpen]  = useState(false);
  const [upgradeTab,   setUpgradeTab]   = useState<'plans' | 'credits'>('plans');
  const [comingSoon,   setComingSoon]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [mobile,       setMobile]       = useState(false);
  const [credits,      setCredits]      = useState(INITIAL_CREDITS);

  // Detect mobile
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Sync demo credits from localStorage
  useEffect(() => {
    setCredits(getCredits());
    const handler = () => setCredits(getCredits());
    window.addEventListener('ugcfire:credits-updated', handler);
    return () => window.removeEventListener('ugcfire:credits-updated', handler);
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: BG, overflow: 'hidden' }}>

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

          {/* Credits pill + Upgrade (desktop only) */}
          {!mobile && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '5px 11px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                <Zap size={11} color={LIME} strokeWidth={2.5} />
                {credits} credits
              </div>
              <button onClick={() => setUpgradeOpen(true)}
                style={{ background: ORANGE, color: '#fff', border: 'none', padding: '6px 13px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                <Rocket size={13} strokeWidth={2} />
                Upgrade
              </button>
            </>
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
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, overflow: 'hidden', minWidth: 220, boxShadow: '0 12px 40px rgba(0,0,0,0.7)', zIndex: 200 }}>
                {/* User info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#0d0d0d' }}>D</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Demo User</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.3 }}>Demo Plan</p>
                    </div>
                  </div>
                  {/* Credits bar */}
                  <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{credits} credits left</span>
                      <button onClick={() => { setAvatarOpen(false); setUpgradeOpen(true); }}
                        style={{ fontSize: 10, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 5, padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Top up
                      </button>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (credits / 125) * 100)}%`, background: LIME, borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px' }}>
                  {[
                    { icon: User,      label: 'View profile',      href: '/dashboard/profile' },
                    { icon: CreditCard, label: 'Manage account',   href: '/dashboard/profile?tab=account' },
                    { icon: Zap,       label: 'Join our community',href: '/community' },
                  ].map(item => (
                    <button key={item.label}
                      onClick={() => { setAvatarOpen(false); router.push(item.href); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.1s, color 0.1s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(255,255,255,0.05)'; el.style.color = '#fff'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'none'; el.style.color = 'rgba(255,255,255,0.6)'; }}>
                      <item.icon size={14} strokeWidth={1.75} />
                      {item.label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  <button onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.07)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
                    <LogOut size={14} strokeWidth={1.75} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'visible', paddingBottom: mobile ? 56 : 0 }}>
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

      {/* ── UPGRADE MODAL ───────────────────────────────────────────────────── */}
      {upgradeOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setUpgradeOpen(false); }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>

            {/* Header */}
            <div style={{ padding: '24px 24px 0', borderBottom: `1px solid rgba(255,255,255,0.07)`, paddingBottom: 16 }}>
              <button onClick={() => setUpgradeOpen(false)}
                style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color="rgba(255,255,255,0.6)" />
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Upgrade Plan or Buy Credits</h2>

              {/* Demo usage bar */}
              <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                <div style={{ background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Current Plan</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Demo</div>
                </div>
                <div style={{ background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Credits</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: LIME }}>{credits} remaining</div>
                </div>
                <div style={{ background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Per generation</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Video · 75cr &nbsp;|&nbsp; Image · 4cr</div>
                </div>
              </div>

              {/* Tab switcher */}
              <div style={{ display: 'flex', marginTop: 16, gap: 4 }}>
                {(['plans', 'credits'] as const).map(t => (
                  <button key={t} onClick={() => setUpgradeTab(t)}
                    style={{ flex: 1, padding: '9px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', borderRadius: 8,
                      background: upgradeTab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: upgradeTab === t ? '#fff' : 'rgba(255,255,255,0.38)',
                      transition: 'all 0.12s' }}>
                    {t === 'plans' ? '🚀 Plans' : '⚡ Credit Packs'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '20px 24px 24px' }}>

              {/* ── PLANS TAB ── */}
              {upgradeTab === 'plans' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { name: 'Starter',  price: 29,  credits: 300,   badge: null,           border: 'rgba(255,255,255,0.08)',   btn: '#1e1e1e', btnTxt: '#fff' },
                    { name: 'Creator',  price: 99,  credits: 1500,  badge: 'Most Popular', border: 'rgba(163,230,53,0.3)',     btn: LIME,      btnTxt: '#0d0d0d' },
                    { name: 'Pro',      price: 199, credits: 4000,  badge: null,           border: 'rgba(255,92,0,0.22)',      btn: ORANGE,    btnTxt: '#fff' },
                  ].map(plan => (
                    <div key={plan.name} style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: `1px solid ${plan.border}`, borderRadius: 14, padding: '14px 16px', gap: 14, position: 'relative',
                      boxShadow: plan.badge ? '0 0 20px rgba(163,230,53,0.06)' : 'none' }}>
                      {plan.badge && (
                        <span style={{ position: 'absolute', top: -10, left: 16, background: LIME, color: '#0d0d0d', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.06em' }}>
                          ✦ {plan.badge}
                        </span>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{plan.name}</span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{plan.credits.toLocaleString()} credits/mo</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                          ~{Math.floor(plan.credits / 75)} videos · ~{Math.floor(plan.credits / 4)} images · Cancel anytime
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>${plan.price}<span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>/mo</span></div>
                      <button onClick={() => { setComingSoon(true); setTimeout(() => setComingSoon(false), 3200); }}
                        style={{ background: plan.btn, color: plan.btnTxt, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        Upgrade
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ── CREDITS TAB ── */}
              {upgradeTab === 'credits' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { credits: 250,  price: 15,  badge: null },
                    { credits: 1000, price: 49,  badge: null },
                    { credits: 2500, price: 99,  badge: 'Most Popular' },
                    { credits: 5000, price: 179, badge: 'Best Value' },
                  ].map(pack => (
                    <div key={pack.credits} style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: `1px solid ${pack.badge ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '12px 16px', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{pack.credits.toLocaleString()} credits</span>
                          {pack.badge && (
                            <span style={{ fontSize: 9, fontWeight: 800, background: pack.badge === 'Best Value' ? ORANGE : LIME, color: pack.badge === 'Best Value' ? '#fff' : '#0d0d0d', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em' }}>
                              {pack.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                          ~{Math.floor(pack.credits / 75)} videos · ~{Math.floor(pack.credits / 4)} images · one-time
                        </div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', flexShrink: 0 }}>${pack.price}</div>
                      <button onClick={() => { setComingSoon(true); setTimeout(() => setComingSoon(false), 3200); }}
                        style={{ background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        Buy
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Coming soon toast */}
              {comingSoon && (
                <div style={{ marginTop: 16, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.25)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CreditCard size={16} color={ORANGE} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Payments coming soon</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Stripe will be connected after UI approval. No charges will be made yet.</div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── ASSETS MODAL ────────────────────────────────────────────────────── */}
      {assetsOpen && (
        <AssetPickerModal onClose={() => setAssetsOpen(false)} onSelect={null} />
      )}
    </div>
  );
}
