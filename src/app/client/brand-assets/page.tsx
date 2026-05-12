'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileText, Video, Palette, StickyNote } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const ASSET_CATEGORIES = [
  { key: 'logos',     label: 'Logos',          icon: Palette,   count: 3, color: LIME   },
  { key: 'products',  label: 'Product Images', icon: ImageIcon, count: 8, color: '#22d3ee' },
  { key: 'guide',     label: 'Brand Guide',    icon: FileText,  count: 1, color: '#a855f7' },
  { key: 'past-ads',  label: 'Past Ads',       icon: Video,     count: 5, color: ORANGE  },
  { key: 'notes',     label: 'Brand Notes',    icon: StickyNote,count: 2, color: '#f59e0b' },
];

const MOCK_ASSETS = [
  { name: 'GlowCo_Primary_Logo.png',  type: 'PNG',  size: '42 KB',  cat: 'logos'    },
  { name: 'GlowCo_Dark_Logo.svg',     type: 'SVG',  size: '8 KB',   cat: 'logos'    },
  { name: 'Product_Hero_Shot.jpg',     type: 'JPG',  size: '1.2 MB', cat: 'products' },
  { name: 'Lifestyle_01.jpg',          type: 'JPG',  size: '980 KB', cat: 'products' },
  { name: 'BrandGuide_2026.pdf',       type: 'PDF',  size: '3.4 MB', cat: 'guide'    },
  { name: 'Summer_Ad_v1.mp4',          type: 'MP4',  size: '18 MB',  cat: 'past-ads' },
];

export default function ClientBrandAssetsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const visible = activeTab === 'all' ? MOCK_ASSETS : MOCK_ASSETS.filter(a => a.cat === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .cat-card { background: ${PANEL}; border-radius: 14px; padding: 18px 16px; cursor: pointer; transition: border-color 0.15s, transform 0.15s; }
        .cat-card:hover { transform: translateY(-1px); }
        @media (max-width: 760px) { .cats-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 480px) { .cats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      <div style={{ padding: '28px 24px 64px', maxWidth: 960, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>Brand Assets</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Logos, product images, brand guides, and reference materials for creators.</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: ORANGE, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'not-allowed', opacity: 0.7, fontFamily: 'inherit' }}>
            <Upload size={14} strokeWidth={2} />
            Upload Asset (demo)
          </button>
        </div>

        {/* Category cards */}
        <div className="cats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
          {ASSET_CATEGORIES.map(c => (
            <div key={c.key} className="cat-card"
              onClick={() => setActiveTab(activeTab === c.key ? 'all' : c.key)}
              style={{ border: `1px solid ${activeTab === c.key ? `${c.color}40` : BORDER}`, background: activeTab === c.key ? `${c.color}08` : PANEL }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <c.icon size={17} color={c.color} strokeWidth={1.75} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{c.count} files</div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div style={{ border: '1.5px dashed rgba(255,255,255,0.12)', borderRadius: 14, padding: '28px 24px', textAlign: 'center', marginBottom: 24, background: 'rgba(255,255,255,0.01)' }}>
          <Upload size={24} color="var(--text-faint)" strokeWidth={1.5} style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-faint)', marginBottom: 4 }}>Drag files here to upload</div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>PNG, JPG, SVG, PDF, MP4 · Upload disabled in demo</div>
        </div>

        {/* Asset list */}
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          {activeTab === 'all' ? 'All Assets' : ASSET_CATEGORIES.find(c => c.key === activeTab)?.label} ({visible.length})
        </h2>
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
          {visible.map((a, i) => (
            <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < visible.length - 1 ? `1px solid ${BORDER}` : undefined }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                {a.type}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{a.size}</div>
              </div>
              <button style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'not-allowed', fontFamily: 'inherit', padding: '6px 10px' }}>
                Download
              </button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
