'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Lock, MessageSquare, RefreshCw, Send, ThumbsUp, UserCheck, XCircle } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type TabKey = 'overview' | 'applicants' | 'submissions' | 'messages' | 'payments';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview',    label: 'Overview'    },
  { key: 'applicants',  label: 'Applicants'  },
  { key: 'submissions', label: 'Submissions' },
  { key: 'messages',    label: 'Messages'    },
  { key: 'payments',    label: 'Payments'    },
];

const APPLICANT_STATUS_META: Record<string, { color: string; bg: string }> = {
  'Applied':     { color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.07)' },
  'Shortlisted': { color: '#22d3ee',               bg: 'rgba(34,211,238,0.1)'   },
  'Invited':     { color: LIME,                    bg: 'rgba(163,230,53,0.1)'   },
  'Declined':    { color: '#ef4444',               bg: 'rgba(239,68,68,0.08)'   },
};

const DEMO_MESSAGES = [
  { from: 'client', text: 'Hi team, please review the brief carefully before starting.', time: 'May 9, 9:00 AM' },
  { from: 'creator', text: 'Understood! I\'ll have a draft ready by tomorrow.', time: 'May 9, 10:15 AM' },
  { from: 'client', text: 'Great. Please check the brand assets folder for reference images.', time: 'May 9, 10:30 AM' },
  { from: 'creator', text: 'Reviewed everything. Starting today!', time: 'May 10, 8:00 AM' },
];

