'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { enterDemoMode } from '@/lib/demoData';

// ─── Design tokens ────────────────────────────────────────────────────────────
const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const ORANGE   = '#FF5C00';
const LIME     = '#a3e635';
const CARD     = 'var(--card)';
const CARD2    = 'var(--card-2)';
const BORDER   = 'var(--border)';
const BORDER2  = 'var(--border-strong)';
const BG       = 'var(--bg)';
const TEXT     = 'var(--text)';
const MUTED    = 'var(--text-muted)';
const FAINT    = 'var(--text-faint)';

// ─── Bullet points for left panel ─────────────────────────────────────────────
const BULLETS = [
  'Create AI image and video ads',
  'Build your public creator profile',
  'Apply to paid brand projects',
  'Post projects and hire AI creators',
];

// ─── Demo workspace configs ───────────────────────────────────────────────────
const DEMO_ROLES = [
  {
    key:       'creator' as const,
    label:     'Demo Creator',
    desc:      'Explore Studio, Profile, Opportunities, Projects, Messages, and Earnings.',
    cta:       'Enter as Creator',
    route:     '/dashboard/studio',
    userName:  'Demo Creator',
    accent:    LIME,
    accentBg:  'rgba(163,230,53,0.06)',
    accentBdr: 'rgba(163,230,53,0.16)',
  },
  {
    key:       'client' as const,
    label:     'Demo Company',
    desc:      'Post projects, browse creators, review submissions, and manage payments.',
    cta:       'Enter as Company',
    route:     '/client',
    userName:  'Demo Company',
    accent:    '#22d3ee',
    accentBg:  'rgba(34,211,238,0.06)',
    accentBdr: 'rgba(34,211,238,0.16)',
  },
  {
    key:       'admin' as const,
    label:     'Demo Admin',
    desc:      'Manage projects, creators, applications, submissions, payments, and disputes.',
    cta:       'Enter as Admin',
    route:     '/admin',
    userName:  'UGCFire Admin',
    accent:    '#a855f7',
    accentBg:  'rgba(168,85,247,0.06)',
    accentBdr: 'rgba(168,85,247,0.16)',
  },
] as const;

// ─── Workspace types ──────────────────────────────────────────────────────────
const WORKSPACES = [
  {
    key:   'creator',
    label: 'Creator',
    desc:  'Create AI content, build your profile, apply to projects, and get paid.',
  },
  {
    key:   'company',
    label: 'Company',
    desc:  'Post projects, hire AI creators, review deliverables, and manage payments.',
  },
] as const;

// ─── Google G logo (inline SVG) ───────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.638-.057-1.251-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

interface Props {
  defaultTab: 'signup' | 'login';
}

