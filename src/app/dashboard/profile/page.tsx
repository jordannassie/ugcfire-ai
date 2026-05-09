'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Camera, Check, ExternalLink, Star, Globe,
  Film, ImageIcon, X, Upload, ChevronRight,
} from 'lucide-react';
import {
  DEMO_VIDEO_GENS, DEMO_IMAGE_GENS,
  LS_VIDEO_GENS, LS_IMAGE_GENS,
  loadFromLS, formatGenDate,
  type VideoGeneration, type ImageGeneration,
} from '@/lib/demoAssets';
import type { CreatorSpecialty } from '@/lib/creatorNetwork';

// ─── Design tokens ─────────────────────────────────────────────────────────
const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.08)';

// ─── localStorage keys for portfolio state ─────────────────────────────────
const LS_PUBLISHED  = 'ugcfire_portfolio_published';  // string[]  (item IDs)
const LS_FEATURED   = 'ugcfire_portfolio_featured';   // string    (item ID)
const LS_PROFILE    = 'ugcfire_creator_profile';      // JSON object

const ALL_SPECIALTIES: CreatorSpecialty[] = [
  'Beauty', 'Fitness', 'Ecommerce', 'Food & Beverage',
  'Tech', 'Fashion', 'Lifestyle', 'Gaming', 'Pets', 'Local Business',
];

function loadPublished(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LS_PUBLISHED) || '[]'); } catch { return []; }
}
function savePublished(ids: string[]) {
  if (typeof window !== 'undefined') localStorage.setItem(LS_PUBLISHED, JSON.stringify(ids));
}
function loadFeatured(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(LS_FEATURED) || '';
}
function saveFeatured(id: string) {
  if (typeof window !== 'undefined') localStorage.setItem(LS_FEATURED, id);
}
interface SavedProfile { displayName: string; username: string; bio: string; specialties: CreatorSpecialty[]; availableForWork: boolean; }
function loadProfile(): SavedProfile {
  if (typeof window === 'undefined') return { displayName: 'Demo User', username: 'demo_creator', bio: '', specialties: [], availableForWork: false };
  try {
    const p = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}');
    return { displayName: p.displayName || 'Demo User', username: p.username || 'demo_creator', bio: p.bio || '', specialties: p.specialties || [], availableForWork: p.availableForWork || false };
  } catch { return { displayName: 'Demo User', username: 'demo_creator', bio: '', specialties: [], availableForWork: false }; }
}
function saveProfile(p: SavedProfile) {
  if (typeof window !== 'undefined') localStorage.setItem(LS_PROFILE, JSON.stringify(p));
}

// ─── Combined portfolio item ────────────────────────────────────────────────
type PortfolioItem =
  | (VideoGeneration & { kind: 'video' })
  | (ImageGeneration & { kind: 'image' });

