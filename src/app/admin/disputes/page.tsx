'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, RefreshCw, DollarSign } from 'lucide-react';
import { ADMIN_DISPUTES, type AdminDispute } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type Resolution = 'Open' | 'In Review' | 'Resolved' | 'Escalated';

const STATUS_CONFIG: Record<Resolution, { color: string; bg: string; border: string }> = {
  'Open':      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)' },
  'In Review': { color: ORANGE,   bg: `${ORANGE}15`,          border: `${ORANGE}30`          },
  'Resolved':  { color: LIME,     bg: 'rgba(163,230,53,0.1)', border: 'rgba(163,230,53,0.25)'},
  'Escalated': { color: '#a855f7',bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)'},
};

const ISSUE_COLORS: Record<string, string> = {
  'Revision Requested': '#22d3ee',
  'Client Rejected':    '#ef4444',
  'Late Delivery':      ORANGE,
  'Payment Hold':       '#a855f7',
  'Quality Review':     '#eab308',
};

export const dynamic = 'force-dynamic';

export default function AdminDisputesPage() {
  const [overrides, setOverrides] = useState<Record<string, Resolution>>({});
  const [filter, setFilter]       = useState<'All' | Resolution>('All');

  function getStatus(d: AdminDispute): Resolution {
    return (overrides[d.id] as Resolution) ?? d.status as Resolution;
  }

  function act(id: string, action: Resolution) {
    setOverrides(prev => ({ ...prev, [id]: action }));
  }

  const filtered = ADMIN_DISPUTES.filter(d => filter === 'All' || getStatus(d) === filter);

  const counts = { All: ADMIN_DISPUTES.length, Open: 0, 'In Review': 0, Resolved: 0, Escalated: 0 };
  ADMIN_DISPUTES.forEach(d => { const s = getStatus(d); counts[s as keyof typeof counts]++; });

  const totalAtRisk = ADMIN_DISPUTES.filter(d => ['Open','In Review'].includes(getStatus(d))).reduce((s,d) => s + d.amountAtRisk, 0);

  return (
    <>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 12 }}>
            <AlertTriangle size={10} strokeWidth={2.5} /> {counts.Open + counts['In Review']} active disputes
          </div>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Disputes & Resolution Queue
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
            ${totalAtRisk} at risk across open and in-review disputes
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['All', 'Open', 'In Review', 'Resolved', 'Escalated'] as const).map(f => {
            const c = f === 'All' ? 'rgba(255,255,255,0.45)' : STATUS_CONFIG[f]?.color ?? 'rgba(255,255,255,0.45)';
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${filter === f ? c : BORDER}`,
                  background: filter === f ? `${c}18` : 'transparent',
                  color: filter === f ? c : 'rgba(255,255,255,0.45)' }}>
                {f} ({counts[f as keyof typeof counts]})
              </button>
            );
          })}
        </div>

        {/* Dispute cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '48px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
              No disputes in this category.
            </div>
          ) : filtered.map(d => {
            const st  = getStatus(d);
            const sc  = STATUS_CONFIG[st];
            const ic  = ISSUE_COLORS[d.issueType] ?? 'rgba(255,255,255,0.4)';
            return (
              <div key={d.id} style={{ background: PANEL, border: `1px solid ${st === 'Open' || st === 'In Review' ? 'rgba(239,68,68,0.2)' : BORDER}`, borderRadius: 14, padding: '20px' }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: ic, background: `${ic}15`, border: `1px solid ${ic}25`, padding: '2px 9px', borderRadius: 20 }}>
                        {d.issueType}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '2px 9px', borderRadius: 20 }}>
                        {st}
                      </span>
                    </div>
                    <Link href={`/admin/projects/${d.projectId}`} style={{ fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                      {d.projectTitle}
                    </Link>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                      Client: <span style={{ color: ORANGE, fontWeight: 600 }}>{d.clientName}</span>
                      {' · '}
                      Creator: <span style={{ color: LIME, fontWeight: 600 }}>{d.creatorName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <DollarSign size={12} color="#ef4444" strokeWidth={2} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>${d.amountAtRisk}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>at risk</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Last Message</div>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{d.lastMessage}&rdquo;</p>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>Opened {d.createdAt}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    {st !== 'Resolved' && (
                      <button onClick={() => act(d.id, 'Resolved')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', background: `${LIME}18`, border: `1px solid ${LIME}35`, color: LIME }}>
                        <CheckCircle size={13} strokeWidth={2} /> Resolve
                      </button>
                    )}
                    {st !== 'In Review' && st !== 'Resolved' && (
                      <button onClick={() => act(d.id, 'In Review')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', background: `${ORANGE}18`, border: `1px solid ${ORANGE}35`, color: ORANGE }}>
                        <RefreshCw size={13} strokeWidth={2} /> Request Revision
                      </button>
                    )}
                    {st !== 'Escalated' && st !== 'Resolved' && (
                      <button onClick={() => act(d.id, 'Escalated')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#ef4444' }}>
                        <DollarSign size={13} strokeWidth={2} /> Refund Review
                      </button>
                    )}
                    {st === 'Resolved' && (
                      <span style={{ fontSize: 12, color: LIME, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CheckCircle size={13} /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
