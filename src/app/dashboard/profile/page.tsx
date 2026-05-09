'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Camera, Check, ExternalLink, Star, Globe,
  Film, ImageIcon, X, Edit2, Volume2, VolumeX,
} from 'lucide-react';
import {
  DEMO_VIDEO_GENS, DEMO_IMAGE_GENS,
  LS_VIDEO_GENS, LS_IMAGE_GENS,
  loadFromLS, formatGenDate,
  type VideoGeneration, type ImageGeneration,
} from '@/lib/demoAssets';
import type { CreatorSpecialty } from '@/lib/creatorNetwork';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const LIME   = '#a3e635';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.08)';

// ─── localStorage keys ───────────────────────────────────────────────────────
const LS_PUBLISHED = 'ugcfire_portfolio_published';
const LS_FEATURED  = 'ugcfire_portfolio_featured';
const LS_PROFILE   = 'ugcfire_creator_profile';

const ALL_SPECIALTIES: CreatorSpecialty[] = [
  'Beauty', 'Fitness', 'Ecommerce', 'Food & Beverage',
  'Tech', 'Fashion', 'Lifestyle', 'Gaming', 'Pets', 'Local Business',
];

interface SavedProfile { displayName: string; username: string; bio: string; specialties: CreatorSpecialty[]; availableForWork: boolean; }

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

// ─── Types ───────────────────────────────────────────────────────────────────
type PortfolioItem =
  | (VideoGeneration & { kind: 'video' })
  | (ImageGeneration & { kind: 'image' });

