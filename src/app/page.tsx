'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// ─── Media assets (reusing all existing UGCFire content) ──────────────────────

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';

const HERO_VIDEOS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260429_020651_1d9ae862-a0c1-498e-9296-651fb43dc88c%20(1).mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260504_162546_98fa6dc2-bf22-4a86-9bff-5ee8c96948ed.mp4',
];

const UGC_VIDEOS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-style-ve_2891981897.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-energetic-ugc-fitne_2891987468.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugcstyle-tes_2892041483.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_make-ugc-video-with-this-_2892034073.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-cinematic-ugc-testi_2892073891.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-ugcstyle-vertical-s_2892334025.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-selfiest_2892474678.mp4',
];

const PRODUCT_IMAGES = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/be7f70f4-139f-4cb1-bcaa-964d79dc6a9e.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/a9a7a9fd-e332-4750-bdd9-859ab5f45948.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5e1cf241-a837-4b51-a46c-f0fb5d643f1f.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/d0702dbc-8d8e-4f40-b4e7-7aa4d7b98cbc.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/video/Site%20reels/images/097881dc-4c18-4c17-8bf4-b106b302d197.png',
];

const UGC_IMAGES = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/02952be0-8ac1-4d5d-98b6-daa52cb4fd08.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/010aa1e6-c801-4299-85c5-62b7c7462e31.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/6038b54b-e507-44e5-a160-691b1788f55a.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/9491597e-5c30-40cc-92cb-e606b4d0a037.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/df522445-4f8c-4c49-9dba-76b8131f0ada.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/6dacd0a5-e10c-4eaa-b6c2-ab1fae07726e.png',
];

