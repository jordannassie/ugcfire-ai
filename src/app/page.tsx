'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Lock, X, Cpu, Clock, Maximize2, Monitor, Briefcase, Calendar, DollarSign, Users, Zap, Award } from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';
import HoverVideoPreview from '@/components/shared/HoverVideoPreview';
import SiteFooter from '@/components/shared/SiteFooter';

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

const HERO_BG_VIDEO = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/video/hf_20260507_203840_ec73ef26-f3ba-4189-8046-bb42475960aa.mp4';

// ─── AI creation panel config ──────────────────────────────────────────────

const VIDEO_SETTING_ROWS = [
  { icon: Cpu,       label: 'Model',        key: 'model'       as const, options: ['Seedance 2.0', 'Seedance 1.0'] },
  { icon: Clock,     label: 'Duration',     key: 'duration'    as const, options: ['4s', '6s', '8s', '12s'] },
  { icon: Maximize2, label: 'Aspect Ratio', key: 'aspectRatio' as const, options: ['9:16', '16:9', '1:1'] },
  { icon: Monitor,   label: 'Resolution',   key: 'resolution'  as const, options: ['720p', '1080p'] },
];

const IMAGE_SETTING_ROWS = [
  { icon: Cpu,       label: 'Model',        key: 'imgModel'       as const, options: ['GPT Image 2.0'] },
  { icon: Maximize2, label: 'Aspect Ratio', key: 'imgAspectRatio' as const, options: ['1:1', '9:16', '16:9', '4:3'] },
  { icon: Monitor,   label: 'Quality',      key: 'imgQuality'     as const, options: ['Standard', 'HD'] },
];

const VIDEO_PROMPT = 'A young woman in a city at night holding a skincare device. Neon lights, cinematic bokeh, UGC style, natural look.';
const IMAGE_PROMPT = 'A realistic UGC-style product photo of a skincare serum on a bathroom counter, natural morning light, iPhone photo look.';

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_CREATORS = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'AI Ad Creator',
    username: 'alexrivera',
    skills: ['UGC Video', 'Product Ads', 'Social Content'],
    portfolioCount: 24,
    available: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Maya Chen',
    role: 'AI Visual Designer',
    username: 'mayachen',
    skills: ['Product Photos', 'Brand Visuals', 'Lifestyle Ads'],
    portfolioCount: 18,
    available: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Jordan Kim',
    role: 'AI Video Creator',
    username: 'jordankim',
    skills: ['TikTok Ads', 'UGC Scripts', 'Motion Content'],
    portfolioCount: 31,
    available: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
];

const MOCK_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Summer Skincare Campaign',
    category: 'Beauty & Skincare',
    payMin: 150,
    payMax: 300,
    deadline: '7 days',
    deliverables: '3 UGC video ads',
    icon: '◆',
  },
  {
    id: '2',
    title: 'App Launch Video Ads',
    category: 'Tech & Apps',
    payMin: 200,
    payMax: 400,
    deadline: '5 days',
    deliverables: '5 short video ads',
    icon: '📱',
  },
  {
    id: '3',
    title: 'Product Launch Graphics',
    category: 'E-commerce',
    payMin: 100,
    payMax: 200,
    deadline: '10 days',
    deliverables: '8 product images',
    icon: '◆',
  },
];

const VIDEO_CARD_DATA = [
  { src: UGC_VIDEOS[0], badge: 'UGC Demo', quote: 'Realistic. Relatable.\nMade for conversion.' },
  { src: UGC_VIDEOS[1], badge: null,        quote: 'My go-to serum\nfor glass skin' },
  { src: UGC_VIDEOS[2], badge: null,        quote: 'Feels premium,\nlooks even better.' },
  { src: UGC_VIDEOS[3], badge: null,        quote: 'Clean ingredients.\nReal results.' },
  { src: UGC_VIDEOS[4], badge: null,        quote: 'Hydration that\nactually lasts.' },
];

// ─── Design tokens ─────────────────────────────────────────────────────────────

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG = 'var(--bg)';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

// ─── Avatar placeholder ────────────────────────────────────────────────────

