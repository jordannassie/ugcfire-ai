'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { ChevronRight, Heart, Eye, Play, Volume2, VolumeX } from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';
import { DEMO_CREATORS, DEMO_PROJECTS, SPECIALTY_COLORS, SPECIALTY_TEXT } from '@/lib/creatorNetwork';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const BORDER = 'rgba(255,255,255,0.07)';

// ─── MediaCard — used for both featured hero and portfolio grid ───────────────
function MediaCard({ project, featured = false }: {
  project: { id: string; title: string; thumbnail_url: string; media_url: string; media_type: 'video' | 'image'; views: number; likes: number };
  featured?: boolean;
}) {
  const [liked,     setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes);
  const [muted,     setMuted]     = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function onEnter() { if (project.media_type === 'video') videoRef.current?.play().catch(() => {}); }
  function onLeave() {
    if (project.media_type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }
  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    setMuted(m => { if (videoRef.current) videoRef.current.muted = !m; return !m; });
  }
  function toggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  }

  const radius = featured ? 20 : 14;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', background: '#111', cursor: 'pointer', width: '100%', height: '100%' }}>

      {project.media_type === 'video' ? (
        <video
          ref={videoRef}
          src={project.media_url}
          poster={project.thumbnail_url}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={project.thumbnail_url} alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}

      {/* Top-right controls */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        {project.media_type === 'video' && (
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '3px 9px', fontSize: 10, fontWeight: 700, color: '#fff' }}>
              <Play size={8} fill="#fff" /> VIDEO
            </span>
            <button onClick={toggleMute}
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {muted ? <VolumeX size={13} color="rgba(255,255,255,0.8)" /> : <Volume2 size={13} color="#fff" />}
            </button>
          </>
        )}
      </div>

      {/* Bottom overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.78) 0%, transparent 100%)', padding: featured ? '44px 16px 16px' : '28px 12px 10px' }}>
        {featured && (
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{project.title}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              <Eye size={11} /> {project.views >= 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: liked ? '#f87171' : 'rgba(255,255,255,0.7)' }}>
              <Heart size={11} fill={liked ? '#f87171' : 'none'} /> {likeCount}
            </span>
          </div>
          <button onClick={toggleLike}
            style={{ width: 28, height: 28, borderRadius: '50%', background: liked ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Heart size={13} fill={liked ? '#f87171' : 'none'} color={liked ? '#f87171' : '#fff'} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CreatorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const creator  = useMemo(() => DEMO_CREATORS.find(c => c.username === username), [username]);
  const projects = useMemo(() => DEMO_PROJECTS.filter(p => p.creator_username === username), [username]);

  const featuredProject = projects[0] ?? null;

  if (!creator) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Creator not found</h1>
        <Link href="/discover" style={{ color: LIME, textDecoration: 'none', fontSize: 14 }}>← Back to Discover</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#f2f0eb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .follow-btn:hover  { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        .invite-btn:hover  { background: #b6f23f !important; }
        @media (max-width: 860px) {
          .creator-hero  { flex-direction: column !important; gap: 32px !important; }
          .creator-left  { max-width: 100% !important; }
          .featured-wrap { max-width: 100% !important; height: 340px !important; margin: 0 auto !important; }
          .port-grid     { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .port-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <PublicHeader activePage="creators" />

      {/* Breadcrumb */}
      <div style={{ marginTop: 60, padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/discover"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}>
          Discover
        </Link>
        <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
        <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{creator.display_name}</span>
      </div>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '52px 28px 80px' }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div className="creator-hero" style={{ display: 'flex', gap: 56, alignItems: 'flex-start', marginBottom: 72 }}>

          {/* Left: Identity */}
          <div className="creator-left" style={{ maxWidth: 300, flexShrink: 0 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 20 }}>
              {creator.available_for_work && (
                <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: `3px solid ${LIME}`, boxShadow: `0 0 22px rgba(163,230,53,0.45)`, zIndex: 1 }} />
              )}
              {creator.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={creator.avatar_url} alt={creator.display_name}
                  style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 2 }} />
              ) : (
                <div style={{ width: 96, height: 96, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#0d0d0d' }}>{creator.display_name[0]}</span>
                </div>
              )}
            </div>

            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4, lineHeight: 1.1 }}>{creator.display_name}</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>@{creator.username}</p>

            {/* Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {creator.available_for_work && (
                <span title="This creator is open to UGCFire agency opportunities." style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: LIME }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: LIME, boxShadow: `0 0 6px ${LIME}` }} />
                  Available for Work
                </span>
              )}
              {creator.featured && (
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,92,0,0.1)', color: ORANGE, padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(255,92,0,0.2)' }}>
                  ✦ Featured
                </span>
              )}
            </div>

            {/* Specialties */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
              {creator.specialties.map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 700, background: SPECIALTY_COLORS[s], color: SPECIALTY_TEXT[s], padding: '3px 10px', borderRadius: 20 }}>{s}</span>
              ))}
            </div>

            {/* Bio */}
            {creator.bio && (
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 24 }}>{creator.bio}</p>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 28, borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              {[
                { label: 'Projects',  value: creator.projects_count },
                { label: 'Followers', value: creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}k` : creator.followers },
                { label: 'Since',     value: new Date(creator.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/signup" className="invite-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', transition: 'background 0.15s' }}>
                Follow
              </Link>
              {creator.available_for_work && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.5 }}>
                  This creator is open to UGCFire agency opportunities.
                </p>
              )}
            </div>
          </div>

          {/* Right: Featured project — constrained to portrait frame */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            {featuredProject ? (
              /* Constrained portrait frame: max 420px wide, 520px tall for vertical 9:16 */
              <div className="featured-wrap" style={{ width: '100%', maxWidth: 420, height: 520, position: 'relative' }}>
                <MediaCard project={featuredProject} featured />
              </div>
            ) : (
              <div className="featured-wrap" style={{ width: '100%', maxWidth: 420, height: 520, border: `1px dashed rgba(255,255,255,0.12)`, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>＋</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>Add Featured Project</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Choose one of your projects to highlight it</p>
              </div>
            )}
          </div>
        </div>

        {/* ── PORTFOLIO GRID ─────────────────────────────────────────────── */}
        {projects.length > 0 && (
          <div style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24, margin: '0 0 24px' }}>
              Portfolio
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.25)', marginLeft: 8 }}>{projects.length}</span>
            </h2>

            <div className="port-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {projects.map(p => (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Fixed card height for consistent grid */}
                  <div style={{ height: 280, borderRadius: 14, overflow: 'hidden' }}>
                    <MediaCard project={p} />
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500, lineHeight: 1.4, paddingLeft: 2 }}>{p.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', borderTop: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.25)' }}>No published projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
