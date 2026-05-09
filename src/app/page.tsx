'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEMO_CREATORS } from '@/lib/creatorNetwork';
import {
  ChevronDown, Lock, Shield, X,
  Clock, Cpu, Maximize2, Monitor,
} from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';

// ─── Media assets ─────────────────────────────────────────────────────────────

const LOGO_URL =
  'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';

const UGC_VIDEOS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-style-ve_2891981897.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-energetic-ugc-fitne_2891987468.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugcstyle-tes_2892041483.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_make-ugc-video-with-this-_2892034073.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-cinematic-ugc-testi_2892073891.mp4',
];

const PRODUCT_IMAGES = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/be7f70f4-139f-4cb1-bcaa-964d79dc6a9e.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/a9a7a9fd-e332-4750-bdd9-859ab5f45948.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5e1cf241-a837-4b51-a46c-f0fb5d643f1f.png',
];

// ─── Static data ───────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, title: 'Upload Image',           desc: 'Add any photo or product shot.' },
  { num: 2, title: 'Choose Motion / Style',  desc: 'Pick a preset or describe the vibe you want.' },
  { num: 3, title: 'Generate Video',         desc: 'Preview and download your UGC video.' },
];

const VIDEO_CARD_DATA = [
  { src: UGC_VIDEOS[0], badge: 'UGC Demo', quote: 'Realistic. Relatable.\nMade for conversion.' },
  { src: UGC_VIDEOS[1], badge: null,        quote: 'My go-to serum\nfor glass skin ✨' },
  { src: UGC_VIDEOS[2], badge: null,        quote: 'Feels premium,\nlooks even better.' },
  { src: UGC_VIDEOS[3], badge: null,        quote: 'Clean ingredients.\nReal results.' },
  { src: UGC_VIDEOS[4], badge: null,        quote: 'Hydration that\nactually lasts.' },
];

const SETTING_ROWS = [
  { icon: Cpu,       label: 'Model',        key: 'model'       as const, options: ['Seedance 2.0', 'Seedance 1.0'] },
  { icon: Clock,     label: 'Duration',     key: 'duration'    as const, options: ['4s', '6s', '8s', '12s'] },
  { icon: Maximize2, label: 'Aspect Ratio', key: 'aspectRatio' as const, options: ['9:16', '16:9', '1:1'] },
  { icon: Monitor,   label: 'Resolution',   key: 'resolution'  as const, options: ['720p', '1080p'] },
];

