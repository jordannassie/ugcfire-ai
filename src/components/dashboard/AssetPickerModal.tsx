'use client';

import React, { useState, useRef } from 'react';
import { X, Plus, Upload, Check } from 'lucide-react';
import HoverVideoPreview from '@/components/shared/HoverVideoPreview';
import { ALL_DEMO_ASSETS, DEMO_IMAGE_GENS, DEMO_VIDEO_GENS, loadFromLS, LS_IMAGE_GENS, LS_VIDEO_GENS } from '@/lib/demoAssets';
import type { ImageGeneration, VideoGeneration } from '@/lib/demoAssets';

const TABS = ['Uploads', 'Image Generations', 'Video Generations', 'Brand Assets', 'Liked'] as const;
type Tab = typeof TABS[number];

const LIME   = '#a3e635';
const BORDER = 'rgba(255,255,255,0.07)';
const PANEL  = '#141414';

interface Props {
  onClose: () => void;
  onSelect: ((urls: string[]) => void) | null;
  initialSelected?: string[];
}

export default function AssetPickerModal({ onClose, onSelect, initialSelected = [] }: Props) {
  const [activeTab, setActiveTab]   = useState<Tab>('Uploads');
  const [selected,  setSelected]    = useState<string[]>(initialSelected);
  const [uploads,   setUploads]     = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const imageGens  = loadFromLS<ImageGeneration>(LS_IMAGE_GENS,  DEMO_IMAGE_GENS);
  const videoGens  = loadFromLS<VideoGeneration>(LS_VIDEO_GENS,  DEMO_VIDEO_GENS);

  function toggleAsset(url: string) {
    setSelected(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach(f => {
      if (!f.type.startsWith('image/')) return;
      const url = URL.createObjectURL(f);
      setUploads(prev => [url, ...prev]);
      setSelected(prev => [url, ...prev]);
    });
  }

  function handleUse() {
    if (onSelect) onSelect(selected);
    onClose();
  }

  // What to render in the grid depending on active tab
  function gridAssets(): string[] {
    switch (activeTab) {
      case 'Uploads':           return uploads;
      case 'Image Generations': return imageGens.map(g => g.imageSrc);
      case 'Video Generations': return videoGens.map(g => g.videoSrc);
      case 'Brand Assets':      return ALL_DEMO_ASSETS;
      case 'Liked':             return [];
    }
  }

  const assets = gridAssets();

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#111', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 18, width: '100%', maxWidth: 820, maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Assets</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER}`, padding: '0 20px', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === t ? '#fff' : 'rgba(255,255,255,0.4)', borderBottom: activeTab === t ? '2px solid #FF5C00' : '2px solid transparent', transition: 'color 0.12s', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* Upload card + hidden input */}
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>

            {/* Upload tile (always shown) */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{ aspectRatio: '1', borderRadius: 12, border: '1.5px dashed rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.35)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)'; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} color="rgba(255,255,255,0.5)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Upload media</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>PNG, JPG, WEBP<br/>up to 25MB</div>
              </div>
            </div>

            {/* Asset tiles */}
            {assets.map((url, i) => {
              const isSelected = selected.includes(url);
              const isVideo = url.includes('.mp4');
              return (
                <div key={i} onClick={() => toggleAsset(url)}
                  style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: isSelected ? `2px solid ${LIME}` : '2px solid transparent', transition: 'border-color 0.12s', background: '#1a1a1a' }}>
                  {isVideo ? (
                    <HoverVideoPreview src={url} autoPlay loop style={{ height: '100%' }} showAudioButton={false} />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color="#0d0d0d" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}

            {assets.length === 0 && activeTab !== 'Uploads' && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
                No {activeTab.toLowerCase()} yet.
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        {onSelect && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#0f0f0f' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {selected.length > 0 && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={selected[selected.length - 1]} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', border: `2px solid ${LIME}` }} />
              )}
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                {selected.length > 0 ? `${selected.length} selected` : 'Select assets to use'}
              </span>
            </div>
            <button
              onClick={handleUse}
              disabled={selected.length === 0}
              style={{ background: selected.length > 0 ? '#1a1a1a' : 'rgba(255,255,255,0.04)', border: `1px solid ${selected.length > 0 ? 'rgba(255,255,255,0.2)' : BORDER}`, color: selected.length > 0 ? '#fff' : 'rgba(255,255,255,0.25)', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: selected.length > 0 ? 'pointer' : 'default', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Upload size={13} />
              Use in prompt ({selected.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
