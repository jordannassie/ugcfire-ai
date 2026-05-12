'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

type AppStatus = 'Applied' | 'Shortlisted' | 'Invited' | 'Declined' | 'Completed';

const STATUS_META: Record<AppStatus, { color: string; bg: string }> = {
  'Applied':     { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.07)' },
  'Shortlisted': { color: '#22d3ee',               bg: 'rgba(34,211,238,0.1)'   },
  'Invited':     { color: LIME,                    bg: 'rgba(163,230,53,0.1)'   },
  'Declined':    { color: '#ef4444',               bg: 'rgba(239,68,68,0.08)'   },
  'Completed':   { color: LIME,                    bg: 'rgba(163,230,53,0.07)'  },
};

interface StoredApplication {
  projectId: string;
  projectTitle: string;
  brandName: string;
  appliedAt: string;
  status: AppStatus;
}

// Mock base applications (always shown as demo)
const DEMO_BASE_APPLICATIONS: StoredApplication[] = [
  { projectId: 'proj-3', projectTitle: 'Fitness App AI UGC Videos', brandName: 'CoreFit App',   appliedAt: '2026-05-08T09:00:00Z', status: 'Shortlisted' },
  { projectId: 'proj-1', projectTitle: 'Skincare TikTok Ad Pack',   brandName: 'GlowCo Beauty', appliedAt: '2026-05-07T14:00:00Z', status: 'Invited'     },
  { projectId: 'proj-6', projectTitle: 'SaaS Explainer Videos',     brandName: 'ToolHive',      appliedAt: '2026-05-01T10:00:00Z', status: 'Completed'   },
];

const TABS: Array<AppStatus | 'All'> = ['All', 'Applied', 'Shortlisted', 'Invited', 'Declined', 'Completed'];

export default function ApplicationsPage() {
  const [tab, setTab] = useState<AppStatus | 'All'>('All');
  const [apps, setApps] = useState<StoredApplication[]>(DEMO_BASE_APPLICATIONS);

  useEffect(() => {
    try {
      const stored: StoredApplication[] = JSON.parse(localStorage.getItem('ugcfire_demo_applications') || '[]');
      // Merge with base, de-dup by projectId
      const merged = [...stored, ...DEMO_BASE_APPLICATIONS].filter(
        (a, idx, arr) => arr.findIndex(x => x.projectId === a.projectId) === idx,
      );
      setApps(merged);
    } catch {}
  }, []);

  const visible = tab === 'All' ? apps : apps.filter(a => a.status === tab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .app-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 18px 20px; transition: border-color 0.15s, transform 0.15s; }
        .app-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-1px); }
        .tab-btn { border: 1px solid ${BORDER}; background: none; border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; color: rgba(255,255,255,0.45); }
        .tab-btn-active { background: rgba(163,230,53,0.1); border-color: rgba(163,230,53,0.3); color: #fff; }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 860, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: LIME, marginBottom: 10 }}>
            Your Applications
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Applications</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Projects you&apos;ve applied to and your application status.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {TABS.map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' tab-btn-active' : ''}`} onClick={() => setTab(t)}>
              {t} ({t === 'All' ? apps.length : apps.filter(a => a.status === t).length})
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '48px 24px' }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--text-faint)' }}>—</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No applications yet</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Browse open opportunities and apply to brand projects.</div>
            <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, textDecoration: 'none' }}>
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map(app => {
              const project = MOCK_PROJECTS.find(p => p.id === app.projectId);
              const meta = STATUS_META[app.status];
              const appliedDate = new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={app.projectId} className="app-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,92,0,0.12)', border: '1px solid rgba(255,92,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#FF5C00' }}>{(project?.brandInitials ?? '?')}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{app.projectTitle}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, background: meta.bg, color: meta.color, padding: '2px 10px', borderRadius: 20, border: `1px solid ${meta.color}30` }}>{app.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} strokeWidth={2} />{app.brandName}</span>
                        {project && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <DollarSign size={11} color={LIME} strokeWidth={2} />
                            <span style={{ color: LIME, fontWeight: 600 }}>${project.creatorPayMin}–${project.creatorPayMax}</span>
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={2} />Applied {appliedDate}</span>
                        {project && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={2} />Due {project.deadline}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                      {app.status === 'Invited' && (
                        <Link href={`/dashboard/projects/${app.projectId}`}
                          style={{ background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                          Start Working →
                        </Link>
                      )}
                      <Link href={`/opportunities/${app.projectId}`}
                        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: 'var(--text)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ExternalLink size={11} strokeWidth={2} />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Find more */}
        <div style={{ marginTop: 28, textAlign: 'center', padding: '24px', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
          <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, textDecoration: 'none' }}>
            Browse More Opportunities →
          </Link>
        </div>

      </div>
    </>
  );
}