function AvatarPlaceholder({ name, size = 64 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#FF5C00', '#a3e635', '#22d3ee', '#a855f7', '#f59e0b'];
  const colorIdx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors[colorIdx]}33, ${colors[colorIdx]}11)`,
      border: `2px solid ${colors[colorIdx]}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 800, color: colors[colorIdx],
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();

  const [heroMode,      setHeroMode]      = useState<'hire' | 'work'>('work');
  const [genMode,       setGenMode]       = useState<'video' | 'image'>('video');
  const [prompt,        setPrompt]        = useState(VIDEO_PROMPT);
  const [settings,      setSettings]      = useState({ model: 'Seedance 2.0', duration: '6s', aspectRatio: '9:16', resolution: '1080p' });
  const [imgSettings,   setImgSettings]   = useState({ imgModel: 'GPT Image 2.0', imgAspectRatio: '1:1', imgQuality: 'HD' });
  const [openSetting,   setOpenSetting]   = useState<string | null>(null);
  const [selectedImg,   setSelectedImg]   = useState(0);
  const [pricingTab,    setPricingTab]    = useState<'plans' | 'credits'>('plans');

  function setSetting(key: keyof typeof settings, value: string) {
    setSettings(s => ({ ...s, [key]: value }));
    setOpenSetting(null);
  }

  function setImgSetting(key: keyof typeof imgSettings, value: string) {
    setImgSettings(s => ({ ...s, [key]: value }));
    setOpenSetting(null);
  }

  function switchGenMode(m: 'video' | 'image') {
    setGenMode(m);
    setOpenSetting(null);
    setPrompt(m === 'video' ? VIDEO_PROMPT : IMAGE_PROMPT);
  }

  const isHire = heroMode === 'hire';

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
        .setting-dropdown { position: absolute; right: 0; top: calc(100% + 4px); background: var(--card-2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; z-index: 20; min-width: 140px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .setting-option { padding: 10px 14px; font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; transition: background 0.1s; font-family: inherit; }
        .setting-option:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .setting-option-selected { color: ${ORANGE}; }

        .gen-btn { width: 100%; background: ${LIME}; color: #0d0d0d; border: none; border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.15s, transform 0.1s; letter-spacing: -0.01em; font-family: inherit; }
        .gen-btn:hover { background: #b6f23f; transform: translateY(-1px); }

        .video-card { flex-shrink: 0; position: relative; border-radius: 14px; overflow: hidden; background: #111; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: border-color 0.2s, transform 0.2s; }
        .video-card:hover { border-color: rgba(255,255,255,0.2); transform: scale(1.02); }

        .ghost-scroll::-webkit-scrollbar { display: none; }
        .ghost-scroll { scrollbar-width: none; }

        .hire-toggle-btn { flex: 1; padding: 14px 28px; border-radius: 10px; border: none; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: -0.01em; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; white-space: nowrap; }

        .creator-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 18px; padding: 24px 20px 20px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: border-color 0.2s, transform 0.2s; }
        .creator-card:hover { border-color: rgba(255,255,255,0.16); transform: translateY(-2px); }

        .opp-card { background: ${PANEL}; border: 1px solid ${BORDER}; border-radius: 18px; padding: 22px; transition: border-color 0.2s, transform 0.2s; }
        .opp-card:hover { border-color: rgba(163,230,53,0.25); transform: translateY(-2px); }

        @media (max-width: 900px) {
          .hero-grid { flex-direction: column !important; }
          .creators-grid { grid-template-columns: 1fr !important; }
          .opps-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .model-banners { grid-template-columns: 1fr !important; }
          .tools-split { flex-direction: column !important; }
          .tools-panel { width: 100% !important; min-width: 0 !important; }
          .stat-row { flex-wrap: wrap !important; }
          .hire-toggle-btn { padding: 11px 16px !important; font-size: 13px !important; }
          .split-section { flex-direction: column !important; }
          .split-img-col { flex: 0 0 280px !important; min-height: 280px !important; width: 100% !important; }
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <PublicHeader isHomePage activePage="home" />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 · HERO WITH HIRE / WORK TOGGLE                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', paddingTop: 60, minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', overflow: 'hidden', maxWidth: '100%' }}>

        {/* Background video */}
        <video
          src={HERO_BG_VIDEO}
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, zIndex: 0, pointerEvents: 'none' }}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,13,13,0.72) 0%, rgba(13,13,13,0.52) 100%)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 880, margin: '0 auto', padding: '48px 24px 64px', textAlign: 'center' }}>

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 28 }}>
            AI CREATOR NETWORK
          </div>

          {/* Hire / Work toggle */}
          <div style={{ display: 'flex', background: 'var(--card-2)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 4, gap: 4, maxWidth: 480, margin: '0 auto 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            <button
              className="hire-toggle-btn"
              onClick={() => setHeroMode('work')}
              style={{
                background: !isHire ? LIME : 'transparent',
                color: !isHire ? '#0d0d0d' : 'rgba(255,255,255,0.45)',
              }}>
              Find AI Work
            </button>
            <button
              className="hire-toggle-btn"
              onClick={() => setHeroMode('hire')}
              style={{
                background: isHire ? ORANGE : 'transparent',
                color: isHire ? '#fff' : 'rgba(255,255,255,0.45)',
              }}>
              Hire AI Creators
            </button>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 62px)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.06, letterSpacing: '-0.035em', marginBottom: 18 }}>
            {isHire
              ? <>Hire AI creators for <span style={{ color: ORANGE }}>ads, videos,</span> and graphics.</>
              : <>Turn your AI creativity into <span style={{ color: LIME }}>paid work.</span></>
            }
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: 'clamp(14px, 1.3vw, 18px)', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32, maxWidth: 620, margin: '0 auto 32px' }}>
            {isHire
              ? 'Post a project and UGCFire connects you with AI creators who make brand-ready ads, product visuals, UGC-style videos, and marketing content.'
              : 'Create AI ads, build your portfolio, and get invited to paid brand projects from brands and agencies.'
            }
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isHire ? (
              <>
                <Link href="/hire"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ORANGE, color: 'var(--text)', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 11, textDecoration: 'none', transition: 'background 0.15s', boxShadow: '0 4px 24px rgba(255,92,0,0.35)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e65200'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ORANGE; }}>
                  Post a Project
                </Link>
                <Link href="/creators"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: 'var(--text)', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 11, textDecoration: 'none', border: `1px solid ${BORDER}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)'; }}>
                  Browse Creators →
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 11, textDecoration: 'none', transition: 'background 0.15s', boxShadow: '0 4px 24px rgba(163,230,53,0.25)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
                  Start Creating
                </Link>
                <Link href="/opportunities"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: 'var(--text)', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 11, textDecoration: 'none', border: `1px solid ${BORDER}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)'; }}>
                  View Opportunities →
                </Link>
              </>
            )}
          </div>

          {/* Social proof stats */}
          <div className="stat-row" style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 44, paddingTop: 36, borderTop: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
            {[
              { value: '2,400+', label: 'AI Creators' },
              { value: '180+',   label: 'Brand Projects' },
              { value: '$1.2M',  label: 'Creator Earnings' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 · AI TOOLS + REAL BRAND WORK                               */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="tools" style={{ background: '#060606', borderTop: `1px solid ${BORDER}`, padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              AI Tools + Real Brand Work
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.1 }}>
              Create with AI. Get paid by brands.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
              UGCFire gives creators professional AI tools to produce brand-ready ads, then connects that work to real paid brand campaigns.
            </p>
          </div>

          {/* Split: creation panel + video showcase */}
          <div className="tools-split" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* Creation panel */}
            <div className="tools-panel" style={{ width: 340, flexShrink: 0 }} onClick={() => setOpenSetting(null)}>
              <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'visible' }}>

                {/* Video / Image toggle */}
                <div style={{ display: 'flex', gap: 4, padding: '10px 10px 0' }}>
                  {(['video', 'image'] as const).map(m => (
                    <button key={m} onClick={e => { e.stopPropagation(); switchGenMode(m); }}
                      style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.06em',
                        background: genMode === m ? (m === 'video' ? ORANGE : LIME) : 'transparent',
                        color: genMode === m ? (m === 'video' ? '#fff' : '#0d0d0d') : 'rgba(255,255,255,0.35)',
                      }}>
                      {m === 'video' ? '▶ Video' : '⬛ Image'}
                    </button>
                  ))}
                </div>

                {/* Section label */}
                <div style={{ padding: '10px 16px 9px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: genMode === 'video' ? ORANGE : LIME, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                    {genMode === 'video' ? 'Create Video Ad' : 'Create Image Ad'}
                  </span>
                </div>

                <div style={{ padding: 16 }}>

                  {/* Reference Image */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                        {genMode === 'video' ? 'Reference Image' : 'Product / Reference Image'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                      <div style={{ width: 50, height: 50, border: '1.5px dashed var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span style={{ fontSize: 8, color: 'var(--text-faint)', marginTop: 3, textAlign: 'center', lineHeight: 1.3 }}>Upload<br/>PNG, JPG</span>
                      </div>
                      {PRODUCT_IMAGES.map((src, i) => (
                        <div key={i} onClick={e => { e.stopPropagation(); setSelectedImg(i); }}
                          style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: selectedImg === i ? `2px solid ${genMode === 'video' ? ORANGE : LIME}` : '2px solid transparent', flexShrink: 0, position: 'relative' }}>
                          <Image src={src} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                          {selectedImg === i && (
                            <div onClick={e => { e.stopPropagation(); setSelectedImg(-1); }}
                              style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, borderRadius: '50%', background: '#0d0d0d', border: `1px solid rgba(255,255,255,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                              <X size={8} color="var(--text-faint)" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prompt */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Prompt</span>
                    </div>
                    <div style={{ background: 'var(--card-2)', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
                      <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        maxLength={500}
                        rows={3}
                        onClick={e => e.stopPropagation()}
                        style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12, lineHeight: 1.65, padding: '10px 12px', resize: 'none', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 8px', borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{prompt.length}/500</span>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                          Enhance Prompt
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 4, marginBottom: 14 }}>
                    {genMode === 'video'
                      ? VIDEO_SETTING_ROWS.map(row => (
                        <div key={row.key} style={{ position: 'relative' }}>
                          <div className="setting-row"
                            onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === row.key ? null : row.key); }}>
                            <row.icon size={13} color="var(--text-faint)" strokeWidth={1.5} />
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>{row.label}</span>
                            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{settings[row.key]}</span>
                            <ChevronDown size={13} color="var(--text-faint)" style={{ transition: 'transform 0.15s', transform: openSetting === row.key ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                          </div>
                          {openSetting === row.key && (
                            <div className="setting-dropdown" onClick={e => e.stopPropagation()}>
                              {row.options.map(opt => (
                                <div key={opt} className={`setting-option${settings[row.key] === opt ? ' setting-option-selected' : ''}`} onClick={() => setSetting(row.key, opt)}>{opt}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                      : IMAGE_SETTING_ROWS.map(row => (
                        <div key={row.key} style={{ position: 'relative' }}>
                          <div className="setting-row"
                            onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === row.key ? null : row.key); }}>
                            <row.icon size={13} color="var(--text-faint)" strokeWidth={1.5} />
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>{row.label}</span>
                            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{imgSettings[row.key]}</span>
                            <ChevronDown size={13} color="var(--text-faint)" style={{ transition: 'transform 0.15s', transform: openSetting === row.key ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                          </div>
                          {openSetting === row.key && (
                            <div className="setting-dropdown" onClick={e => e.stopPropagation()}>
                              {row.options.map(opt => (
                                <div key={opt} className={`setting-option${imgSettings[row.key] === opt ? ' setting-option-selected' : ''}`} onClick={() => setImgSetting(row.key, opt)}>{opt}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>

                  {/* Generate button */}
                  <button className="gen-btn"
                    onClick={e => { e.stopPropagation(); router.push(genMode === 'video' ? '/signup?mode=video' : '/signup?mode=image'); }}>
                    {genMode === 'video' ? '▶ Generate Video' : '⬛ Generate Image'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 10 }}>
                    <Lock size={11} color="var(--text-faint)" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5 }}>
                      Sign up to generate. AI ads become your portfolio.
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* Video showcase */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: LIME, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>Portfolio Work</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  AI ads made with UGCFire tools. Creators publish work like this to their portfolios and get invited to brand campaigns.
                </p>
              </div>
              <div className="ghost-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                {VIDEO_CARD_DATA.map((card, i) => (
                  <div key={i} className="video-card" style={{ width: 168, flexShrink: 0 }}>
                    {card.badge && (
                      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 3, background: ORANGE, color: 'var(--text)', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>
                        {card.badge}
                      </div>
                    )}
                    <HoverVideoPreview src={card.src} autoPlay loop style={{ height: 290 }} />
                    {card.quote && (
                      <div style={{ position: 'absolute', top: card.badge ? 40 : 12, left: 10, right: 10, fontSize: 11, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, textShadow: '0 1px 6px rgba(0,0,0,0.7)', whiteSpace: 'pre-line', pointerEvents: 'none' }}>
                        {card.quote}
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', padding: '24px 8px 8px', pointerEvents: 'none' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span style={{ fontSize: 9, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{settings.duration}</span>
                        <span style={{ fontSize: 9, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{settings.aspectRatio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href="/signup"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 9, textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
                  Start Creating
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 · HOW UGCFIRE WORKS — CREATORS                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', minHeight: 560 }} className="split-section">

          {/* ── Left: office image ── */}
          <div style={{ flex: '0 0 48%', position: 'relative', minHeight: 480 }} className="split-img-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/images/office.png"
              alt="UGCFire team"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Right-edge fade into section bg */}
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, background: `linear-gradient(to right, transparent, ${BG})`, pointerEvents: 'none' }} />
          </div>

          {/* ── Right: content ── */}
          <div style={{ flex: 1, padding: '64px 48px 64px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, alignSelf: 'flex-start' }}>
              For Creators
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.08 }}>
              How UGCFire Works
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.75, maxWidth: 420 }}>
              Three steps from zero to paid brand campaigns.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
              {[
                { num: '01', icon: Zap,         title: 'Create AI Ads',               desc: 'Use Studio tools to create UGC-style video ads, product images, and brand content.',          color: LIME   },
                { num: '02', icon: Award,        title: 'Build Your Portfolio',        desc: 'Publish your AI ad work to a public creator portfolio and signal availability to brands.',     color: LIME   },
                { num: '03', icon: DollarSign,   title: 'Get Invited to Paid Projects', desc: 'UGCFire matches brands with the right creators based on your portfolio work.',                color: ORANGE },
              ].map(step => (
                <div key={step.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${step.color}18`, border: `1px solid ${step.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <step.icon size={17} color={step.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: step.color, letterSpacing: '0.1em' }}>{step.num}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{step.title}</h3>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link href="/signup"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, padding: '12px 26px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
                Start Creating Free
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 · FOR BRANDS & AGENCIES                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#060606', borderTop: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', minHeight: 560, flexDirection: 'row-reverse' }} className="split-section">

          {/* ── Right: office image (mirrored side for visual variety) ── */}
          <div style={{ flex: '0 0 48%', position: 'relative', minHeight: 480 }} className="split-img-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/images/office.png"
              alt="UGCFire brand team"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Left-edge fade into section bg */}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, transparent, #060606)', pointerEvents: 'none' }} />
          </div>

          {/* ── Left: content ── */}
          <div style={{ flex: 1, padding: '64px 40px 64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, alignSelf: 'flex-start' }}>
              For Brands & Agencies
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.08 }}>
              AI-made ads. Vetted creators.<br />Brand-ready results.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.75, maxWidth: 420 }}>
              Post a project, review AI creator work, and approve brand-ready ads — all in one place.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
              {[
                { num: '01', icon: Briefcase, title: 'Post a Project',            desc: 'Describe your campaign, set your budget, and specify deliverables. UGCFire matches you with the right creators.',  color: ORANGE },
                { num: '02', icon: Users,     title: 'Review AI Creator Work',    desc: 'Browse creator applications and portfolio samples. Select the creators whose style fits your brand.',            color: ORANGE },
                { num: '03', icon: Award,     title: 'Approve Ready-to-Test Ads', desc: 'Receive final AI-made ad deliverables. Review, request revisions, and approve brand-ready content.',            color: LIME   },
              ].map(step => (
                <div key={step.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${step.color}18`, border: `1px solid ${step.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <step.icon size={17} color={step.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: step.color, letterSpacing: '0.1em' }}>{step.num}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{step.title}</h3>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link href="/signup?role=company"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 26px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s', boxShadow: '0 4px 20px rgba(255,92,0,0.3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e65200'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ORANGE; }}>
                Post a Project
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 · FEATURED CREATORS                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                AI Creator Network
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Featured AI Creators
              </h2>
            </div>
            <Link href="/creators"
              style={{ fontSize: 13, color: LIME, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
              See all creators →
            </Link>
          </div>

          <div className="creators-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {MOCK_CREATORS.map(creator => (
              <div key={creator.id} className="creator-card">
                {/* Avatar */}
                <div style={{ position: 'relative', marginBottom: 14 }}>
                  {creator.available && (
                    <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${LIME}`, boxShadow: `0 0 12px rgba(163,230,53,0.35)` }} />
                  )}
                  {creator.avatar ? (
                    <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={creator.avatar} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ) : (
                    <AvatarPlaceholder name={creator.name} size={72} />
                  )}
                </div>

                {/* Name + role */}
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>{creator.name}</div>
                <div style={{ fontSize: 12, color: ORANGE, fontWeight: 600, marginBottom: 8 }}>{creator.role}</div>

                {/* Available badge */}
                {creator.available && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: LIME, letterSpacing: '0.04em', marginBottom: 10 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: LIME, boxShadow: `0 0 4px ${LIME}` }} />
                    Open to Work
                  </div>
                )}

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 14 }}>
                  {creator.skills.map(s => (
                    <span key={s} style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '3px 9px', borderRadius: 20 }}>{s}</span>
                  ))}
                </div>

                {/* Portfolio count */}
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 14 }}>
                  {creator.portfolioCount} portfolio pieces
                </div>

                <Link href={`/creators/${creator.username}`}
                  style={{ display: 'block', width: '100%', textAlign: 'center', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 12, padding: '9px', borderRadius: 9, textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
                  View Portfolio
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6 · FEATURED OPPORTUNITIES                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#060606', borderTop: `1px solid ${BORDER}`, padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                Brand Projects
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Featured Opportunities
              </h2>
            </div>
            <Link href="/opportunities"
              style={{ fontSize: 13, color: ORANGE, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
              View all opportunities →
            </Link>
          </div>

          <div className="opps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {MOCK_OPPORTUNITIES.map(opp => (
              <div key={opp.id} className="opp-card">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {opp.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', lineHeight: 1.2, marginBottom: 4 }}>{opp.title}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '2px 9px', borderRadius: 20, display: 'inline-block' }}>{opp.category}</div>
                  </div>
                </div>

                {/* Meta info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarSign size={13} color={LIME} strokeWidth={2} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: LIME }}>${opp.payMin}–${opp.payMax}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>per project</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={13} color="rgba(255,255,255,0.35)" strokeWidth={2} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Deadline: {opp.deadline}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={13} color="rgba(255,255,255,0.35)" strokeWidth={2} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opp.deliverables}</span>
                  </div>
                </div>

                <Link href="/opportunities"
                  style={{ display: 'block', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: 'var(--text)', fontWeight: 600, fontSize: 13, padding: '9px', borderRadius: 9, textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.1)'; el.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = BORDER; }}>
                  View Project →
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 · FINAL CTA                                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: '80px 24px 88px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 24 }}>
            AI Creator Network
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.035em', lineHeight: 1.08, marginBottom: 18 }}>
            Ready to create,<br />
            build, and <span style={{ color: LIME }}>get paid?</span>
          </h2>

          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Join thousands of AI creators building portfolios and getting paid brand campaigns on UGCFire.ai.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 11, textDecoration: 'none', transition: 'background 0.15s', boxShadow: '0 4px 24px rgba(163,230,53,0.25)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
              Start Creating Free
            </Link>
            <Link href="/signup?role=company"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ORANGE, color: 'var(--text)', fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 11, textDecoration: 'none', transition: 'background 0.15s', boxShadow: '0 4px 24px rgba(255,92,0,0.25)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e65200'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ORANGE; }}>
              Post a Project
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 8 · PRICING                                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ background: '#060606', borderTop: `1px solid ${BORDER}`, padding: '72px 20px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12 }}>Simple pricing for AI creators</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Monthly credits to create AI ads and build your portfolio. Add more anytime.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
            <div style={{ display: 'flex', background: 'var(--card-2)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, gap: 4 }}>
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

          {pricingTab === 'plans' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 960, margin: '0 auto' }}>
              {[
                { name: 'Starter',  price: 29,  credits: 300,   badge: null,           desc: 'Start your AI creator portfolio', color: 'var(--border)',   btnColor: 'var(--card-2)', btnText: 'var(--text)', border: BORDER },
                { name: 'Creator',  price: 99,  credits: 1500,  badge: 'Most Popular', desc: 'Build and grow your portfolio',   color: 'rgba(163,230,53,0.06)',    btnColor: LIME,      btnText: '#0d0d0d', border: 'rgba(163,230,53,0.35)' },
                { name: 'Pro',      price: 199, credits: 4000,  badge: null,           desc: 'High-volume portfolio creation',  color: 'rgba(255,92,0,0.05)',      btnColor: ORANGE,    btnText: 'var(--text)', border: 'rgba(255,92,0,0.25)' },
              ].map(plan => (
                <div key={plan.name} style={{ background: plan.color, border: `1px solid ${plan.border}`, borderRadius: 20, padding: '28px 26px 24px', position: 'relative',
                  boxShadow: plan.badge ? '0 0 40px rgba(163,230,53,0.08)' : 'none' }}>
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: LIME, color: '#0d0d0d', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em', lineHeight: 1 }}>${plan.price}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-faint)', paddingBottom: 6 }}>/mo</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{plan.credits.toLocaleString()} credits</span> / month
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
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => router.push('/signup')}
                    style={{ width: '100%', background: plan.btnColor, color: plan.btnText, border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}>
                    Start {plan.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {pricingTab === 'credits' && (
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { credits: 250,  price: 15,  badge: null,           savings: null },
                { credits: 1000, price: 49,  badge: null,           savings: null },
                { credits: 2500, price: 99,  badge: 'Most Popular', savings: '33% more credits' },
                { credits: 5000, price: 179, badge: 'Best Value',   savings: '40% more credits' },
              ].map(pack => (
                <div key={pack.credits} style={{ display: 'flex', alignItems: 'center', background: 'var(--card)', border: `1px solid ${pack.badge ? 'rgba(163,230,53,0.25)' : BORDER}`, borderRadius: 16, padding: '18px 22px', gap: 16,
                  boxShadow: pack.badge ? '0 0 24px rgba(163,230,53,0.06)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{pack.credits.toLocaleString()} credits</span>
                      {pack.badge && (
                        <span style={{ fontSize: 10, fontWeight: 800, background: pack.badge === 'Best Value' ? ORANGE : LIME, color: pack.badge === 'Best Value' ? '#fff' : '#0d0d0d', padding: '3px 9px', borderRadius: 20, letterSpacing: '0.05em' }}>
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>~{Math.floor(pack.credits / 75)} videos</span>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>~{Math.floor(pack.credits / 4)} images</span>
                      {pack.savings && <span style={{ fontSize: 12, color: LIME, fontWeight: 600 }}>{pack.savings}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>${pack.price}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>one-time</div>
                  </div>
                  <button onClick={() => router.push('/signup')}
                    style={{ background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#b6f23f'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = LIME; }}>
                    Buy Credits
                  </button>
                </div>
              ))}
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
                Add credits anytime · Great for extra generations · No subscription required
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION · AI MODELS                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 16 }}>
              AI Models
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.1 }}>
              Powered by leading AI models
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              Choose your AI model in Studio. Create realistic UGC videos and high-quality product images with the models built for modern creators.
            </p>
          </div>

          {/* Model cards — full-width horizontal, stacks on mobile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ── Seedance 2.0 ── VIDEO */}
            <div style={{ background: 'linear-gradient(135deg, #0e1b25 0%, #080f14 100%)', border: '1px solid rgba(34,211,238,0.16)', borderRadius: 20, display: 'flex', overflow: 'hidden', minHeight: 190, position: 'relative' }}>
              {/* Left image */}
              <div style={{ width: 200, flexShrink: 0, background: 'linear-gradient(135deg, #0d2233 0%, #061520 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, borderRight: '1px solid rgba(34,211,238,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/seedance_2_logo_transparent_original_edges.png" alt="Seedance 2.0" style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 140 }} />
              </div>
              {/* Right content */}
              <div style={{ flex: 1, padding: '26px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.18)', borderRadius: 20, padding: '3px 10px', fontSize: 9.5, fontWeight: 700, color: '#22d3ee', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 4px #22d3ee' }} />
                    Available for everyone
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, background: '#22d3ee', color: '#061520', borderRadius: 5, padding: '2px 7px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Video</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>Seedance 2.0</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, maxWidth: 440 }}>
                  Realistic AI video generation for UGC ads, product demos, and creator-style content.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 11, color: 'rgba(34,211,238,0.6)', fontWeight: 600 }}>54 credits / video</span>
                  <button onClick={() => router.push('/signup?mode=video')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.28)', color: '#22d3ee', padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,211,238,0.18)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,211,238,0.10)'; }}>
                    &#9654; Create Video
                  </button>
                </div>
              </div>
            </div>

            {/* ── GPT Image 2.0 ── IMAGE */}
            <div style={{ background: 'linear-gradient(135deg, #111b0e 0%, #090f07 100%)', border: '1px solid rgba(163,230,53,0.18)', borderRadius: 20, display: 'flex', overflow: 'hidden', minHeight: 190, position: 'relative' }}>
              {/* Left image */}
              <div style={{ width: 200, flexShrink: 0, background: '#050505', overflow: 'hidden', borderRight: '1px solid rgba(163,230,53,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/GPT%202.0.png" alt="GPT Image 2.0" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              {/* Right content */}
              <div style={{ flex: 1, padding: '26px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 9.5, fontWeight: 700, color: LIME, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: LIME, boxShadow: `0 0 4px ${LIME}` }} />
                    New image model
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, background: LIME, color: '#090f07', borderRadius: 5, padding: '2px 7px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Image</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>GPT Image 2.0</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, maxWidth: 440 }}>
                  Clean product visuals, lifestyle images, apparel mockups, and UGC-style photos.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 11, color: `rgba(163,230,53,0.6)`, fontWeight: 600 }}>8 credits / image</span>
                  <button onClick={() => router.push('/signup?mode=image')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.28)', color: LIME, padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,230,53,0.18)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,230,53,0.10)'; }}>
                    &#9633; Create Image
                  </button>
                </div>
              </div>
            </div>

            {/* ── Nano Banana ── IMAGE */}
            <div style={{ background: 'linear-gradient(135deg, #1a1800 0%, #0e0d00 100%)', border: '1px solid rgba(250,204,21,0.18)', borderRadius: 20, display: 'flex', overflow: 'hidden', minHeight: 190, position: 'relative' }}>
              {/* Left image */}
              <div style={{ width: 200, flexShrink: 0, background: '#111100', overflow: 'hidden', borderRight: '1px solid rgba(250,204,21,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/Nano.jpg" alt="Nano Banana" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              {/* Right content */}
              <div style={{ flex: 1, padding: '26px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 9.5, fontWeight: 700, color: '#facc15', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#facc15', boxShadow: '0 0 4px #facc15' }} />
                    Fast &amp; affordable
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, background: '#facc15', color: '#0e0d00', borderRadius: 5, padding: '2px 7px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Image</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>Nano Banana</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, maxWidth: 440 }}>
                  Fast product mockups, ad variations, social images, and creative testing at scale.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 11, color: 'rgba(250,204,21,0.6)', fontWeight: 600 }}>4 credits / image</span>
                  <button onClick={() => router.push('/signup?mode=image')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.28)', color: '#facc15', padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,204,21,0.18)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,204,21,0.10)'; }}>
                    &#9633; Create Image
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom note */}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-faint)', marginTop: 28 }}>
            Model options available in Studio · Choose your model per generation
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <SiteFooter />

    </>
  );
}
