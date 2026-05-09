'use client';

import React, { useState } from 'react';
import { Play, Video, ImageIcon } from 'lucide-react';
import { UGC_VIDEOS, PRODUCT_IMAGES, UGC_IMAGES } from '@/lib/demoAssets';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BORDER = 'rgba(255,255,255,0.08)';

const DEMO_USERS = ['@sarah_j', '@mike_creates', '@outdoor_life', '@ryan_p', '@emma_ux', '@j_kim', '@t_smith'];
const MODELS     = ['UGC Fire 2.0', 'Nano Banana 2', 'Seedance 2.0', 'UGC Fire 1.0'];

// Build demo generation items
const DEMO_GENS = [
  ...UGC_VIDEOS.slice(0, 5).map((src, i) => ({
    id: `v${i}`, kind: 'video' as const, src, model: MODELS[i % MODELS.length],
    user: DEMO_USERS[i % DEMO_USERS.length], status: 'Completed',
    created: `May ${9 - Math.floor(i / 2)}, 2026`,
  })),
  ...UGC_IMAGES.map((src, i) => ({
    id: `im${i}`, kind: 'image' as const, src, model: MODELS[(i + 1) % MODELS.length],
    user: DEMO_USERS[(i + 2) % DEMO_USERS.length], status: 'Completed',
    created: `May ${8 - Math.floor(i / 2)}, 2026`,
  })),
  ...PRODUCT_IMAGES.slice(0, 4).map((src, i) => ({
    id: `pi${i}`, kind: 'image' as const, src, model: MODELS[(i + 2) % MODELS.length],
    user: DEMO_USERS[(i + 3) % DEMO_USERS.length], status: i === 1 ? 'Processing' : 'Completed',
    created: `May ${7 - i}, 2026`,
  })),
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Completed:  { bg: 'rgba(34,197,94,0.1)',   text: '#22c55e' },
  Processing: { bg: 'rgba(234,179,8,0.12)',  text: '#eab308' },
  Failed:     { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444' },
};

export default function AdminGenerationsPage() {
  const [tab, setTab] = useState<'all' | 'videos' | 'images'>('all');

  const filtered = DEMO_GENS.filter(g => {
    if (tab === 'videos') return g.kind === 'video';
    if (tab === 'images') return g.kind === 'image';
    return true;
  });

  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Generations</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{DEMO_GENS.length} total generations across all users.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
        {(['All', 'Videos', 'Images'] as const).map(t => {
          const key = t.toLowerCase() as 'all' | 'videos' | 'images';
          const count = key === 'all' ? DEMO_GENS.length : DEMO_GENS.filter(g => g.kind === (key === 'videos' ? 'video' : 'image')).length;
          return (
            <button key={t} onClick={() => setTab(key)}
              style={{ padding: '10px 18px', fontSize: 13, fontWeight: tab === key ? 700 : 500, background: 'none', border: 'none', cursor: 'pointer', color: tab === key ? '#fff' : 'rgba(255,255,255,0.4)', borderBottom: tab === key ? `2px solid ${ORANGE}` : '2px solid transparent', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7 }}>
              {t}
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '1px 7px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {filtered.map(g => (
          <div key={g.id} style={{ background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; }}>

            {/* Media */}
            <div style={{ position: 'relative', aspectRatio: g.kind === 'video' ? '9/16' : '3/4', overflow: 'hidden', maxHeight: 220 }}>
              {g.kind === 'video' ? (
                <>
                  <video src={g.src} muted autoPlay loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                      <Play size={12} color="#fff" fill="#fff" />
                    </div>
                  </div>
                </>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={g.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}

              {/* Type badge */}
              <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4, background: g.kind === 'video' ? 'rgba(255,92,0,0.9)' : 'rgba(163,230,53,0.9)', borderRadius: 6, padding: '3px 8px' }}>
                {g.kind === 'video'
                  ? <Video size={10} color="#fff" strokeWidth={2} />
                  : <ImageIcon size={10} color="#0d0d0d" strokeWidth={2} />
                }
                <span style={{ fontSize: 10, fontWeight: 700, color: g.kind === 'video' ? '#fff' : '#0d0d0d' }}>{g.kind === 'video' ? 'Video' : 'Image'}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>{g.user}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: STATUS_COLORS[g.status]?.bg, color: STATUS_COLORS[g.status]?.text }}>{g.status}</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{g.model} · {g.created}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
