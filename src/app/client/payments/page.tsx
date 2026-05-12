'use client';

import React from 'react';
import { DollarSign, Lock, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const SUMMARY = [
  { label: 'Total Deposited', value: '$4,200', icon: DollarSign,  color: '#fff',     sub: 'All projects'          },
  { label: 'In Escrow',       value: '$2,450', icon: Lock,        color: '#22d3ee',  sub: 'Pending delivery'      },
  { label: 'Pending Approval',value: '$680',   icon: Clock,       color: ORANGE,     sub: '3 submissions to review'},
  { label: 'Released',        value: '$1,070', icon: CheckCircle, color: LIME,       sub: 'Paid to creators'      },
];

const TRANSACTIONS = [
  { id: 1, project: 'Fitness Brand Testimonials', creator: 'Sam Torres',   amount: '$320', status: 'Released', date: 'May 8',  statusColor: LIME   },
  { id: 2, project: 'Summer Skincare Campaign',   creator: 'Alex Rivera',  amount: '$450', status: 'In Escrow', date: 'May 9', statusColor: '#22d3ee' },
  { id: 3, project: 'App Launch Video Ads',       creator: 'Maya Chen',    amount: '$230', status: 'Pending Approval', date: 'May 10', statusColor: ORANGE },
  { id: 4, project: 'App Launch Video Ads',       creator: 'Jordan Kim',   amount: '$230', status: 'Pending Approval', date: 'May 10', statusColor: ORANGE },
  { id: 5, project: 'Product Launch Graphics',    creator: 'Riley Park',   amount: '$280', status: 'In Escrow', date: 'May 7',  statusColor: '#22d3ee' },
  { id: 6, project: 'Fitness Brand Testimonials', creator: 'Sam Torres',   amount: '$750', status: 'Released', date: 'Apr 28', statusColor: LIME   },
];

export default function ClientPaymentsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        @media (max-width: 760px) { .summary-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 960, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>Payments</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Escrow balances, pending approvals, and released payments.</p>
        </div>

        {/* Summary cards */}
        <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {SUMMARY.map(s => (
            <div key={s.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={14} color={s.color} strokeWidth={1.75} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Escrow note */}
        <div style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 28 }}>
          <Lock size={15} color="#22d3ee" strokeWidth={1.75} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Escrow protection</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Funds are held securely until you approve deliverables. Creators are paid only when you confirm the work is complete.
              Stripe integration will be wired in a future step.
            </div>
          </div>
        </div>

        {/* Transaction table */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Payment History</h2>
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '1fr 120px 100px 110px 80px', gap: 12 }}>
            {['Project', 'Creator', 'Amount', 'Status', 'Date'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {TRANSACTIONS.map((t, i) => (
            <div key={t.id} style={{ padding: '14px 20px', borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${BORDER}` : undefined, display: 'grid', gridTemplateColumns: '1fr 120px 100px 110px 80px', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{t.project}</div>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.creator}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: LIME }}>{t.amount}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.statusColor, background: `${t.statusColor}14`, padding: '3px 10px', borderRadius: 20, border: `1px solid ${t.statusColor}25`, display: 'inline-block' }}>{t.status}</span>
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t.date}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 16, fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>
          Payments are demo data only. Stripe will be connected in a future step.
        </p>

      </div>
    </>
  );
}
