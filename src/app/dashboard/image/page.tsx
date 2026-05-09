'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Maximize2, X, Grid, List, Sparkles, Layers } from 'lucide-react';
import {
  PRODUCT_IMAGES, DEMO_IMAGE_GENS, LS_IMAGE_GENS,
  loadFromLS, saveToLS, UGC_VIDEOS,
  type ImageGeneration,
} from '@/lib/demoAssets';
import AssetPickerModal from '@/components/dashboard/AssetPickerModal';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const MODEL_OPTIONS = ['Nano Banana 2', 'Nano Banana 1', 'Seedance 2.0'];
const RATIO_OPTIONS = ['3:4', '1:1', '16:9', '9:16'];
const COUNT_OPTIONS = [1, 2, 4, 8];

export default function ImagePage() {
  const [activeTab,      setActiveTab]      = useState<'create' | 'edit'>('create');
  const [historyTab,     setHistoryTab]     = useState<'history' | 'inspiration'>('history');
  const [prompt,         setPrompt]         = useState('Hyperrealistic UGC style image of a woman wearing the product outdoors in a sunny city. Casual lifestyle shot, natural lighting, authentic look.');
  const [model,          setModel]          = useState('Nano Banana 2');
  const [ratio,          setRatio]          = useState('3:4');
  const [count,          setCount]          = useState(4);
  const [openSetting,    setOpenSetting]    = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([PRODUCT_IMAGES[0], PRODUCT_IMAGES[1], PRODUCT_IMAGES[2]]);
  const [generations,    setGenerations]    = useState<ImageGeneration[]>([]);
  const [generating,     setGenerating]     = useState(false);
  const [assetsOpen,     setAssetsOpen]     = useState(false);
  const [gridView,       setGridView]       = useState(true);

  useEffect(() => {
    const data = loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS);
    if (data.length === 0) {
      saveToLS(LS_IMAGE_GENS, DEMO_IMAGE_GENS);
      setGenerations(DEMO_IMAGE_GENS);
    } else {
      setGenerations(data);
    }
  }, []);

  async function handleGenerate() {
    if (generating) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1600));

    // Generate `count` new image cards
    const allImgSrcs = [...PRODUCT_IMAGES, ...DEMO_IMAGE_GENS.map(g => g.imageSrc)];
    const newGens: ImageGeneration[] = Array.from({ length: count }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
      imageSrc: allImgSrcs[Math.floor(Math.random() * allImgSrcs.length)],
      model,
      aspectRatio: ratio,
      numImages: count,
      prompt,
      selectedAssets,
    }));

    const updated = [...newGens, ...generations];
    setGenerations(updated);
    saveToLS(LS_IMAGE_GENS, updated);
    setGenerating(false);
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: BG, overflow: 'hidden' }} onClick={() => setOpenSetting(null)}>

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <aside style={{ width: 276, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {(['Create Image', 'Edit Image'] as const).map((tab, i) => {
            const key = (['create', 'edit'] as const)[i];
            return (
              <button key={tab} onClick={e => { e.stopPropagation(); setActiveTab(key); }}
                style={{ flex: 1, padding: '12px 4px', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === key ? '#fff' : 'rgba(255,255,255,0.3)', borderBottom: activeTab === key ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'color 0.12s', fontFamily: 'inherit' }}>
                {tab}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

          {/* Selected assets */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Selected assets</span>
              {selectedAssets.length > 0 && (
                <button onClick={() => setSelectedAssets([])} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedAssets.map((src, i) => (
                <div key={i} style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button onClick={e => { e.stopPropagation(); setSelectedAssets(prev => prev.filter((_, j) => j !== i)); }}
                    style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: '#0d0d0d', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                    <X size={8} color="rgba(255,255,255,0.6)" />
                  </button>
                </div>
              ))}
              <button onClick={e => { e.stopPropagation(); setAssetsOpen(true); }}
                style={{ width: 52, height: 52, borderRadius: 8, border: '1.5px dashed rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>+</span>
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>Prompt</p>
            <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                maxLength={1000}
                rows={5}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.65, padding: '10px 12px', resize: 'none', fontFamily: 'inherit', display: 'block' }}
              />
              <div style={{ padding: '5px 10px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{prompt.length} / 1000</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 4, marginBottom: 16 }}>

            {/* Model */}
            <div style={{ position: 'relative' }}>
              <div onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === 'model' ? null : 'model'); }}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 0', cursor: 'pointer', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <Layers size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>Model</span>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{model}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.15)', padding: '1px 5px', borderRadius: 4 }}>NEW</span>
                <ChevronRight size={13} color="rgba(255,255,255,0.25)" />
              </div>
              {openSetting === 'model' && (
                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 'calc(100% + 2px)', background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  {MODEL_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setModel(opt); setOpenSetting(null); }}
                      style={{ padding: '10px 14px', fontSize: 13, color: model === opt ? ORANGE : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aspect ratio */}
            <div style={{ position: 'relative' }}>
              <div onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === 'ratio' ? null : 'ratio'); }}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 0', cursor: 'pointer', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <Maximize2 size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>Aspect ratio</span>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{ratio}</span>
                <ChevronRight size={13} color="rgba(255,255,255,0.25)" />
              </div>
              {openSetting === 'ratio' && (
                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 'calc(100% + 2px)', background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  {RATIO_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setRatio(opt); setOpenSetting(null); }}
                      style={{ padding: '10px 14px', fontSize: 13, color: ratio === opt ? ORANGE : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images count */}
            <div style={{ position: 'relative' }}>
              <div onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === 'count' ? null : 'count'); }}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 0', cursor: 'pointer', gap: 10 }}>
                <Grid size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>Images</span>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{count}</span>
                <ChevronRight size={13} color="rgba(255,255,255,0.25)" />
              </div>
              {openSetting === 'count' && (
                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 'calc(100% + 2px)', background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 80, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  {COUNT_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setCount(opt); setOpenSetting(null); }}
                      style={{ padding: '10px 14px', fontSize: 13, color: count === opt ? ORANGE : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={e => { e.stopPropagation(); handleGenerate(); }}
            disabled={generating}
            style={{ width: '100%', background: generating ? '#7aaa28' : LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 800, cursor: generating ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'background 0.15s' }}>
            {generating ? <><Sparkles size={16} />Generating…</> : `Generate ✦ ${count}`}
          </button>
        </div>
      </aside>

      {/* ── CENTER (History) ──────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* History tabs + controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex' }}>
            {(['History', 'Inspiration'] as const).map(t => {
              const key = t.toLowerCase() as 'history' | 'inspiration';
              return (
                <button key={t} onClick={() => setHistoryTab(key)}
                  style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: historyTab === key ? '#fff' : 'rgba(255,255,255,0.38)', borderBottom: historyTab === key ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'color 0.12s', fontFamily: 'inherit' }}>
                  {t}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setGridView(true)} style={{ width: 28, height: 28, borderRadius: 6, background: gridView ? '#222' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid size={13} color={gridView ? '#fff' : 'rgba(255,255,255,0.35)'} />
            </button>
            <button onClick={() => setGridView(false)} style={{ width: 28, height: 28, borderRadius: 6, background: !gridView ? '#222' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <List size={13} color={!gridView ? '#fff' : 'rgba(255,255,255,0.35)'} />
            </button>
          </div>
        </div>

        {/* Image grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {generations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${gridView ? '160px' : '100%'}, 1fr))`, gap: 10 }}>
              {generations.map(g => (
                <div key={g.id} style={{ borderRadius: 12, overflow: 'hidden', background: PANEL, border: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'border-color 0.15s', position: 'relative' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.imageSrc} alt="" style={{ width: '100%', aspectRatio: g.aspectRatio.replace(':', '/'), objectFit: 'cover', display: 'block' }} />
                  {!gridView && (
                    <div style={{ padding: '8px 12px' }}>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{g.prompt.slice(0, 80)}…</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{g.model} · {g.aspectRatio}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 10 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>No images generated yet.</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)' }}>Generate your first image to get started.</p>
            </div>
          )}
        </div>
      </main>

      {/* Asset picker */}
      {assetsOpen && (
        <AssetPickerModal
          onClose={() => setAssetsOpen(false)}
          onSelect={urls => setSelectedAssets(prev => [...new Set([...prev, ...urls])].slice(0, 6))}
          initialSelected={selectedAssets}
        />
      )}
    </div>
  );
}
