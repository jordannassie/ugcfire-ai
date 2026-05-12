'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Users, MessageSquare, CreditCard, Package, Shield, TrendingUp, Clock, DollarSign, Bell } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BG = 'var(--bg)';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const STATS = [
  { label: 'Active Projects',     value: '3',      icon: Briefcase,    color: ORANGE,  sub: '2 in progress'    },
  { label: 'Pending Submissions', value: '7',      icon: Clock,        color: LIME,    sub: 'Awaiting review'  },
  { label: 'Escrow Balance',      value: '$2,450', icon: DollarSign,   color: '#22d3ee', sub: 'Funds held safely'},
  { label: 'Messages',            value: '12',     icon: Bell,         color: '#a855f7', sub: '4 unread'         },
];

const ACTIONS = [
  { label: 'Post a Project',  desc: 'Brief a new AI creator project',       href: '/client/post-project',  icon: Briefcase, color: ORANGE, bg: 'rgba(255,92,0,0.08)',    border: 'rgba(255,92,0,0.2)'    },
  { label: 'Browse Creators', desc: 'Find and invite AI creators',          href: '/client/creators',      icon: Users,     color: LIME,   bg: 'rgba(163,230,53,0.06)',  border: 'rgba(163,230,53,0.18)' },
  { label: 'View Projects',   desc: 'Track project status and submissions', href: '/client/projects',      icon: Shield,    color: ORANGE, bg: 'rgba(255,92,0,0.05)',    border: BORDER                  },
  { label: 'Payments',        desc: 'Escrow, approvals, and payouts',       href: '/client/payments',      icon: CreditCard,color: '#22d3ee', bg: 'rgba(34,211,238,0.05)', border: 'rgba(34,211,238,0.15)' },
  { label: 'Brand Assets',    desc: 'Logos, guides, and product images',    href: '/client/brand-assets',  icon: Package,   color: LIME,   bg: 'rgba(163,230,53,0.05)',  border: BORDER                  },
  { label: 'Messages',        desc: 'Chat with creators on your projects',  href: '/client/messages',      icon: MessageSquare, color: '#a855f7', bg: 'rgba(168,85,247,0.05)', border: 'rgba(168,85,247,0.15)' },
];

const RECENT_PROJECTS = [
  { title: 'Summer Skincare Campaign', status: 'In Progress', creators: 2, due: '7 days', statusColor: LIME  },
  { title: 'App Launch Video Ads',     status: 'Review',      creators: 3, due: '3 days', statusColor: ORANGE },
  { title: 'Product Launch Graphics',  status: 'Posted',      creators: 0, due: '10 days', statusColor: 'rgba(255,255,255,0.35)' },
];

export default function ClientDashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .action-card { background: ${PANEL}; border-radius: 16px; padding: 22px 20px; text-decoration: none; display: flex; flex-direction: column; gap: 10px; transition: transform 0.18s, border-color 0.15s; }
        .action-card:hover { transform: translateY(-2px); }
        .stat-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 20px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .actions-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr !important; } .actions-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
            Client Dashboard
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Welcome back, Demo Client
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Post projects, review creator work, and manage escrow-style payments.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={15} color={s.color} strokeWidth={1.75} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Quick Actions</h2>
        <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 36 }}>
          {ACTIONS.map(a => (
            <Link key={a.label} href={a.href} className="action-card" style={{ border: `1px solid ${a.border}`, background: a.bg }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${a.color}18`, border: `1px solid ${a.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={18} color={a.color} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.desc}</div>
              </div>
              <div style={{ fontSize: 12, color: a.color, fontWeight: 600, marginTop: 'auto' }}>Open →</div>
            </Link>
          ))}
        </div>

        {/* Recent projects */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Recent Projects</h2>
          <Link href="/client/projects" style={{ fontSize: 12, color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RECENT_PROJECTS.map(p => (
            <div key={p.title} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{p.creators} creator{p.creators !== 1 ? 's' : ''} · Due in {p.due}</div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${p.statusColor}14`, border: `1px solid ${p.statusColor}30`, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: p.statusColor, flexShrink: 0 }}>
                {p.status}
              </div>
              <Link href="/client/projects" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, flexShrink: 0 }}>View →</Link>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
