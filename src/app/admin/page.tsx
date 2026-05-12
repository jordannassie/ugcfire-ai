'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase, ClipboardList, Upload, DollarSign, AlertTriangle,
  UserCheck, TrendingUp, Activity, Shield, CheckCircle,
} from 'lucide-react';
import {
  MOCK_PROJECTS, ADMIN_PAYMENTS, ADMIN_DISPUTES, ADMIN_ACTIVITY, ADMIN_CLIENTS,
} from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

export const dynamic = 'force-dynamic';

export default function AdminOverviewPage() {
  const allApplicants   = MOCK_PROJECTS.flatMap(p => p.applicants);
  const allSubmissions  = MOCK_PROJECTS.flatMap(p => p.submissions);
  const pendingApps     = allApplicants.filter(a => a.status === 'Applied').length;
  const pendingSubmissions = allSubmissions.filter(s => s.status === 'Pending').length;
  const activeProjects  = MOCK_PROJECTS.filter(p => ['In Progress','Submitted','Creators Invited'].includes(p.status)).length;
  const escrowTotal     = ADMIN_PAYMENTS.filter(p => p.escrowStatus === 'Funded' || p.escrowStatus === 'In Review').reduce((s, p) => s + p.projectBudget, 0);
  const payoutsDue      = ADMIN_PAYMENTS.filter(p => p.payoutStatus === 'Pending').reduce((s, p) => s + p.creatorPayout, 0);
  const openDisputes    = ADMIN_DISPUTES.filter(d => d.status === 'Open' || d.status === 'In Review').length;

  const STATS = [
    { label: 'Active Projects',       value: String(activeProjects),     icon: Briefcase,     color: ORANGE,   href: '/admin/projects'     },
    { label: 'Pending Applications',  value: String(pendingApps),        icon: ClipboardList, color: '#22d3ee',href: '/admin/applications'  },
    { label: 'Pending Submissions',   value: String(pendingSubmissions),  icon: Upload,        color: LIME,     href: '/admin/submissions'  },
    { label: 'Escrow Balance',        value: `$${escrowTotal.toLocaleString()}`, icon: DollarSign, color: '#22d3ee', href: '/admin/payments' },
    { label: 'Creator Payouts Due',   value: `$${payoutsDue.toLocaleString()}`,  icon: TrendingUp, color: LIME,  href: '/admin/payments'     },
    { label: 'Open Disputes',         value: String(openDisputes),       icon: AlertTriangle, color: '#ef4444',href: '/admin/disputes'      },
  ];

  const QUICK_ACTIONS = [
    { label: 'Review Applications',  href: '/admin/applications',  color: '#22d3ee', bg: 'rgba(34,211,238,0.08)',  border: 'rgba(34,211,238,0.2)'  },
    { label: 'Review Submissions',   href: '/admin/submissions',   color: LIME,      bg: 'rgba(163,230,53,0.07)', border: 'rgba(163,230,53,0.2)'  },
    { label: 'Release Payments',     href: '/admin/payments',      color: LIME,      bg: 'rgba(163,230,53,0.07)', border: 'rgba(163,230,53,0.2)'  },
    { label: 'Resolve Disputes',     href: '/admin/disputes',      color: '#ef4444', bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.18)'  },
  ];

  const recentProjects     = MOCK_PROJECTS.slice(0, 4);
  const recentApplicants   = allApplicants.filter(a => a.status === 'Applied').slice(0, 3);
  const recentSubmissions  = allSubmissions.filter(s => s.status === 'Pending').slice(0, 3);
  const paymentQueue       = ADMIN_PAYMENTS.filter(p => p.payoutStatus === 'Pending').slice(0, 3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .stat-card { background: ${PANEL}; border-radius: 14px; padding: 18px; text-decoration: none; display: block; transition: border-color 0.15s, transform 0.12s; }
        .stat-card:hover { transform: translateY(-1px); }
        .section-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 16px; overflow: hidden; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .two-col { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
            <Shield size={10} strokeWidth={2} /> Admin Command Center
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Marketplace Overview
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.6 }}>
            UGCFire controls quality before work reaches the client. Review applications, approve submissions, and release payments.
          </p>
        </div>

        {/* Stats grid */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 28 }}>
          {STATS.map(s => (
            <Link key={s.label} href={s.href} className="stat-card" style={{ border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={14} color={s.color} strokeWidth={1.75} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.4 }}>{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Quality framing banner */}
        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={17} color="#818cf8" strokeWidth={1.75} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
              UGCFire controls quality before work reaches the client.
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Every submission is reviewed by the admin team before delivery. This makes UGCFire a managed marketplace — not an open, unmoderated platform.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {QUICK_ACTIONS.map(a => (
              <Link key={a.label} href={a.href} style={{ fontSize: 11, fontWeight: 700, background: a.bg, border: `1px solid ${a.border}`, color: a.color, borderRadius: 8, padding: '6px 12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main sections */}
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

          {/* Recent Projects */}
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Recent Projects</h2>
              <Link href="/admin/projects" style={{ fontSize: 12, color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            {recentProjects.map((p, i) => {
              const sc: Record<string, string> = { 'Posted': 'rgba(255,255,255,0.4)', 'Creators Invited': '#22d3ee', 'In Progress': LIME, 'Submitted': ORANGE, 'Approved': '#6366f1', 'Completed': LIME };
              return (
                <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < recentProjects.length - 1 ? `1px solid ${BORDER}` : undefined, textDecoration: 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.brandName} · ${p.budget}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: sc[p.status], background: `${sc[p.status]}14`, padding: '2px 8px', borderRadius: 20, border: `1px solid ${sc[p.status]}25`, flexShrink: 0 }}>{p.status}</span>
                </Link>
              );
            })}
          </div>

          {/* Pending Applications */}
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Pending Applications</h2>
              <Link href="/admin/applications" style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none', fontWeight: 600 }}>Review →</Link>
            </div>
            {recentApplicants.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', fontSize: 13, color: 'var(--text-faint)' }}>No pending applications.</div>
            ) : recentApplicants.map((a, i) => {
              const proj = MOCK_PROJECTS.find(p => p.applicants.some(ap => ap.id === a.id));
              return (
                <Link key={a.id} href="/admin/applications" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < recentApplicants.length - 1 ? `1px solid ${BORDER}` : undefined, textDecoration: 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${a.color}20`, border: `1.5px solid ${a.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: a.color, flexShrink: 0 }}>{a.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj?.title ?? 'Unknown project'}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#22d3ee', background: 'rgba(34,211,238,0.1)', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>New</span>
                </Link>
              );
            })}
          </div>

        </div>

        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

          {/* Submissions needing review */}
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Submissions to Review</h2>
              <Link href="/admin/submissions" style={{ fontSize: 12, color: LIME, textDecoration: 'none', fontWeight: 600 }}>Review →</Link>
            </div>
            {recentSubmissions.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', fontSize: 13, color: 'var(--text-faint)' }}>No pending submissions.</div>
            ) : recentSubmissions.map((s, i) => {
              const proj = MOCK_PROJECTS.find(p => p.submissions.some(sub => sub.id === s.id));
              return (
                <Link key={s.id} href="/admin/submissions" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < recentSubmissions.length - 1 ? `1px solid ${BORDER}` : undefined, textDecoration: 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: 'var(--text-muted)' }}>▶</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.creatorName} · {proj?.title ?? ''}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>Pending</span>
                </Link>
              );
            })}
          </div>

          {/* Payment queue */}
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Payment Queue</h2>
              <Link href="/admin/payments" style={{ fontSize: 12, color: LIME, textDecoration: 'none', fontWeight: 600 }}>Manage →</Link>
            </div>
            {paymentQueue.map((pay, i) => (
              <Link key={pay.id} href="/admin/payments" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < paymentQueue.length - 1 ? `1px solid ${BORDER}` : undefined, textDecoration: 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: LIME, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pay.projectTitle}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pay.creatorName} · ${pay.creatorPayout} payout</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: LIME, flexShrink: 0 }}>${pay.creatorPayout}</span>
              </Link>
            ))}
          </div>

        </div>

        {/* Workspace quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
          {[
            {
              label:   'Post a Project',
              sub:     'Post as UGC Fire Agency',
              href:    '/client/post-project',
              color:   '#22d3ee',
              bg:      'rgba(34,211,238,0.06)',
              border:  'rgba(34,211,238,0.18)',
            },
            {
              label:   'Open Creator Studio',
              sub:     'Switch to Creator workspace',
              href:    '/dashboard/studio',
              color:   '#a3e635',
              bg:      'rgba(163,230,53,0.06)',
              border:  'rgba(163,230,53,0.18)',
            },
            {
              label:   'Browse Opportunities',
              sub:     'See live creator opportunities',
              href:    '/opportunities',
              color:   '#a855f7',
              bg:      'rgba(168,85,247,0.06)',
              border:  'rgba(168,85,247,0.18)',
            },
          ].map(a => (
            <Link key={a.label} href={a.href}
              style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 14, padding: '16px 18px', textDecoration: 'none', display: 'block', transition: 'border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = a.color + '50'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = a.border; }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 }}>{a.sub}</div>
            </Link>
          ))}
        </div>

        {/* Platform Activity */}
        <div className="section-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={14} color={LIME} strokeWidth={2} />
              Platform Activity
            </h2>
          </div>
          <div style={{ padding: '8px 0' }}>
            {ADMIN_ACTIVITY.map((act, i) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 18px', borderBottom: i < ADMIN_ACTIVITY.length - 1 ? `1px solid rgba(255,255,255,0.04)` : undefined }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: act.color }}>{act.message}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>{act.detail}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-faint)', flexShrink: 0, whiteSpace: 'nowrap' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