export default function ClientProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = MOCK_PROJECTS.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [applicantStates, setApplicantStates] = useState<Record<string, string>>({});
  const [submissionStates, setSubmissionStates] = useState<Record<string, string>>({});
  const [msgInput, setMsgInput] = useState('');

  if (!project) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Project not found</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>That project ID doesn&apos;t exist.</p>
        <Link href="/client/projects" style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>← Back to Projects</Link>
      </div>
    );
  }

  function setApplicant(id: string, s: string) { setApplicantStates(p => ({ ...p, [id]: s })); }
  function setSubmission(id: string, s: string) { setSubmissionStates(p => ({ ...p, [id]: s })); }

  const statusColor: Record<string, string> = {
    'Posted': 'rgba(255,255,255,0.4)', 'Creators Invited': '#22d3ee', 'In Progress': LIME, 'Submitted': ORANGE, 'Approved': '#6366f1', 'Completed': LIME,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .tab-btn { border: none; background: none; padding: 9px 14px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; border-bottom: 2px solid transparent; color: rgba(255,255,255,0.42); transition: color 0.12s, border-color 0.12s; white-space: nowrap; }
        .tab-btn-active { color: #fff; border-bottom-color: ${ORANGE}; }
        .action-btn { border: 1px solid ${BORDER}; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.12s; display: flex; align-items: center; gap: 5px; }
        .action-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .field-input { width: 100%; background: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 10px 13px; font-size: 13px; color: #fff; outline: none; font-family: inherit; }
      `}</style>

      <div style={{ padding: '20px 24px 8px', maxWidth: 1000, margin: '0 auto' }}>
        <Link href="/client/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          <ArrowLeft size={13} strokeWidth={2} /> Projects
        </Link>
      </div>

      <div style={{ padding: '16px 24px 64px', maxWidth: 1000, margin: '0 auto' }}>

        {/* Project header */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '22px 24px', marginBottom: 20 }}>
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
                <span style={{ color: project.brandColor, fontWeight: 700 }}>{project.brandName}</span>
                <span>{project.category}</span>
                <span style={{ color: LIME, fontWeight: 600 }}>${project.budget} budget</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={2} />{project.deadline}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={11} strokeWidth={2} color={project.escrowStatus === 'Funded' ? '#22d3ee' : undefined} />{project.escrowStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 22, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${activeTab === t.key ? ' tab-btn-active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
              {t.key === 'applicants' && project.applicants.length > 0 && (
                <span style={{ marginLeft: 5, fontSize: 10, background: '#22d3ee20', color: '#22d3ee', border: '1px solid #22d3ee30', borderRadius: 20, padding: '1px 6px' }}>{project.applicants.length}</span>
              )}
              {t.key === 'submissions' && project.submissions.length > 0 && (
                <span style={{ marginLeft: 5, fontSize: 10, background: `${ORANGE}20`, color: ORANGE, border: `1px solid ${ORANGE}30`, borderRadius: 20, padding: '1px 6px' }}>{project.submissions.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Project Brief</h2>
              <pre style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>{project.brief}</pre>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Deliverables</h3>
                {project.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: LIME, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>{d}
                  </div>
                ))}
              </div>
              <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Skills Needed</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {project.skills.map(s => (
                    <span key={s} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', padding: '4px 10px', borderRadius: 20, border: `1px solid ${BORDER}` }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── APPLICANTS TAB ── */}
        {activeTab === 'applicants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {project.applicants.length === 0 ? (
              <div style={{ textAlign: 'center', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 24px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                No applicants yet. <Link href="/client/creators" style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>Browse creators →</Link>
              </div>
            ) : project.applicants.map(a => {
              const curStatus = applicantStates[a.id] ?? a.status;
              const meta = APPLICANT_STATUS_META[curStatus] ?? APPLICANT_STATUS_META['Applied'];
              return (
                <div key={a.id} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${a.color}20`, border: `1.5px solid ${a.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: a.color, flexShrink: 0 }}>
                      {a.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{a.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, background: meta.bg, color: meta.color, padding: '2px 9px', borderRadius: 20, border: `1px solid ${meta.color}30` }}>{curStatus}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{a.role} · {a.portfolioCount} portfolio pieces</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 12px' }}>
                        &ldquo;{a.message}&rdquo;
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                        {a.skills.map(s => <span key={s} style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
                      <button className="action-btn" onClick={() => setApplicant(a.id, 'Shortlisted')} style={{ background: curStatus === 'Shortlisted' ? 'rgba(34,211,238,0.1)' : undefined, borderColor: curStatus === 'Shortlisted' ? '#22d3ee40' : undefined, color: curStatus === 'Shortlisted' ? '#22d3ee' : undefined }}>
                        <UserCheck size={12} strokeWidth={2} /> Shortlist
                      </button>
                      <button className="action-btn" onClick={() => setApplicant(a.id, 'Invited')} style={{ background: curStatus === 'Invited' ? 'rgba(163,230,53,0.1)' : undefined, borderColor: curStatus === 'Invited' ? 'rgba(163,230,53,0.3)' : undefined, color: curStatus === 'Invited' ? LIME : undefined }}>
                        <CheckCircle size={12} strokeWidth={2} /> Invite
                      </button>
                      <button className="action-btn" onClick={() => setApplicant(a.id, 'Declined')} style={{ color: 'rgba(239,68,68,0.7)' }}>
                        <XCircle size={12} strokeWidth={2} /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {project.submissions.length === 0 ? (
              <div style={{ textAlign: 'center', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 24px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                No submissions yet. Creators will submit here once work begins.
              </div>
            ) : project.submissions.map(s => {
              const curStatus = submissionStates[s.id] ?? s.status;
              const sc = curStatus === 'Approved' ? LIME : curStatus === 'Revision Requested' ? ORANGE : 'rgba(255,255,255,0.45)';
              return (
                <div key={s.id} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
                  {/* Thumbnail placeholder */}
                  <div style={{ height: 120, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{s.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}14`, padding: '2px 9px', borderRadius: 20, border: `1px solid ${sc}30` }}>{curStatus}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                        <span style={{ color: s.creatorColor, fontWeight: 600 }}>{s.creatorName}</span> · Submitted {s.submittedAt}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px' }}>
                        {s.notes}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
                      <button className="action-btn" onClick={() => setSubmission(s.id, 'Approved')} style={{ background: curStatus === 'Approved' ? 'rgba(163,230,53,0.1)' : undefined, color: curStatus === 'Approved' ? LIME : undefined }}>
                        <ThumbsUp size={12} strokeWidth={2} /> Approve
                      </button>
                      <button className="action-btn" onClick={() => setSubmission(s.id, 'Revision Requested')} style={{ color: ORANGE }}>
                        <RefreshCw size={12} strokeWidth={2} /> Revision
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {activeTab === 'messages' && (
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ height: 360, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DEMO_MESSAGES.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'client' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '72%', padding: '10px 14px',
                    borderRadius: m.from === 'client' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.from === 'client' ? ORANGE : '#1e1e1e',
                    border: m.from === 'client' ? 'none' : `1px solid ${BORDER}`,
                    fontSize: 13, color: '#fff', lineHeight: 1.55,
                  }}>
                    {m.text}
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, textAlign: 'right' }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 16px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 10 }}>
              <input value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Message creators... (demo — not sent)" className="field-input" style={{ flex: 1 }} />
              <button disabled style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,92,0,0.3)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed', flexShrink: 0 }}>
                <Send size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* ── PAYMENTS TAB ── */}
        {activeTab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Project Budget',    value: `$${project.budget}`,          color: '#fff'  },
                { label: 'Creator Payout',    value: `$${project.creatorPayMin}–$${project.creatorPayMax}`, color: LIME },
                { label: 'Platform Fee (10%)', value: `$${project.platformFee}`,    color: ORANGE  },
                { label: 'Escrow Status',     value: project.escrowStatus,          color: project.escrowStatus === 'Released' ? LIME : '#22d3ee' },
              ].map(c => (
                <div key={c.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginBottom: 5 }}>{c.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c.color, letterSpacing: '-0.02em' }}>{c.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,92,0,0.05)', border: '1px solid rgba(255,92,0,0.15)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Release Payment to Creators</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Available after you approve all submissions. Stripe wired in a future step.</div>
              </div>
              <button disabled style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'not-allowed', opacity: 0.5, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Lock size={13} strokeWidth={2} /> Release Escrow (demo)
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
