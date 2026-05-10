'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { enterDemoMode } from '@/lib/demoData';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const LIME     = '#a3e635';
const ORANGE   = '#FF5C00';

export default function SignupPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const intent       = searchParams.get('intent'); // 'creator' | 'publish' | null

  const [entering, setEntering] = useState<'user' | 'admin' | null>(null);

  function handleDemo(role: 'client' | 'admin') {
    const display = role === 'admin' ? 'admin' : 'user';
    setEntering(display);
    enterDemoMode(role);
    setTimeout(() => {
      router.push(role === 'admin' ? '/admin' : '/dashboard/video');
    }, 120);
  }

  // Headline adapts to intent
  const leftHeadline = intent === 'creator'
    ? 'Build your AI ads portfolio.\nGet hired by brands.'
    : 'Build your AI ads portfolio.\nGet hired by brands.';

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f2f0eb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .demo-card { transition: background 0.15s, border-color 0.15s, transform 0.12s; }
        .demo-card:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.2) !important; transform: translateY(-1px); }
        .demo-card:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }
        .admin-card:hover { border-color: rgba(255,92,0,0.4) !important; }
        .signup-btn:hover { background: #b6f23f !important; box-shadow: 0 0 20px rgba(163,230,53,0.35) !important; }
        .login-btn:hover  { background: rgba(255,255,255,0.1) !important; }
        @media (max-width: 860px) {
          .split-layout { flex-direction: column !important; }
          .left-panel   { padding: 40px 28px 32px !important; min-height: 0 !important; }
          .right-panel  { padding: 32px 20px 48px !important; }
          .left-headline { font-size: 32px !important; }
        }
      `}</style>

      {/* ── MINIMAL HEADER ───────────────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/">
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={30} style={{ objectFit: 'contain', height: 26, width: 'auto', display: 'block' }} unoptimized />
        </Link>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.12s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}>
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </header>

      {/* ── SPLIT LAYOUT ─────────────────────────────────────────────────── */}
      <div className="split-layout" style={{ display: 'flex', flex: 1, marginTop: 56 }}>

        {/* ── LEFT PANEL — Creator Network copy ──────────────────────────── */}
        <div className="left-panel" style={{ flex: 1, minHeight: 'calc(100vh - 56px)', padding: '72px 60px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

          {/* Background video — subtle */}
          <video
            autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, zIndex: 0 }}
            src="https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260429_020651_1d9ae862-a0c1-498e-9296-651fb43dc88c%20(1).mp4"
          />
          {/* Overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,8,8,0.82) 0%, rgba(8,8,8,0.65) 100%)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,0,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 800, color: LIME, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: LIME, boxShadow: `0 0 8px ${LIME}` }} />
              AI CREATOR NETWORK
            </div>

            {/* Headline */}
            <h1 className="left-headline" style={{ fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20, whiteSpace: 'pre-line' }}>
              {leftHeadline}
            </h1>

            {/* Subheadline */}
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 40, maxWidth: 420 }}>
              UGCFire.ai is where AI creators build portfolios, publish UGC-style image and video ads, and turn on Open to Work for paid brand campaigns.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '—', color: LIME,   text: 'Upload AI ad work made anywhere' },
                { icon: '—', color: LIME,   text: 'Create video and image ads with UGCFire tools' },
                { icon: '—', color: ORANGE, text: 'Build a public AI creator portfolio' },
                { icon: '—', color: ORANGE, text: 'Turn on Open to Work for paid brand projects' },
              ].map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: f.color, fontSize: 13, fontWeight: 800, marginTop: 1, flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Signup card ──────────────────────────────────── */}
        <div className="right-panel" style={{ width: 'min(480px, 100%)', minHeight: 'calc(100vh - 56px)', padding: '72px 40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>

          <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>

            {/* Card heading */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6 }}>
                Start creating with UGCFire.ai
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
                Use demo access now. Full creator accounts are coming soon.
              </p>
            </div>

            {/* Demo User card */}
            <button className="demo-card"
              onClick={() => handleDemo('client')}
              disabled={entering !== null}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10, textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, color: LIME, fontWeight: 800 }}>
                C
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                  {entering === 'user' ? 'Entering…' : 'Demo User'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Explore the creator dashboard</div>
              </div>
              <ChevronRight size={16} color={LIME} />
            </button>

            {/* Demo Admin card */}
            <button className="demo-card admin-card"
              onClick={() => handleDemo('admin')}
              disabled={entering !== null}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,92,0,0.05)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24, textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, color: ORANGE, fontWeight: 800 }}>
                A
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                  {entering === 'admin' ? 'Entering…' : 'Demo Admin'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Explore the admin creator network</div>
              </div>
              <ChevronRight size={16} color={ORANGE} />
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Sign up + Login */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="/signup" className="signup-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 15, borderRadius: 12, padding: '13px 0', textDecoration: 'none', transition: 'background 0.15s, box-shadow 0.15s', boxShadow: `0 0 0px rgba(163,230,53,0)` }}>
                Sign up with email
              </a>
              <a href="/login" className="login-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 15, borderRadius: 12, padding: '13px 0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.15s' }}>
                Log in
              </a>
            </div>

            {/* Footer note */}
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 24, lineHeight: 1.6 }}>
              By continuing you agree to our{' '}
              <Link href="/terms" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Terms</Link>
              {' & '}
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
