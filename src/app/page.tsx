'use client';

import Image from "next/image";
import React, { useState, useEffect, type CSSProperties } from "react";
import { Upload, Image as ImageIcon, Video, Layers, Archive, CreditCard, MessageSquare, Inbox, Star, Building2, Users, Brain, TrendingUp, Palmtree, Sun, Wand2, User } from "lucide-react";
import FireButton from "@/components/FireButton";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

interface StatCardProps {
  value: string;
  label?: string;
  delta?: string;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
}

interface TestimonialProps {
  quote: string;
  name: string;
  handle: string;
  revenue: string;
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: "🔥",
    title: "Upload Your Brand",
    desc: "Drop in your product photos, logo, website, and brand voice. UGCFire.ai learns your style in minutes.",
  },
  {
    icon: "⚡",
    title: "Generate Product Images",
    desc: "Create clean, high-quality branded visuals with one click — ready for ads, organic posts, and landing pages.",
  },
  {
    icon: "📝",
    title: "Write UGC Scripts & Hooks",
    desc: "AI-generated hooks, scripts, and caption ideas matched to your brand voice and offer.",
  },
  {
    icon: "🎬",
    title: "Turn Images Into Videos",
    desc: "Animate your product images into short-form UGC-style videos built for TikTok, Reels, and Shorts.",
  },
  {
    icon: "🗂️",
    title: "Save Everything in Studio",
    desc: "Your content library lives in the Studio — organized, labeled, and ready to download or publish.",
  },
  {
    icon: "🔄",
    title: "Generate New Content Daily",
    desc: "No more creative blocks. Keep your ad account fresh with new hooks, images, and videos whenever you need them.",
  },
];

const TESTIMONIALS_NEW = [
  {
    quote: "I used to spend thousands on content teams. Now I upload my product and have a full content batch in under an hour.",
    name: "Brand Founder",
    handle: "Ecommerce Brand",
    label: "UGCFire.ai user",
    avatar: "https://i.pravatar.cc/96?img=68",
  },
  {
    quote: "The image quality is insane. I couldn't tell these apart from a professional photoshoot. And it took me 10 minutes.",
    name: "Marketing Lead",
    handle: "Growth Team",
    label: "UGCFire.ai user",
    avatar: "https://i.pravatar.cc/96?img=32",
  },
  {
    quote: "We're testing 5x more hooks every week because generating a new script takes seconds. It's completely changed how we run ads.",
    name: "Agency Owner",
    handle: "Client Content Partner",
    label: "UGCFire.ai user",
    avatar: "https://i.pravatar.cc/96?img=12",
  },
];

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    monthlyPrice: 29,
    priceSuffix: "/mo",
    assetsLabel: "50 generations/month",
    badge: null,
    salesOnly: false,
    desc: "Perfect for testing AI-generated content for one brand.",
    includes: [
      "50 AI image generations",
      "UGC script & hook generator",
      "Studio content library",
      "Export ready-to-post files",
      "1 brand workspace",
    ],
    cta: "Start Creating",
  },
  {
    key: "growth",
    name: "Growth",
    monthlyPrice: 99,
    priceSuffix: "/mo",
    assetsLabel: "250 generations/month",
    badge: "Most Popular",
    salesOnly: false,
    desc: "For brands that need consistent content volume every month.",
    includes: [
      "250 AI image generations",
      "Image-to-video conversion",
      "Advanced brand style matching",
      "Bulk script & hook generation",
      "3 brand workspaces",
    ],
    cta: "Start Creating",
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 299,
    priceSuffix: "/mo",
    assetsLabel: "Unlimited generations",
    badge: null,
    salesOnly: false,
    desc: "For agencies and power users who need unlimited output.",
    includes: [
      "Unlimited AI generations",
      "Unlimited video conversions",
      "White-label studio exports",
      "Priority generation queue",
      "Unlimited brand workspaces",
    ],
    cta: "Start Creating",
  },
  {
    key: "custom",
    name: "Custom / Agencies",
    monthlyPrice: null,
    priceSuffix: "",
    assetsLabel: "Custom volume",
    badge: null,
    salesOnly: true,
    desc: "For agencies managing multiple client brands at scale.",
    includes: [
      "Custom generation limits",
      "Agency / white-label support",
      "Client brand management",
      "Studio delivery system",
      "Priority support",
    ],
    cta: "Talk to Sales",
  },
];

