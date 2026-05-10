'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, Clock, Cpu, Maximize2, Monitor, Plus, X,
  Download, Play, Sparkles, MessageCircle, ChevronDown,
} from 'lucide-react';
import {
  UGC_VIDEOS, PRODUCT_IMAGES, DEMO_VIDEO_GENS,
  LS_VIDEO_GENS, loadFromLS, saveToLS, formatGenDate,
  subtractCredits,
  type VideoGeneration,
} from '@/lib/demoAssets';
import AssetPickerModal from '@/components/dashboard/AssetPickerModal';
import HoverVideoPreview from '@/components/shared/HoverVideoPreview';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const SETTINGS_CFG = [
  { icon: Cpu,       label: 'Model',        key: 'model'       as const, options: ['UGC Fire 2.0', 'UGC Fire 1.0', 'Seedance 2.0'],     badge: 'NEW' },
  { icon: Clock,     label: 'Duration',     key: 'duration'    as const, options: ['4s', '6s', '8s', '12s'],                            badge: null  },
  { icon: Maximize2, label: 'Aspect Ratio', key: 'aspectRatio' as const, options: ['9:16 (Vertical)', '16:9 (Landscape)', '1:1'],       badge: null  },
  { icon: Monitor,   label: 'Resolution',   key: 'resolution'  as const, options: ['720p', '1080p'],                                    badge: null  },
];

