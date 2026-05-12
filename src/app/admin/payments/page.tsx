'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Lock, RefreshCw, CheckCircle } from 'lucide-react';
import { ADMIN_PAYMENTS, type AdminPayment } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

type PayoutAction = 'Released' | 'On Hold' | 'Refund Review';

const PAYOUT_CONFIG: Record<string, { color: string; bg: string }> = {
  'Released':      { color: LIME,      bg: 'rgba(163,230,53,0.1)'   },
  'Pending':       { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)'   },
  'On Hold':       { color: ORANGE,    bg: `${ORANGE}18`            },
  'Refund Review': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'    },
  'Refunded':      { color: '#6b7280', bg: 'rgba(107,114,128,0.1)'  },
};

const ESCROW_CONFIG: Record<string, { color: string }> = {
  'Funded':      { color: LIME      },
  'Not Funded':  { color: '#6b7280' },
  'In Review':   { color: '#22d3ee' },
  'Released':    { color: ORANGE    },
};

export const dynamic = 'force-dynamic';

export default function AdminPaymentsPage() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  function getPayoutStatus(pay: AdminPayment): string {
    return overrides[pay.id] ?? pay.payoutStatus;
  }

  function act(id: string, action: string) {
    setOverrides(prev => ({ ...prev, [id]: action }));
  }

  const totalEscrow   = ADMIN_PAYMENTS.filter(p => ['Funded','In Review'].includes(p.escrowStatus)).reduce((s,p) => s + p.projectBudget, 0);
  const pendingPayout = ADMIN_PAYMENTS.filter(p => getPayoutStatus(p) === 'Pending').reduce((s,p) => s + p.creatorPayout, 0);
  const platformFees  = ADMIN_PAYMENTS.reduce((s,p) => s + p.platformFee, 0);
  const released      = ADMIN_PAYMENTS.filter(p => getPayoutStatus(p) === 'Released').reduce((s,p) => s + p.creatorPayout, 0);
  const refundReqs    = ADMIN_PAYMENTS.filter(p => getPayoutStatus(p) === 'Refund Review').length;

  const SUMMARY = [
    { label: 'Total Escrow',           value: `$${totalEscrow.toLocaleString()}`,   color: '#22d3ee', icon: Lock          },
    { label: 'Pending Creator Payouts', value: `$${pendingPayout.toLocaleString()}`, color: LIME,      icon: TrendingUp    },
    { label: 'Platform Fees (total)',  value: `$${platformFees.toLocaleString()}`,  color: ORANGE,    icon: DollarSign    },
    { label: 'Released Payments',      value: `$${released.toLocaleString()}`,      color: LIME,      icon: CheckCircle   },
    { label: 'Refund Requests',        value: String(refundReqs),                  color: '#ef4444', icon: RefreshCw     },
  ];

  return (
    <>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pay-row { display: grid; grid-template-columns: 2fr 1fr 1fr 80px 80px 70px 90px 90px 140px; gap: 10px; align-items: center; padding: 13px 18px; border-bottom: 1px solid ${BORDER}; }
        @media (max-width: 1000px) { .pay-row { grid-template-columns: 2fr 1fr 80px 90px 140px; } .hide-md { display: none !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1300, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Payment & Escrow Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
            Manage creator payouts, escrow releases, and refund requests.
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          {SUMMARY.map(s => (
            <div key={s.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={14} color={s.color} strokeWidth={1.75} />
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Payment table */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Table header */}
          <div className="pay-row" style={{ borderBottom: `1px solid ${BORDER}` }}>
            {['Project', 'Client', 'Creator', 'Budget', 'Payout', 'UGCFire Fee', 'Escrow', 'Payout Status', 'Action'].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                className={['Creator', 'Budget', 'UGCFire Fee', 'Escrow'].includes(h) ? 'hide-md' : ''}>{h}</span>
            ))}
          </div>

          {ADMIN_PAYMENTS.map(pay => {
            const ps  = getPayoutStatus(pay);
            const psc = PAYOUT_CONFIG[ps] ?? { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
            const ec  = ESCROW_CONFIG[pay.escrowStatus] ?? { color: 'var(--text-muted)' };
            return (
              <div key={pay.id} className="pay-row"
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ minWidth: 0 }}>
                  <Link href={`/admin/projects/${pay.projectId}`} style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{pay.projectTitle}</Link>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{pay.date}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pay.clientName}</div>
                <div className="hide-md" style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pay.creatorName}</div>
                <div className="hide-md" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>${pay.projectBudget}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: LIME }}>${pay.creatorPayout}</div>
                <div className="hide-md" style={{ fontSize: 12, color: ORANGE }}>${pay.platformFee}</div>
                <div className="hide-md">
                  <span style={{ fontSize: 10, fontWeight: 700, color: ec.color, background: `${ec.color}14`, padding: '3px 8px', borderRadius: 20, border: `1px solid ${ec.color}25` }}>{pay.escrowStatus}</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: psc.color, background: psc.bg, padding: '3px 8px', borderRadius: 20, border: `1px solid ${psc.color}30` }}>{ps}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {ps !== 'Released' && ps !== 'Refunded' && (
                    <button onClick={() => act(pay.id, 'Released')}
                      style={{ fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', background: `${LIME}18`, border: `1px solid ${LIME}35`, color: LIME, whiteSpace: 'nowrap' }}>
                      Release
                    </button>
                  )}
                  {ps !== 'On Hold' && ps !== 'Released' && ps !== 'Refunded' && (
                    <button onClick={() => act(pay.id, 'On Hold')}
                      style={{ fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`, color: ORANGE, whiteSpace: 'nowrap' }}>
                      Hold
                    </button>
                  )}
                  {ps !== 'Refund Review' && ps !== 'Released' && ps !== 'Refunded' && (
                    <button onClick={() => act(pay.id, 'Refund Review')}
                      style={{ fontSize: 10, fontWeight: 600, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', whiteSpace: 'nowrap' }}>
                      Refund
                    </button>
                  )}
                  {(ps === 'Released' || ps === 'Refunded') && (
                    <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