// ─── Design tokens ─────────────────────────────────────────────────────────────

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();

  const [prompt,      setPrompt]      = useState('A young woman in a city at night holding a LED skincare device. Neon lights, cinematic bokeh, UGC style, natural look.');
  const [settings,    setSettings]    = useState({ model: 'Seedance 2.0', duration: '6s', aspectRatio: '9:16', resolution: '1080p' });
  const [openSetting, setOpenSetting] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [pricingTab,  setPricingTab]  = useState<'plans' | 'credits'>('plans');

  function setSetting(key: keyof typeof settings, value: string) {
    setSettings(s => ({ ...s, [key]: value }));
    setOpenSetting(null);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-x: hidden; max-width: 100%; }
        body { background: ${BG}; color: #f2f0eb; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow-x: hidden; max-width: 100%; }
        ::selection { background: rgba(163,230,53,0.2); }

        .setting-row { display: flex; align-items: center; padding: 9px 0; cursor: pointer; gap: 8px; position: relative; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .setting-row:last-child { border-bottom: none; }

        .setting-dropdown { position: absolute; right: 0; top: calc(100% + 4px); background: #1e1e1e; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; overflow: hidden; z-index: 20; min-width: 140px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .setting-option { padding: 10px 14px; font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; transition: background 0.1s; font-family: inherit; }
        .setting-option:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .setting-option-selected { color: ${ORANGE}; }

        .gen-btn { width: 100%; background: ${LIME}; color: #0d0d0d; border: none; border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.15s, transform 0.1s; letter-spacing: -0.01em; font-family: inherit; }
        .gen-btn:hover { background: #b6f23f; transform: translateY(-1px); }
        .gen-btn:active { transform: translateY(0); }

        .video-card { flex-shrink: 0; position: relative; border-radius: 14px; overflow: hidden; background: #111; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: border-color 0.2s, transform 0.2s; }
        .video-card:hover { border-color: rgba(255,255,255,0.2); transform: scale(1.02); }

        .ghost-scroll::-webkit-scrollbar { display: none; }
        .ghost-scroll { scrollbar-width: none; }

        @media (max-width: 900px) {
          .home-split { flex-direction: column !important; }
          .home-panel { width: 100% !important; min-width: 0 !important; position: relative !important; top: auto !important; height: auto !important; padding: 16px !important; }
          .home-content { padding: 24px 16px !important; }
          .model-banners { grid-template-columns: 1fr !important; }
          .model-banner-left-img { width: 140px !important; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-strip { flex-direction: column !important; gap: 16px !important; }
          .step-arrow { display: none !important; }
        }
        @media (max-width: 600px) {
          .model-banner-left-img { width: 110px !important; }
        }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <PublicHeader isHomePage activePage="home" />

      {/* ── HERO SPLIT ────────────────────────────────────────────────────────── */}
      <div id="video" className="home-split" style={{ display: 'flex', paddingTop: 60, minHeight: 'calc(100vh - 60px)', overflow: 'hidden', maxWidth: '100%' }}>

        {/* ── LEFT CREATION PANEL ──────────────────────────────────────────── */}
        <div className="home-panel" style={{ width: 360, padding: '18px 0 24px 16px', position: 'sticky', top: 60, alignSelf: 'flex-start', height: 'calc(100vh - 60px)', overflowY: 'auto', flexShrink: 0 }} onClick={() => setOpenSetting(null)}>
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'visible' }}>

            {/* Section label */}
            <div style={{ padding: '11px 16px 10px', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Create Video</span>
            </div>

            <div style={{ padding: 16 }}>

              {/* Reference Image */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Reference Image</span>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>?</span>
                </div>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                  {/* Upload slot */}
                  <div style={{ width: 50, height: 50, border: '1.5px dashed rgba(255,255,255,0.18)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', marginTop: 3, textAlign: 'center', lineHeight: 1.3 }}>Upload<br/>PNG, JPG</span>
                  </div>
                  {/* Thumbnails */}
                  {PRODUCT_IMAGES.map((src, i) => (
                    <div key={i} onClick={e => { e.stopPropagation(); setSelectedImg(i); }}
                      style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: selectedImg === i ? `2px solid ${ORANGE}` : '2px solid transparent', flexShrink: 0, position: 'relative' }}>
                      <Image src={src} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                      {selectedImg === i && (
                        <div
                          onClick={e => { e.stopPropagation(); setSelectedImg(-1); }}
                          style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, borderRadius: '50%', background: '#0d0d0d', border: `1px solid rgba(255,255,255,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                          <X size={8} color="rgba(255,255,255,0.6)" />
                        </div>
                      )}
                    </div>
                  ))}
                  <button style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>View all</button>
                </div>
              </div>

              {/* Prompt */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Prompt</span>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>?</span>
                </div>
                <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    maxLength={500}
                    rows={4}
                    onClick={e => e.stopPropagation()}
                    style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.65, padding: '10px 12px', resize: 'none', fontFamily: 'inherit' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{prompt.length}/500</span>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                      ✦ Enhance Prompt
                    </button>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 4, marginBottom: 14 }}>
                {SETTING_ROWS.map(row => (
                  <div key={row.key} style={{ position: 'relative' }}>
                    <div className="setting-row"
                      onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === row.key ? null : row.key); }}>
                      <row.icon size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{row.label}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{settings[row.key]}</span>
                      <ChevronDown size={13} color="rgba(255,255,255,0.3)"
                        style={{ transition: 'transform 0.15s', transform: openSetting === row.key ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                    </div>
                    {openSetting === row.key && (
                      <div className="setting-dropdown" onClick={e => e.stopPropagation()}>
                        {row.options.map(opt => (
                          <div key={opt}
                            className={`setting-option${settings[row.key] === opt ? ' setting-option-selected' : ''}`}
                            onClick={() => setSetting(row.key, opt)}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Generate */}
              <button className="gen-btn" onClick={e => { e.stopPropagation(); router.push('/signup'); }} style={{ marginBottom: 10 }}>
                ✦ Generate
              </button>

              {/* Note */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <Lock size={11} color="rgba(255,255,255,0.2)" style={{ marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
                  You&apos;ll be prompted to sign up when you click Generate.
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ────────────────────────────────────────────────── */}
        <div className="home-content" style={{ flex: 1, padding: '32px 28px 48px', minWidth: 0 }}>

          {/* Trust badge */}
          <div style={{ float: 'right', display: 'flex', alignItems: 'center', gap: 10, background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 14px', marginBottom: 8, marginLeft: 16, flexShrink: 0 }}>
            <Shield size={18} color={ORANGE} strokeWidth={1.5} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>No credit card</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>Start for free. No paywall until you generate.</div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 54px)', fontWeight: 800, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 16, maxWidth: 620 }}>
            Create <span style={{ color: ORANGE }}>UGC</span> videos<br />
            before you even sign in.
          </h1>

          <p style={{ fontSize: 'clamp(13px, 1.15vw, 16px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>
            Upload any image. Turn it into scroll-stopping UGC in seconds.<br />
            Sign up <span style={{ color: ORANGE, fontWeight: 600 }}>only when you&apos;re ready</span> to generate.
          </p>

          {/* Steps strip */}
          <div className="steps-strip" style={{ background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 22px', marginBottom: 28, display: 'flex', alignItems: 'flex-start' }}>
            {STEPS.map((step, i) => (
              <React.Fragment key={step.num}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, flex: 1 }}>
                  <div style={{ width: 27, height: 27, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{step.num}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5, maxWidth: 160 }}>{step.desc}</div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="step-arrow" style={{ display: 'flex', alignItems: 'center', padding: '4px 14px', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Video gallery */}
          <div id="examples" className="ghost-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
            {VIDEO_CARD_DATA.map((card, i) => (
              <div key={i} className="video-card" style={{ width: 155, flexShrink: 0 }}>
                {card.badge && (
                  <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, background: ORANGE, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: '0.04em' }}>
                    {card.badge}
                  </div>
                )}
                <video src={card.src} autoPlay muted loop playsInline style={{ width: '100%', height: 264, objectFit: 'cover', display: 'block' }} />
                {card.quote && (
                  <div style={{ position: 'absolute', top: card.badge ? 38 : 10, left: 10, right: 10, fontSize: 11, fontWeight: 600, color: '#fff', lineHeight: 1.45, textShadow: '0 1px 6px rgba(0,0,0,0.7)', whiteSpace: 'pre-line', pointerEvents: 'none' }}>
                    {card.quote}
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', padding: '24px 8px 8px', pointerEvents: 'none' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>{settings.duration}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>{settings.aspectRatio}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Play all */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, paddingLeft: 8, gap: 8, cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a1a1a', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.65)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', fontWeight: 500 }}>Play all</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── MODEL BANNERS ─────────────────────────────────────────────────────── */}
      <section id="image" style={{ background: '#060606', borderTop: `1px solid ${BORDER}`, padding: '56px 20px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>AI Models</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>Powered by the latest AI models</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Create realistic UGC videos and high-quality product images with the models built for modern creators.
            </p>
          </div>

          {/* Banner grid */}
          <div className="model-banners" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* ── SEEDANCE 2.0 BANNER ── */}
            <a href="/dashboard/video" style={{ textDecoration: 'none', display: 'flex', borderRadius: 22, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #080e1a 0%, #0c1829 45%, #060f1e 100%)', border: '1px solid rgba(56,139,253,0.22)', boxShadow: '0 0 40px rgba(56,139,253,0.08)', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s', minHeight: 220 }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 48px rgba(56,139,253,0.22)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 0 40px rgba(56,139,253,0.08)'; }}>

              {/* Left image panel */}
              <div className="model-banner-left-img" style={{ width: 200, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,211,238,0.06)', borderRight: '1px solid rgba(34,211,238,0.12)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(34,211,238,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/seedance_2_logo_transparent_original_edges.png"
                  alt="Seedance 2.0" style={{ width: 130, height: 130, objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 18px rgba(34,211,238,0.35))' }} />
              </div>

              {/* Right text */}
              <div style={{ flex: 1, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'absolute', top: -50, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,139,253,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#22d3ee', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)', padding: '4px 10px', borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: 14 }}>
                  Available for everyone
                </span>
                <h3 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10 }}>Seedance 2.0</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, marginBottom: 20 }}>
                  Realistic AI video generation for UGC ads, product demos, and creator-style content.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, alignSelf: 'flex-start' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Create Video
                </div>
              </div>
            </a>

            {/* ── GPT IMAGE 2.0 BANNER ── */}
            <a href="/dashboard/image" style={{ textDecoration: 'none', display: 'flex', borderRadius: 22, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #0d0d0d 0%, #141414 50%, #0a0a0a 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 40px rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s', minHeight: 220 }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 48px rgba(255,255,255,0.09)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 0 40px rgba(255,255,255,0.03)'; }}>

              {/* Left image panel */}
              <div className="model-banner-left-img" style={{ width: 200, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(163,230,53,0.04)', borderRight: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(163,230,53,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/GPT%202.0.png"
                  alt="GPT Image 2.0" style={{ width: 130, height: 130, objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 18px rgba(163,230,53,0.3))' }} />
              </div>

              {/* Right text */}
              <div style={{ flex: 1, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'absolute', top: -40, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', padding: '4px 10px', borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: 14 }}>
                  New image model
                </span>
                <h3 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10 }}>GPT Image 2.0</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, marginBottom: 20 }}>
                  Generate clean product visuals, lifestyle images, apparel mockups, and UGC-style photos.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.28)', color: '#a3e635', padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, alignSelf: 'flex-start' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Create Image
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: '72px 20px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>Simple pricing for UGC creation</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Start with monthly credits. Add more anytime when you need them.
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
            <div style={{ display: 'flex', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, gap: 4 }}>
              {(['plans', 'credits'] as const).map(t => (
                <button key={t} onClick={() => setPricingTab(t)}
                  style={{ padding: '8px 22px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
                    background: pricingTab === t ? (t === 'plans' ? ORANGE : LIME) : 'transparent',
                    color: pricingTab === t ? (t === 'plans' ? '#fff' : '#0d0d0d') : 'rgba(255,255,255,0.45)',
                    transition: 'all 0.15s' }}>
                  {t === 'plans' ? 'Monthly Plans' : 'Credit Packs'}
                </button>
              ))}
            </div>
          </div>

          {/* ── MONTHLY PLANS ── */}
          {pricingTab === 'plans' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 960, margin: '0 auto' }}>
              {[
                { name: 'Starter',  price: 29,  credits: 300,   badge: null,           desc: 'Testing AI UGC creation',        color: 'rgba(255,255,255,0.08)',   btnColor: '#1e1e1e', btnText: '#fff', border: BORDER },
                { name: 'Creator',  price: 99,  credits: 1500,  badge: 'Most Popular', desc: 'Consistent weekly content',       color: 'rgba(163,230,53,0.06)',    btnColor: LIME,      btnText: '#0d0d0d', border: 'rgba(163,230,53,0.35)' },
                { name: 'Pro',      price: 199, credits: 4000,  badge: null,           desc: 'Brands running more ad tests',   color: 'rgba(255,92,0,0.05)',      btnColor: ORANGE,    btnText: '#fff', border: 'rgba(255,92,0,0.25)' },
              ].map(plan => (
                <div key={plan.name} style={{ background: plan.color, border: `1px solid ${plan.border}`, borderRadius: 20, padding: '28px 26px 24px', position: 'relative',
                  boxShadow: plan.badge ? '0 0 40px rgba(163,230,53,0.08)' : 'none' }}>
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: LIME, color: '#0d0d0d', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      ✦ {plan.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>${plan.price}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', paddingBottom: 6 }}>/mo</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{plan.credits.toLocaleString()} credits</span> / month
                  </div>
                  <div style={{ fontSize: 12, color: ORANGE, fontWeight: 500, marginBottom: 20 }}>Best for: {plan.desc}</div>
                  <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {[
                      `~${Math.floor(plan.credits / 75)} video generations (75cr each)`,
                      `~${Math.floor(plan.credits / 4)} image generations (4cr each)`,
                      'Cancel anytime',
                    ].map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ color: LIME, fontSize: 13, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => router.push("/signup")}
                    style={{ width: '100%', background: plan.btnColor, color: plan.btnText, border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}>
                    Start {plan.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── CREDIT PACKS ── */}
          {pricingTab === 'credits' && (
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { credits: 250,  price: 15,  badge: null,           savings: null },
                { credits: 1000, price: 49,  badge: null,           savings: null },
                { credits: 2500, price: 99,  badge: 'Most Popular', savings: '33% more credits' },
                { credits: 5000, price: 179, badge: 'Best Value',   savings: '40% more credits' },
              ].map(pack => (
                <div key={pack.credits} style={{ display: 'flex', alignItems: 'center', background: '#141414', border: `1px solid ${pack.badge ? 'rgba(163,230,53,0.25)' : BORDER}`, borderRadius: 16, padding: '18px 22px', gap: 16,
                  boxShadow: pack.badge ? '0 0 24px rgba(163,230,53,0.06)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{pack.credits.toLocaleString()} credits</span>
                      {pack.badge && (
                        <span style={{ fontSize: 10, fontWeight: 800, background: pack.badge === 'Best Value' ? ORANGE : LIME, color: pack.badge === 'Best Value' ? '#fff' : '#0d0d0d', padding: '3px 9px', borderRadius: 20, letterSpacing: '0.05em' }}>
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>~{Math.floor(pack.credits / 75)} videos</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>~{Math.floor(pack.credits / 4)} images</span>
                      {pack.savings && <span style={{ fontSize: 12, color: LIME, fontWeight: 600 }}>{pack.savings}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>${pack.price}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>one-time</div>
                  </div>
                  <button onClick={() => router.push("/signup")}
                    style={{ background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#b6f23f'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = LIME; }}>
                    Buy Credits
                  </button>
                </div>
              ))}
              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 8 }}>
                Add credits anytime · Great for extra generations · No subscription required
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ── CREATOR NETWORK ───────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, rgba(163,230,53,0.04) 0%, transparent 100%)', borderTop: `1px solid ${BORDER}`, padding: '72px 20px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              ✦ Creator Network
            </div>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
              Create AI ads. Build your portfolio.<br />
              <span style={{ color: LIME }}>Get discovered.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.75 }}>
              UGCFire.ai is the AI Creator Network for UGC ads, product videos, and image-to-video creators. Publish your best work, grow your portfolio, and become visible for agency opportunities.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/discover?tab=creators"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
                ✦ Join Creator Network
              </Link>
              <Link href="/discover"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', border: `1px solid ${BORDER}`, transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}>
                Explore Creators →
              </Link>
            </div>
          </div>

          {/* Creator cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {DEMO_CREATORS.slice(0, 4).map(creator => (
              <div key={creator.id} style={{ background: PANEL, border: `1px solid ${creator.featured ? 'rgba(163,230,53,0.2)' : BORDER}`, borderRadius: 18, padding: '22px 18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: creator.featured ? '0 0 24px rgba(163,230,53,0.05)' : 'none' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  {creator.available_for_work && (
                    <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${LIME}`, boxShadow: `0 0 10px rgba(163,230,53,0.45)` }} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={creator.avatar_url || ''} alt={creator.display_name}
                    style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 2 }}>{creator.display_name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>@{creator.username}</div>
                {creator.available_for_work && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 20, padding: '2px 8px', fontSize: 9.5, fontWeight: 700, color: LIME, letterSpacing: '0.04em', marginBottom: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: LIME, boxShadow: `0 0 4px ${LIME}` }} />
                    Available
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 14 }}>
                  {creator.specialties.slice(0, 2).map(s => (
                    <span key={s} style={{ fontSize: 9.5, fontWeight: 700, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', padding: '2px 7px', borderRadius: 20 }}>{s}</span>
                  ))}
                </div>
                <Link href={`/creators/${creator.username}`}
                  style={{ display: 'block', width: '100%', textAlign: 'center', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 12, padding: '8px', borderRadius: 9, textDecoration: 'none' }}>
                  View Portfolio
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/discover"
              style={{ fontSize: 13, color: LIME, textDecoration: 'none', fontWeight: 600 }}>
              See all creators →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#060606', borderTop: `1px solid ${BORDER}`, padding: '40px 24px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 48, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 auto', marginRight: 8 }}>
              <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={30} style={{ objectFit: 'contain', height: 28, width: 'auto', marginBottom: 12 }} unoptimized />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', lineHeight: 1.8, maxWidth: 220 }}>
                UGCFire.ai helps brands generate UGC-style ads, product visuals, hooks, scripts, and ad variations faster with AI.
              </p>
            </div>
            {[
              { title: 'Product', links: [['How It Works', '#'], ['Pricing', '#pricing'], ['Studio', '/dashboard/studio']] },
              { title: 'Social',  links: [['Instagram', 'https://www.instagram.com/ugcfire'], ['TikTok', 'https://www.tiktok.com/@ugcfire'], ['X', 'https://x.com/ugcfire']] },
              { title: 'Legal',   links: [['Terms of Service', '/terms'], ['Privacy Policy', '/privacy']] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', fontWeight: 600, marginBottom: 14 }}>{col.title}</div>
                {col.links.map(([l, h]) => (
                  <a key={l} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.16)' }}>© 2026 UGCFire.ai. All rights reserved.</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.16)' }}>Built for brands that move fast 🔥</span>
          </div>
        </div>
      </footer>

    </>
  );
}
