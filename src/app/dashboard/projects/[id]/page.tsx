'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, DollarSign, Upload, CheckCircle, X, ArrowLeft, FileText, Lock, Package } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const STATUS_META: Record<string, { color: string }> = {
  'Posted':           { color: 'rgba(255,255,255,0.4)' },
  'Creators Invited': { color: '#22d3ee'               },
  'In Progress':      { color: LIME                    },
  'Submitted':        { color: ORANGE                  },
  'Approved':         { color: '#6366f1'               },
  'Completed':        { color: LIME                    },
};

export default function CreatorProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = MOCK_PROJECTS.find(p => p.id === id);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subForm, setSubForm] = useState({ title: '', notes: '' });
  const [checklist, setChecklist] = useState<boolean[]>([]);

  if (!project) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Project not found</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>That project ID doesn&apos;t exist.</p>
        <Link href="/dashboard/projects" style={{ color: LIME, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>← Back to Projects</Link>
      </div>
    );
  }

  const statusMeta = STATUS_META[project.status] ?? { color: 'rgba(255,255,255,0.4)' };
  const itemChecked = checklist.length > 0 ? checklist : project.deliverables.map(() => false);

  function toggleCheck(i: number) {
    const next = itemChecked.map((v, idx) => idx === i ? !v : v);
    setChecklist(next);
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); setSubmitOpen(false); }, 1200);
  }

  const escrowColor = project.escrowStatus === 'Released' ? LIME : project.escrowStatus === 'Not Funded' ? 'rgba(255,255,255,0.3)' : '#22d3ee';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .field-input { width: 100%; background: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 10px 13px; font-size: 13px; color: #fff; outline: none; font-family: inherit; transition: border-color 0.15s; resize: vertical; }
        .field-input:focus { border-color: rgba(163,230,53,0.35); }
        @media (max-width: 820px) { .proj-layout { flex-direction: column !important; } .proj-sidebar { width: 100% !important; } }
      `}</style>

      <div style={{ padding: '20px 24px 8px', maxWidth: 1060, margin: '0 auto' }}>
        <Link href="/dashboard/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          <ArrowLeft size={13} strokeWidth={2} /> Projects
        </Link>
      </div>

      <div className="proj-layout" style={{ display: 'flex', gap: 22, padding: '16px 24px 64px', maxWidth: 1060, margin: '0 auto', alignItems: 'flex-start' }}>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Header card */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{project.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
                  <h1 style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{project.title}</h1>
                  <span style={{ fontSize: 10, fontWeight: 700, color: statusMeta.color, background: `${statusMeta.color}18`, padding: '2px 10px', borderRadius: 20, border: `1px solid ${statusMeta.color}30` }}>{project.status}</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  <span style={{ color: project.brandColor, fontWeight: 700 }}>{project.brandName}</span>
                  <span style={{ margin: '0 8px', opacity: 0.3 }}>·</span>
                  {project.category}
                  <span style={{ margin: '0 8px', opacity: 0.3 }}>·</span>
                  {project.contentType}
                </div>
              </div>
            </div>
          </div>

          {/* Brief */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Brief</h2>
            <pre style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
              {project.brief}
            </pre>
          </div>

          {/* Deliverables checklist */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Deliverables</h2>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{itemChecked.filter(Boolean).length}/{project.deliverables.length} completed</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.deliverables.map((d, i) => (
                <div key={i} onClick={() => toggleCheck(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: itemChecked[i] ? 'rgba(163,230,53,0.05)' : '#1a1a1a', border: `1px solid ${itemChecked[i] ? 'rgba(163,230,53,0.2)' : BORDER}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${itemChecked[i] ? LIME : 'rgba(255,255,255,0.2)'}`, background: itemChecked[i] ? LIME : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {itemChecked[i] && <CheckCircle size={12} color="#0d0d0d" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 13, color: itemChecked[i] ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.75)', textDecoration: itemChecked[i] ? 'line-through' : 'none', transition: 'color 0.15s' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand assets */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Brand Assets</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.assets.map(a => (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{a.type}</div>
                  <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{a.name}</span>
                  <button style={{ fontSize: 11, color: LIME, background: 'none', border: 'none', cursor: 'not-allowed', fontFamily: 'inherit', opacity: 0.6 }}>Download</button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit deliverable */}
          {submitted ? (
            <div style={{ background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <CheckCircle size={28} color={LIME} strokeWidth={1.75} style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Deliverable submitted (demo)</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>In the live version, this would notify the client and update the project status to &apos;Submitted&apos;.</div>
            </div>
          ) : (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Submit Deliverable</h2>
              {submitOpen ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Deliverable title</label>
                    <input className="field-input" placeholder="e.g. Hook Draft v1 — lifestyle angle" value={subForm.title} onChange={e => setSubForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Upload placeholder</label>
                    <div style={{ border: '1.5px dashed rgba(255,255,255,0.12)', borderRadius: 10, padding: '24px', textAlign: 'center' }}>
                      <Upload size={20} color="rgba(255,255,255,0.2)" strokeWidth={1.5} style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Upload disabled in demo</div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Notes to client</label>
                    <textarea className="field-input" rows={3} placeholder="Describe what you submitted and any questions..." value={subForm.notes} onChange={e => setSubForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleSubmit} disabled={submitting}
                      style={{ flex: 1, background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Submitting...' : 'Submit Deliverable'}
                    </button>
                    <button onClick={() => setSubmitOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 16px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setSubmitOpen(true)}
                  style={{ width: '100%', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', color: LIME, borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <Upload size={15} strokeWidth={2} />
                  Submit a Deliverable
                </button>
              )}
            </div>
          )}

        </div>

        {/* ── SIDEBAR ── */}
        <div className="proj-sidebar" style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Pay & escrow */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Your Pay</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: LIME, letterSpacing: '-0.02em', marginBottom: 14 }}>${project.creatorPayMin}–${project.creatorPayMax}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 5 }}><DollarSign size={11} strokeWidth={2} />Escrow</span>
                <span style={{ color: escrowColor, fontWeight: 700 }}>{project.escrowStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={11} strokeWidth={2} />Deadline</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{project.deadline}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 5 }}><Package size={11} strokeWidth={2} />Type</span>
                <span style={{ color: '#fff', fontWeight: 600, textAlign: 'right', maxWidth: 130 }}>{project.contentType}</span>
              </div>
            </div>
          </div>

          {/* Messages preview */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Client Messages</h3>
              <Link href="/dashboard/messages" style={{ fontSize: 11, color: LIME, textDecoration: 'none', fontWeight: 600 }}>View all</Link>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', lineHeight: 1.6 }}>
              <span style={{ color: project.brandColor, fontWeight: 700 }}>{project.brandName}</span>: &ldquo;Great work! Can you also try a 15s cut?&rdquo;
              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.5 }}>Today at 10:30 AM</div>
            </div>
          </div>

          {/* Submissions list */}
          {project.submissions.length > 0 && (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Your Submissions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.submissions.map(s => (
                  <div key={s.id} style={{ padding: '10px 12px', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 3, lineHeight: 1.3 }}>{s.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.submittedAt}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.status === 'Approved' ? LIME : s.status === 'Revision Requested' ? ORANGE : 'rgba(255,255,255,0.4)' }}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