export default function AuthPage({ defaultTab }: Props) {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const [tab,           setTab]           = useState<'signup' | 'login'>(defaultTab);
  const [workspace,     setWorkspace]     = useState<'creator' | 'company'>('creator');
  const [name,          setName]          = useState('');
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [notice,        setNotice]        = useState('');
  const [googleNotice,  setGoogleNotice]  = useState('');

  // Honour ?role=company from public CTAs
  useEffect(() => {
    const role = searchParams?.get('role');
    if (role === 'company') {
      setTab('signup');
      setWorkspace('company');
    }
  }, [searchParams]);

  function enterDemo(role: typeof DEMO_ROLES[number]) {
    enterDemoMode(role.key);
    // Override username for demo mode
    if (typeof window !== 'undefined') {
      localStorage.setItem('demoUserName', role.userName);
    }
    router.push(role.route);
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === 'signup') {
      setNotice('Account creation will be connected soon.');
    } else {
      setNotice('Login will be connected soon.');
    }
    setTimeout(() => setNotice(''), 4000);
  }

  function handleGoogle() {
    setGoogleNotice('Google login will be connected soon.');
    setTimeout(() => setGoogleNotice(''), 4000);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: BG, fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)', position: 'relative' }}>

      {/* ── HERO BACKGROUND VIDEO ──────────────────────────────────────────── */}
      <video
        src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/video/hf_20260507_203840_ec73ef26-f3ba-4189-8046-bb42475960aa.mp4"
        autoPlay muted loop playsInline
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, zIndex: 0, pointerEvents: 'none' }}
      />
      {/* Gradient overlay — same as homepage hero */}
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(13,13,13,0.72) 0%, rgba(13,13,13,0.52) 100%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
      <div style={{
        flex: '0 0 46%',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 56px',
        background: 'transparent',
        borderRight: 'none',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 2,
      }}
        className="auth-left-panel">
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,92,0,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(163,230,53,0.04)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Image src={LOGO_URL} alt="UGCFire.ai" width={130} height={32} style={{ objectFit: 'contain', height: 30, width: 'auto', marginBottom: 32 }} unoptimized />

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 28 }}>
            AI Creator Network
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 900, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 20 }}>
            Build your AI ads profile.<br />
            <span style={{ color: ORANGE }}>Get hired by brands.</span>
          </h1>

          {/* Body copy */}
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, marginBottom: 36, maxWidth: 380 }}>
            UGCFire.ai is where AI creators use Studio tools, build public profiles, and get connected to paid brand projects.
          </p>

          {/* Bullets */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
            {BULLETS.map(b => (
              <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={11} color={LIME} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{b}</span>
              </li>
            ))}
          </ul>

          {/* Footer note */}
          <p style={{ fontSize: 12, color: FAINT, marginTop: 44, lineHeight: 1.6 }}>
            One account can manage multiple workspaces.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        padding: '24px 20px 48px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Back link */}
        <div style={{ width: '100%', maxWidth: 520, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: MUTED, fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color 0.12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = TEXT; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = MUTED; }}>
            <ArrowLeft size={14} strokeWidth={2} />
            Back to home
          </Link>
          {/* Logo (mobile) */}
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 24, width: 'auto' }} unoptimized className="auth-mobile-logo" />
        </div>

        {/* Auth card */}
        <div style={{ width: '100%', maxWidth: 520, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
            {(['signup', 'login'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setNotice(''); setGoogleNotice(''); }}
                style={{
                  flex: 1, padding: '14px 0', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', border: 'none', background: 'none',
                  fontFamily: 'inherit', letterSpacing: '0.01em',
                  color: tab === t ? TEXT : MUTED,
                  borderBottom: tab === t ? `2px solid ${ORANGE}` : '2px solid transparent',
                  transition: 'color 0.12s',
                  marginBottom: -1,
                }}>
                {t === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px 28px 24px' }}>

            {/* Heading */}
            <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Start with UGCFire.ai
            </h2>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
              Choose demo access now or sign up for future creator and company accounts.
            </p>

            {/* ── DEMO ACCESS ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>
                Demo access
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMO_ROLES.map(role => (
                  <div key={role.key}
                    style={{
                      background: role.accentBg,
                      border: `1px solid ${role.accentBdr}`,
                      borderRadius: 12,
                      padding: '13px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: role.accent, marginBottom: 2 }}>
                        {role.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5 }}>
                        {role.desc}
                      </div>
                    </div>
                    <button onClick={() => enterDemo(role)}
                      style={{
                        flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', border: 'none',
                        background: role.key === 'creator' ? LIME : role.key === 'client' ? '#22d3ee' : '#a855f7',
                        color: role.key === 'creator' ? '#0d0d0d' : '#fff',
                        letterSpacing: '0.01em',
                      }}>
                      {role.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DIVIDER ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
              <span style={{ fontSize: 11, color: FAINT, fontWeight: 500, whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
            </div>

            {/* ── GOOGLE BUTTON ───────────────────────────────────────── */}
            <button onClick={handleGoogle}
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'var(--card)', color: 'var(--text)', border: `1px solid ${BORDER2}`,
                marginBottom: googleNotice ? 8 : 20,
                transition: 'background 0.12s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--card-2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)'; }}>
              <GoogleIcon />
              Continue with Google
            </button>
            {googleNotice && (
              <div style={{ fontSize: 12, color: '#22d3ee', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>
                {googleNotice}
              </div>
            )}

            {/* ── WORKSPACE CHOICE (signup only) ──────────────────────── */}
            {tab === 'signup' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>
                  Choose your workspace
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {WORKSPACES.map(ws => {
                    const active = workspace === ws.key;
                    return (
                      <button key={ws.key}
                        onClick={() => setWorkspace(ws.key as 'creator' | 'company')}
                        style={{
                          padding: '12px 14px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                          textAlign: 'left', border: active ? `1px solid ${ORANGE}` : `1px solid ${BORDER}`,
                          background: active ? 'rgba(255,92,0,0.07)' : CARD2,
                          transition: 'border-color 0.12s, background 0.12s',
                        }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: active ? ORANGE : TEXT, marginBottom: 4 }}>
                          {ws.label}
                        </div>
                        <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
                          {ws.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: 11, color: FAINT, margin: 0 }}>
                  You can add another workspace later.
                </p>
              </div>
            )}

            {/* ── FORM ────────────────────────────────────────────────── */}
            <form onSubmit={handleFormSubmit}>
              {tab === 'signup' && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5 }}>Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              )}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5 }}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: tab === 'login' ? 6 : 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5 }}>Password</label>
                <input
                  type="password"
                  placeholder={tab === 'signup' ? 'Create a password' : 'Enter password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
              {tab === 'login' && (
                <div style={{ textAlign: 'right', marginBottom: 18 }}>
                  <span style={{ fontSize: 12, color: MUTED, cursor: 'pointer', fontWeight: 500 }}
                    onClick={() => { setNotice('Password reset will be connected soon.'); setTimeout(() => setNotice(''), 4000); }}>
                    Forgot password?
                  </span>
                </div>
              )}

              {notice && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.18)', marginBottom: 14, fontSize: 13, color: LIME, fontWeight: 500 }}>
                  {notice}
                </div>
              )}

              <button type="submit"
                style={{
                  width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                  background: ORANGE, color: '#fff',
                  letterSpacing: '0.01em',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e65200'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ORANGE; }}>
                {tab === 'signup' ? 'Create Account' : 'Log In'}
              </button>
            </form>

            {/* Footer */}
            <p style={{ fontSize: 11, color: FAINT, textAlign: 'center', marginTop: 16, lineHeight: 1.7, margin: '16px 0 0' }}>
              By continuing, you agree to our{' '}
              <Link href="/terms" style={{ color: MUTED, textDecoration: 'underline' }}>Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: MUTED, textDecoration: 'underline' }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* ── RESPONSIVE CSS ───────────────────────────────────────────────── */}
      <style>{`
        @media (min-width: 900px) {
          .auth-left-panel { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
        @media (max-width: 899px) {
          .auth-mobile-logo { display: block !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
  );
}

// ─── Input shared style ───────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: CARD2,
  border: `1px solid ${BORDER}`,
  borderRadius: 9,
  padding: '10px 13px',
  fontSize: 14,
  color: TEXT,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.12s',
};
