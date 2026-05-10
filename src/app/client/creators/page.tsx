'use client';

import React, { useState } from 'react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const CREATORS = [
  { id: 1, name: 'Alex Rivera',  role: 'AI Ad Creator',      skills: ['UGC Video', 'Product Ads', 'Social Content'], portfolio: 24, available: true,  initials: 'AR', color: LIME   },
  { id: 2, name: 'Maya Chen',    role: 'AI Visual Designer',  skills: ['Product Photos', 'Brand Visuals', 'Lifestyle'], portfolio: 18, available: true,  initials: 'MC', color: '#22d3ee' },
  { id: 3, name: 'Jordan Kim',   role: 'AI Video Creator',    skills: ['TikTok Ads', 'UGC Scripts', 'Motion'],        portfolio: 31, available: false, initials: 'JK', color: '#a855f7' },
  { id: 4, name: 'Sam Torres',   role: 'AI Content Strategist',skills: ['Ad Hooks', 'Copy', 'Storyboards'],           portfolio: 15, available: true,  initials: 'ST', color: ORANGE  },
  { id: 5, name: 'Riley Park',   role: 'AI Image Specialist', skills: ['Product Shots', 'Flat Lay', 'Lifestyle'],     portfolio: 22, available: true,  initials: 'RP', color: LIME   },
  { id: 6, name: 'Casey Morgan', role: 'AI Video Editor',     skills: ['Reels', 'Short-form', 'Sound Design'],        portfolio: 9,  available: false, initials: 'CM', color: '#f59e0b' },
];

export default function ClientCreatorsPage() {
  const [invited, setInvited] = useState<number[]>([]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .creator-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 18px; padding: 22px 20px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: border-color 0.15s, transform 0.15s; }
        .creator-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }
        @media (max-width: 900px) { .creators-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .creators-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 1000, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>Browse AI Creators</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Find and invite AI creators to apply to your projects.</p>
        </div>

        <div className="creators-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {CREATORS.map(c => (
            <div key={c.id} className="creator-card">
              {/* Avatar */}
              <div style={{ position: 'relative', marginBottom: 14 }}>
                {c.available && (
                  <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${LIME}`, boxShadow: `0 0 10px rgba(163,230,53,0.3)` }} />
                )}
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${c.color}20`, border: `2px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: c.color }}>
                  {c.initials}
                </div>
              </div>

              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 3 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: ORANGE, fontWeight: 600, marginBottom: 8 }}>{c.role}</div>

              {c.available && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700, color: LIME, marginBottom: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: LIME, boxShadow: `0 0 4px ${LIME}` }} />
                  Available
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
                {c.skills.map(s => (
                  <span key={s} style={{ fontSize: 10, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', padding: '2px 8px', borderRadius: 20 }}>{s}</span>
                ))}
              </div>

              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>{c.portfolio} portfolio pieces</div>

              <button
                onClick={() => setInvited(prev => invited.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])}
                style={{
                  width: '100%', border: 'none', borderRadius: 9, padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                  background: invited.includes(c.id) ? 'rgba(163,230,53,0.12)' : ORANGE,
                  color: invited.includes(c.id) ? LIME : '#fff',
                }}>
                {invited.includes(c.id) ? '✓ Invited' : 'Invite to Project'}
              </button>
            </div>
          ))}
        </div>

        {invited.length > 0 && (
          <div style={{ marginTop: 24, background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: LIME, fontWeight: 600 }}>{invited.length} creator{invited.length > 1 ? 's' : ''} invited (demo)</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Invitations are demo-only. Real invites will be sent when Supabase is connected.</span>
          </div>
        )}

      </div>
    </>
  );
}
