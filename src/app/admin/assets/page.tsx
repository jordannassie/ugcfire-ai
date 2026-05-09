'use client';

import React, { useState } from 'react';
import { Upload, Star, ImageIcon, User, Folder } from 'lucide-react';
import { ALL_DEMO_ASSETS, PRODUCT_IMAGES, UGC_IMAGES } from '@/lib/demoAssets';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BORDER = 'rgba(255,255,255,0.08)';

type AssetType = 'All' | 'Logo' | 'Product' | 'Creator' | 'Inspiration';

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  Logo: Star, Product: ImageIcon, Creator: User, Inspiration: Folder,
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Logo:        { bg: 'rgba(255,92,0,0.15)',    text: ORANGE    },
  Product:     { bg: 'rgba(163,230,53,0.12)',  text: LIME      },
  Creator:     { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8' },
  Inspiration: { bg: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.55)' },
};

// Tag every asset with a type
const TAGGED_ASSETS = [
  ...PRODUCT_IMAGES.slice(0, 2).map(src => ({ src, type: 'Logo'    as AssetType })),
  ...PRODUCT_IMAGES.map(src        => ({ src, type: 'Product'  as AssetType })),
  ...UGC_IMAGES.slice(0, 3).map(src => ({ src, type: 'Creator'  as AssetType })),
  ...UGC_IMAGES.slice(3).map(src    => ({ src, type: 'Inspiration' as AssetType })),
];

const ALL_TYPES: AssetType[] = ['All', 'Logo', 'Product', 'Creator', 'Inspiration'];

export default function AdminAssetsPage() {
  const [filter, setFilter] = useState<AssetType>('All');

  const shown = filter === 'All' ? TAGGED_ASSETS : TAGGED_ASSETS.filter(a => a.type === filter);

  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Assets</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{ALL_DEMO_ASSETS.length} total platform assets.</p>
        </div>
        <button style={{ background: LIME, color: '#0d0d0d', border: 'none', padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
          <Upload size={13} strokeWidth={2.5} />
          Upload Asset
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {ALL_TYPES.map(t => {
          const active = filter === t;
          const Icon = t !== 'All' ? TYPE_ICONS[t] : null;
          const colors = t !== 'All' ? TYPE_COLORS[t] : null;
          return (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
                background: active ? (colors?.bg ?? 'rgba(255,255,255,0.1)') : '#141414',
                border: `1px solid ${active ? (colors?.text ?? 'rgba(255,255,255,0.3)') + '66' : BORDER}`,
                color: active ? (colors?.text ?? '#fff') : 'rgba(255,255,255,0.5)',
                transition: 'all 0.12s',
              }}>
              {Icon && <Icon size={11} />}
              {t}
              <span style={{ fontSize: 10, opacity: 0.6 }}>
                ({t === 'All' ? TAGGED_ASSETS.length : TAGGED_ASSETS.filter(a => a.type === t).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {shown.map((asset, i) => {
          const c = TYPE_COLORS[asset.type];
          return (
            <div key={i} style={{ background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.12s', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.src} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
              {/* Type badge */}
              <div style={{ position: 'absolute', top: 6, left: 6, background: c?.bg, borderRadius: 5, padding: '2px 7px' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: c?.text }}>{asset.type}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