// ─── Small video card with mute button ───────────────────────────────────────
function PortCard({ item, published, featured, onTogglePublish, onSetFeatured }: {
  item: PortfolioItem;
  published: boolean;
  featured: boolean;
  onTogglePublish: () => void;
  onSetFeatured: () => void;
}) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    setMuted(m => { if (videoRef.current) videoRef.current.muted = !m; return !m; });
  }
  function onEnter() {
    if (item.kind !== 'video' || !videoRef.current) return;
    const vid = videoRef.current;
    vid.muted = false;
    setMuted(false);
    vid.play().catch(() => {
      vid.muted = true;
      setMuted(true);
      vid.play().catch(() => {});
    });
  }
  function onLeave() {
    if (item.kind !== 'video' || !videoRef.current) return;
    videoRef.current.muted = true;
    setMuted(true);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }

  return (
    <div style={{ border: `1px solid ${featured ? 'rgba(255,215,0,0.3)' : published ? 'rgba(163,230,53,0.25)' : BORDER}`, borderRadius: 14, overflow: 'hidden', background: '#111', transition: 'border-color 0.15s' }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        {item.kind === 'video' ? (
          <video ref={videoRef} src={item.videoSrc} muted={muted} loop playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={item.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}

        {/* Type badge + mute */}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: item.kind === 'video' ? 'rgba(255,92,0,0.85)' : 'rgba(163,230,53,0.85)', color: item.kind === 'video' ? '#fff' : '#0d0d0d' }}>
            {item.kind === 'video' ? 'VIDEO' : 'IMAGE'}
          </span>
          {item.kind === 'video' && (
            <button onClick={toggleMute} style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {muted ? <VolumeX size={11} color="rgba(255,255,255,0.75)" /> : <Volume2 size={11} color="#fff" />}
            </button>
          )}
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {featured && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,215,0,0.9)', color: '#0d0d0d' }}>★ FEAT</span>}
          {published && !featured && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'rgba(163,230,53,0.85)', color: '#0d0d0d' }}>PUBLIC</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>
          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
        <button onClick={onTogglePublish}
          style={{ width: '100%', padding: '5px 8px', borderRadius: 7, border: `1px solid ${published ? 'rgba(163,230,53,0.3)' : BORDER}`, background: published ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.03)', color: published ? LIME : 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {published ? '✓ Published' : '+ Publish'}
        </button>
        {published && !featured && (
          <button onClick={onSetFeatured}
            style={{ width: '100%', padding: '5px 8px', borderRadius: 7, border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.05)', color: '#ffd700', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            ★ Feature
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  // Profile state
  const [displayName,      setDisplayName]      = useState('Demo User');
  const [username,         setUsername]         = useState('demo_creator');
  const [bio,              setBio]              = useState('');
  const [specialties,      setSpecialties]      = useState<CreatorSpecialty[]>([]);
  const [availableForWork, setAvailableForWork] = useState(false);

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editOpen,     setEditOpen]     = useState(false);
  const [editName,     setEditName]     = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio,      setEditBio]      = useState('');
  const [editSpecs,    setEditSpecs]    = useState<CreatorSpecialty[]>([]);
  const [editSaved,    setEditSaved]    = useState(false);

  // Portfolio
  const [allItems,  setAllItems]  = useState<PortfolioItem[]>([]);
  const [published, setPublished] = useState<string[]>([]);
  const [featured,  setFeatured]  = useState<string>('');
  const [featModal, setFeatModal] = useState(false);
  const [portTab,   setPortTab]   = useState<'all' | 'videos' | 'images'>('all');

  // Load from localStorage
  useEffect(() => {
    const p = loadProfile();
    setDisplayName(p.displayName);
    setUsername(p.username);
    setBio(p.bio);
    setSpecialties(p.specialties);
    setAvailableForWork(p.availableForWork);

    const videos = loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS).map(v => ({ ...v, kind: 'video' as const }));
    const images = loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS).map(i => ({ ...i, kind: 'image' as const }));
    setAllItems([...videos, ...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setPublished(loadPublished());
    setFeatured(loadFeatured());
  }, []);

  function openEdit() {
    setEditName(displayName);
    setEditUsername(username);
    setEditBio(bio);
    setEditSpecs([...specialties]);
    setEditSaved(false);
    setEditOpen(true);
  }

  function saveEdit() {
    setDisplayName(editName);
    setUsername(editUsername);
    setBio(editBio);
    setSpecialties(editSpecs);
    saveProfile({ displayName: editName, username: editUsername, bio: editBio, specialties: editSpecs, availableForWork });
    setEditSaved(true);
    setTimeout(() => { setEditOpen(false); setEditSaved(false); }, 900);
  }

  function toggleAFW() {
    const next = !availableForWork;
    setAvailableForWork(next);
    saveProfile({ displayName, username, bio, specialties, availableForWork: next });
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

  const featuredItem = allItems.find(i => i.id === featured);
  const filteredItems = allItems.filter(i =>
    portTab === 'all' ? true : portTab === 'videos' ? i.kind === 'video' : i.kind === 'image'
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#f2f0eb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input, textarea { font-family: inherit; }
        .spec-pill:hover { border-color: ${LIME} !important; color: ${LIME} !important; }
        .tab-btn:hover { color: #fff !important; }
        @media (max-width: 640px) {
          .port-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* ── PROFILE HEADER ───────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, flexWrap: 'wrap' }}>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {availableForWork && (
              <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: `3px solid ${LIME}`, boxShadow: `0 0 18px rgba(163,230,53,0.4)`, zIndex: 1 }} />
            )}
            <div onClick={() => avatarInputRef.current?.click()}
              style={{ width: 88, height: 88, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 32, fontWeight: 800, color: '#0d0d0d' }}>{displayName[0]?.toUpperCase() || 'D'}</span>
              }
              <div className="avatar-hover" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}>
                <Camera size={18} color="#fff" />
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) setAvatarPreview(URL.createObjectURL(f)); }} />
          </div>

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>{displayName}</h1>
              <button onClick={openEdit}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Edit2 size={12} /> Edit
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>@{username}</p>

            {/* AFW toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div onClick={toggleAFW}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '5px 12px', borderRadius: 20, background: availableForWork ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${availableForWork ? 'rgba(163,230,53,0.3)' : BORDER}`, transition: 'all 0.15s', userSelect: 'none' }}>
                <div style={{ width: 32, height: 18, borderRadius: 9, background: availableForWork ? LIME : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.15s', flexShrink: 0 }}>
                  <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2.5, left: availableForWork ? 17 : 2.5, transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: availableForWork ? LIME : 'rgba(255,255,255,0.45)' }}>
                  Available for Work
                </span>
              </div>
              {availableForWork && (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>
                  Let UGCFire contact me for paid agency opportunities.
                </span>
              )}

              {/* Specialties */}
              {specialties.slice(0, 3).map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '3px 10px' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* View public profile */}
          <Link href={`/creators/${username}`} target="_blank"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Globe size={13} />
            View Public Profile
            <ExternalLink size={11} />
          </Link>
        </div>

        {/* ── FEATURED PROJECT ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Featured Project</h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Highlighted at the top of your public profile.</p>
            </div>
            <button onClick={() => setFeatModal(true)}
              style={{ fontSize: 12, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {featuredItem ? 'Change' : '+ Add'}
            </button>
          </div>

          {featuredItem ? (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px', background: PANEL, border: `1px solid rgba(255,215,0,0.2)`, borderRadius: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
                {featuredItem.kind === 'video'
                  ? <video src={featuredItem.videoSrc} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <img src={featuredItem.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  {featuredItem.kind === 'video' ? <Film size={12} color="#FF5C00" /> : <ImageIcon size={12} color={LIME} />}
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#ffd700', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 20, padding: '1px 8px' }}>★ Featured</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {featuredItem.prompt}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{formatGenDate(featuredItem.createdAt)}</p>
              </div>
              <button onClick={() => { setFeatured(''); saveFeatured(''); }}
                style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <X size={12} color="rgba(255,255,255,0.4)" />
              </button>
            </div>
          ) : (
            <button onClick={() => setFeatModal(true)}
              style={{ width: '100%', padding: '32px', background: PANEL, border: `1px dashed rgba(255,255,255,0.12)`, borderRadius: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} color="rgba(255,255,255,0.25)" />
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Add Featured Project</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Choose one of your projects to highlight it</p>
            </button>
          )}
        </div>

        {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Portfolio
                <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>{allItems.length}</span>
              </h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Publish your best AI ads to get discovered.</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['all', 'videos', 'images'] as const).map(t => (
                <button key={t} onClick={() => setPortTab(t)} className="tab-btn"
                  style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: portTab === t ? 'rgba(255,255,255,0.1)' : 'none', color: portTab === t ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 20px', borderRadius: 16, border: `1px dashed rgba(255,255,255,0.08)` }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔥</div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Ready to show your work?</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.6 }}>
                Publish your best AI ads to build your public portfolio and get discovered for agency opportunities.
              </p>
              <Link href="/dashboard/video"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
                ✦ Generate your first video
              </Link>
            </div>
          ) : (
            <div className="port-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {filteredItems.map(item => (
                <PortCard
                  key={item.id}
                  item={item}
                  published={published.includes(item.id)}
                  featured={featured === item.id}
                  onTogglePublish={() => togglePublish(item.id)}
                  onSetFeatured={() => setAsFeatured(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ───────────────────────────────────────────── */}
      {editOpen && (
        <>
          <div onClick={() => setEditOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 300, backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, width: 'min(520px, 92vw)', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 310, boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            {/* Header */}
            <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>Edit Profile</p>
              <button onClick={() => setEditOpen(false)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </div>

            {/* Body */}
            <div style={{ overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Change photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div onClick={() => avatarInputRef.current?.click()}
                  style={{ width: 60, height: 60, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 22, fontWeight: 800, color: '#0d0d0d' }}>{editName[0]?.toUpperCase() || 'D'}</span>
                  }
                </div>
                <button onClick={() => avatarInputRef.current?.click()}
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Camera size={13} /> Change photo
                </button>
              </div>

              {/* Display name */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Display Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  style={{ width: '100%', background: '#111', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
              </div>

              {/* Username */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Username</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#111', border: `1px solid ${BORDER}`, borderRadius: 9, overflow: 'hidden' }}>
                  <span style={{ padding: '9px 10px', fontSize: 12, color: 'rgba(255,255,255,0.25)', borderRight: `1px solid ${BORDER}`, flexShrink: 0 }}>@</span>
                  <input value={editUsername} onChange={e => setEditUsername(e.target.value.replace(/[^a-z0-9_]/g, ''))}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '9px 12px', color: '#fff', fontSize: 13 }} />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bio</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                  placeholder="I create UGC-style ads for DTC brands using AI..."
                  style={{ width: '100%', background: '#111', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'none' }} />
              </div>

              {/* Specialties */}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Specialties <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', letterSpacing: 0 }}>(up to 4)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_SPECIALTIES.map(s => {
                    const active = editSpecs.includes(s);
                    return (
                      <button key={s} type="button" className="spec-pill"
                        onClick={() => setEditSpecs(prev => active ? prev.filter(x => x !== s) : prev.length < 4 ? [...prev, s] : prev)}
                        style={{ padding: '4px 11px', borderRadius: 20, border: `1px solid ${active ? LIME : BORDER}`, background: active ? 'rgba(163,230,53,0.12)' : 'transparent', color: active ? LIME : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={saveEdit}
                style={{ width: '100%', background: editSaved ? 'rgba(163,230,53,0.12)' : LIME, color: editSaved ? LIME : '#0d0d0d', border: editSaved ? `1px solid rgba(163,230,53,0.3)` : 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}>
                {editSaved ? <><Check size={14} /> Saved!</> : 'Save Profile'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── FEATURE SELECTOR MODAL ───────────────────────────────────────── */}
      {featModal && (
        <>
          <div onClick={() => setFeatModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 300, backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, width: 'min(640px, 92vw)', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 310, boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>Select Featured Project</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Highlighted at the top of your public profile.</p>
              </div>
              <button onClick={() => setFeatModal(false)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {allItems.map(item => (
                <button key={item.id} onClick={() => setAsFeatured(item.id)}
                  style={{ padding: 0, background: 'none', border: `2px solid ${featured === item.id ? '#ffd700' : BORDER}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.12s' }}>
                  <div style={{ height: 90, overflow: 'hidden' }}>
                    {item.kind === 'video'
                      ? <video src={item.videoSrc} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <img src={item.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    }
                  </div>
                  <div style={{ padding: '5px 8px', background: '#111' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.kind === 'video' ? '#FF5C00' : LIME, textTransform: 'uppercase' }}>{item.kind}</span>
                    {featured === item.id && <span style={{ marginLeft: 6, fontSize: 10, color: '#ffd700' }}>★</span>}
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
