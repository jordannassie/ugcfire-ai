'use client';

import React, { useState, useRef } from 'react';
import { Upload, Folder, Image as ImageIcon, User, Star, Plus, X } from 'lucide-react';
import { ALL_DEMO_ASSETS, PRODUCT_IMAGES, UGC_IMAGES, LS_BRAND_ASSETS, loadFromLS, saveToLS } from '@/lib/demoAssets';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const FOLDERS = [
  { label: 'Logos',       icon: Star,      assets: PRODUCT_IMAGES.slice(0, 2), color: 'rgba(255,92,0,0.15)',    border: 'rgba(255,92,0,0.25)'    },
  { label: 'Products',    icon: ImageIcon, assets: PRODUCT_IMAGES,             color: 'rgba(163,230,53,0.08)',  border: 'rgba(163,230,53,0.2)'   },
  { label: 'Creators',    icon: User,      assets: UGC_IMAGES.slice(0, 3),     color: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.25)'  },
  { label: 'Inspiration', icon: Folder,    assets: UGC_IMAGES,                 color: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.12)' },
];

export default function BrandAssetsPage() {
  const [uploads,  setUploads]  = useState<string[]>(() => loadFromLS<string>(LS_BRAND_ASSETS, []));
  const [selected, setSelected] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const urls = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => URL.createObjectURL(f));
    const updated = [...urls, ...uploads];
    setUploads(updated);
    saveToLS(LS_BRAND_ASSETS, updated);
  }

  const allAssets = [...uploads, ...ALL_DEMO_ASSETS];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 28px', background: BG }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Brand Assets</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>Upload logos, products, creators, and inspiration.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          <button onClick={() => fileRef.current?.click()}
            style={{ background: LIME, color: '#0d0d0d', border: 'none', padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
            <Upload size={14} strokeWidth={2.5} />
            Upload Asset
          </button>
        </div>
      </div>

      {/* Folder cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
        {FOLDERS.map(folder => (
          <div key={folder.label} style={{ background: folder.color, border: `1px solid ${folder.border}`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <folder.icon size={15} color="rgba(255,255,255,0.6)" strokeWidth={1.75} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{folder.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {folder.assets.slice(0, 3).map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={src} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }} />
              ))}
              {folder.assets.length > 3 && (
                <div style={{ width: 40, height: 40, borderRadius: 6, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                  +{folder.assets.length - 3}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* New folder */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: `1.5px dashed ${BORDER}`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 96 }}>
          <Plus size={20} color="rgba(255,255,255,0.25)" />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>New folder</span>
        </div>
      </div>

      {/* All assets grid */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>All Assets</h2>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{allAssets.length} items</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
        {/* Upload card */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{ aspectRatio: '1', borderRadius: 12, border: `1.5px dashed rgba(255,255,255,0.16)`, background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'border-color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.32)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.16)'; }}
        >
          <Plus size={22} color="rgba(255,255,255,0.35)" />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Upload</span>
        </div>

        {allAssets.map((src, i) => {
          const isSel = selected === src;
          return (
            <div key={i}
              onClick={() => setSelected(isSel ? null : src)}
              style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: `2px solid ${isSel ? LIME : 'transparent'}`, transition: 'border-color 0.12s', background: PANEL }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {isSel && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected asset preview bar */}
      {selected && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 50 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: `2px solid ${LIME}` }} />
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>1 asset selected</span>
          <button style={{ background: LIME, color: '#0d0d0d', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Use in creation</button>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
      )}
    </div>
  );
}
