'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, Clock, Briefcase, CheckCircle } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

type CreatorStatus = 'Invited' | 'In Progress' | 'Submitted' | 'Approved' | 'Paid';

const STATUS_META: Record<string, { color: string }> = {
  'Posted':           { color: 'var(--text-faint)'  },
  'Creators Invited': { color: '#22d3ee'                 },
  'In Progress':      { color: LIME                      },
  'Submitted':        { color: ORANGE                    },
  'Approved':         { color: '#a855f7'                 },
  'Completed':        { color: LIME                      },
};

// Show the most active/interesting projects for the creator view
const CREATOR_PROJECTS = MOCK_PROJECTS.filter(p =>
  ['Creators Invited', 'In Progress', 'Submitted', 'Approved', 'Completed'].includes(p.status)
);

export default function CreatorProjectsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .proj-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 20px; transition: border-color 0.15s, transform 0.15s; }
        .proj-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-1px); }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 860, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: LIME, marginBottom: 10 }}>
            Your Projects
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Projects</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Brand campaigns you&apos;ve been invited to or are actively working on.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {CREATOR_PROJECTS.map(p => {
            const meta = STATUS_META[p.status] ?? { color: 'var(--text-faint)' };
            return (
              <div key={p.id} className="proj-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{p.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, background: `${meta.color}14`, padding: '2px 10px', borderRadius: 20, border: `1px solid ${meta.color}30` }}>{p.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} strokeWidth={2} /><span style={{ color: p.brandColor, fontWeight: 600 }}>{p.brandName}</span></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={11} strokeWidth={2} color={LIME} /><span style={{ color: LIME, fontWeight: 600 }}>${p.creatorPayMin}–${p.creatorPayMax}</span></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={2} />Due: {p.deadline}</span>
                      <span>{p.deliverables.length} deliverable{p.deliverables.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                    {p.status === 'Approved' || p.status === 'Completed' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: LIME, fontSize: 12, fontWeight: 700 }}>
                        <CheckCircle size={14} strokeWidth={2} /> {p.status}
                      </div>
                    ) : null}
                    <Link href={`/dashboard/projects/${p.id}`} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: '#fff', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Open →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '32px 20px' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Find more paid projects</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>Browse open opportunities and apply to brand campaigns.</p>
          <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, textDecoration: 'none' }}>
            View Opportunities →
          </Link>
        </div>

      </div>
    </>
  );
}
