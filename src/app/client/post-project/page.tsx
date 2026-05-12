'use client';

import React, { useState } from 'react';
import { Briefcase, Upload, CheckCircle, ChevronDown } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const CONTENT_TYPES = ['AI Video Ads', 'AI Image Ads', 'UGC-Style Ads', 'Product Visuals', 'Social Graphics', 'Other'];

const POSTING_AS_OPTIONS = ['UGC Fire Agency', 'Demo Brand Client'];

function PostingAs() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(POSTING_AS_OPTIONS[0]);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 9, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Posting as</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#22d3ee' }}>{selected}</span>
        <ChevronDown size={11} color="#22d3ee" strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.13s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, minWidth: 200, boxShadow: '0 8px 28px rgba(0,0,0,0.6)', zIndex: 100, overflow: 'hidden' }}>
          {POSTING_AS_OPTIONS.map(opt => (
            <button key={opt} onClick={() => { setSelected(opt); setOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: selected === opt ? 'rgba(34,211,238,0.08)' : 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: selected === opt ? 700 : 500, color: selected === opt ? '#22d3ee' : 'var(--text-muted)', textAlign: 'left' }}>
              {opt}
              {selected === opt && <span style={{ fontSize: 10, color: '#22d3ee' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostProjectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: '', brand: '', contentType: 'AI Video Ads', budget: '', deadline: '', deliverables: '3', brief: '' });

  function handleField(key: string, value: string) { setForm(f => ({ ...f, [key]: value })); }

  if (submitted) {
    return (
      <div style={{ padding: '48px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(163,230,53,0.1)', border: '2px solid rgba(163,230,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={28} color={LIME} strokeWidth={1.75} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Project saved (demo)</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>In the live version, this would notify matched AI creators and add the project to your dashboard.</p>
        <button onClick={() => setSubmitted(false)} style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Post Another Project
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 7px; display: block; }
        .field-input { width: 100%; background: var(--input-bg); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; font-size: 14px; color: var(--text); outline: none; font-family: inherit; transition: border-color 0.15s; }
        .field-input:focus { border-color: rgba(255,92,0,0.4); }
        .field-select { appearance: none; }
        @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 720, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={17} color={ORANGE} strokeWidth={1.75} />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>Post a Project</h1>
            </div>
            {/* Posting as selector */}
            <PostingAs />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Brief an AI creator project. UGCFire will match you with creators whose portfolio fits your brand.
          </p>
        </div>

        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="field-label">Project Title *</label>
              <input className="field-input" placeholder="e.g. Summer Skincare Campaign" value={form.title} onChange={e => handleField('title', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Brand / Company *</label>
              <input className="field-input" placeholder="e.g. GlowCo Beauty" value={form.brand} onChange={e => handleField('brand', e.target.value)} />
            </div>
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="field-label">Content Type</label>
              <select className="field-input field-select" value={form.contentType} onChange={e => handleField('contentType', e.target.value)}>
                {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Number of Deliverables</label>
              <input className="field-input" type="number" min="1" max="50" placeholder="3" value={form.deliverables} onChange={e => handleField('deliverables', e.target.value)} />
            </div>
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="field-label">Budget ($)</label>
              <input className="field-input" placeholder="e.g. 500" value={form.budget} onChange={e => handleField('budget', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Deadline</label>
              <input className="field-input" type="date" value={form.deadline} onChange={e => handleField('deadline', e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          <div>
            <label className="field-label">Project Brief</label>
            <textarea className="field-input" rows={5} placeholder="Describe your campaign goals, target audience, tone, and any specific requirements..." value={form.brief} onChange={e => handleField('brief', e.target.value)} style={{ resize: 'vertical' }} />
          </div>

          {/* Brand assets placeholder */}
          <div>
            <label className="field-label">Upload Brand Assets</label>
            <div style={{ border: '1.5px dashed var(--border)', borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <Upload size={22} color="var(--text-faint)" strokeWidth={1.5} style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 4 }}>Drag logos, product images, or brand guides here</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>PNG, JPG, PDF up to 20MB · Upload disabled in demo</div>
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: 11, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}>
            Save Demo Project
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.6 }}>
            Demo mode only — no real project will be created. Payments and Supabase will be wired in a future step.
          </p>

        </div>
      </div>
    </>
  );
}
