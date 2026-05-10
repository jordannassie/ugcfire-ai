'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Check, RefreshCw, X } from 'lucide-react';
import { MOCK_PROJECTS, type MockSubmission } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type AdminSubStatus = 'Pending' | 'Approved' | 'Revision Requested' | 'Rejected';

interface FlatSubmission extends MockSubmission {
  projectId: string; projectTitle: string; brandName: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  'Pending':           { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.25)' },
  'Approved':          { color: LIME,     bg: 'rgba(163,230,53,0.1)',  border: 'rgba(163,230,53,0.25)' },
  'Revision Requested':{ color: ORANGE,   bg: `${ORANGE}18`,           border: `${ORANGE}30`           },
  'Rejected':          { color: '#ef4444',bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)'   },
};

const TYPE_EMOJI: Record<string, string> = { video: '▶', image: '◼', script: '—', default: '—' };

export const dynamic = 'force-dynamic';

export default function AdminSubmissionsPage() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'All' | AdminSubStatus>('All');
  const [overrides, setOverrides] = useState<Record<string, AdminSubStatus>>({});

  const allSubs = useMemo<FlatSubmission[]>(() => {
    const list: FlatSubmission[] = [];
    MOCK_PROJECTS.forEach(p => {
      p.submissions.forEach(s => {
        list.push({ ...s, projectId: p.id, projectTitle: p.title, brandName: p.brandName });
      });
    });
    return list;
  }, []);

  function getStatus(sub: FlatSubmission): AdminSubStatus {
    if (overrides[sub.id]) return overrides[sub.id];
    if (sub.status === 'Approved') return 'Approved';
    if (sub.status === 'Revision Requested') return 'Revision Requested';
    return 'Pending';
  }

  function act(subId: string, action: AdminSubStatus) {
    setOverrides(prev => ({ ...prev, [subId]: action }));
  }

  const filtered = allSubs.filter(s => {
    const m = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.creatorName.toLowerCase().includes(search.toLowerCase()) || s.projectTitle.toLowerCase().includes(search.toLowerCase());
    const st = getStatus(s);
    return m && (filter === 'All' || st === filter);
  });

  const counts = { All: allSubs.length, Pending: 0, Approved: 0, 'Revision Requested': 0, Rejected: 0 };
  allSubs.forEach(s => { const st = getStatus(s); counts[st as keyof typeof counts]++; });

  return (
    <>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Submission Review Queue
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
            {counts.Pending} submissions waiting for admin review before client delivery
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 300 }}>
            <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search submissions..."
              style={{ width: '100%', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 12px 9px 32px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['All', 'Pending', 'Approved', 'Revision Requested', 'Rejected'] as const).map(f => {
              const c = f === 'All' ? 'rgba(255,255,255,0.45)' : STATUS_CONFIG[f]?.color ?? 'rgba(255,255,255,0.45)';
              return (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${filter === f ? c : BORDER}`,
                    background: filter === f ? `${c}18` : 'transparent',
                    color: filter === f ? c : 'rgba(255,255,255,0.45)' }}>
                  {f} {counts[f as keyof typeof counts] > 0 ? `(${counts[f as keyof typeof counts]})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submission cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '48px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
              No submissions match your filters.
            </div>
          ) : filtered.map(sub => {
            const st   = getStatus(sub);
            const sc   = STATUS_CONFIG[st];
            const emoji = TYPE_EMOJI.default;
            return (
              <div key={sub.id} style={{ background: PANEL, border: `1px solid ${st === 'Pending' ? 'rgba(163,230,53,0.18)' : BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

                  {/* Thumbnail placeholder */}
                  <div style={{ width: 80, height: 70, background: 'linear-gradient(135deg, rgba(255,92,0,0.15), rgba(163,230,53,0.1))', borderRadius: 10, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    {emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{sub.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '2px 9px', borderRadius: 20 }}>{st}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                      By <span style={{ color: '#fff', fontWeight: 600 }}>{sub.creatorName}</span>
                      {' · '}
                      <Link href={`/admin/projects/${sub.projectId}`} style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>{sub.projectTitle}</Link>
                      <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>· {sub.brandName}</span>
                    </div>
                    {sub.notes && (
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 6 }}>
                        &ldquo;{sub.notes}&rdquo;
                      </p>
                    )}
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Submitted {sub.submittedAt}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0, alignItems: 'flex-end' }}>
                    <button onClick={() => act(sub.id, 'Approved')} disabled={st === 'Approved'}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, cursor: st === 'Approved' ? 'default' : 'pointer', fontFamily: 'inherit',
                        border: `1px solid ${LIME}40`, background: st === 'Approved' ? `${LIME}18` : 'transparent', color: LIME }}>
                      <Check size={12} strokeWidth={2.5} /> Approve for Client
                    </button>
                    <button onClick={() => act(sub.id, 'Revision Requested')} disabled={st === 'Revision Requested'}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, cursor: st === 'Revision Requested' ? 'default' : 'pointer', fontFamily: 'inherit',
                        border: `1px solid ${ORANGE}40`, background: st === 'Revision Requested' ? `${ORANGE}18` : 'transparent', color: ORANGE }}>
                      <RefreshCw size={12} strokeWidth={2.5} /> Request Revision
                    </button>
                    <button onClick={() => act(sub.id, 'Rejected')} disabled={st === 'Rejected'}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, cursor: st === 'Rejected' ? 'default' : 'pointer', fontFamily: 'inherit',
                        border: `1px solid rgba(239,68,68,0.3)`, background: st === 'Rejected' ? 'rgba(239,68,68,0.12)' : 'transparent', color: st === 'Rejected' ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>
                      <X size={12} strokeWidth={2.5} /> Reject
                    </button>
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
