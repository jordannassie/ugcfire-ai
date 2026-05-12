'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, DollarSign, Package, Zap, Bookmark, X, CheckCircle, ArrowLeft, FileText, Lock } from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';
import { MOCK_PROJECTS } from '@/lib/demoData';
import SiteFooter from '@/components/shared/SiteFooter';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BG = 'var(--bg)';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const STATUS_META: Record<string, { color: string; bg: string }> = {
  'Posted':           { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.07)' },
  'Creators Invited': { color: '#22d3ee',               bg: 'rgba(34,211,238,0.08)'  },
  'In Progress':      { color: LIME,                    bg: 'rgba(163,230,53,0.08)'  },
  'Submitted':        { color: ORANGE,                  bg: 'rgba(255,92,0,0.08)'    },
  'Approved':         { color: '#6366f1',               bg: 'rgba(99,102,241,0.08)'  },
  'Completed':        { color: LIME,                    bg: 'rgba(163,230,53,0.06)'  },
};

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const project = MOCK_PROJECTS.find(p => p.id === id);

  const [modalOpen, setModalOpen]   = useState(false);
  const [saved,     setSaved]       = useState(false);
  const [applied,   setApplied]     = useState(false);
  const [submitting,setSubmitting]  = useState(false);
  const [form, setForm] = useState({ message: '', sample: '', turnaround: '5 days', fit: '' });

  if (!project) {
    return (
      <>
        <PublicHeader activePage="opportunities" />
        <main style={{ paddingTop: 80, minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Project not found</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>That project ID doesn&apos;t exist or may have been removed.</p>
            <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, padding: '11px 22px', borderRadius: 10, textDecoration: 'none' }}>
              ← Back to Opportunities
            </Link>
          </div>
        </main>
      </>
    );
  }

  const statusMeta = STATUS_META[project.status] ?? STATUS_META['Posted'];

  function handleApply() {
    setSubmitting(true);
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('ugcfire_demo_applications') || '[]');
        existing.push({ projectId: project.id, projectTitle: project.title, brandName: project.brandName, appliedAt: new Date().toISOString(), status: 'Applied' });
        localStorage.setItem('ugcfire_demo_applications', JSON.stringify(existing));
      } catch {}
      setSubmitting(false);
      setApplied(true);
      setModalOpen(false);
    }, 1200);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${BG}; color: #f2f0eb; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .field-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 6px; display: block; }
        .field-input { width: 100%; background: var(--input-bg); border: 1px solid var(--border); border-radius: 9px; padding: 10px 13px; font-size: 13px; color: var(--text); outline: none; font-family: inherit; transition: border-color 0.15s; resize: vertical; }
        .field-input:focus { border-color: rgba(163,230,53,0.35); }
        @media (max-width: 840px) { .detail-layout { flex-direction: column !important; } .sidebar { width: 100% !important; } }
      `}</style>

      <PublicHeader activePage="opportunities" />

      <main style={{ paddingTop: 60, minHeight: '100vh', background: BG }}>

        {/* Breadcrumb */}
        <div style={{ padding: '20px 24px 0', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'}>
            <ArrowLeft size={13} strokeWidth={2} /> Opportunities
          </Link>
        </div>

        <div className="detail-layout" style={{ display: 'flex', gap: 24, padding: '24px 24px 64px', maxWidth: 1100, margin: '0 auto', alignItems: 'flex-start' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Header */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${project.brandColor}18`, border: `1.5px solid ${project.brandColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                  {project.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{project.title}</h1>
                    <span style={{ fontSize: 10, fontWeight: 700, background: statusMeta.bg, color: statusMeta.color, padding: '3px 10px', borderRadius: 20, border: `1px solid ${statusMeta.color}30` }}>{project.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
                    <span style={{ color: project.brandColor, fontWeight: 700 }}>{project.brandName}</span>
                    <span>{project.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={11} color={LIME} strokeWidth={2} />{project.contentType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 22px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Project Brief</h2>
              <pre style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                {project.brief}
              </pre>
            </div>

            {/* Deliverables */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Deliverables</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: LIME }}>{i + 1}</span>
                    </div>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Skills Needed</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {project.skills.map(s => (
                  <span key={s} style={{ fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'var(--text)', padding: '5px 12px', borderRadius: 20, border: `1px solid ${BORDER}` }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Brand assets */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Brand Assets</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.assets.map(a => (
                  <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--card-2)', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-faint)' }}>
                      {a.type}
                    </div>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{a.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-faint)' }}>
                      <Lock size={10} strokeWidth={2} />
                      Available after applying
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="sidebar" style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Pay & timeline */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px' }}>
              <div style={{ display: 'flex', justify: 'space-between', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Creator Pay</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: LIME, letterSpacing: '-0.02em' }}>${project.creatorPayMin}–${project.creatorPayMax}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Budget</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>${project.budget}</div>
                </div>
              </div>
              <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={12} strokeWidth={2} />Deadline</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{project.deadline}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Package size={12} strokeWidth={2} />Content type</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{project.contentType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={12} strokeWidth={2} />Escrow</span>
                  <span style={{ color: project.escrowStatus === 'Not Funded' ? 'rgba(255,255,255,0.35)' : LIME, fontWeight: 600 }}>{project.escrowStatus}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            {applied ? (
              <div style={{ background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
                <CheckCircle size={28} color={LIME} strokeWidth={1.75} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Application Submitted</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>Demo application saved. Track it in your Applications page.</div>
                <Link href="/dashboard/applications" style={{ display: 'block', marginTop: 14, fontSize: 13, color: LIME, textDecoration: 'none', fontWeight: 600 }}>
                  View Applications →
                </Link>
              </div>
            ) : (
              <>
                <button onClick={() => setModalOpen(true)}
                  style={{ width: '100%', background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}>
                  Apply to Project
                </button>
                <button onClick={() => setSaved(s => !s)}
                  style={{ width: '100%', background: saved ? 'rgba(255,255,255,0.07)' : 'transparent', border: `1px solid ${saved ? 'rgba(255,255,255,0.15)' : BORDER}`, color: saved ? '#fff' : 'rgba(255,255,255,0.5)', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}>
                  <Bookmark size={14} strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save Opportunity'}
                </button>
              </>
            )}

            {/* Applicant count */}
            {project.applicants.length > 0 && (
              <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>{project.applicants.length}</span> creator{project.applicants.length !== 1 ? 's' : ''} applied
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ── APPLY MODAL ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <div style={{ padding: '24px 24px 0', borderBottom: `1px solid ${BORDER}`, paddingBottom: 18 }}>
              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color="var(--text-faint)" />
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Apply to Project</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{project.title} · {project.brandName}</p>
            </div>

            <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="field-label">Short message to the brand</label>
                <textarea className="field-input" rows={3} placeholder="Introduce yourself and why you're interested..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Relevant portfolio sample</label>
                <input className="field-input" placeholder="Paste a link to your most relevant piece..." value={form.sample} onChange={e => setForm(f => ({ ...f, sample: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Estimated turnaround</label>
                <select className="field-input" value={form.turnaround} onChange={e => setForm(f => ({ ...f, turnaround: e.target.value }))} style={{ appearance: 'none' }}>
                  {['2 days', '3 days', '5 days', '7 days', '10 days'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Why are you a fit?</label>
                <textarea className="field-input" rows={3} placeholder="Describe your relevant experience or style..." value={form.fit} onChange={e => setForm(f => ({ ...f, fit: e.target.value }))} />
              </div>

              <button
                onClick={handleApply}
                disabled={submitting}
                style={{ background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 11, padding: '13px', fontSize: 14, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.15s' }}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>Demo only — saved to localStorage. No real submission.</p>
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </>
  );
}
