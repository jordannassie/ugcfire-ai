'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clapperboard, User, Briefcase, ClipboardList, LayoutDashboard, DollarSign,
  ArrowRight,
} from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const QUICK_CARDS = [
  { label: 'Studio',        sub: 'Generate AI images and videos',         href: '/dashboard/studio',        icon: Clapperboard,   color: ORANGE  },
  { label: 'Profile',       sub: 'Your profile is your portfolio',         href: '/dashboard/profile',       icon: User,           color: LIME    },
  { label: 'Opportunities', sub: 'Apply to paid brand projects',          href: '/opportunities',           icon: Briefcase,      color: '#22d3ee'},
  { label: 'Applications',  sub: 'Track your project applications',       href: '/dashboard/applications',  icon: ClipboardList,  color: '#a855f7'},
  { label: 'Projects',      sub: 'Manage active brand work',              href: '/dashboard/projects',      icon: LayoutDashboard,color: ORANGE  },
  { label: 'Earnings',      sub: 'View payouts and payment history',      href: '/dashboard/earnings',      icon: DollarSign,     color: LIME    },
];

export default function DashboardHome() {
  return (
    <>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .card-link { text-decoration: none; display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: #141414; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; transition: border-color 0.15s, transform 0.12s; }
        .card-link:hover { border-color: rgba(255,255,255,0.16); transform: translateY(-1px); }
        @media (max-width: 680px) { .grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: 900, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'inline-block', background: `${LIME}12`, border: `1px solid ${LIME}28`, borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
            Creator Dashboard
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 12 }}>
            Create AI ads in Studio,<br />
            <span style={{ color: ORANGE }}>build your profile,</span> and get paid.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
            Studio is where you generate AI images and videos. Your profile is your portfolio — it proves your skill to brands. Opportunities get you paid.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/dashboard/studio" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: ORANGE, color: '#fff', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Open Studio <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${LIME}14`, border: `1px solid ${LIME}35`, color: LIME, borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              View Opportunities
            </Link>
            <Link href="/dashboard/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick cards */}
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {QUICK_CARDS.map(card => (
            <Link key={card.label} href={card.href} className="card-link">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${card.color}18`, border: `1px solid ${card.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <card.icon size={18} color={card.color} strokeWidth={1.75} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{card.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.sub}</div>
              </div>
              <ArrowRight size={14} color="rgba(255,255,255,0.2)" strokeWidth={1.75} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
