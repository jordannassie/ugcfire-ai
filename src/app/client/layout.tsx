'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Users, MessageSquare, CreditCard, Package, LayoutDashboard, Menu, X, LogOut, ChevronDown, Shield } from 'lucide-react';
import { isDemoMode, getDemoUserName, exitDemoMode } from '@/lib/demoData';
import AppFooter from '@/components/shared/AppFooter';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BG     = '#0d0d0d';
const BORDER = 'rgba(255,255,255,0.07)';

const NAV = [
  { label: 'Dashboard',    href: '/client',               icon: LayoutDashboard },
  { label: 'Post Project', href: '/client/post-project',  icon: Briefcase       },
  { label: 'Projects',     href: '/client/projects',      icon: Shield          },
  { label: 'Creators',     href: '/client/creators',      icon: Users           },
  { label: 'Messages',     href: '/client/messages',      icon: MessageSquare   },
  { label: 'Payments',     href: '/client/payments',      icon: CreditCard      },
  { label: 'Brand Assets', href: '/client/brand-assets',  icon: Package         },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const avatarRef = useRef<HTMLDivElement>(null);

  const [mobile,     setMobile]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [userName,   setUserName]   = useState('Demo Client');

  useEffect(() => {
    const fn = () => { setMobile(window.innerWidth < 768); if (window.innerWidth >= 768) setDrawerOpen(false); };
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    if (isDemoMode()) setUserName(getDemoUserName());
  }, []);

  useEffect(() => {
    function h(e: MouseEvent) { if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobile && drawerOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile, drawerOpen]);

  function handleLogout() { exitDemoMode(); router.push('/login'); }

  function isActive(href: string) {
    if (href === '/client') return pathname === '/client';
    return pathname === href || pathname.startsWith(href + '/');
  }

  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: BG }}>

      {/* TOP NAV */}
      <nav style={{ height: 52, background: BG, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 4, flexShrink: 0, zIndex: 100 }}>

        {mobile && (
          <button onClick={() => setDrawerOpen(o => !o)} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0 }}>
            <Menu size={20} color="rgba(255,255,255,0.7)" />
          </button>
        )}

        <Link href="/client" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: mobile ? 'auto' : 14, flexShrink: 0 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 26, width: 'auto' }} unoptimized />
        </Link>

        {!mobile && NAV.map(l => {
          const active = isActive(l.href);
          return (
            <Link key={l.label} href={l.href}
              style={{ color: active ? '#fff' : 'rgba(255,255,255,0.48)', fontWeight: active ? 700 : 500, fontSize: 13.5, textDecoration: 'none', padding: '5px 10px', borderBottom: active ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'color 0.12s', whiteSpace: 'nowrap' }}>
              {l.label}
            </Link>
          );
        })}

        <div style={{ marginLeft: mobile ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Demo badge */}
          <div style={{ display: mobile ? 'none' : 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.25)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: ORANGE, whiteSpace: 'nowrap' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }} />
            Client Demo
          </div>

          {/* Avatar */}
          <div ref={avatarRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div onClick={() => setAvatarOpen(o => !o)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: avatarOpen ? '2px solid rgba(255,92,0,0.5)' : '2px solid transparent', transition: 'border-color 0.12s' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{initials}</span>
            </div>
            {avatarOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, minWidth: 200, boxShadow: '0 12px 40px rgba(0,0,0,0.7)', zIndex: 200, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{userName}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Brand / Agency Client</p>
                </div>
                <div style={{ padding: 6 }}>
                  <Link href="/login" onClick={() => setAvatarOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>
                    <ChevronDown size={14} strokeWidth={1.75} />
                    Switch Demo Role
                  </Link>
                  <div style={{ height: 1, background: BORDER, margin: '4px 0' }} />
                  <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}>
                    <LogOut size={14} strokeWidth={1.75} />
                    Exit Demo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ flex: 1, paddingBottom: mobile ? 56 : 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>{children}</div>
        {!mobile && <AppFooter />}
      </div>

      {/* MOBILE BOTTOM NAV */}
      {mobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: BG, borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 100 }}>
          {NAV.slice(0, 5).map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.label} href={item.href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', flex: 1, padding: '6px 0' }}>
                <item.icon size={20} color={active ? ORANGE : 'rgba(255,255,255,0.35)'} strokeWidth={active ? 2.25 : 1.75} />
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? ORANGE : 'rgba(255,255,255,0.35)' }}>{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* MOBILE DRAWER */}
      {mobile && drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 240, background: '#111', borderRight: `1px solid ${BORDER}`, zIndex: 160, display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 16px', borderBottom: `1px solid ${BORDER}` }}>
              <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 24, width: 'auto' }} unoptimized />
              <button onClick={() => setDrawerOpen(false)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color="rgba(255,255,255,0.6)" />
              </button>
            </div>
            <nav style={{ flex: 1, padding: '12px 8px' }}>
              {NAV.map(item => {
                const active = isActive(item.href);
                return (
                  <Link key={item.label} href={item.href} onClick={() => setDrawerOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 10, marginBottom: 4, textDecoration: 'none', background: active ? 'rgba(255,92,0,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: 15, fontWeight: active ? 700 : 400 }}>
                    <item.icon size={17} color={active ? ORANGE : 'rgba(255,255,255,0.4)'} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}` }}>
              <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                <LogOut size={15} />
                Exit Demo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