const FAQS = [
  {
    q: "How does UGCFire.ai work?",
    a: "You upload your product photos, logo, website URL, and brand style. UGCFire.ai uses that to generate branded images, UGC-style videos, hooks, and scripts — all matched to your specific offer and audience.",
  },
  {
    q: "What can I generate?",
    a: "Product images, AI photo-style visuals, short-form UGC-style videos, hooks, captions, and ad scripts. Everything you need to run and test content across TikTok, Reels, Shorts, and paid ads.",
  },
  {
    q: "Do I need any design or editing skills?",
    a: "No. UGCFire.ai is built for founders, marketers, and brand managers — not designers. You upload your assets, pick a style, and click generate.",
  },
  {
    q: "How long does it take to generate content?",
    a: "Most images generate in under 30 seconds. Videos typically take 1–3 minutes. You can run multiple generations at once and download everything from your Studio.",
  },
  {
    q: "Can I use the content for paid ads?",
    a: "Yes. All generated content is yours to use on TikTok, Instagram, YouTube, Facebook, landing pages, and paid ads — without any licensing restrictions.",
  },
  {
    q: "Can agencies use UGCFire.ai for multiple clients?",
    a: "Yes. The Pro and Custom plans support multiple brand workspaces so agencies can manage and generate content for all their clients from one account.",
  },
  {
    q: "What platforms work best with UGCFire.ai content?",
    a: "TikTok, Instagram Reels, YouTube Shorts, Facebook, organic posts, landing pages, and paid ads. All content exports in vertical and landscape formats.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. UGCFire.ai is a monthly subscription with no long-term contracts. Cancel anytime from your dashboard.",
  },
];

const REEL_CARDS = [
  {
    label: "Computer Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-style-ve_2891981897.mp4",
  },
  {
    label: "Workout Gear Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-energetic-ugc-fitne_2891987468.mp4",
  },
  {
    label: "Soda Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugcstyle-tes_2892041483.mp4",
  },
  {
    label: "Lotion Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_make-ugc-video-with-this-_2892034073.mp4",
  },
  {
    label: "Vacuum Cleaner Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-cinematic-ugc-testi_2892073891.mp4",
  },
  {
    label: "Chips Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-ugcstyle-vertical-s_2892334025.mp4",
  },
  {
    label: "Hot Sauce Brand",
    videoSrc: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-selfiest_2892474678.mp4",
  },
];

const PHOTO_CARDS = [
  { label: "Soap Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/02952be0-8ac1-4d5d-98b6-daa52cb4fd08.png" },
  { label: "Face Beauty Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/010aa1e6-c801-4299-85c5-62b7c7462e31.png" },
  { label: "Trail Mix Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/6038b54b-e507-44e5-a160-691b1788f55a.png" },
  { label: "Soda Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/9491597e-5c30-40cc-92cb-e606b4d0a037.png" },
  { label: "Toothpaste Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/df522445-4f8c-4c49-9dba-76b8131f0ada.png" },
  { label: "Hot Sauce Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/6dacd0a5-e10c-4eaa-b6c2-ab1fae07726e.png" },
  { label: "Detergent Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/164bdc38-cd6d-4917-b5e7-26a973a03ab1.png" },
  { label: "Chip Brand", src: "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/4b29686e-366c-4163-9549-6e371e81ca1a.png" },
];

const REEL_VIDEO_URL = "https://phhczohqidgrvcmszets.supabase.co/storage/v1/object/public/UGC%20Fire/video/alluring_swan_07128_httpss.mj.runVArsopscz9I_slow_motion_pers_c2fb5354-bceb-4ae0-8069-d65e46035d16_1.mp4";

function StatCard({ value, label, delta }: StatCardProps) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 28px", minWidth: 160 }}>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-bebas)", letterSpacing: "0.02em", color: "#fff" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, marginTop: 4 }}>{delta ?? label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 24px", transition: "border-color 0.2s, background 0.2s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,80,40,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,59,26,0.05)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
    >
      <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 8, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

function ReelCard({ label, videoSrc }: { label: string; videoSrc?: string }) {
  return (
    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", width: 200, flexShrink: 0 }}>
      <div style={{ position: "relative", height: 320 }}>
        <video src={videoSrc ?? REEL_VIDEO_URL} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: 10, right: 10, background: "#22c55e", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.05em" }}>VIDEO</div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{label}</div>
      </div>
    </div>
  );
}

function PhotoCard({ label, src }: { label: string; src: string }) {
  return (
    <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", width: 220, flexShrink: 0 }}>
      <div style={{ position: "relative", height: 280 }}>
        <Image src={src} alt={label} fill style={{ objectFit: "cover" }} unoptimized />
        <div style={{ position: "absolute", top: 10, right: 10, background: "#FF3B1A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.05em" }}>PHOTO</div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{label}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "22px 0" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", padding: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "#FF3B1A", fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      {open && <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginTop: 14 }}>{a}</p>}
    </div>
  );
}

