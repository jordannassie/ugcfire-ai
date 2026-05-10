'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ImageIcon, Video, Download, Heart, Play, Cpu, Clock, Maximize2, Monitor,
  FolderOpen, Upload, Layers, User, Briefcase, Search, ChevronDown,
  Sparkles, CheckCircle, X,
} from 'lucide-react';
import HoverVideoPreview from '@/components/shared/HoverVideoPreview';
import AssetPickerModal from '@/components/dashboard/AssetPickerModal';
import {
  PRODUCT_IMAGES, DEMO_VIDEO_GENS, DEMO_IMAGE_GENS,
  LS_VIDEO_GENS, LS_IMAGE_GENS,
  loadFromLS, saveToLS, subtractCredits, formatGenDate,
  type VideoGeneration, type ImageGeneration,
} from '@/lib/demoAssets';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const PANEL2 = '#111111';
const BORDER = 'rgba(255,255,255,0.07)';

type GenItem = (VideoGeneration & { kind: 'video' }) | (ImageGeneration & { kind: 'image' });

const IMAGE_STYLES   = ['UGC-Style Ad', 'Product Shot', 'Lifestyle Ad', 'Model Shot', 'Marketing Graphic'];
const IMAGE_MODELS   = ['GPT Image 2.0', 'Nano Banana 2', 'UGCFire Image'];
const IMAGE_RATIOS   = ['1:1', '4:5', '9:16', '16:9'];
const IMAGE_COUNTS   = [1, 2, 4];
const VIDEO_MODELS   = ['UGCFire Video 2.0', 'Seedance 2.0', 'UGCFire Video 1.0'];
const VIDEO_DURATIONS = ['6s', '8s', '10s'];
const VIDEO_RATIOS   = ['9:16', '16:9', '1:1'];
const VIDEO_RES      = ['720p', '1080p'];

