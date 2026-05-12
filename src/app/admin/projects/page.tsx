'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Briefcase } from 'lucide-react';
import { MOCK_PROJECTS, type ProjectStatus } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const ALL_STATUSES: ('All' | ProjectStatus)[] = ['All', 'Posted', 'Creators Invited', 'In Progress', 'Submitted', 'Approved', 'Completed'];

const STATUS_COLORS: Record<string, string> = {
  'Posted':           'rgba(255,255,255,0.4)',
  'Creators Invited': '#22d3ee',
  'In Progress':      LIME,
  'Submitted':        ORANGE,
  'Approved':         '#6366f1',
  'Completed':        LIME,
};

export const dynamic = 'force-dynamic';

export default function AdminProjectsPage() {
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState<'All' | ProjectStatus>('All');

  const filtered = MOCK_PROJECTS.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.brandName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .row-link { display: grid; grid-template-columns: 2fr 1fr 100px 80px 70px 60px 60px 110px; align-items: center; gap: 12px; padding: 14px 18px; text-decoration: none; border-bottom: 1px solid ${BORDER}; transition: background 0.1s; }
        .row-link:hover { background: rgba(255,255,255,0.02); }
        @media (max-width: 900px) { .row-link { grid-template-columns: 1fr 80px 100px; } .hide-sm { display: none !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            All Projects
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>{MOCK_PROJECTS.length} projects in the marketplace</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
            <Search size={13} color="var(--text-faint)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
              style={{ width: '100%', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 12px 9px 32px', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                style={{ fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 20, border: `1px solid ${statusFilter === s ? ORANGE : BORDER}`, background: statusFilter === s ? `${ORANGE}18` : 'transparent', color: statusFilter === s ? ORANGE : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontFamily: 'inherit' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px 70px 60px 60px 110px', gap: 12, padding: '10px 18px', borderBottom: `1px solid ${BORDER}` }}>
            {['Project', 'Client / Brand', 'Status', 'Budget', 'Creator Pay', 'Apps', 'Subs', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                className={['Apps', 'Subs', 'Creator Pay', 'Budget', 'Status'].includes(h) ? 'hide-sm' : ''}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>No projects match your filters.</div>
          ) : filtered.map(p => {
            const sc = STATUS_COLORS[p.status] ?? 'rgba(255,255,255,0.4)';
            return (
              <div key={p.id} className="row-link" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px 70px 60px 60px 110px', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{p.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{p.category} · {p.deadline}</div>
                  </div>
                </div>
                <div className="hide-sm" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${p.brandColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: p.brandColor, flexShrink: 0 }}>{p.brandInitials}</div>
                  <span style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.brandName}</span>
                </div>
                <div className="hide-sm">
                  <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}12`, padding: '3px 9px', borderRadius: 20, border: `1px solid ${sc}25` }}>{p.status}</span>
                </div>
                <div className="hide-sm" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>${p.budget}</div>
                <div className="hide-sm" style={{ fontSize: 12, color: LIME }}>${p.creatorPayMin}–${p.creatorPayMax}</div>
                <div className="hide-sm" style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{p.applicants.length}</div>
                <div className="hide-sm" style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{p.submissions.length}</div>
                <Link href={`/admin/projects/${p.id}`} onClick={e => e.stopPropagation()}
                  style={{ fontSize: 11, fontWeight: 700, background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`, color: ORANGE, borderRadius: 8, padding: '6px 12px', textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Manage →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Summary row */}
        <div style={{ display: 'flex', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Total budget', value: `$${MOCK_PROJECTS.reduce((s,p) => s+p.budget, 0).toLocaleString()}` },
            { label: 'Total creator payouts (max)', value: `$${MOCK_PROJECTS.reduce((s,p) => s+p.creatorPayMax, 0).toLocaleString()}` },
            { label: 'Total platform fees', value: `$${MOCK_PROJECTS.reduce((s,p) => s+p.platformFee, 0).toLocaleString()}` },
          ].map(s => (
            <div key={s.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 16px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: LIME }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
