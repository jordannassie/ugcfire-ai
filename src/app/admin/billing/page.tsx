'use client';

import React from 'react';
import { TrendingUp, DollarSign, CreditCard, Users, ArrowUpRight } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BORDER = 'var(--border)';
const CARD   = 'var(--card)';

const REVENUE_STATS = [
  { label: 'Monthly Recurring Revenue', value: '$48,290',  trend: '+22.1%', icon: DollarSign, color: 'rgba(163,230,53,0.12)', iconColor: LIME    },
  { label: 'Annual Recurring Revenue',  value: '$579,480', trend: '+19.8%', icon: TrendingUp,  color: 'rgba(255,92,0,0.12)',   iconColor: ORANGE  },
  { label: 'Active Subscriptions',      value: '24,583',   trend: '+12.5%', icon: Users,       color: 'rgba(99,102,241,0.12)', iconColor: '#818cf8'},
  { label: 'Avg Revenue Per User',      value: '$1.97',    trend: '+8.3%',  icon: CreditCard,  color: 'rgba(234,179,8,0.12)',  iconColor: '#eab308'},
];

const RECENT_PAYMENTS = [
  { name: 'Sarah Johnson', email: 'sarah.j@example.com',    plan: 'Pro Plan',      amount: '$29.00',  status: 'Paid',    date: 'May 9, 2026'  },
  { name: 'Mike Chen',     email: 'mike.chen@example.com',  plan: 'Creator Plan',  amount: '$19.00',  status: 'Paid',    date: 'May 9, 2026'  },
  { name: 'Emma Nguyen',   email: 'emma.n@example.com',     plan: 'Enterprise',    amount: '$299.00', status: 'Paid',    date: 'May 8, 2026'  },
  { name: 'Ryan Patel',    email: 'ryan.patel@example.com', plan: 'Creator Plan',  amount: '$19.00',  status: 'Paid',    date: 'May 8, 2026'  },
  { name: 'Alex Rivera',   email: 'alex.rivera@example.com',plan: 'Starter Plan',  amount: '$9.00',   status: 'Paid',    date: 'May 7, 2026'  },
  { name: 'Taylor Smith',  email: 't.smith@example.com',    plan: 'Pro Plan',      amount: '$29.00',  status: 'Failed',  date: 'May 6, 2026'  },
  { name: 'Jordan Kim',    email: 'j.kim@example.com',      plan: 'Pro Plan',      amount: '$29.00',  status: 'Paid',    date: 'May 5, 2026'  },
  { name: 'Chris Wang',    email: 'c.wang@example.com',     plan: 'Starter Plan',  amount: '$9.00',   status: 'Refunded',date: 'May 4, 2026'  },
];

const PLANS = [
  { label: 'Pro Plan',      price: '$29/mo',  users: 12540, revenue: '$363,660', color: LIME    },
  { label: 'Creator Plan',  price: '$19/mo',  users: 7862,  revenue: '$149,378', color: ORANGE  },
  { label: 'Starter Plan',  price: '$9/mo',   users: 3421,  revenue: '$30,789',  color: '#eab308' },
  { label: 'Enterprise',    price: '$299/mo', users: 760,   revenue: '$227,240', color: '#8b5cf6' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Paid:     { bg: 'rgba(34,197,94,0.1)',   text: '#22c55e' },
  Failed:   { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444' },
  Refunded: { bg: 'rgba(234,179,8,0.1)',   text: '#eab308' },
  Pending:  { bg: 'rgba(255,255,255,0.07)',text: 'rgba(255,255,255,0.5)' },
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, ...style }}>{children}</div>;
}

export default function AdminBillingPage() {
  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4 }}>Billing</h1>
        <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>Revenue overview and subscription breakdown.</p>
      </div>

      {/* Revenue stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {REVENUE_STATS.map(s => (
          <Card key={s.label} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>{s.label}</p>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={15} color={s.iconColor} strokeWidth={1.75} />
              </div>
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 5 }}>{s.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpRight size={12} color='#22c55e' strokeWidth={2.5} />
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{s.trend} vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, marginBottom: 20 }}>

        {/* Recent Payments */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Recent Payments</span>
            <button style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View all</button>
          </div>
          <div>
            {RECENT_PAYMENTS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderBottom: i < RECENT_PAYMENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-faint)' }}>{p.plan} · {p.date}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: STATUS_COLORS[p.status]?.bg, color: STATUS_COLORS[p.status]?.text, flexShrink: 0 }}>{p.status}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', minWidth: 55, textAlign: 'right', flexShrink: 0 }}>{p.amount}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Plans breakdown */}
        <Card>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Plans</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            {PLANS.map((p, i) => (
              <div key={i} style={{ marginBottom: i < PLANS.length - 1 ? 18 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 7 }}>{p.price}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{p.revenue}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${Math.round(p.users / 250)}%`, maxWidth: '100%', background: p.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)', flexShrink: 0 }}>{p.users.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
