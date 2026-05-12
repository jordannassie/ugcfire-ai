'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Users, FileText } from 'lucide-react';
import { MOCK_PROJECTS, type ProjectStatus } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const STATUS_META: Record<ProjectStatus, { color: string; bg: string }> = {
  'Posted':           { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.06)'  },
  'Creators Invited': { color: '#22d3ee',                bg: 'rgba(34,211,238,0.08)'   },
  'In Progress':      { color: LIME,                     bg: 'rgba(163,230,53,0.08)'   },
  'Submitted':        { color: ORANGE,                   bg: 'rgba(255,92,0,0.08)'     },
  'Approved':         { color: '#6366f1',                bg: 'rgba(99,102,241,0.08)'   },
  'Completed':        { color: LIME,                     bg: 'rgba(163,230,53,0.06)'   },
};

const ALL_STATUSES: ProjectStatus[] = ['Posted', 'Creators Invited', 'In Progress', 'Submitted', 'Approved', 'Completed'];

export default function ClientProjectsPage() {
  const [filter, setFilter] = useState<ProjectStatus | 'All'>('All');

  const visible = filter === 'All' ? MOCK_PROJECTS : MOCK_PROJECTS.filter(p => p.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .proj-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 20px; transition: border-color 0.15s, transform 0.15s; }
        .proj-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-1px); }
        .filter-btn { border: 1px solid ${BORDER}; background: none; border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; color: rgba(255,255,255,0.45); }
        .filter-btn-active { background: rgba(255,92,0,0.1); border-color: rgba(255,92,0,0.3); color: #fff; }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 960, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Projects</h1>
            <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>{MOCK_PROJECTS.length} total projects</p>
          </div>
          <Link href="/client/post-project" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: ORANGE, color: 'var(--text)', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 9, textDecoration: 'none' }}>
            + Post New Project
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button className={`filter-btn${filter === 'All' ? ' filter-btn-active' : ''}`} onClick={() => setFilter('All')}>All ({MOCK_PROJECTS.length})</button>
          {ALL_STATUSES.map(s => (
            <button key={s} className={`filter-btn${filter === s ? ' filter-btn-active' : ''}`} onClick={() => setFilter(s)}>
              {s} ({MOCK_PROJECTS.filter(p => p.status === s).length})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map(p => {
            const meta = STATUS_META[p.status];
            return (
              <div key={p.id} className="proj-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{p.icon}</div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{p.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: meta.bg, color: meta.color, padding: '2px 10px', borderRadius: 20, border: `1px solid ${meta.color}30` }}>{p.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ color: p.brandColor, fontWeight: 600 }}>{p.brandName}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} strokeWidth={2} />{p.applicants.length} applicants</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={2} />Due: {p.deadline}</span>
                      <span style={{ color: LIME, fontWeight: 600 }}>${p.budget}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {p.submissions.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: ORANGE }}>
                        <FileText size={11} strokeWidth={2} /> {p.submissions.length} submission{p.submissions.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    <Link href={`/client/projects/${p.id}`} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: '#fff', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                      View →
                    </Link>
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
