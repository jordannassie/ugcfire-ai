'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Briefcase, Shield } from 'lucide-react';
import { enterDemoMode, type DemoRole } from '@/lib/demoData';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const ROLES: {
  key: DemoRole;
  icon: React.FC<{ size: number; color: string; strokeWidth: number }>;
  label: string;
  tagline: string;
  desc: string;
  btn: string;
  btnBg: string;
  btnColor: string;
  accent: string;
  accentBorder: string;
  route: string;
}[] = [
  {
    key: 'creator',
    icon: Zap,
    label: 'AI Creator',
    tagline: 'Create. Publish. Get paid.',
    desc: 'Create AI ads, build your portfolio, apply to projects, chat with clients, and track earnings.',
    btn: 'Enter as Creator',
    btnBg: LIME,
    btnColor: '#0d0d0d',
    accent: 'rgba(163,230,53,0.06)',
    accentBorder: 'rgba(163,230,53,0.22)',
    route: '/dashboard',
  },
  {
    key: 'client',
    icon: Briefcase,
    label: 'Brand / Agency Client',
    tagline: 'Post projects. Hire creators.',
    desc: 'Post projects, review AI creator applications, manage submissions, chat with creators, and approve escrow-style payments.',
    btn: 'Enter as Client',
    btnBg: ORANGE,
    btnColor: '#fff',
    accent: 'rgba(255,92,0,0.06)',
    accentBorder: 'rgba(255,92,0,0.22)',
    route: '/client',
  },
  {
    key: 'admin',
    icon: Shield,
    label: 'UGCFire Admin',
    tagline: 'Manage the whole platform.',
    desc: 'Manage projects, creators, clients, applications, submissions, payments, disputes, and platform quality.',
    btn: 'Enter as Admin',
    btnBg: '#6366f1',
    btnColor: '#fff',
    accent: 'rgba(99,102,241,0.06)',
    accentBorder: 'rgba(99,102,241,0.22)',
    route: '/admin',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [entering, setEntering] = useState<DemoRole | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleEnter(role: DemoRole, route: string) {
    setEntering(role);
    enterDemoMode(role);
    router.push(route);
  }

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { overflow-x: hidden; }
        body { background: ${BG}; color: #f2f0eb; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow-x: hidden; }
        .role-card { background: ${PANEL}; border-radius: 20px; padding: 28px 24px; transition: transform 0.18s, box-shadow 0.18s; cursor: default; }
        .role-card:hover { transform: translateY(-3px); }
        .role-btn { width: 100%; border: none; border-radius: 11px; padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; letter-spacing: -0.01em; transition: opacity 0.15s, transform 0.1s; }
        .role-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .role-btn:active { transform: translateY(0); }
        .role-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        @media (max-width: 900px) { .roles-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: BG, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 26, width: 'auto' }} unoptimized />
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Demo Mode
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 64px' }}>

        <div style={{ maxWidth: 900, width: '100%', textAlign: 'center' }}>

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 24 }}>
            AI Creator Network
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Choose how you want to explore UGCFire
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 52, maxWidth: 540, margin: '0 auto 52px' }}>
            Demo the AI Creator Network as a creator, client, or admin before accounts and payments are connected.
          </p>

          {/* Role cards */}
          <div className="roles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
            {ROLES.map(role => (
              <div key={role.key} className="role-card" style={{ border: `1px solid ${role.accentBorder}`, background: role.accent }}>

                {/* Icon */}
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${role.btnBg}18`, border: `1px solid ${role.btnBg}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <role.icon size={22} color={role.btnBg} strokeWidth={1.75} />
                </div>

                {/* Label */}
                <div style={{ fontSize: 12, fontWeight: 700, color: role.btnBg, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {role.tagline}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2 }}>
                  {role.label}
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 24 }}>
                  {role.desc}
                </p>

                <button
                  className="role-btn"
                  disabled={entering !== null}
                  onClick={() => handleEnter(role.key, role.route)}
                  style={{ background: role.btnBg, color: role.btnColor }}>
                  {entering === role.key ? 'Entering...' : role.btn}
                </button>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
            Demo mode uses localStorage only. No real accounts, auth, or payments are involved.&nbsp;
            <Link href="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Back to homepage</Link>
          </p>

        </div>
      </main>
    </>
  );
}