export default function StudioPage() {
  const [mode, setMode]             = useState<'image' | 'video'>('video');
  const [historyTab, setHistoryTab] = useState<'all' | 'images' | 'videos' | 'favorites'>('all');
  const [search, setSearch]         = useState('');
  const [items, setItems]           = useState<GenItem[]>([]);
  const [liked, setLiked]           = useState<Set<string>>(new Set());
  const [toastId, setToastId]       = useState<string | null>(null);
  const [mobile, setMobile]         = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightOpen, setRightOpen]   = useState(false);

  // Image form state
  const [imgPrompt, setImgPrompt]   = useState('Hyperrealistic UGC style image of a woman wearing the product outdoors. Casual lifestyle shot, natural lighting, authentic look.');
  const [imgStyle, setImgStyle]     = useState(IMAGE_STYLES[0]);
  const [imgModel, setImgModel]     = useState(IMAGE_MODELS[0]);
  const [imgRatio, setImgRatio]     = useState('1:1');
  const [imgCount, setImgCount]     = useState(2);
  const [imgGenerating, setImgGenerating] = useState(false);
  const [imgAssets, setImgAssets]   = useState<string[]>([PRODUCT_IMAGES[0]]);

  // Video form state
  const [vidPrompt, setVidPrompt]   = useState('');
  const [vidModel, setVidModel]     = useState(VIDEO_MODELS[0]);
  const [vidDuration, setVidDuration] = useState('6s');
  const [vidRatio, setVidRatio]     = useState('9:16');
  const [vidRes, setVidRes]         = useState('1080p');
  const [vidGenerating, setVidGenerating] = useState(false);
  const [vidAssets, setVidAssets]   = useState<string[]>([PRODUCT_IMAGES[0], PRODUCT_IMAGES[1]]);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 900);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const vids = loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS).map(g => ({ ...g, kind: 'video' as const }));
    const imgs = loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS).map(g => ({ ...g, kind: 'image' as const }));
    const merged: GenItem[] = [...vids, ...imgs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setItems(merged);
  }, []);

  function showToast(id: string) {
    setToastId(id);
    setTimeout(() => setToastId(null), 2000);
  }

  function toggleLike(id: string) {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function handleGenerateImage() {
    if (imgGenerating) return;
    subtractCredits(4 * imgCount);
    setImgGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    const srcs = [...PRODUCT_IMAGES, ...DEMO_IMAGE_GENS.map(g => g.imageSrc)];
    const newGens: ImageGeneration[] = Array.from({ length: imgCount }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      prompt: imgPrompt, model: imgModel, ratio: imgRatio,
      imageSrc: srcs[(Math.floor(Math.random() * srcs.length))],
      createdAt: new Date().toISOString(),
    }));
    const existing = loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS);
    const updated = [...newGens, ...existing];
    saveToLS(LS_IMAGE_GENS, updated);
    setItems(prev => [...newGens.map(g => ({ ...g, kind: 'image' as const })), ...prev]);
    setImgGenerating(false);
  }

  async function handleGenerateVideo() {
    if (vidGenerating) return;
    subtractCredits(75);
    setVidGenerating(true);
    await new Promise(r => setTimeout(r, 2200));
    const newGen: VideoGeneration = {
      id: `vid-${Date.now()}`,
      prompt: vidPrompt || 'AI video generation',
      model: vidModel, duration: vidDuration, aspectRatio: vidRatio, resolution: vidRes,
      videoSrc: DEMO_VIDEO_GENS[Math.floor(Math.random() * DEMO_VIDEO_GENS.length)].videoSrc,
      createdAt: new Date().toISOString(),
    };
    const existing = loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS);
    saveToLS(LS_VIDEO_GENS, [newGen, ...existing]);
    setItems(prev => [{ ...newGen, kind: 'video' }, ...prev]);
    setVidGenerating(false);
  }

  const filtered = items.filter(item => {
    if (historyTab === 'videos' && item.kind !== 'video') return false;
    if (historyTab === 'images' && item.kind !== 'image') return false;
    if (historyTab === 'favorites' && !liked.has(item.id)) return false;
    if (search && !item.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const generating = mode === 'image' ? imgGenerating : vidGenerating;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { resize: none; }
        .left-panel { width: 272px; min-width: 272px; border-right: 1px solid ${BORDER}; overflow-y: auto; }
        .left-panel.collapsed { width: 0; min-width: 0; overflow: hidden; }
        .seg-btn { background: none; border: none; cursor: pointer; font-family: inherit; transition: all 0.12s; }
        .seg-btn:disabled { opacity: 0.5; cursor: default; }
        .pill-btn { border-radius: 20px; padding: 4px 11px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.12s; }
        .action-btn { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 5px 10px; border-radius: 7px; cursor: pointer; font-family: inherit; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); transition: all 0.12s; }
        .action-btn:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .field-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
        .gen-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.15s; }
        .gen-card:hover { border-color: rgba(255,255,255,0.2); }
        @media (max-width: 900px) { .left-panel { width: 100% !important; min-width: unset !important; border-right: none !important; border-bottom: 1px solid ${BORDER}; max-height: 420px; overflow-y: auto; } .studio-wrap { flex-direction: column !important; overflow: auto !important; } }
      `}</style>

      {/* Toast */}
      {toastId && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1a1a1a', border: `1px solid ${LIME}35`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: LIME, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <CheckCircle size={14} strokeWidth={2.5} /> Added to Profile
        </div>
      )}

      {assetsOpen && (
        <AssetPickerModal
          onClose={() => setAssetsOpen(false)}
          onSelect={mode === 'image'
            ? (src: string) => { setImgAssets(p => p.includes(src) ? p.filter(x => x !== src) : [...p, src]); }
            : (src: string) => { setVidAssets(p => p.includes(src) ? p.filter(x => x !== src) : [...p, src]); }}
          selectedAssets={mode === 'image' ? imgAssets : vidAssets}
        />
      )}

      <div className="studio-wrap" style={{ display: 'flex', height: '100%', overflow: 'hidden', background: BG }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <aside className={`left-panel${leftCollapsed ? ' collapsed' : ''}`} style={{ background: PANEL2, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

          {/* Panel header */}
          <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#fff' }}>Create</div>
              <button onClick={() => setLeftCollapsed(v => !v)} className="seg-btn" style={{ padding: '3px 5px', borderRadius: 6, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>
            {/* Image / Video mode */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 3, gap: 2 }}>
              {(['image', 'video'] as const).map(m => (
                <button key={m} className="seg-btn" onClick={() => setMode(m)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 7, fontSize: 12, fontWeight: mode === m ? 700 : 500, background: mode === m ? 'rgba(255,255,255,0.07)' : 'none', color: mode === m ? '#fff' : 'rgba(255,255,255,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  {m === 'image' ? <ImageIcon size={12} strokeWidth={1.75} /> : <Video size={12} strokeWidth={1.75} />}
                  {m === 'image' ? 'Image' : 'Video'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
            {mode === 'image' ? (
              /* ── IMAGE CONTROLS ─── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div className="field-label">Prompt</div>
                  <textarea value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 10px', color: '#fff', fontSize: 12, fontFamily: 'inherit', outline: 'none', lineHeight: 1.6 }} />
                </div>

                <div>
                  <div className="field-label">Reference Assets</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {imgAssets.slice(0, 3).map((src, i) => (
                      <div key={i} style={{ width: 40, height: 40, borderRadius: 7, overflow: 'hidden', border: `1.5px solid ${ORANGE}50`, position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <button onClick={() => setAssetsOpen(true)} className="seg-btn"
                      style={{ width: 40, height: 40, borderRadius: 7, border: `1.5px dashed rgba(255,255,255,0.18)`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                      <FolderOpen size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="field-label">Style</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {IMAGE_STYLES.map(s => (
                      <button key={s} className="pill-btn" onClick={() => setImgStyle(s)}
                        style={{ border: `1px solid ${imgStyle === s ? ORANGE : BORDER}`, background: imgStyle === s ? `${ORANGE}18` : 'transparent', color: imgStyle === s ? ORANGE : 'rgba(255,255,255,0.45)' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label">Aspect Ratio</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {IMAGE_RATIOS.map(r => (
                      <button key={r} className="pill-btn" onClick={() => setImgRatio(r)}
                        style={{ border: `1px solid ${imgRatio === r ? LIME : BORDER}`, background: imgRatio === r ? `${LIME}15` : 'transparent', color: imgRatio === r ? LIME : 'rgba(255,255,255,0.45)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label">Model</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {IMAGE_MODELS.map(m => (
                      <button key={m} className="seg-btn" onClick={() => setImgModel(m)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${imgModel === m ? LIME + '40' : BORDER}`, background: imgModel === m ? `${LIME}08` : 'transparent', textAlign: 'left', color: imgModel === m ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: imgModel === m ? 700 : 400 }}>
                        <Cpu size={12} strokeWidth={1.75} color={imgModel === m ? LIME : 'rgba(255,255,255,0.3)'} />
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label">Count</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {IMAGE_COUNTS.map(c => (
                      <button key={c} className="pill-btn" onClick={() => setImgCount(c)}
                        style={{ border: `1px solid ${imgCount === c ? LIME : BORDER}`, background: imgCount === c ? `${LIME}15` : 'transparent', color: imgCount === c ? LIME : 'rgba(255,255,255,0.45)' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleGenerateImage} disabled={imgGenerating}
                  style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: imgGenerating ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 800, background: imgGenerating ? 'rgba(163,230,53,0.25)' : LIME, color: imgGenerating ? LIME : '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  {imgGenerating ? <><Sparkles size={14} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : `Generate Image`}
                </button>
              </div>
            ) : (
              /* ── VIDEO CONTROLS ─── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div className="field-label">Prompt</div>
                  <textarea value={vidPrompt} onChange={e => setVidPrompt(e.target.value)} rows={4}
                    placeholder="Describe your video scene in detail..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 10px', color: '#fff', fontSize: 12, fontFamily: 'inherit', outline: 'none', lineHeight: 1.6 }} />
                </div>

                <div>
                  <div className="field-label">Reference Assets</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {vidAssets.slice(0, 3).map((src, i) => (
                      <div key={i} style={{ width: 40, height: 40, borderRadius: 7, overflow: 'hidden', border: `1.5px solid ${ORANGE}50` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <button onClick={() => setAssetsOpen(true)} className="seg-btn"
                      style={{ width: 40, height: 40, borderRadius: 7, border: `1.5px dashed rgba(255,255,255,0.18)`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                      <FolderOpen size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="field-label">Model</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {VIDEO_MODELS.map(m => (
                      <button key={m} className="seg-btn" onClick={() => setVidModel(m)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${vidModel === m ? ORANGE + '40' : BORDER}`, background: vidModel === m ? `${ORANGE}12` : 'transparent', textAlign: 'left', color: vidModel === m ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: vidModel === m ? 700 : 400 }}>
                        <Cpu size={12} strokeWidth={1.75} color={vidModel === m ? ORANGE : 'rgba(255,255,255,0.3)'} />
                        {m}
                        {m.includes('2.0') && <span style={{ fontSize: 9, fontWeight: 800, background: ORANGE, color: '#000', borderRadius: 4, padding: '1px 5px', marginLeft: 'auto' }}>NEW</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label">Duration</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {VIDEO_DURATIONS.map(d => (
                      <button key={d} className="pill-btn" onClick={() => setVidDuration(d)}
                        style={{ border: `1px solid ${vidDuration === d ? ORANGE : BORDER}`, background: vidDuration === d ? `${ORANGE}18` : 'transparent', color: vidDuration === d ? ORANGE : 'rgba(255,255,255,0.45)' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label">Aspect Ratio</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {VIDEO_RATIOS.map(r => (
                      <button key={r} className="pill-btn" onClick={() => setVidRatio(r)}
                        style={{ border: `1px solid ${vidRatio === r ? LIME : BORDER}`, background: vidRatio === r ? `${LIME}15` : 'transparent', color: vidRatio === r ? LIME : 'rgba(255,255,255,0.45)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label">Resolution</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {VIDEO_RES.map(r => (
                      <button key={r} className="pill-btn" onClick={() => setVidRes(r)}
                        style={{ border: `1px solid ${vidRes === r ? LIME : BORDER}`, background: vidRes === r ? `${LIME}15` : 'transparent', color: vidRes === r ? LIME : 'rgba(255,255,255,0.45)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleGenerateVideo} disabled={vidGenerating}
                  style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: vidGenerating ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 800, background: vidGenerating ? `${ORANGE}40` : ORANGE, color: vidGenerating ? ORANGE : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  {vidGenerating ? <><Sparkles size={14} strokeWidth={2} /> Generating...</> : `Generate Video`}
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── CENTER WORKSPACE ─────────────────────────────────────────── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Workspace toolbar */}
          <div style={{ padding: '12px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            {leftCollapsed && (
              <button onClick={() => setLeftCollapsed(false)} className="seg-btn"
                style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 8, background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`, color: ORANGE }}>
                + Create
              </button>
            )}
            {/* History tab filters */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '2px', gap: 1 }}>
              {(['all', 'images', 'videos', 'favorites'] as const).map(t => (
                <button key={t} className="seg-btn" onClick={() => setHistoryTab(t)}
                  style={{ padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: historyTab === t ? 700 : 400, background: historyTab === t ? 'rgba(255,255,255,0.07)' : 'none', color: historyTab === t ? '#fff' : 'rgba(255,255,255,0.38)', whiteSpace: 'nowrap' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 10px', maxWidth: 200 }}>
              <Search size={12} color="rgba(255,255,255,0.3)" strokeWidth={1.75} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..."
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'rgba(255,255,255,0.55)', width: 120, fontFamily: 'inherit' }} />
            </div>
            {/* Assets panel toggle */}
            <button onClick={() => setRightOpen(v => !v)} className="seg-btn"
              style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, background: rightOpen ? 'rgba(255,255,255,0.07)' : 'transparent', border: `1px solid ${BORDER}`, color: rightOpen ? '#fff' : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Layers size={13} strokeWidth={1.75} /> Assets
            </button>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minWidth: 0 }}>

            {/* Generation history feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px', minWidth: 0 }}>

              {generating && (
                <div style={{ background: 'rgba(255,92,0,0.05)', border: `1px solid ${ORANGE}25`, borderRadius: 14, padding: '16px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Sparkles size={16} color={ORANGE} strokeWidth={2} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ fontWeight: 700, color: ORANGE }}>{mode === 'image' ? 'Generating images' : 'Generating video'}</span>
                    {' '}— {mode === 'image' ? imgModel : vidModel} · {mode === 'image' ? imgRatio : vidRatio}
                  </div>
                </div>
              )}

              {filtered.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, gap: 14, textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {historyTab === 'favorites' ? <Heart size={24} color="rgba(255,255,255,0.18)" /> : <Sparkles size={24} color="rgba(255,255,255,0.18)" />}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>
                    {historyTab === 'favorites' ? 'No favorites yet.' : 'No generations yet.'}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', maxWidth: 260 }}>
                    {historyTab === 'favorites' ? 'Favorite generated content to save it here.' : 'Use the Create panel on the left to generate AI images and videos.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {filtered.map(item => (
                    <div key={item.id} className="gen-card">
                      {/* Media */}
                      <div style={{ position: 'relative' }}>
                        {item.kind === 'video' ? (
                          <>
                            <HoverVideoPreview src={(item as VideoGeneration).videoSrc} autoPlay loop style={{ height: 220 }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.75 }}>
                                <Play size={13} color="#fff" fill="#fff" />
                              </div>
                            </div>
                          </>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={(item as ImageGeneration).imageSrc} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                        )}
                        {/* Type badge overlay */}
                        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4, background: item.kind === 'video' ? `${ORANGE}dd` : `rgba(30,30,30,0.85)`, backdropFilter: 'blur(6px)', borderRadius: 20, padding: '3px 8px' }}>
                          {item.kind === 'video' ? <Video size={9} color="#fff" strokeWidth={2} /> : <ImageIcon size={9} color={LIME} strokeWidth={2} />}
                          <span style={{ fontSize: 9, fontWeight: 800, color: item.kind === 'video' ? '#fff' : LIME }}>{item.kind === 'video' ? 'Video' : 'Image'}</span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: '10px 12px' }}>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, lineHeight: 1.5 }}>
                          {item.prompt.slice(0, 70)}{item.prompt.length > 70 ? '…' : ''}
                        </p>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 9 }}>
                          {item.model} · {formatGenDate(item.createdAt)}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          <button onClick={() => showToast(item.id)} className="action-btn"
                            style={{ background: `${LIME}12`, border: `1px solid ${LIME}30`, color: LIME }}>
                            <User size={10} strokeWidth={2} /> Add to Profile
                          </button>
                          <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
                            <button className="action-btn" style={{ background: `${ORANGE}12`, border: `1px solid ${ORANGE}30`, color: ORANGE }}>
                              <Briefcase size={10} strokeWidth={2} /> Submit
                            </button>
                          </Link>
                          <button className="action-btn">
                            <Download size={10} strokeWidth={2} /> Save
                          </button>
                          <button onClick={() => toggleLike(item.id)} className="action-btn"
                            style={{ background: liked.has(item.id) ? 'rgba(239,68,68,0.12)' : undefined, color: liked.has(item.id) ? '#ef4444' : undefined }}>
                            <Heart size={10} strokeWidth={2} fill={liked.has(item.id) ? '#ef4444' : 'none'} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── ASSETS RIGHT PANEL ─── */}
            {rightOpen && (
              <aside style={{ width: 240, borderLeft: `1px solid ${BORDER}`, background: PANEL2, overflowY: 'auto', flexShrink: 0, padding: '14px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Assets
                  <button onClick={() => setRightOpen(false)} className="seg-btn" style={{ padding: '2px 4px', color: 'rgba(255,255,255,0.3)' }}>
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Upload zone */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1.5px dashed rgba(255,255,255,0.12)`, borderRadius: 10, padding: '14px', textAlign: 'center', marginBottom: 14, cursor: 'pointer' }}>
                  <Upload size={16} color="rgba(255,255,255,0.25)" strokeWidth={1.5} style={{ margin: '0 auto 6px' }} />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>Drop files or click to upload</p>
                </div>

                {/* Asset tabs */}
                {[
                  { label: 'Logos & Branding', assets: PRODUCT_IMAGES.slice(0, 2) },
                  { label: 'Product Images', assets: PRODUCT_IMAGES },
                  { label: 'Past Generations', assets: DEMO_IMAGE_GENS.map(g => g.imageSrc) },
                ].map(cat => (
                  <div key={cat.label} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{cat.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
                      {cat.assets.slice(0, 6).map((src, i) => (
                        <div key={i} style={{ aspectRatio: '1', borderRadius: 7, overflow: 'hidden', border: `1px solid ${BORDER}`, cursor: 'pointer' }}
                          onClick={() => mode === 'image' ? setImgAssets(p => p.includes(src) ? p.filter(x => x !== src) : [...p, src]) : setVidAssets(p => p.includes(src) ? p.filter(x => x !== src) : [...p, src])}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