// ─── Small reusable components ─────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '22px 0', textAlign: 'left' }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: open ? '#FF5C00' : 'rgba(255,255,255,0.5)', fontSize: 22, flexShrink: 0, transition: 'transform 0.2s, color 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', fontWeight: 300 }}>+</span>
      </button>
      {open && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, paddingBottom: 22, marginTop: -4 }}>{a}</p>}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVidIdx, setHeroVidIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroVidIdx(v => (v + 1) % HERO_VIDEOS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const FIRE = '#FF5C00';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080808; color: #f2f0eb; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        ::selection { background: rgba(255,92,0,0.25); }

        .fire-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #FF5C00; color: #fff; border: none;
          padding: 14px 32px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 0 0 rgba(255,92,0,0);
        }
        .fire-btn:hover { background: #ff7022; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,92,0,0.35); }

        .ghost-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 13px 26px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); color: #fff; }

        .section { padding: 96px 24px; max-width: 1160px; margin: 0 auto; }
        .eyebrow { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #FF5C00; margin-bottom: 14px; }

        .mixed-heading { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(36px, 5vw, 60px); font-weight: 700; color: #fff; line-height: 1.1; letter-spacing: -0.02em; }
        .mixed-heading em { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 400; color: rgba(255,255,255,0.85); letter-spacing: 0; }

        .hero-heading { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(40px, 6.5vw, 76px); font-weight: 700; line-height: 1.08; color: #fff; letter-spacing: -0.025em; }
        .hero-heading em { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 400; color: rgba(255,255,255,0.9); font-size: 1.05em; letter-spacing: 0; }

        /* Phone card */
        .phone-card { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; position: relative; }
        .phone-badge { position: absolute; top: 8px; left: 8px; background: rgba(10,10,10,0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 4px 10px; font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.04em; z-index: 2; }
        .phone-active-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.6); z-index: 2; }

        /* Scroll carousels */
        .scroll-left { display: flex; gap: 14px; animation: scrollL 28s linear infinite; width: max-content; }
        .scroll-right { display: flex; gap: 14px; animation: scrollR 32s linear infinite; width: max-content; }
        @keyframes scrollL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scrollR { from { transform: translateX(-50%); } to { transform: translateX(0); } }

        /* Stat block */
        .stat-block { text-align: center; }
        .stat-block .num { font-family: 'Syne', sans-serif; font-size: clamp(36px,5vw,56px); font-weight: 800; color: #fff; line-height: 1; }
        .stat-block .num em { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 400; }
        .stat-block .lbl { font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 8px; }

        /* Feature card */
        .feat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; transition: border-color 0.25s; }
        .feat-card:hover { border-color: rgba(255,92,0,0.3); }

        /* Pricing */
        .plan-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 36px 28px; display: flex; flex-direction: column; }
        .plan-card.popular { background: rgba(255,92,0,0.06); border-color: rgba(255,92,0,0.35); }

        /* Step card */
        .step-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; }

        /* Mobile nav */
        .mob-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; z-index: 98; background: rgba(8,8,8,0.97); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 24px; flex-direction: column; gap: 16px; }
        .mob-menu.open { display: flex; }

        @media(max-width:768px){
          .nav-links-desk { display: none !important; }
          .ham { display: flex !important; }
          .hero-center { flex-direction: column !important; }
          .hero-outputs { gap: 10px !important; }
          .hero-output-card { width: 100px !important; }
          .trust-cards { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .section { padding: 64px 20px; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: scrolled ? 'rgba(8,8,8,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={120} height={36} style={{ objectFit: 'contain', height: 32, width: 'auto' }} unoptimized />
        </a>
        <div className="nav-links-desk" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[['How It Works','#how-it-works'],['Pricing','#pricing'],['Examples','#examples'],['FAQ','#faq']].map(([l,h]) => (
            <a key={l} href={h} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.45)')}
            >{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/login" className="ghost-btn" style={{ padding: '10px 20px', fontSize: 13 }}>Login / Signup</a>
          {/* Hamburger */}
          <button className="ham" onClick={()=>setMenuOpen(m=>!m)}
            style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {[0,1,2].map(i=><span key={i} style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu${menuOpen?' open':''}`}>
        {[['How It Works','#how-it-works'],['Pricing','#pricing'],['Examples','#examples'],['FAQ','#faq']].map(([l,h])=>(
          <a key={l} href={h} onClick={()=>setMenuOpen(false)} style={{ color:'rgba(255,255,255,0.7)', fontSize:16, textDecoration:'none', fontWeight:500 }}>{l}</a>
        ))}
        <a href="#" className="fire-btn" style={{ marginTop:8 }} onClick={()=>setMenuOpen(false)}>Start Creating</a>
      </div>

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 64px', overflow: 'hidden', textAlign: 'center' }}>
        {/* Rotating background videos */}
        {HERO_VIDEOS.map((src, i) => (
          <video key={src} autoPlay muted loop playsInline src={src} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            opacity: heroVidIdx === i ? 0.45 : 0,
            transition: 'opacity 1.2s ease',
          }} />
        ))}
        {/* Orange glow overlay (matches .com) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 60% at 72% 38%, rgba(255,92,0,0.22) 0%, transparent 70%)' }} />
        {/* Dark gradient — bottom fade so content reads cleanly */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.0) 40%, rgba(8,8,8,0.92) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, width: '100%' }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>DIY AI Content Generator for Brands</div>

          <h1 className="hero-heading" style={{ marginBottom: 24 }}>
            Create 10x More<br />Branded UGC <em>With AI</em>
          </h1>

          <p style={{ fontSize: 'clamp(15px,1.4vw,18px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 10, maxWidth: 540, margin: '0 auto 20px' }}>
            Upload your product, logo, and brand style.<br />
            Generate images, videos, hooks, and content assets in minutes.
          </p>

          {/* Process breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
            {['Upload Product', 'Add Brand', 'Generate Content'].map((s, i, a) => (
              <React.Fragment key={s}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{s}</span>
                {i < a.length - 1 && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>›</span>}
              </React.Fragment>
            ))}
          </div>

          <a href="#" className="fire-btn" style={{ fontSize: 16, padding: '15px 40px', marginBottom: 48 }}>
            ✦ Start Creating
          </a>
        </div>

        {/* Hero centerpiece: product → outputs */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 720, marginTop: 8 }}>
          {/* Central product card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0, position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 22, overflow: 'hidden', backdropFilter: 'blur(16px)', boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.6)', width: 260 }}>
              {/* Text header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Your Brand</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Product + Logo + Style</div>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.7)', flexShrink: 0 }} />
              </div>
              {/* Large product image below */}
              <div style={{ width: '100%', height: 280 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/images/Makeupimage.jpg"
                  alt="Your product"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* SVG connecting lines — white */}
          <div style={{ position: 'relative', height: 80 }}>
            <svg viewBox="0 0 720 80" preserveAspectRatio="none" style={{ width: '100%', height: 80 }}>
              <path d="M360 0 C360 30 140 50 140 80" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
              <path d="M360 0 C360 40 360 40 360 80" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
              <path d="M360 0 C360 30 580 50 580 80" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
              <circle cx="140" cy="80" r="5" fill="#fff" opacity="0.7"/>
              <circle cx="360" cy="80" r="5" fill="#fff" opacity="0.9"/>
              <circle cx="580" cy="80" r="5" fill="#fff" opacity="0.7"/>
            </svg>
          </div>

          {/* Three output phone cards */}
          <div className="hero-outputs" style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'flex-start' }}>
            {[UGC_VIDEOS[0], UGC_VIDEOS[1], UGC_VIDEOS[2]].map((src, i) => (
              <div key={i} className="hero-output-card" style={{ position: 'relative', flex: '0 0 auto', width: 160, transform: i === 1 ? 'scale(1.06)' : 'scale(0.96)', zIndex: i === 1 ? 3 : 2 }}>
                <div className="phone-card" style={{ borderRadius: 18 }}>
                  {i === 1 && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#FF5C00', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.06em', zIndex: 4, whiteSpace: 'nowrap' }}>GENERATED</div>}
                  <div className="phone-badge">{['Image Output','Video Output','Content Asset'][i]}</div>
                  <div className="phone-active-dot" />
                  <video src={src} autoPlay muted loop playsInline style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                  {['AI Image','UGC Video','Hook Asset'][i]}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
            Generated in minutes from one brand upload
          </p>
        </div>
      </section>

      {/* ── SECTION 2: TRUST / RESULTS ──────────────────────────────────────── */}
      <section id="examples" style={{ background: '#0c0c0c', padding: '96px 0' }}>
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="mixed-heading" style={{ marginBottom: 16 }}>
              Trusted By Brands Creating More <em>Content With AI</em>
            </div>
          </div>

          {/* 3 testimonial cards */}
          <div className="trust-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 56 }}>
            {[
              { name: 'Brand Founder', role: 'Ecommerce Brand', quote: 'I used to spend thousands on content teams. Now I upload my product and have a full content batch in under an hour.', img: 'https://i.pravatar.cc/80?img=68' },
              { name: 'Marketing Lead', role: 'DTC Growth Team', quote: 'The image quality is insane. Couldn\'t tell these apart from a photoshoot. Took me 10 minutes.', img: 'https://i.pravatar.cc/80?img=32' },
              { name: 'Agency Owner', role: 'Client Content Partner', quote: 'We\'re testing 5x more hooks every week. Generating a new script takes seconds. Changed how we run ads completely.', img: 'https://i.pravatar.cc/80?img=12' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                {/* Preview image strip */}
                <div style={{ height: 160, position: 'relative', background: '#111', overflow: 'hidden' }}>
                  <Image src={PRODUCT_IMAGES[i]} alt="content preview" fill style={{ objectFit: 'cover', opacity: 0.7 }} unoptimized />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))' }} />
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} alt={t.name} width={36} height={36} style={{ borderRadius: '50%', border: '2px solid rgba(255,92,0,0.4)' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>&ldquo;{t.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { num: '10x', numSuffix: ' Faster', lbl: 'Content Creation vs. Traditional' },
              { num: 'Minutes', lbl: 'Average Generation Time' },
              { num: 'Multi-Format', lbl: 'Images, Videos, Scripts, Hooks' },
            ].map((s, i) => (
              <div key={i} className="stat-block" style={{ background: '#0c0c0c', padding: '40px 24px' }}>
                <div className="num">{s.num}<em>{s.numSuffix ?? ''}</em></div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: "AI LOOKS FAKE" ─────────────────────────────────────── */}
      <section style={{ padding: '96px 0', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', padding: '0 24px', marginBottom: 56, maxWidth: 700, margin: '0 auto 56px' }}>
          <div className="mixed-heading" style={{ fontSize: 'clamp(32px,5vw,58px)', marginBottom: 16 }}>
            The &ldquo;AI Content Looks Fake&rdquo; Era <em>Is Over.</em>
          </div>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Create content that feels real, branded, and ready to publish.
          </p>
        </div>

        {/* Video scroll row 1 — left */}
        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="scroll-left">
            {[...UGC_VIDEOS, ...UGC_VIDEOS].map((src, i) => (
              <div key={i} className="phone-card" style={{ width: 160, flexShrink: 0, borderRadius: 16 }}>
                <video src={src} autoPlay muted loop playsInline style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Image scroll row 2 — right */}
        <div style={{ overflow: 'hidden' }}>
          <div className="scroll-right">
            {[...UGC_IMAGES, ...UGC_IMAGES].map((src, i) => (
              <div key={i} style={{ width: 220, height: 260, flexShrink: 0, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
                <Image src={src} alt={`content ${i}`} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FEATURE GRID ─────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0a', padding: '96px 0' }}>
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow">Features</div>
            <div className="mixed-heading">Built To Generate Better <em>Brand Content</em></div>
          </div>

          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                title: 'Brand-Consistent Output',
                desc: 'Keep your content aligned with your logo, product, and visual style — every single generation.',
                media: { type: 'img' as const, src: PRODUCT_IMAGES[0] },
              },
              {
                title: 'Multi-Format Content',
                desc: 'Generate images, hooks, UGC-style visuals, and video-ready assets from one brand upload.',
                media: { type: 'video' as const, src: UGC_VIDEOS[3] },
              },
              {
                title: 'Fast Content Creation',
                desc: 'Go from upload to usable, ready-to-post content in minutes — not days.',
                media: { type: 'video' as const, src: UGC_VIDEOS[4] },
              },
              {
                title: 'Studio-Ready Workflow',
                desc: 'Save, organize, and reuse all your generated assets in one place. Built for speed.',
                media: { type: 'img' as const, src: PRODUCT_IMAGES[3] },
              },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ position: 'relative', height: 240, background: '#111', overflow: 'hidden' }}>
                  {f.media.type === 'video'
                    ? <video src={f.media.src} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <Image src={f.media.src} alt={f.title} fill style={{ objectFit: 'cover' }} unoptimized />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))' }} />
                </div>
                <div style={{ padding: '24px 28px 28px' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>
                    {f.title}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '96px 0' }}>
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow">How It Works</div>
            <div className="mixed-heading">Generate Content <em>In Minutes</em></div>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              {
                num: '1', title: 'Upload Product + Brand',
                desc: 'Add your product, logo, website, and brand style once. UGCFire.ai learns your identity.',
                media: { type: 'img' as const, src: PRODUCT_IMAGES[1] },
              },
              {
                num: '2', title: 'Pick Content Type',
                desc: 'Choose images, UGC-style visuals, hooks, and content formats from your brand dashboard.',
                media: { type: 'video' as const, src: UGC_VIDEOS[1] },
              },
              {
                num: '3', title: 'Generate + Save',
                desc: 'Create multiple assets fast and save them into your Studio — organized and ready to use.',
                media: { type: 'video' as const, src: UGC_VIDEOS[5] },
              },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div style={{ position: 'relative', height: 280, background: '#111', overflow: 'hidden' }}>
                  {s.media.type === 'video'
                    ? <video src={s.media.src} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <Image src={s.media.src} alt={s.title} fill style={{ objectFit: 'cover' }} unoptimized />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))' }} />
                  {/* Step number overlay */}
                  <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: "'Cormorant Garamond', serif", fontSize: 72, fontWeight: 400, color: 'rgba(255,255,255,0.12)', lineHeight: 1, userSelect: 'none' }}>{s.num}</div>
                  {/* Dot indicators (like Adsper) */}
                  <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                    {[0,1,2].map(d=><div key={d} style={{ width: d===i?20:6, height: 6, borderRadius: 999, background: d===i?'#FF5C00':'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />)}
                  </div>
                </div>
                <div style={{ padding: '22px 24px 26px' }}>
                  <div style={{ fontSize: 11, color: '#FF5C00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Step {s.num}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="#" className="fire-btn">✦ Start Creating</a>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" style={{ background: '#0a0a0a', padding: '96px 0' }}>
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="mixed-heading">Transparent <em>Pricing</em></div>
          </div>

          <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              {
                name: 'Starter', price: 29, period: 'Per Month',
                features: ['25 content generations','Brand kit upload','AI image outputs','Basic Studio access','Cancel anytime'],
                badge: null,
              },
              {
                name: 'Growth', price: 99, period: 'Per Month',
                features: ['150 content generations','Brand kit upload','Images + content outputs','Studio access','Priority processing'],
                badge: 'Most Popular',
              },
              {
                name: 'Pro', price: 299, period: 'Per Month',
                features: ['500 content generations','Full brand kit','Images + content + advanced outputs','Studio access','Team-ready workflow'],
                badge: null,
              },
            ].map((p, i) => (
              <div key={i} className={`plan-card${p.badge?' popular':''}`}>
                {p.badge && (
                  <div style={{ position: 'absolute' }}>
                    <div style={{ background: '#FF5C00', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 20, marginBottom: 16, display: 'inline-block' }}>{p.badge}</div>
                  </div>
                )}
                <div style={{ marginTop: p.badge ? 32 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>${p.price}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>{p.period}</div>
                </div>
                <div style={{ flex: 1 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <a href="#" className="fire-btn" style={{ width: '100%', display: 'flex' }}>Start Creating</a>
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>No credit card required. Cancel Anytime.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="mixed-heading">Frequently Asked <em>Questions</em></div>
          </div>
          {[
            { q: 'What can I generate with UGCFire.ai?', a: 'You can generate AI product images, UGC-style short-form videos, hooks, captions, and ad scripts — all matched to your specific brand, product, and audience.' },
            { q: 'Can I upload my logo and product images?', a: 'Yes. You upload your product photos, logo, website URL, and brand guidelines once. UGCFire.ai uses them to keep every generation on-brand.' },
            { q: 'Will the content match my brand style?', a: 'Yes. Every generation is grounded in your brand kit. Colors, visual style, and product identity are preserved across all output formats.' },
            { q: 'Can I use the generated content for my business?', a: 'Absolutely. All generated content is yours to use for paid ads, organic posts, landing pages, and any other commercial purpose — no licensing restrictions.' },
            { q: 'Do I need design experience?', a: 'No. UGCFire.ai is built for founders, marketers, and brand managers — not designers. Upload your assets, pick a style, click generate.' },
            { q: 'Can I save my generated content?', a: 'Yes. Everything you generate lives in your Studio — organized by type, ready to download, share, or use in your next campaign.' },
          ].map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}

        </div>
      </section>

      {/* ── SECTION 8: FINAL CTA ────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a', padding: '96px 24px' }}>
        {/* Left and right floating video cards */}
        <div style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%) rotate(-6deg)', width: 140, borderRadius: 16, overflow: 'hidden', opacity: 0.5, pointerEvents: 'none' }}>
          <video src={UGC_VIDEOS[5]} autoPlay muted loop playsInline style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ position: 'absolute', left: 180, top: '50%', transform: 'translateY(-70%) rotate(-3deg)', width: 120, borderRadius: 16, overflow: 'hidden', opacity: 0.35, pointerEvents: 'none' }}>
          <Image src={UGC_IMAGES[0]} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
          <div style={{ height: 200 }} />
        </div>
        <div style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%) rotate(6deg)', width: 140, borderRadius: 16, overflow: 'hidden', opacity: 0.5, pointerEvents: 'none' }}>
          <video src={UGC_VIDEOS[6]} autoPlay muted loop playsInline style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ position: 'absolute', right: 180, top: '50%', transform: 'translateY(-30%) rotate(3deg)', width: 120, borderRadius: 16, overflow: 'hidden', opacity: 0.35, pointerEvents: 'none' }}>
          <Image src={UGC_IMAGES[3]} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
          <div style={{ height: 200 }} />
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div className="mixed-heading" style={{ marginBottom: 20 }}>
            Ready To Create More UGC <em>With AI?</em>
          </div>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 36 }}>
            Turn one product and one brand kit into a stream of content assets — images, videos, hooks, and scripts in minutes.
          </p>
          <a href="#" className="fire-btn" style={{ fontSize: 16, padding: '16px 44px' }}>✦ Start Creating</a>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#060606', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 32px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* Brand col */}
            <div>
              <Image src={LOGO_URL} alt="UGCFire.ai" width={120} height={36} style={{ objectFit: 'contain', height: 32, width: 'auto', marginBottom: 16 }} unoptimized />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, maxWidth: 240, marginTop: 12 }}>
                UGCFire.ai helps brands generate branded UGC-style content faster with AI.
              </p>
            </div>
            {/* Product */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 16 }}>Product</div>
              {['How It Works','Features','Pricing','FAQ'].map(l=>(
                <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                >{l}</a>
              ))}
            </div>
            {/* Social */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 16 }}>Social</div>
              {[['Instagram','https://www.instagram.com/ugcfire'],['TikTok','https://www.tiktok.com/@ugcfire'],['X','https://x.com/ugcfire']].map(([l,h])=>(
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                >{l}</a>
              ))}
            </div>
            {/* Legal */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 16 }}>Legal</div>
              {[['Terms of Service','/terms'],['Privacy Policy','/privacy']].map(([l,h])=>(
                <a key={l} href={h} style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                >{l}</a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© 2026 UGCFire.ai. All rights reserved.</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>Built for brands that move fast 🔥</span>
          </div>
        </div>
      </footer>
    </>
  );
}
