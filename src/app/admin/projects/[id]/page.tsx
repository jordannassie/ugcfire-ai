'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Lock, RefreshCw, Shield, ThumbsUp, UserCheck, XCircle, StickyNote } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type AdminTab = 'overview' | 'applicants' | 'submissions' | 'payments' | 'notes';

const TABS: { key: AdminTab; label: string }[] = [
  { key: 'overview',    label: 'Overview'    },
  { key: 'applicants',  label: 'Applicants'  },
  { key: 'submissions', label: 'Submissions' },
  { key: 'payments',    label: 'Payments'    },
  { key: 'notes',       label: 'Admin Notes' },
];

export default function AdminProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = MOCK_PROJECTS.find(p => p.id === id);

  const [tab, setTab]                   = useState<AdminTab>('overview');
  const [applicantStates, setApplicant] = useState<Record<string, string>>({});
  const [submissionStates, setSubmission] = useState<Record<string, string>>({});
  const [qualityNote, setQualityNote]   = useState('');
  const [noteSaved, setNoteSaved]       = useState(false);
  const [actionMsg, setActionMsg]       = useState('');

  if (!project) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Project not found</h2>
        <Link href="/admin" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>← Back to Admin</Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    'Posted': 'rgba(255,255,255,0.4)', 'Creators Invited': '#22d3ee', 'In Progress': LIME, 'Submitted': ORANGE, 'Approved': '#6366f1', 'Completed': LIME,
  };

  function adminAction(msg: string) { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000); }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .tab-btn { border: none; background: none; padding: 9px 14px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; border-bottom: 2px solid transparent; color: rgba(255,255,255,0.42); transition: color 0.12s, border-color 0.12s; white-space: nowrap; }
        .tab-btn-active { color: #fff; border-bottom-color: #6366f1; }
        .action-btn { border: 1px solid ${BORDER}; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.12s; display: flex; align-items: center; gap: 5px; }
        .action-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .field-input { width: 100%; background: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 10px 13px; font-size: 13px; color: #fff; outline: none; font-family: inherit; resize: vertical; transition: border-color 0.15s; }
        .field-input:focus { border-color: rgba(99,102,241,0.4); }
      `}</style>

      <div style={{ padding: '20px 24px 8px', maxWidth: 1000, margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          <ArrowLeft size={13} strokeWidth={2} /> Admin
        </Link>
      </div>

      <div style={{ padding: '16px 24px 64px', maxWidth: 1000, margin: '0 auto' }}>

        {/* Admin badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#6366f1', marginBottom: 14 }}>
          <Shield size={10} strokeWidth={2} />
          Admin Control Room
        </div>

        {/* Project header */}
        <div style={{ background: PANEL, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 18, padding: '22px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{project.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
                <h1 style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{project.title}</h1>
                <span style={{ fontSize: 10, fontWeight: 700, color: statusColor[project.status], background: `${statusColor[project.status]}18`, padding: '2px 10px', borderRadius: 20, border: `1px solid ${statusColor[project.status]}30` }}>
                  {project.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                <span>Client: <span style={{ color: project.brandColor, fontWeight: 700 }}>{project.brandName}</span></span>
                <span>{project.category}</span>
                <span style={{ color: LIME, fontWeight: 600 }}>${project.budget}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={2} />{project.deadline}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={11} strokeWidth={2} />Escrow: {project.escrowStatus}</span>
              </div>
            </div>
          </div>

          {/* Admin quick actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
            {['Invite Creator', 'Mark Complete', 'Flag for Review', 'Pause Project'].map(action => (
              <button key={action} className="action-btn" onClick={() => adminAction(`${action} (demo — no backend yet)`)}>
                {action}
              </button>
            ))}
          </div>

          {actionMsg && (
            <div style={{ marginTop: 10, padding: '8px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontSize: 12, color: '#818cf8' }}>
              {actionMsg}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 22, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${tab === t.key ? ' tab-btn-active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { label: 'Budget',       value: `$${project.budget}`,   color: '#fff'   },
                { label: 'Creator Pay',  value: `$${project.creatorPayMin}–${project.creatorPayMax}`, color: LIME },
                { label: 'Platform Fee', value: `$${project.platformFee}`, color: ORANGE },
                { label: 'Applicants',   value: String(project.applicants.length), color: '#22d3ee' },
                { label: 'Submissions',  value: String(project.submissions.length), color: ORANGE },
                { label: 'Escrow',       value: project.escrowStatus, color: project.escrowStatus === 'Released' ? LIME : '#22d3ee' },
              ].map(c => (
                <div key={c.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '15px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Brief</h3>
              <pre style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>{project.brief}</pre>
            </div>
          </div>
        )}

        {/* ── APPLICANTS ── */}
        {tab === 'applicants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {project.applicants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No applicants yet.</div>
            ) : project.applicants.map(a => {
              const cur = applicantStates[a.id] ?? a.status;
              return (
                <div key={a.id} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${a.color}20`, border: `1.5px solid ${a.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: a.color, flexShrink: 0 }}>
                    {a.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{a.name} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>· {a.role}</span></div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, lineHeight: 1.5 }}>{a.message}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: cur === 'Shortlisted' ? '#22d3ee' : cur === 'Invited' ? LIME : cur === 'Declined' ? '#ef4444' : 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 20 }}>{cur}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="action-btn" onClick={() => setApplicant(p => ({ ...p, [a.id]: 'Invited' }))} style={{ color: cur === 'Invited' ? LIME : undefined }}>
                      <UserCheck size={11} /> Invite
                    </button>
                    <button className="action-btn" onClick={() => setApplicant(p => ({ ...p, [a.id]: 'Declined' }))} style={{ color: '#ef444480' }}>
                      <XCircle size={11} /> Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SUBMISSIONS ── */}
        {tab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {project.submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No submissions yet.</div>
            ) : project.submissions.map(s => {
              const cur = submissionStates[s.id] ?? s.status;
              const sc = cur === 'Approved' ? LIME : cur === 'Revision Requested' ? ORANGE : 'rgba(255,255,255,0.45)';
              return (
                <div key={s.id} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '16px 18px', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ width: 80, height: 60, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, color: 'rgba(255,255,255,0.3)' }}>▶</div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}14`, padding: '2px 8px', borderRadius: 20 }}>{cur}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                      <span style={{ color: s.creatorColor, fontWeight: 600 }}>{s.creatorName}</span> · {s.submittedAt}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{s.notes}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'flex-start' }}>
                    <button className="action-btn" onClick={() => setSubmission(p => ({ ...p, [s.id]: 'Approved' }))} style={{ color: cur === 'Approved' ? LIME : undefined }}>
                      <ThumbsUp size={11} /> Approve
                    </button>
                    <button className="action-btn" onClick={() => setSubmission(p => ({ ...p, [s.id]: 'Revision Requested' }))} style={{ color: ORANGE }}>
                      <RefreshCw size={11} /> Revision
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {[
                { label: 'Total Budget',   value: `$${project.budget}`,          color: '#fff'    },
                { label: 'Creator Pay',    value: `$${project.creatorPayMin}–$${project.creatorPayMax}`, color: LIME },
                { label: 'Platform (10%)', value: `$${project.platformFee}`,     color: ORANGE    },
                { label: 'Escrow Status',  value: project.escrowStatus,          color: project.escrowStatus === 'Released' ? LIME : '#22d3ee' },
              ].map(c => (
                <div key={c.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '15px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Release Escrow', 'Issue Refund', 'Dispute Flagged', 'Mark Paid'].map(a => (
                <button key={a} className="action-btn" onClick={() => adminAction(`${a} (demo only)`)}
                  style={{ background: a === 'Release Escrow' ? 'rgba(163,230,53,0.08)' : undefined, color: a === 'Release Escrow' ? LIME : undefined }}>
                  <DollarSign size={11} /> {a}
                </button>
              ))}
            </div>
            {actionMsg && (
              <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 9, fontSize: 12, color: '#818cf8' }}>{actionMsg}</div>
            )}
          </div>
        )}

        {/* ── ADMIN NOTES ── */}
        {tab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <StickyNote size={15} color="#6366f1" strokeWidth={1.75} />
                Quality Notes
              </h3>
              <textarea className="field-input" rows={5} placeholder="Add admin quality notes, flags, or review decisions for this project..." value={qualityNote} onChange={e => setQualityNote(e.target.value)} />
              <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
                <button onClick={() => { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2500); }}
                  style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Save Note (demo)
                </button>
                {noteSaved && <span style={{ fontSize: 12, color: '#818cf8' }}>✓ Note saved (demo only)</span>}
              </div>
            </div>
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Project Timeline</h3>
              {[
                { event: 'Project posted',       date: 'May 1',  color: 'rgba(255,255,255,0.35)' },
                { event: 'Creators invited',     date: 'May 3',  color: '#22d3ee'                },
                { event: 'Work started',         date: 'May 5',  color: LIME                     },
                { event: 'Submission received',  date: 'May 9',  color: ORANGE                   },
                { event: 'Client review',        date: 'May 10', color: ORANGE                   },
              ].map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ev.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{ev.event}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{ev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