// ─── Thumb component ───────────────────────────────────────────────────────
function Thumb({ item }: { item: PortfolioItem }) {
  if (item.kind === 'video') {
    return (
      <video
        src={item.videoSrc} muted playsInline preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={item.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  );
}

export default function ProfilePage() {
  // ── Profile fields ────────────────────────────────────────────────────────
  const [displayName,      setDisplayName]      = useState('Demo User');
  const [username,         setUsername]         = useState('demo_creator');
  const [bio,              setBio]              = useState('');
  const [specialties,      setSpecialties]      = useState<CreatorSpecialty[]>([]);
  const [availableForWork, setAvailableForWork] = useState(false);
  const [profileSaved,     setProfileSaved]     = useState(false);

  // ── Avatar ────────────────────────────────────────────────────────────────
  const [avatarPreview,    setAvatarPreview]    = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── Portfolio state ────────────────────────────────────────────────────────
  const [allItems,   setAllItems]   = useState<PortfolioItem[]>([]);
  const [published,  setPublished]  = useState<string[]>([]);
  const [featured,   setFeatured]   = useState<string>('');
  const [featModal,  setFeatModal]  = useState(false);

  // ── Section tab ────────────────────────────────────────────────────────────
  const [activeTab,  setActiveTab]  = useState<'all' | 'videos' | 'images'>('all');

  // ── Load everything from localStorage ─────────────────────────────────────
  useEffect(() => {
    const p = loadProfile();
    setDisplayName(p.displayName);
    setUsername(p.username);
    setBio(p.bio);
    setSpecialties(p.specialties);
    setAvailableForWork(p.availableForWork);

    const videos = loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS).map(v => ({ ...v, kind: 'video' as const }));
    const images = loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS).map(i => ({ ...i, kind: 'image' as const }));
    const merged: PortfolioItem[] = [...videos, ...images].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAllItems(merged);
    setPublished(loadPublished());
    setFeatured(loadFeatured());
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  function togglePublish(id: string) {
    setPublished(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      savePublished(next);
      if (!next.includes(id) && featured === id) { setFeatured(''); saveFeatured(''); }
      return next;
    });
  }

  function setAsFeatured(id: string) {
    if (!published.includes(id)) {
      setPublished(prev => { const n = [...prev, id]; savePublished(n); return n; });
    }
    setFeatured(id);
    saveFeatured(id);
    setFeatModal(false);
  }

  function saveProfileFields() {
    saveProfile({ displayName, username, bio, specialties, availableForWork });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  const filteredItems = allItems.filter(item => {
    if (activeTab === 'videos') return item.kind === 'video';
    if (activeTab === 'images') return item.kind === 'image';
    return true;
  });

  const featuredItem = allItems.find(i => i.id === featured);
  const publishedCount = published.length;

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#f2f0eb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .port-card { transition: border-color 0.15s, transform 0.15s; }
        .port-card:hover { border-color: rgba(255,255,255,0.18) !important; transform: translateY(-2px); }
        .spec-pill { transition: all 0.12s; }
        .spec-pill:hover { border-color: ${LIME} !important; color: ${LIME} !important; }
        .tab-btn { transition: all 0.12s; }
        .tab-btn:hover { color: #fff !important; }
        input, textarea { font-family: inherit; }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Creator Profile</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Build your public portfolio and get discovered for agency opportunities.
          </p>
        </div>

        {/* ── PROFILE CARD ─────────────────────────────────────────────────── */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>

          {/* Top banner */}
          <div style={{ height: 100, background: 'linear-gradient(135deg, rgba(163,230,53,0.1) 0%, rgba(255,92,0,0.06) 50%, rgba(163,230,53,0.04) 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,230,53,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          </div>

          <div style={{ padding: '0 24px 24px' }}>
            {/* Avatar row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -36, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {/* Lime ring if AFW */}
                {availableForWork && (
                  <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `3px solid ${LIME}`, boxShadow: `0 0 16px rgba(163,230,53,0.4)` }} />
                )}
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  style={{ width: 80, height: 80, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #141414', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28, fontWeight: 800, color: '#0d0d0d' }}>{displayName[0]?.toUpperCase() || 'D'}</span>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}>
                    <Camera size={18} color="#fff" />
                  </div>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>{displayName}</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>@{username}</p>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href={`/creators/${username}`} target="_blank"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 9, fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <Globe size={13} />
                  View Public Profile
                  <ExternalLink size={11} />
                </Link>
                <Link href="/discover?tab=creators"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: LIME, borderRadius: 9, fontSize: 13, color: '#0d0d0d', textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  ✦ Discover
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Projects', value: allItems.length },
                { label: 'Published', value: publishedCount },
                { label: 'Followers', value: 0 },
              ].map(s => (
                <div key={s.label}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{s.value}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 5 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Specialties */}
            {specialties.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {specialties.map(s => (
                  <span key={s} style={{ fontSize: 11, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 10px' }}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

          {/* ── LEFT: Portfolio ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Featured Project */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 1 }}>Featured Project</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Highlighted at the top of your public profile.</p>
                </div>
                <button onClick={() => setFeatModal(true)}
                  style={{ fontSize: 12, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {featuredItem ? 'Change' : 'Add'}
                </button>
              </div>

              {featuredItem ? (
                <div style={{ display: 'flex', gap: 16, padding: 20, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
                    <Thumb item={featuredItem} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {featuredItem.kind === 'video'
                        ? <Film size={12} color={ORANGE} />
                        : <ImageIcon size={12} color={LIME} />}
                      <span style={{ fontSize: 11, fontWeight: 700, color: featuredItem.kind === 'video' ? ORANGE : LIME, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{featuredItem.kind}</span>
                      <span style={{ fontSize: 10, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 20, padding: '1px 8px', color: '#ffd700', fontWeight: 700, marginLeft: 4 }}>★ Featured</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {featuredItem.kind === 'video' ? featuredItem.prompt : featuredItem.prompt}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{formatGenDate(featuredItem.createdAt)}</p>
                  </div>
                  <button onClick={() => { setFeatured(''); saveFeatured(''); }}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <X size={12} color="rgba(255,255,255,0.4)" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setFeatModal(true)}
                  style={{ width: '100%', padding: '32px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={18} color="rgba(255,255,255,0.3)" />
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Add a featured project</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Choose one of your projects to highlight it</p>
                </button>
              )}
            </div>

            {/* Portfolio Grid */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 1 }}>Portfolio</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Publish your best AI ads to get discovered.</p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['all', 'videos', 'images'] as const).map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className="tab-btn"
                      style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: activeTab === t ? 'rgba(255,255,255,0.1)' : 'none', color: activeTab === t ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔥</div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Ready to show your work?</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.6 }}>
                    Publish your best AI ads to build your public portfolio and get discovered for agency opportunities.
                  </p>
                  <Link href="/dashboard/video"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
                    ✦ Generate your first video
                  </Link>
                </div>
              ) : (
                <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {filteredItems.map(item => {
                    const isPub  = published.includes(item.id);
                    const isFeat = featured === item.id;
                    return (
                      <div key={item.id} className="port-card"
                        style={{ border: `1px solid ${isFeat ? 'rgba(255,215,0,0.3)' : isPub ? 'rgba(163,230,53,0.25)' : BORDER}`, borderRadius: 12, overflow: 'hidden', background: '#111', position: 'relative' }}>
                        {/* Thumbnail */}
                        <div style={{ height: 130, overflow: 'hidden' }}>
                          <Thumb item={item} />
                        </div>

                        {/* Badges */}
                        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: item.kind === 'video' ? 'rgba(255,92,0,0.85)' : 'rgba(163,230,53,0.85)', color: item.kind === 'video' ? '#fff' : '#0d0d0d', letterSpacing: '0.04em', backdropFilter: 'blur(4px)' }}>
                            {item.kind === 'video' ? 'VIDEO' : 'IMAGE'}
                          </span>
                          {isFeat && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,215,0,0.9)', color: '#0d0d0d', backdropFilter: 'blur(4px)' }}>★ FEAT</span>}
                          {isPub && !isFeat && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'rgba(163,230,53,0.85)', color: '#0d0d0d', backdropFilter: 'blur(4px)' }}>PUBLIC</span>}
                        </div>

                        {/* Info */}
                        <div style={{ padding: '8px 10px' }}>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          {/* Actions */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <button onClick={() => togglePublish(item.id)}
                              style={{ width: '100%', padding: '5px 8px', borderRadius: 7, border: `1px solid ${isPub ? 'rgba(163,230,53,0.3)' : BORDER}`, background: isPub ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.03)', color: isPub ? LIME : 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                              {isPub ? '✓ Published' : '+ Publish'}
                            </button>
                            {isPub && !isFeat && (
                              <button onClick={() => setAsFeatured(item.id)}
                                style={{ width: '100%', padding: '5px 8px', borderRadius: 7, border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.05)', color: '#ffd700', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                                ★ Feature
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Profile Edit Form ──────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Available for Work */}
            <div
              onClick={() => setAvailableForWork(a => !a)}
              style={{ background: availableForWork ? 'rgba(163,230,53,0.07)' : PANEL, border: `1px solid ${availableForWork ? 'rgba(163,230,53,0.3)' : BORDER}`, borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: availableForWork ? LIME : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.15s' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: availableForWork ? 23 : 3, transition: 'left 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: availableForWork ? LIME : '#fff', marginBottom: 2 }}>
                  {availableForWork ? '✦ Available for Work' : 'Available for Work'}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  Let UGCFire contact me for paid agency opportunities.
                </p>
              </div>
            </div>

            {/* Edit form */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Creator Info</p>

              {/* Display name */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
              </div>

              {/* Username */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Username</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 9, overflow: 'hidden' }}>
                  <span style={{ padding: '9px 10px', fontSize: 12, color: 'rgba(255,255,255,0.25)', borderRight: `1px solid ${BORDER}`, flexShrink: 0 }}>@</span>
                  <input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/g, ''))}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '9px 12px', color: '#fff', fontSize: 13 }} />
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>ugcfire.ai/creators/{username || 'your_username'}</p>
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="I create UGC-style ads for DTC brands using AI..."
                  style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'none' }} />
              </div>

              {/* Specialties */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Specialties <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', letterSpacing: 0 }}>(up to 4)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_SPECIALTIES.map(s => {
                    const active = specialties.includes(s);
                    return (
                      <button key={s} type="button" className="spec-pill"
                        onClick={() => setSpecialties(prev => active ? prev.filter(x => x !== s) : prev.length < 4 ? [...prev, s] : prev)}
                        style={{ padding: '4px 11px', borderRadius: 20, border: `1px solid ${active ? LIME : BORDER}`, background: active ? 'rgba(163,230,53,0.12)' : 'transparent', color: active ? LIME : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Public URL preview */}
              <div style={{ background: '#111', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Public profile URL</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: LIME, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ugcfire.ai/creators/{username || 'your_username'}</p>
                </div>
                <Link href={`/creators/${username || 'demo_creator'}`} target="_blank"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '5px 10px', border: `1px solid ${BORDER}`, borderRadius: 7, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <ExternalLink size={11} />
                  Preview
                </Link>
              </div>

              {/* Save button */}
              <button onClick={saveProfileFields}
                style={{ width: '100%', background: profileSaved ? 'rgba(163,230,53,0.12)' : LIME, color: profileSaved ? LIME : '#0d0d0d', border: profileSaved ? `1px solid rgba(163,230,53,0.3)` : 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}>
                {profileSaved ? <><Check size={14} /> Profile Saved</> : 'Save Profile'}
              </button>
            </div>

            {/* Quick links */}
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              {[
                { label: 'Generate Video',   href: '/dashboard/video',        icon: Film     },
                { label: 'Generate Image',   href: '/dashboard/image',        icon: ImageIcon },
                { label: 'Join Community',   href: '/community',              icon: Upload   },
              ].map((l, i, arr) => (
                <Link key={l.label} href={l.href}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', textDecoration: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500, transition: 'color 0.12s, background 0.12s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = '#fff'; el.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'rgba(255,255,255,0.55)'; el.style.background = 'none'; }}>
                  <l.icon size={14} />
                  {l.label}
                  <ChevronRight size={13} style={{ marginLeft: 'auto' }} color="rgba(255,255,255,0.2)" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED PROJECT MODAL ───────────────────────────────────────────── */}
      {featModal && (
        <>
          <div onClick={() => setFeatModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 300, backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 20, width: 'min(640px, 92vw)', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 310, boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid rgba(255,255,255,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Select Featured Project</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>This will be highlighted at the top of your public profile.</p>
              </div>
              <button onClick={() => setFeatModal(false)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {allItems.map(item => (
                <button key={item.id} onClick={() => setAsFeatured(item.id)}
                  style={{ padding: 0, background: 'none', border: `2px solid ${featured === item.id ? '#ffd700' : BORDER}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.12s' }}>
                  <div style={{ height: 100 }}><Thumb item={item} /></div>
                  <div style={{ padding: '6px 8px', background: '#111' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.kind === 'video' ? ORANGE : LIME, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.kind}</span>
                    {featured === item.id && <span style={{ marginLeft: 6, fontSize: 10, color: '#ffd700' }}>★</span>}
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
