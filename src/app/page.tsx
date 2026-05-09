'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { enterDemoMode } from '@/lib/demoData';
import {
  ChevronDown, Lock, Search, Shield, X,
  Clock, Cpu, Maximize2, Monitor, Gift, Zap, Rocket,
} from 'lucide-react';

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

const NAV_LINKS = [
  { label: 'Explore',      href: '#',                  active: false },
  { label: 'Image',        href: '#',                  active: false },
  { label: 'Video',        href: '#',                  active: true  },
  { label: 'Brand Assets', href: '#',                  active: false },
  { label: 'Studio',       href: '/dashboard/studio',  active: false },
  { label: 'Pricing',      href: '#pricing',           active: false },
];

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

const BENEFIT_CARDS = [
  { Icon: Gift,   title: 'Start Free',             desc: 'Explore the studio and create previews before signing up.',                         link: 'No credit card required' },
  { Icon: Zap,    title: 'Use Seedance 2.0',        desc: 'Powered by the latest Seedance model for ultra-realistic motion.',                   link: 'Pro quality by default'  },
  { Icon: Rocket, title: 'Built for UGC Creators', desc: 'Made for TikTok, Reels, Shorts and performance-driven content.',                    link: 'Creators love it'        },
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

  const [activeTab,   setActiveTab]   = useState<'create' | 'edit' | 'motion'>('create');
  const [prompt,      setPrompt]      = useState('A young woman in a city at night holding a LED skincare device. Neon lights, cinematic bokeh, UGC style, natural look.');
  const [settings,    setSettings]    = useState({ model: 'Seedance 2.0', duration: '6s', aspectRatio: '9:16', resolution: '1080p' });
  const [openSetting, setOpenSetting] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [showModal,   setShowModal]   = useState(false);
  const [entering,    setEntering]    = useState<'user' | 'admin' | null>(null);

  function setSetting(key: keyof typeof settings, value: string) {
    setSettings(s => ({ ...s, [key]: value }));
    setOpenSetting(null);
  }

  function handleDemo(role: 'client' | 'admin') {
    setEntering(role === 'admin' ? 'admin' : 'user');
    enterDemoMode(role);
    setTimeout(() => router.push(role === 'admin' ? '/admin' : '/dashboard/video'), 120);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${BG}; color: #f2f0eb; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow-x: hidden; }
        ::selection { background: rgba(163,230,53,0.2); }

        .nav-link { color: rgba(255,255,255,0.5); font-size: 13.5px; text-decoration: none; padding: 5px 9px; border-radius: 6px; transition: color 0.15s; font-weight: 500; white-space: nowrap; }
        .nav-link:hover { color: #fff; }
        .nav-link-active { color: ${ORANGE}; font-size: 13.5px; text-decoration: none; padding: 5px 9px; border-bottom: 2px solid ${ORANGE}; font-weight: 600; white-space: nowrap; }

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

        .modal-btn { width: 100%; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 12px 16px; cursor: pointer; transition: all 0.15s; text-align: left; color: #fff; font-size: 14px; font-weight: 600; font-family: inherit; }
        .modal-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.16); }
        .modal-btn:disabled { opacity: 0.5; cursor: default; pointer-events: none; }

        .ghost-scroll::-webkit-scrollbar { display: none; }
        .ghost-scroll { scrollbar-width: none; }

        @media (max-width: 900px) {
          .home-split { flex-direction: column !important; }
          .home-panel { width: 100% !important; position: relative !important; top: auto !important; height: auto !important; padding: 16px !important; }
          .home-content { padding: 24px 16px !important; }
          .nav-links-desk { display: none !important; }
          .nav-search { display: none !important; }
          .benefit-grid { grid-template-columns: 1fr !important; }
          .steps-strip { flex-direction: column !important; gap: 16px !important; }
          .step-arrow { display: none !important; }
        }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, zIndex: 100, background: '#0d0d0d', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 4, padding: '0 16px' }}>

        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 10, flexShrink: 0 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={30} style={{ objectFit: 'contain', height: 28, width: 'auto' }} unoptimized />
        </a>

        <div className="nav-links-desk" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className={l.active ? 'nav-link-active' : 'nav-link'}>{l.label}</a>
          ))}
        </div>

        <div className="nav-search" style={{ marginLeft: 'auto', marginRight: 10, display: 'flex', alignItems: 'center', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 10px', gap: 7, flexShrink: 0 }}>
          <Search size={13} color="rgba(255,255,255,0.3)" strokeWidth={2} />
          <input
            placeholder="Search templates, styles, assets..."
            style={{ background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 13, width: 200, fontFamily: 'inherit' }}
          />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, fontWeight: 500, flexShrink: 0 }}>⌘K</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <a href="/login"
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none', padding: '7px 16px', border: `1px solid ${BORDER}`, borderRadius: 8, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'rgba(255,255,255,0.65)'; el.style.borderColor = BORDER; }}
          >Login</a>
          <a href="/signup"
            style={{ color: '#0d0d0d', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', padding: '7px 18px', background: LIME, borderRadius: 8, transition: 'background 0.15s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}
          >Sign up</a>
        </div>
      </nav>

      {/* ── HERO SPLIT ────────────────────────────────────────────────────────── */}
      <div className="home-split" style={{ display: 'flex', paddingTop: 60, minHeight: 'calc(100vh - 60px)' }}>

        {/* ── LEFT CREATION PANEL ──────────────────────────────────────────── */}
        <div className="home-panel" style={{ width: 296, padding: '18px 0 24px 16px', position: 'sticky', top: 60, alignSelf: 'flex-start', height: 'calc(100vh - 60px)', overflowY: 'auto', flexShrink: 0 }} onClick={() => setOpenSetting(null)}>
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'visible' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
              {(['Create Video', 'Edit Video', 'Motion Control'] as const).map((tab, i) => {
                const key = (['create', 'edit', 'motion'] as const)[i];
                return (
                  <button key={tab} onClick={e => { e.stopPropagation(); setActiveTab(key); }}
                    style={{ flex: 1, padding: '11px 4px', fontSize: 11, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === key ? '#fff' : 'rgba(255,255,255,0.3)', borderBottom: activeTab === key ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'color 0.15s, border-color 0.15s', fontFamily: 'inherit', letterSpacing: '-0.01em' }}>
                    {tab}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: 14 }}>

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
              <button className="gen-btn" onClick={e => { e.stopPropagation(); setShowModal(true); }} style={{ marginBottom: 10 }}>
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
          <div className="ghost-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
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

      {/* ── BENEFIT CARDS ─────────────────────────────────────────────────────── */}
      <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: '40px 20px' }}>
        <div className="benefit-grid" style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {BENEFIT_CARDS.map(({ Icon, title, desc, link }) => (
            <div key={title} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 22px 20px' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={20} color={ORANGE} strokeWidth={1.75} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, marginBottom: 10 }}>{desc}</p>
              <span style={{ fontSize: 13, color: ORANGE, fontWeight: 600 }}>{link}</span>
            </div>
          ))}
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

      {/* ── GENERATE MODAL ────────────────────────────────────────────────────── */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '36px 32px', width: '100%', maxWidth: 400, position: 'relative' }}>

            {/* Close */}
            <button onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} color="rgba(255,255,255,0.6)" />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={30} style={{ objectFit: 'contain', height: 26, width: 'auto', margin: '0 auto 16px' }} unoptimized />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                Create an account to generate
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>Start free. No credit card required.</p>
            </div>

            {/* Demo buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <button className="modal-btn" onClick={() => handleDemo('client')} disabled={entering !== null}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,92,0,0.12)', border: '1px solid rgba(255,92,0,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👤</span>
                <div style={{ flex: 1 }}>
                  <div>{entering === 'user' ? 'Entering…' : 'Demo User'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', fontWeight: 400, marginTop: 1 }}>Explore the client dashboard</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <button className="modal-btn" onClick={() => handleDemo('admin')} disabled={entering !== null}
                style={{ borderColor: 'rgba(255,92,0,0.2)' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>⚡</span>
                <div style={{ flex: 1 }}>
                  <div>{entering === 'admin' ? 'Entering…' : 'Demo Admin'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', fontWeight: 400, marginTop: 1 }}>Explore the admin command center</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Auth buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/signup"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, borderRadius: 10, padding: '11px 0', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#b6f23f')}
                onMouseLeave={e => (e.currentTarget.style.background = LIME)}
              >Sign up</a>
              <a href="/login"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 10, padding: '11px 0', textDecoration: 'none', border: `1px solid ${BORDER}`, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >Login</a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
