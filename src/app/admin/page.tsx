'use client';

import React from 'react';
import { Users, Video, ImageIcon, DollarSign, TrendingUp, Activity, Zap, CheckCircle2, UserPlus } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD   = '#141414';

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Total Users',             value: '24,583',  trend: '12.5% vs last 30 days',  icon: Users,       color: 'rgba(99,102,241,0.15)',  iconColor: '#818cf8' },
  { label: 'Videos Generated Today',  value: '1,248',   trend: '18.7% vs yesterday',     icon: Video,       color: 'rgba(255,92,0,0.15)',   iconColor: ORANGE    },
  { label: 'Images Generated Today',  value: '3,682',   trend: '15.3% vs yesterday',     icon: ImageIcon,   color: 'rgba(163,230,53,0.12)', iconColor: LIME      },
  { label: 'Monthly Revenue',         value: '$48,290', trend: '22.1% vs last month',    icon: DollarSign,  color: 'rgba(234,179,8,0.12)',  iconColor: '#eab308' },
];

const ACTIVITY = [
  { icon: UserPlus,   label: 'Sarah Johnson',      detail: 'New user signed up',            time: '2m ago',  amount: null    },
  { icon: Video,      label: 'Video generated',    detail: 'by @mike_creates',              time: '4m ago',  amount: null    },
  { icon: ImageIcon,  label: 'Image generated',    detail: 'by @outdoor_life',              time: '7m ago',  amount: null    },
  { icon: DollarSign, label: 'Payment received',   detail: 'from Pro Plan — Monthly',       time: '11m ago', amount: '$29.00'},
  { icon: Activity,   label: 'Support ticket',     detail: 'created by @james_wilson',      time: '18m ago', amount: null    },
];

const SYSTEM = [
  { label: 'API',     status: 'Operational' },
  { label: 'Queue',   status: 'Operational' },
  { label: 'Storage', status: 'Operational' },
  { label: 'Billing', status: 'Operational' },
];

const PLANS = [
  { label: 'Pro Plan',      count: 12540, pct: 51, color: LIME    },
  { label: 'Creator Plan',  count: 7862,  pct: 32, color: ORANGE  },
  { label: 'Starter Plan',  count: 3421,  pct: 14, color: '#eab308'},
  { label: 'Enterprise',    count: 760,   pct: 3,  color: '#8b5cf6'},
];

const NEW_USERS = [
  { name: 'Sarah Johnson', email: 'sarah.j@example.com',    time: '2m ago',  color: '#8b5cf6' },
  { name: 'Mike Chen',     email: 'mike.chen@example.com',  time: '6m ago',  color: '#06b6d4' },
  { name: 'Alex Rivera',   email: 'alex.rivera@example.com',time: '14m ago', color: '#22c55e' },
  { name: 'Jessica Lee',   email: 'jessica.lee@example.com',time: '22m ago', color: ORANGE    },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 12px', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{title}</span>
      {action && <button style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{action}</button>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  return (
    <div style={{ padding: '28px 24px', maxWidth: 1400 }}>

      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Monitor your platform at a glance.</p>
      </div>

      {/* ── ROW 1: STAT CARDS ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {STATS.map(s => (
          <Card key={s.label} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</p>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={16} color={s.iconColor} strokeWidth={1.75} />
              </div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6 }}>{s.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <TrendingUp size={12} color='#22c55e' strokeWidth={2.5} />
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{s.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ── ROW 2: ACTIVITY + SYSTEM ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, marginBottom: 20 }}>

        {/* Recent Activity */}
        <Card>
          <SectionHeader title="Recent Activity" action="View all" />
          <div>
            {ACTIVITY.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < ACTIVITY.length - 1 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={14} color="rgba(255,255,255,0.5)" strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.label}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>{item.detail}</span>
                </div>
                {item.amount && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>{item.amount}</span>
                )}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <SectionHeader title="System Status" />
          <div style={{ padding: '8px 18px 16px' }}>
            {SYSTEM.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < SYSTEM.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 5px rgba(34,197,94,0.5)' }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: LIME }}>{s.status}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, padding: '10px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 9, border: '1px solid rgba(34,197,94,0.15)' }}>
              <CheckCircle2 size={14} color='#22c55e' strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>All systems operational</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── ROW 3: SUBSCRIPTION + NEWEST USERS ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>

        {/* Subscription Breakdown */}
        <Card>
          <SectionHeader title="Subscription Breakdown" action="View all" />
          <div style={{ padding: '14px 18px 18px' }}>
            {PLANS.map((p, i) => (
              <div key={i} style={{ marginBottom: i < PLANS.length - 1 ? 18 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{p.label}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{p.count.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', minWidth: 32, textAlign: 'right' }}>({p.pct}%)</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: 6, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Newest Users */}
        <Card>
          <SectionHeader title="Newest Users" action="View all" />
          <div>
            {NEW_USERS.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderBottom: i < NEW_USERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.color + '33', border: `1px solid ${u.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: u.color }}>{u.name[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.33)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', flexShrink: 0 }}>{u.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.18)', marginTop: 32, paddingBottom: 8 }}>
        © 2026 UGCFire.ai · All rights reserved.
      </p>
    </div>
  );
}
