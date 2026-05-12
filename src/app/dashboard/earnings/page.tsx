'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Clock, CheckCircle, Briefcase } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const STATS = [
  { label: 'Total Earned',       value: '$1,095', icon: DollarSign,  color: LIME,   sub: 'All time'         },
  { label: 'Pending Release',    value: '$450',   icon: Clock,       color: ORANGE, sub: 'Awaiting approval' },
  { label: 'Projects Completed', value: '8',      icon: CheckCircle, color: LIME,   sub: 'Approved work'    },
  { label: 'Avg. Per Project',   value: '$137',   icon: TrendingUp,  color: '#22d3ee', sub: 'Across 8 projects' },
];

const PAYMENTS = [
  { id: 1, project: 'Fitness Brand Testimonials', client: 'CoreFit',       amount: '$175', date: 'May 8',   status: 'Paid',    color: LIME   },
  { id: 2, project: 'App Launch Video Ads',       client: 'LaunchKit',     amount: '$230', date: 'May 10',  status: 'Pending', color: ORANGE },
  { id: 3, project: 'Summer Skincare Campaign',   client: 'GlowCo Beauty', amount: '$150', date: 'May 10',  status: 'Pending', color: ORANGE },
  { id: 4, project: 'SaaS Demo Package',          client: 'ToolHive',      amount: '$280', date: 'Apr 29',  status: 'Paid',    color: LIME   },
  { id: 5, project: 'Product Lifestyle Shots',    client: 'ShopBrand',     amount: '$120', date: 'Apr 21',  status: 'Paid',    color: LIME   },
  { id: 6, project: 'Supplement Ad Bundle',       client: 'PureForm',      amount: '$340', date: 'Apr 14',  status: 'Paid',    color: LIME   },
];

export default function EarningsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        @media (max-width: 760px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 860, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: LIME, marginBottom: 10 }}>
            Creator Earnings
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Earnings</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Track your income from brand projects, escrow balances, and payouts.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={13} color={s.color} strokeWidth={1.75} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Payout note */}
        <div style={{ background: 'rgba(163,230,53,0.05)', border: '1px solid rgba(163,230,53,0.18)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 28 }}>
          <DollarSign size={15} color={LIME} strokeWidth={1.75} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Payouts via Stripe Connect</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              When a client approves your submission, funds are released from escrow. Stripe Connect will be wired in a future step.
            </div>
          </div>
        </div>

        {/* Transaction table */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Payment History</h2>
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '1fr 120px 90px 100px 70px', gap: 12 }}>
            {['Project', 'Client', 'Amount', 'Status', 'Date'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {PAYMENTS.map((p, i) => (
            <div key={p.id} style={{ padding: '14px 20px', borderBottom: i < PAYMENTS.length - 1 ? `1px solid ${BORDER}` : undefined, display: 'grid', gridTemplateColumns: '1fr 120px 90px 100px 70px', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.project}</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.client}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: LIME }}>{p.amount}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color, background: `${p.color}14`, padding: '3px 10px', borderRadius: 20, border: `1px solid ${p.color}25`, display: 'inline-block' }}>{p.status}</span>
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{p.date}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, textDecoration: 'none' }}>
            <Briefcase size={14} strokeWidth={2.5} />
            Find More Projects
          </Link>
        </div>

      </div>
    </>
  );
}
