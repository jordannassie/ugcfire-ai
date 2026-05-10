'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { isDemoMode, getDemoRole, getDemoUserName } from '@/lib/demoData';

// ─── Design tokens ─────────────────────────────────────────────────────────
const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const LIME     = '#a3e635';
const ORANGE   = '#FF5C00';
const BG       = '#0d0d0d';
const BORDER   = 'rgba(255,255,255,0.07)';

// ─── Nav definition ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'create',       label: 'Create',       href: '/dashboard/create', group: 'core'    },
  { key: 'creators',     label: 'Creators',     href: '/creators',         group: 'network' },
  { key: 'opportunities',label: 'Opportunities',href: '/opportunities',    group: 'network' },
  { key: 'hire',         label: 'Hire',         href: '/hire',             group: 'brand'   },
  { key: 'pricing',      label: 'Pricing',      href: '/pricing',          group: 'core'    },
] as const;

type ActivePage = typeof NAV_ITEMS[number]['key'] | 'home';

interface Props {
  activePage?: ActivePage;
  isHomePage?: boolean;
}

export default function PublicHeader({ activePage }: Props) {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [mobile,    setMobile]    = useState(false);
  const [demoOn,    setDemoOn]    = useState(false);
  const [demoLabel, setDemoLabel] = useState('');

  useEffect(() => {
    const fn = () => { setMobile(window.innerWidth < 900); if (window.innerWidth >= 900) setMenuOpen(false); };
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    if (isDemoMode()) {
      setDemoOn(true);
      setDemoLabel(getDemoUserName() || getDemoRole() || 'Demo');
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);

  function isActive(item: typeof NAV_ITEMS[number]) {
    return activePage === item.key;
  }

  function activeColor(item: typeof NAV_ITEMS[number]) {
    if (item.group === 'brand')   return ORANGE;
    if (item.group === 'network') return LIME;
    return LIME;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ph-nav-link {
          color: rgba(255,255,255,0.5);
          font-size: 13.5px;
          text-decoration: none;
          padding: 5px 9px;
          border-bottom: 2px solid transparent;
          font-weight: 500;
          white-space: nowrap;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          transition: color 0.12s;
          line-height: 1;
        }
        .ph-nav-link:hover { color: #fff; }
        @media (max-width: 900px) { .ph-nav-links { display: none !important; } }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 60,
        zIndex: 200, background: BG,
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center',
        gap: 4, padding: '0 16px',
        overflow: 'hidden', maxWidth: '100vw',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}>

        {/* Mobile hamburger */}
        {mobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 4 }}>
            {menuOpen
              ? <X size={20} color="rgba(255,255,255,0.7)" />
              : <Menu size={20} color="rgba(255,255,255,0.7)" />}
          </button>
        )}

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 10, flexShrink: 0 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={30} style={{ objectFit: 'contain', height: 28, width: 'auto' }} unoptimized />
        </Link>

        {/* Desktop nav links */}
        <div className="ph-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item);
            const color  = activeColor(item);
            return (
              <Link
                key={item.key}
                href={item.href}
                className="ph-nav-link"
                style={{
                  color: active ? '#fff' : undefined,
                  fontWeight: active ? 700 : undefined,
                  borderBottom: active ? `2px solid ${color}` : undefined,
                }}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side CTAs */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {demoOn ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: LIME, boxShadow: `0 0 4px ${LIME}` }} />
                {demoLabel}
              </div>
              <a href="/login"
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8, whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; }}
              >Switch Demo</a>
            </>
          ) : (
            <>
              <a href="/login"
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none', padding: '7px 12px', transition: 'color 0.15s', whiteSpace: 'nowrap', display: mobile ? 'none' : undefined }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
              >Login</a>
              <a href="/signup"
                style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', padding: '7px 16px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${BORDER}`, borderRadius: 8, transition: 'background 0.15s', whiteSpace: 'nowrap', display: mobile ? 'none' : undefined }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)'; }}
              >Start Creating</a>
              <a href="/hire"
                style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', padding: '7px 18px', background: ORANGE, borderRadius: 8, transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e65200'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ORANGE; }}
              >Post a Project</a>
            </>
          )}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobile && menuOpen && (
        <>
          <div
            onClick={closeMenu}
            style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(0,0,0,0.4)' }}
          />
          <div style={{
            position: 'fixed', top: 60, left: 0, right: 0, zIndex: 195,
            background: '#111', borderBottom: `1px solid ${BORDER}`,
            padding: '12px 16px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            {NAV_ITEMS.map(item => {
              const active = isActive(item);
              const color  = activeColor(item);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMenu}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 12px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 15,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                    background: active ? `${color}15` : 'transparent',
                    marginBottom: 2,
                  }}>
                  {item.group !== 'core' && (
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  )}
                  {item.label}
                  {active && <span style={{ marginLeft: 'auto', fontSize: 11, color: color, fontWeight: 700 }}>●</span>}
                </Link>
              );
            })}

            <div style={{ height: 1, background: BORDER, margin: '10px 0' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 9, border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 500, textDecoration: 'none', background: 'none' }}>Login</a>
              <a href="/signup" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: `1px solid ${BORDER}`, color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Start Creating</a>
              <a href="/hire" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 9, background: ORANGE, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Post a Project</a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