export default function VideoPage() {
  // Tab state removed — only "Create Video" workflow shown
  const [mobileView,  setMobileView]  = useState<'history' | 'create'>('history');
  const [mobile,      setMobile]      = useState(false);
  const [prompt,      setPrompt]      = useState('');
  const [settings,    setSettings]    = useState({ model: 'UGC Fire 2.0', duration: '6s', aspectRatio: '9:16 (Vertical)', resolution: '1080p' });
  const [openSetting, setOpenSetting] = useState<string | null>(null);
  const [refImages,   setRefImages]   = useState<string[]>([PRODUCT_IMAGES[0], PRODUCT_IMAGES[1], PRODUCT_IMAGES[2]]);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [generations, setGenerations] = useState<VideoGeneration[]>([]);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [generating,  setGenerating]  = useState(false);
  const [assetsOpen,  setAssetsOpen]  = useState(false);
  const [dragging,    setDragging]    = useState(false);
  const [sheetOpen,   setSheetOpen]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const data = loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS);
    if (data.length === 0) {
      saveToLS(LS_VIDEO_GENS, DEMO_VIDEO_GENS);
      setGenerations(DEMO_VIDEO_GENS);
      setSelectedId(DEMO_VIDEO_GENS[0].id);
    } else {
      setGenerations(data);
      setSelectedId(data[0].id);
    }
  }, []);

  const selected = generations.find(g => g.id === selectedId) ?? null;

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setUploadedImg(url);
    setRefImages(prev => [url, ...prev.slice(0, 2)]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handleGenerate() {
    if (generating) return;
    subtractCredits(75);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    const newGen: VideoGeneration = {
      id: `gen-${Date.now()}`,
      createdAt: new Date().toISOString(),
      videoSrc: UGC_VIDEOS[Math.floor(Math.random() * UGC_VIDEOS.length)],
      model: settings.model,
      duration: settings.duration,
      aspectRatio: settings.aspectRatio,
      resolution: settings.resolution,
      prompt: prompt || 'Lifestyle product video of a fitness supplement bottle. Confident creator outdoors, natural lighting, authentic UGC style.',
      referenceImages: refImages.length ? refImages : [PRODUCT_IMAGES[0]],
    };
    const updated = [newGen, ...generations];
    setGenerations(updated);
    setSelectedId(newGen.id);
    saveToLS(LS_VIDEO_GENS, updated);
    setGenerating(false);
    if (mobile) setMobileView('history');
  }

  function setSetting(key: keyof typeof settings, val: string) {
    setSettings(s => ({ ...s, [key]: val }));
    setOpenSetting(null);
  }

  // ── Creation panel (shared desktop + mobile) ──────────────────────────────
  const CreationPanel = (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px' }} onClick={() => setOpenSetting(null)}>

      {/* Section label */}
      {!mobile && (
        <div style={{ paddingBottom: 14, marginBottom: 4, borderBottom: `1px solid ${BORDER}`, marginLeft: -16, marginRight: -16, paddingLeft: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Create Video Ad</span>
        </div>
      )}

      {/* Headline */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: mobile ? 20 : 22, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 2 }}>Create portfolio-ready</h2>
        <h2 style={{ fontSize: mobile ? 20 : 22, fontWeight: 800, color: LIME, lineHeight: 1.15, letterSpacing: '-0.03em' }}>UGC-style video ads.</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6, lineHeight: 1.5 }}>Create video ads for your AI creator profile. Upload work made with UGCFire or any AI tool.</p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileRef.current?.click()}
        style={{ border: `1.5px dashed ${dragging ? LIME : 'rgba(255,255,255,0.15)'}`, borderRadius: 12, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(163,230,53,0.04)' : 'rgba(255,255,255,0.02)', marginBottom: 14, transition: 'all 0.15s' }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        {uploadedImg ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={uploadedImg} alt="Uploaded" style={{ width: '100%', maxHeight: 110, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
        ) : (
          <>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>Drag &amp; drop any image</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>JPG, PNG, WEBP up to 10MB</p>
            <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
              style={{ background: '#1e1e1e', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.65)', padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Browse
            </button>
          </>
        )}
      </div>

      {/* Reference images */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 7 }}>Reference images (optional)</p>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {refImages.slice(0, 3).map((src, i) => (
            <div key={i} style={{ width: 46, height: 46, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={e => { e.stopPropagation(); setRefImages(prev => prev.filter((_, j) => j !== i)); }}
                style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: '#0d0d0d', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                <X size={8} color="rgba(255,255,255,0.6)" />
              </button>
            </div>
          ))}
          <button onClick={e => { e.stopPropagation(); setAssetsOpen(true); }}
            style={{ width: 46, height: 46, borderRadius: 8, border: '1.5px dashed rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Plus size={16} color="rgba(255,255,255,0.4)" />
          </button>
        </div>
      </div>

      {/* Prompt */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>Prompt</p>
        <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} maxLength={1000} rows={4} placeholder="Describe the video you want to create…"
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.65, padding: '10px 12px', resize: 'none', fontFamily: 'inherit', display: 'block' }} />
          <div style={{ padding: '5px 10px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{prompt.length} / 1000</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 4, marginBottom: 14 }}>
        {SETTINGS_CFG.map(row => (
          <div key={row.key} style={{ position: 'relative' }}>
            <div onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === row.key ? null : row.key); }}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 0', cursor: 'pointer', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <row.icon size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{settings[row.key]}</span>
              {row.badge && <span style={{ fontSize: 9, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.15)', padding: '1px 5px', borderRadius: 4 }}>{row.badge}</span>}
              <ChevronDown size={13} color="rgba(255,255,255,0.25)" />
            </div>
            {openSetting === row.key && (
              <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 'calc(100% + 2px)', background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10, overflow: 'hidden', zIndex: 30, minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                {row.options.map(opt => (
                  <div key={opt} onClick={() => setSetting(row.key, opt)}
                    style={{ padding: '10px 14px', fontSize: 13, color: settings[row.key] === opt ? ORANGE : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Generate */}
      <button onClick={e => { e.stopPropagation(); handleGenerate(); }} disabled={generating}
        style={{ width: '100%', background: generating ? '#7aaa28' : LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 800, cursor: generating ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginBottom: 8, letterSpacing: '-0.01em', transition: 'background 0.15s' }}>
        {generating ? <><Sparkles size={16} strokeWidth={2} />Generating…</> : 'Generate Video'}
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.22)', marginBottom: 8 }}>1 generation ≈ 1 credit</p>
    </div>
  );

  // ── History panel ─────────────────────────────────────────────────────────
  const HistoryPanel = (
    <div style={{ flex: 1, overflowY: 'auto', padding: mobile ? '16px' : '20px 24px' }}>
      {generations.length > 0 ? (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {generations.map(g => {
            const isSel = g.id === selectedId;
            return (
              <div key={g.id} onClick={() => { setSelectedId(g.id); if (mobile) setSheetOpen(true); }}
                style={{ width: mobile ? 'calc(50% - 6px)' : 168, flexShrink: 0, borderRadius: 14, overflow: 'hidden', background: PANEL, border: `2px solid ${isSel ? LIME : BORDER}`, cursor: 'pointer', transition: 'border-color 0.15s', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <HoverVideoPreview src={g.videoSrc} autoPlay loop style={{ height: mobile ? 200 : 290 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                      <Play size={14} color="#fff" fill="#fff" />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 5, padding: '2px 7px', fontSize: 11, color: '#fff', fontWeight: 600 }}>
                    0:{g.duration.replace('s', '').padStart(2, '0')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 10 }}>
          <MessageCircle size={32} color="rgba(255,255,255,0.18)" strokeWidth={1.5} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>Your videos will appear here.</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)' }}>Generate your first video to get started.</p>
        </div>
      )}
    </div>
  );

  // ── Mobile inspector bottom sheet ─────────────────────────────────────────
  const MobileSheet = selected && sheetOpen && (
    <>
      <div onClick={() => setSheetOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', bottom: 56, left: 0, right: 0, maxHeight: '72vh', background: '#111', borderTop: `1px solid rgba(255,255,255,0.12)`, borderRadius: '20px 20px 0 0', zIndex: 201, overflowY: 'auto', padding: '0 0 24px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.15)', margin: '12px auto 16px' }} />
        <div style={{ padding: '0 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>Completed</span>
            </div>
            <button onClick={() => setSheetOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>✕</button>
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 14, border: `1px solid ${BORDER}` }}>
            <HoverVideoPreview src={selected.videoSrc} autoPlay loop style={{ height: 200 }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>UGC Fire 2.0</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>{formatGenDate(selected.createdAt)}</p>
          {[
            { label: 'Model',        value: selected.model       },
            { label: 'Duration',     value: selected.duration    },
            { label: 'Aspect Ratio', value: selected.aspectRatio },
            { label: 'Resolution',   value: selected.resolution  },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{row.value}</span>
            </div>
          ))}
          <button style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, color: '#fff', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginTop: 16 }}>
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
    </>
  );

  // ─── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG, overflow: 'hidden' }}>
        {/* Mobile tab switcher */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, background: '#111', flexShrink: 0 }}>
          {(['history', 'create'] as const).map(v => (
            <button key={v} onClick={() => setMobileView(v)}
              style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: mobileView === v ? '#fff' : 'rgba(255,255,255,0.4)', borderBottom: mobileView === v ? `2px solid ${ORANGE}` : '2px solid transparent', fontFamily: 'inherit' }}>
              {v === 'history' ? 'My Videos' : 'Create Video Ad'}
            </button>
          ))}
        </div>

        {mobileView === 'create' ? (
          <div style={{ flex: 1, overflowY: 'auto' }} onClick={() => setOpenSetting(null)}>
            {CreationPanel}
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 16px 8px', flexShrink: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Recent Generations</p>
            </div>
            {HistoryPanel}
          </>
        )}

        {MobileSheet}

        {assetsOpen && (
          <AssetPickerModal onClose={() => setAssetsOpen(false)}
            onSelect={urls => setRefImages(prev => [...urls, ...prev].slice(0, 6))}
            initialSelected={refImages} />
        )}
      </div>
    );
  }

  // ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100%', background: BG, overflow: 'hidden' }} onClick={() => setOpenSetting(null)}>
      <aside style={{ width: 276, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        {CreationPanel}
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Recent Generations</span>
          </div>
          <button style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
            View all <ChevronRight size={13} />
          </button>
        </div>
        {HistoryPanel}
      </main>

      {selected && (
        <aside style={{ width: 254, borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>Completed</span>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: 16 }}>···</button>
            </div>
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 14, border: `1px solid ${BORDER}` }}>
              <HoverVideoPreview src={selected.videoSrc} autoPlay loop style={{ height: 180 }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>UGC Fire 2.0</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginBottom: 16 }}>{formatGenDate(selected.createdAt)}</p>
            {[
              { label: 'Model',        value: selected.model,        badge: true  },
              { label: 'Duration',     value: selected.duration,     badge: false },
              { label: 'Aspect Ratio', value: selected.aspectRatio,  badge: false },
              { label: 'Resolution',   value: selected.resolution,   badge: false },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{row.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{row.value}</span>
                  {row.badge && <span style={{ fontSize: 9, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.15)', padding: '1px 5px', borderRadius: 4 }}>NEW</span>}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 6 }}>Prompt</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
                {selected.prompt.length > 120 ? selected.prompt.slice(0, 120) + '…' : selected.prompt}
              </p>
            </div>
            {selected.referenceImages.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 8 }}>Reference Images</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {selected.referenceImages.slice(0, 3).map((src, i) => (
                    <div key={i} style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, color: '#fff', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginBottom: 12 }}>
              <Download size={14} />
              Download
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageCircle size={12} color="rgba(255,255,255,0.25)" />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Need help? </span>
              <a href="#" style={{ fontSize: 11, color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>Join our Discord</a>
            </div>
          </div>
        </aside>
      )}

      {assetsOpen && (
        <AssetPickerModal onClose={() => setAssetsOpen(false)}
          onSelect={urls => setRefImages(prev => [...urls, ...prev].slice(0, 6))}
          initialSelected={refImages} />
      )}
    </div>
  );
}