function StarRating() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[...Array(5)].map((_, i) => <Star key={i} size={16} color="#FF3B1A" fill="#FF3B1A" strokeWidth={0} />)}
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>4.9</span>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Early access · Brands love it</span>
    </div>
  );
}

export default function Home() {
  const [pageReady, setPageReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVideo, setHeroVideo] = useState(0);
  const [showcaseCol1, setShowcaseCol1] = useState(0);
  const [showcaseCol2, setShowcaseCol2] = useState(0);
  const [showcaseCol3, setShowcaseCol3] = useState(0);

  const fireStyle: CSSProperties = { color: "#FF3B1A" };
  const sectionHead: CSSProperties = { textAlign: "center", marginBottom: 64 };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroVideo((v) => (v + 1) % 2), 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t1 = setInterval(() => setShowcaseCol1(v => (v + 1) % 3), 3500);
    const t2 = setInterval(() => setShowcaseCol2(v => (v + 1) % 4), 4000);
    const t3 = setInterval(() => setShowcaseCol3(v => (v + 1) % 2), 5000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, []);

  return (
    <>
      {/* Page load overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "opacity 0.5s ease, visibility 0.5s ease",
        opacity: pageReady ? 0 : 1,
        visibility: pageReady ? "hidden" : "visible",
        pointerEvents: "none",
      }}>
        <div style={{ position: "relative", width: 96, height: 96 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ position: "absolute", inset: 0, animation: "ugcfire-spin 1.1s linear infinite" }}>
            <style>{`@keyframes ugcfire-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <circle cx="48" cy="48" r="44" fill="none" stroke="#FF3B1A" strokeWidth="4" strokeLinecap="round" strokeDasharray="207" strokeDashoffset="138" />
          </svg>
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#FF3B1A", letterSpacing: "-0.01em" }}>AI</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        :root {
          --fire: #FF3B1A;
          --black: #080808;
          --font-bebas: 'Bebas Neue', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--black);
          color: #F0EDE6;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        ::selection { background: rgba(255,59,26,0.3); }
        .reel-scroll {
          display: flex;
          gap: 16px;
          animation: scroll-left 20s linear infinite;
          width: max-content;
        }
        .photo-scroll {
          display: flex;
          gap: 16px;
          animation: scroll-right 24s linear infinite;
          width: max-content;
        }
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .btn-fire {
          background: #FF3B1A;
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
        }
        .btn-fire:hover { background: #FF5533; transform: translateY(-2px); }
        .btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: rgba(8,8,8,0.97);
          backdropFilter: blur(16px);
          padding: 24px 1.5rem 32px;
          z-index: 99;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-direction: column;
          gap: 20px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-size: 18px; color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500; }
        .mobile-menu a:hover { color: #fff; }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.2s; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-btns-desktop { display: none !important; }
          .hamburger { display: flex !important; }
          .hamburger-cta { display: inline-flex !important; }
          .hero-badge { display: none !important; }
          .hero-top-label { padding-top: 40px !important; }
          .hero-bottom { flex-direction: column !important; align-items: flex-start !important; }
          .hero-stats { width: 100% !important; justify-content: flex-start !important; }
          .stat-card { min-width: 0 !important; flex: 1 1 calc(33% - 12px) !important; }
          .sec { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .sec-v { padding-top: 64px !important; padding-bottom: 64px !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-wrap { padding: 48px 1.5rem 24px !important; }
          .proof-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 3rem", height: 68,
        background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
      }}>
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#FF3B1A", letterSpacing: "-0.01em" }}>UGCFire</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.01em" }}>.ai</span>
        </a>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {[
            { label: "How It Works", href: "#how-it-works" },
            { label: "Plans", href: "#plans" },
            { label: "Examples", href: "#results" },
            { label: "FAQ", href: "#faq" },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14, fontWeight: 400, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >{label}</a>
          ))}
        </div>
        <div className="nav-btns-desktop" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/login" className="btn-ghost" style={{ fontSize: 13, padding: "9px 18px", textDecoration: "none" }}>Sign In</a>
          <a href="#plans" className="btn-ghost" style={{ fontSize: 13, padding: "9px 18px", textDecoration: "none" }}>See Plans</a>
          <a href="#" className="btn-fire" style={{ fontSize: 13, padding: "9px 18px", textDecoration: "none" }}>Start Creating</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="#" className="btn-fire hamburger-cta" style={{ fontSize: 13, padding: "9px 18px", textDecoration: "none", display: "none" }}>Start Creating</a>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {[
          { label: "How It Works", href: "#how-it-works" },
          { label: "Plans", href: "#plans" },
          { label: "Examples", href: "#results" },
          { label: "FAQ", href: "#faq" },
        ].map(({ label, href }) => (
          <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          <a href="/login" className="btn-ghost" style={{ textDecoration: "none", textAlign: "center" }}>Sign In</a>
          <a href="#" className="btn-fire" style={{ textDecoration: "none", textAlign: "center" }} onClick={() => setMenuOpen(false)}>Start Creating</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="sec sec-v" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", padding: "120px 3rem 5rem", overflow: "hidden" }}>
        {[
          "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260429_020651_1d9ae862-a0c1-498e-9296-651fb43dc88c%20(1).mp4",
          "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260504_162546_98fa6dc2-bf22-4a86-9bff-5ee8c96948ed.mp4",
        ].map((src, i) => (
          <video key={src} autoPlay muted loop playsInline onEnded={() => setHeroVideo((v) => (v + 1) % 2)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: heroVideo === i ? 0.55 : 0, transition: "opacity 1s ease" }}
            src={src}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse 55% 60% at 72% 38%, rgba(255,59,26,0.22) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", gap: 10, alignItems: "center" }}>
          {[0, 1].map((i) => (
            <button key={i} onClick={() => setHeroVideo(i)} aria-label={`Hero video ${i + 1}`} style={{ width: heroVideo === i ? 28 : 8, height: 8, borderRadius: 4, background: heroVideo === i ? "#FF3B1A" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "width 0.3s ease, background 0.3s ease", padding: 0 }} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, transparent 30%, rgba(8,8,8,0.95) 100%)" }} />
        <div className="hero-badge" style={{ position: "absolute", top: 90, right: "3rem", zIndex: 3, background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start", maxWidth: 280, backdropFilter: "blur(12px)" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3B1A", marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Generation</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>Upload your product. Get branded content in minutes.</div>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, width: "100%" }}>
          <div className="hero-top-label" style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 14 }}><StarRating /></div>
            <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>DIY AI Content Generator for Brands</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(72px, 9vw, 130px)", lineHeight: 0.95, letterSpacing: "0.01em", color: "#fff", marginBottom: 32, maxWidth: 760 }}>
            Create Branded<br />
            UGC Content<br />
            <span style={fireStyle}>Yourself. With AI.</span>
          </h1>
          <div className="hero-bottom" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <div style={{ maxWidth: 460 }}>
              <p style={{ fontSize: "clamp(15px, 1.3vw, 18px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
                Upload your product, logo, and brand style. Generate images, videos, hooks, and content assets in minutes.
              </p>
              <div style={{ display: "flex", gap: 14 }}>
                <FireButton href="#" className="btn-fire" style={{ fontSize: 16, padding: "15px 36px", textDecoration: "none" }}>
                  Start Creating
                </FireButton>
                <a href="#results" className="btn-ghost" style={{ fontSize: 15, textDecoration: "none" }}>View Demo →</a>
              </div>
            </div>
            <div className="hero-stats" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <StatCard value="IMAGES" delta="AI Generated" />
              <StatCard value="VIDEOS" delta="UGC Style" />
              <StatCard value="MONTHLY" delta="Cancel Anytime" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", padding: "16px 0" }}>
        <style>{`
          @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .brand-ticker { display: flex; align-items: center; gap: 56px; animation: ticker-scroll 22s linear infinite; width: max-content; }
          .brand-ticker:hover { animation-play-state: paused; }
          .ticker-item { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); white-space: nowrap; }
          .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #FF3B1A; flex-shrink: 0; }
        `}</style>
        <div className="brand-ticker">
          {[...Array(2)].map((_, pass) => (
            <React.Fragment key={pass}>
              {["Upload Your Brand", "•", "Generate Images", "•", "Create Scripts", "•", "Make Videos", "•", "Studio Library", "•", "Publish Anywhere", "•"].map((item, i) => (
                item === "•"
                  ? <span key={`${pass}-${i}`} className="ticker-dot" />
                  : <span key={`${pass}-${i}`} className="ticker-item">{item}</span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── CONTENT EXAMPLES ── */}
      <section id="results" className="sec-v" style={{ padding: "100px 0", overflow: "hidden" }}>
        <div className="sec" style={{ textAlign: "center", marginBottom: 56, padding: "0 3rem" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Content Examples</div>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "0.02em", color: "#fff" }}>
            AI Content That Actually <span style={fireStyle}>Burns</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>
            Images and UGC-style videos generated in minutes — ready for ads, organic posts, and landing pages.
          </p>
        </div>
        <div style={{ overflow: "hidden", padding: "0 0 16px" }}>
          <div className="reel-scroll" style={{ padding: "8px 0" }}>
            {[...REEL_CARDS, ...REEL_CARDS].map((card, i) => <ReelCard key={i} {...card} />)}
          </div>
        </div>
        <div style={{ overflow: "hidden", padding: "8px 0 0" }}>
          <div className="photo-scroll" style={{ padding: "8px 0" }}>
            {[...PHOTO_CARDS, ...PHOTO_CARDS].map((card, i) => <PhotoCard key={i} {...card} />)}
          </div>
        </div>
      </section>

      {/* ── 3-COLUMN SHOWCASE ── */}
      <section style={{ background: "#f2f1ee", padding: "64px 2rem" }}>
        <style>{`
          .showcase-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
          @media (max-width: 900px) { .showcase-grid { grid-template-columns: 1fr; } }
          .showcase-card { border-radius: 20px; overflow: hidden; position: relative; min-height: 540px; }
          .showcase-fade { position: absolute; inset: 0; transition: opacity 0.7s ease; }
        `}</style>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>How It Works</div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 80px)", letterSpacing: "0.02em", color: "#111", lineHeight: 1, margin: 0 }}>
              From Upload to <span style={fireStyle}>Ready to Post.</span>
            </h2>
            <p style={{ fontSize: 16, color: "#555", marginTop: 14, maxWidth: 600, margin: "14px auto 0", lineHeight: 1.6 }}>
              Upload your brand assets — we turn them into product images and UGC-style videos ready to post or run as ads.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 12 }}>
            {[
              { label: "Your Brand Assets", desc: "Upload product photos, your logo, website, and brand direction.", Icon: Wand2 },
              { label: "AI Product Images", desc: "Clean, branded visuals generated in seconds from your assets.", Icon: ImageIcon },
              { label: "UGC-Style Videos", desc: "Short-form videos built for social, ads, and content testing.", Icon: User },
            ].map(({ label, desc, Icon }, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FF3B1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color="#fff" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "0.01em" }}>{label}</span>
                </div>
                <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5, maxWidth: 220 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 28, padding: 14, boxShadow: "0 8px 48px rgba(0,0,0,0.10)" }}>
            <div className="showcase-grid">
              {/* Col 1 */}
              {(() => {
                const COL1 = [
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/be7f70f4-139f-4cb1-bcaa-964d79dc6a9e.png",
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/a9a7a9fd-e332-4750-bdd9-859ab5f45948.png",
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/19780ec9-301d-41b4-b893-5e30df793635.png",
                ];
                return (
                  <div className="showcase-card" style={{ background: "#f7f5f2" }}>
                    {COL1.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={`Product ${i + 1}`} className="showcase-fade" style={{ objectFit: "cover", objectPosition: "center top", opacity: showcaseCol1 === i ? 1 : 0 }} />
                    ))}
                    <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 10 }}>
                      {COL1.map((_, i) => <div key={i} style={{ width: showcaseCol1 === i ? 18 : 6, height: 6, borderRadius: 999, background: showcaseCol1 === i ? "#FF3B1A" : "rgba(255,255,255,0.5)", transition: "all 0.3s ease" }} />)}
                    </div>
                  </div>
                );
              })()}
              {/* Col 2 */}
              {(() => {
                const COL2 = [
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/video/Site%20reels/images/097881dc-4c18-4c17-8bf4-b106b302d197.png",
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5e1cf241-a837-4b51-a46c-f0fb5d643f1f.png",
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/d0702dbc-8d8e-4f40-b4e7-7aa4d7b98cbc.png",
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5265139e-c668-4866-a7e1-bb1d7c20ca2b.png",
                ];
                return (
                  <div className="showcase-card" style={{ background: "#0a0a0a" }}>
                    {COL2.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={`Photo ${i + 1}`} className="showcase-fade" style={{ objectFit: "cover", objectPosition: "center top", opacity: showcaseCol2 === i ? 1 : 0 }} />
                    ))}
                    <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 10 }}>
                      {COL2.map((_, i) => <div key={i} style={{ width: showcaseCol2 === i ? 18 : 6, height: 6, borderRadius: 999, background: showcaseCol2 === i ? "#FF3B1A" : "rgba(255,255,255,0.5)", transition: "all 0.3s ease" }} />)}
                    </div>
                  </div>
                );
              })()}
              {/* Col 3 */}
              {(() => {
                const COL3 = [
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/video/Site%20reels/hf_20260504_161208_b8ca7e84-576a-4ad6-af16-c541ca6083a8.mp4",
                  "https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260504_161728_1fe36f3f-a863-4d66-907b-b38d04c80ee8.mp4",
                ];
                return (
                  <div className="showcase-card" style={{ background: "#0a0a0a" }}>
                    {COL3.map((src, i) => (
                      <video key={src} autoPlay muted loop playsInline className="showcase-fade" style={{ objectFit: "cover", opacity: showcaseCol3 === i ? 1 : 0 }} src={src} />
                    ))}
                    <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 10 }}>
                      {COL3.map((_, i) => <div key={i} style={{ width: showcaseCol3 === i ? 18 : 6, height: 6, borderRadius: 999, background: showcaseCol3 === i ? "#FF3B1A" : "rgba(255,255,255,0.5)", transition: "all 0.3s ease" }} />)}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="sec sec-v" style={{ padding: "100px 3rem", background: "linear-gradient(180deg, transparent 0%, rgba(255,59,26,0.03) 50%, transparent 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={sectionHead}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Steps</div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "0.02em", color: "#fff", lineHeight: 1 }}>
              Four Steps. <span style={fireStyle}>Unlimited Content.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>
              From brand upload to Studio library — UGCFire.ai gives you one simple place to generate, manage, and publish content.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 64 }}>
            {([
              { step: "01", Icon: Upload, title: "Upload Your Brand", desc: "Drop in your product photos, logo, website, and brand guidelines. UGCFire.ai learns your style." },
              { step: "02", Icon: ImageIcon, title: "Generate Content", desc: "Pick a content type — images, videos, hooks, or scripts — and let the AI create your first batch." },
              { step: "03", Icon: Layers, title: "Review & Refine", desc: "Browse your generations, download what you love, and re-prompt to refine anything that needs tweaking." },
              { step: "04", Icon: Archive, title: "Studio Library", desc: "All your content lives in the Studio — organized by type, ready to download, share, or run as ads." },
            ] as { step: string; Icon: React.ElementType; title: string; desc: string }[]).map(({ step, Icon, title, desc }, i) => (
              <div key={i} style={{ position: "relative", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "36px 28px 32px", transition: "border-color 0.2s, background 0.2s", overflow: "hidden" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,80,40,0.35)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,59,26,0.045)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.025)"; }}
              >
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: 96, color: "rgba(255,59,26,0.08)", lineHeight: 1, position: "absolute", bottom: -8, right: 16, letterSpacing: "-0.02em", userSelect: "none", pointerEvents: "none" }}>{step}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,59,26,0.12)", border: "1px solid rgba(255,59,26,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={20} color="#FF3B1A" strokeWidth={1.75} />
                </div>
                <div style={{ fontSize: 11, color: "#FF3B1A", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Step {step}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="sec sec-v" style={{ padding: "80px 3rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={sectionHead}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "0.02em", color: "#fff", lineHeight: 1 }}>
              Everything You Need to<br /><span style={fireStyle}>Create at Scale.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── ORANGE PROCESS BANNER ── */}
      <section style={{ position: "relative", overflow: "hidden", background: "#FF3B1A", padding: "80px 0 72px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#000", borderRadius: 999, padding: "6px 16px", marginBottom: 22 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF3B1A", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#fff", textTransform: "uppercase" }}>Our Process</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(42px, 9vw, 78px)", letterSpacing: "0.01em", color: "#fff", lineHeight: 0.95, marginBottom: 18 }}>
            Your Brand. Your Content. Your AI.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", lineHeight: 1.65, marginBottom: 52, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            Upload your brand once. Generate unlimited content that always matches your style, offer, and audience.
          </p>
          <div style={{ margin: "0 auto", maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginBottom: 6 }}>
              {[0,1,2,3,4].map(i => (
                <svg key={i} width="16" height="30" viewBox="0 0 16 30" fill="none">
                  <line x1="8" y1="0" x2="8" y2="19" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 14 L8 22 L14 14" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ))}
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
              {([
                { label: "BRAND",    icon: Building2,  tl:  0, tr: 100, bl:  7, br: 93, bg: "linear-gradient(180deg,#ffffff 0%,#ebebeb 100%)" },
                { label: "PRODUCT",  icon: Users,       tl:  7, tr:  93, bl: 14, br: 86, bg: "linear-gradient(180deg,#f5f5f5 0%,#e2e2e2 100%)" },
                { label: "GENERATE", icon: Video,       tl: 14, tr:  86, bl: 21, br: 79, bg: "linear-gradient(180deg,#eeeeee 0%,#d8d8d8 100%)" },
                { label: "REFINE",   icon: Brain,       tl: 21, tr:  79, bl: 28, br: 72, bg: "linear-gradient(180deg,#e6e6e6 0%,#d0d0d0 100%)" },
                { label: "PUBLISH",  icon: TrendingUp,  tl: 28, tr:  72, bl: 35, br: 65, bg: "linear-gradient(180deg,#dedede 0%,#c8c8c8 100%)" },
              ] as { label: string; icon: React.ElementType; tl: number; tr: number; bl: number; br: number; bg: string }[]).map(({ label, icon: Icon, tl, tr, bl, br, bg }, i) => (
                <div key={label} style={{ filter: `drop-shadow(0px ${8 - i}px ${10 - i}px rgba(0,0,0,${(0.20 - i * 0.02).toFixed(2)}))` }}>
                  <div style={{ clipPath: `polygon(${tl}% 0,${tr}% 0,${br}% 100%,${bl}% 100%)`, background: bg, height: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 11 }}>
                    <Icon size={16} color="#CC2D0F" />
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: 21, letterSpacing: "0.06em", color: "#1a1a1a" }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 54, height: 24, background: "linear-gradient(180deg, rgba(200,200,200,0.80) 0%, rgba(255,255,255,0) 100%)" }} />
              <div style={{ width: 120, height: 16, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, transparent 70%)", filter: "blur(5px)", marginTop: -5 }} />
            </div>
          </div>
          <p style={{ marginTop: 28, fontSize: 11, color: "rgba(255,255,255,0.48)", fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Brand → Product → Generate → Refine → Publish
          </p>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="plans" className="sec sec-v" style={{ padding: "100px 2rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={sectionHead}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Plans</div>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "0.02em", color: "#fff", lineHeight: 1 }}>
            Simple Pricing.<br /><span style={fireStyle}>Unlimited Potential.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>
            Pick a plan. Upload your brand. Start generating. All plans include the Studio library and brand workspace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start" style={{ maxWidth: 1280, margin: "0 auto" }}>
          {PLANS.map((plan, i) => {
            const isPopular = plan.badge === "Most Popular";
            return (
              <div key={i} style={{ background: isPopular ? "rgba(255,59,26,0.07)" : "rgba(255,255,255,0.03)", border: isPopular ? "1px solid rgba(255,59,26,0.35)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "36px 28px", position: "relative", display: "flex", flexDirection: "column" }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: 28, background: "#FF3B1A", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 20 }}>{plan.badge}</div>
                )}
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{plan.name}</div>
                <div style={{ marginBottom: 4 }}>
                  {plan.salesOnly ? (
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: 36, color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>Custom</span>
                  ) : (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: 44, color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>${plan.monthlyPrice}</span>
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: 20, color: "rgba(255,255,255,0.5)" }}>{plan.priceSuffix}</span>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 10, marginTop: 2 }}>{plan.assetsLabel}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ marginBottom: 24, flex: 1 }}>
                  {plan.includes.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                      <span style={{ color: "#FF3B1A", fontSize: 13, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.62)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                {plan.salesOnly ? (
                  <a href="#" style={{ display: "block", textAlign: "center", textDecoration: "none", fontSize: 14, padding: "13px 20px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontWeight: 700, transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,59,26,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
                  >{plan.cta}</a>
                ) : (
                  <FireButton href="#" className="btn-fire" style={{ display: "block", textAlign: "center", textDecoration: "none", fontSize: 14, padding: "13px 20px" }}>{plan.cta}</FireButton>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ maxWidth: 1280, margin: "32px auto 0", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 20px" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>What counts as a generation?</span>{" "}
            Each image, video, hook, or script you generate counts as one. Unused generations do not roll over between months.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="sec sec-v" style={{ padding: "100px 3rem", background: "linear-gradient(180deg, transparent 0%, rgba(255,59,26,0.04) 50%, transparent 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={sectionHead}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><StarRating /></div>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Social Proof</div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "0.02em", color: "#fff", lineHeight: 1 }}>
              Content Teams Are Expensive.<br /><span style={fireStyle}>UGCFire.ai Makes It Simple.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }} className="proof-grid">
            {TESTIMONIALS_NEW.map((t, i) => (
              <div key={i} style={{ position: "relative", paddingTop: 52 }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
                  <div style={{ width: 84, height: 84, borderRadius: "50%", border: "3px solid #FF3B1A", boxShadow: "0 0 0 4px rgba(255,59,26,0.15), 0 0 28px rgba(255,59,26,0.35)", overflow: "hidden", background: "#1a1a1a", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt={t.name} width={84} height={84} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "52px 24px 28px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, color: "#FF3B1A", marginBottom: 10, lineHeight: 1 }}>&ldquo;</div>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{t.handle}</div>
                    <div style={{ background: "rgba(255,59,26,0.15)", border: "1px solid rgba(255,59,26,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: "#ff8060", marginTop: 2 }}>{t.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="sec sec-v" style={{ padding: "100px 3rem", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ ...sectionHead, textAlign: "left", marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#FF3B1A", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 5vw, 72px)", letterSpacing: "0.02em", color: "#fff" }}>
            Frequently Asked <span style={fireStyle}>Questions</span>
          </h2>
        </div>
        <div>{FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}</div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="sec sec-v" style={{ padding: "100px 3rem", position: "relative", overflow: "hidden", borderTop: "1px solid rgba(255,59,26,0.15)", borderBottom: "1px solid rgba(255,59,26,0.15)" }}>
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.6 }}
          src="https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/video/alluring_swan_07128__--ar_9151_--bs_1_--motion_high_--video_1_9a3a1ff2-5c55-4a2a-bc02-824ad4a0d14d_0.mp4"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,8,8,0.65) 0%, rgba(8,8,8,0.55) 100%)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(52px, 5.5vw, 88px)", letterSpacing: "0.01em", color: "#fff", lineHeight: 0.95, marginBottom: 20 }}>
            Ready to create<br /><span style={fireStyle}>branded content</span><br />with AI?
          </div>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Upload your product once. Generate images, videos, hooks, and scripts — all matched to your brand.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <FireButton href="#" className="btn-fire" style={{ fontSize: 16, padding: "15px 40px", textDecoration: "none" }}>Start Creating</FireButton>
            <a href="#plans" className="btn-ghost" style={{ fontSize: 15, textDecoration: "none" }}>See Plans →</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-wrap" style={{ background: "#060606", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 3rem 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#FF3B1A" }}>UGCFire</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "rgba(255,255,255,0.6)" }}>.ai</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: 240 }}>
                UGCFire.ai is a DIY AI content generator for brands. Upload your product, logo, and brand style — generate images, videos, hooks, and content assets in minutes.
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 24, alignItems: "center" }}>
                <a href="https://www.instagram.com/ugcfire" target="_blank" rel="noopener noreferrer" title="UGCFire on Instagram"
                  style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s", display: "flex" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B1A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                ><InstagramIcon size={28} /></a>
                <a href="https://www.tiktok.com/@ugcfire" target="_blank" rel="noopener noreferrer" title="UGCFire on TikTok"
                  style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s", display: "flex" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B1A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                ><TikTokIcon size={26} /></a>
              </div>
            </div>
            {([
              {
                heading: "Product",
                links: [
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Plans", href: "#plans" },
                  { label: "Examples", href: "#results" },
                  { label: "FAQ", href: "#faq" },
                ],
              },
              {
                heading: "Account",
                links: [
                  { label: "Sign In", href: "/login" },
                  { label: "Get Started", href: "#" },
                ],
              },
              {
                heading: "Legal",
                links: [
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                ],
              },
            ] as { heading: string; links: { label: string; href: string }[] }[]).map(({ heading, links }) => (
              <div key={heading}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600, marginBottom: 18 }}>{heading}</div>
                {links.map((l) => (
                  <a key={l.label} href={l.href}
                    style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >{l.label}</a>
                ))}
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600, marginBottom: 18 }}>Platforms</div>
              {[
                { icon: <TikTokIcon size={18} />, label: "TikTok" },
                { icon: <InstagramIcon size={18} />, label: "Instagram Reels" },
                { icon: <Video size={18} />, label: "YouTube Shorts" },
                { icon: <Palmtree size={18} />, label: "Facebook Ads" },
                { icon: <Sun size={18} />, label: "Landing Pages" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, color: "rgba(255,255,255,0.45)" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 13 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 UGCFire.ai. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Built for founders and marketers 🔥</span>
          </div>
        </div>
      </footer>
    </>
  );
}
