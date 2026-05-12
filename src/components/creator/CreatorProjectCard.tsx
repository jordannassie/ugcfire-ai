'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';
import { CreatorProject } from '@/lib/creatorNetwork';

const LIME   = '#a3e635';
const PANEL  = 'var(--card)';
const BORDER = 'var(--border)';

interface Props {
  project: CreatorProject;
  showCreator?: boolean;
}

export default function CreatorProjectCard({ project, showCreator = true }: Props) {
  const [liked,  setLiked]  = useState(false);
  const [muted,  setMuted]  = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    setMuted(m => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  }

  function onCardMouseEnter() {
    if (project.media_type !== 'video' || !videoRef.current) return;
    const vid = videoRef.current;
    vid.muted = false;
    setMuted(false);
    vid.play().catch(() => {
      // Browser blocked unmuted autoplay — fall back to muted
      vid.muted = true;
      setMuted(true);
      vid.play().catch(() => {});
    });
  }
  function onCardMouseLeave() {
    if (project.media_type !== 'video' || !videoRef.current) return;
    videoRef.current.muted = true;
    setMuted(true);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }

  return (
    <div
      style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.16)'; onCardMouseEnter(); }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; onCardMouseLeave(); }}>

      {/* Thumbnail / video */}
      <div style={{ position: 'relative', aspectRatio: '9/14', overflow: 'hidden' }}>
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
          <img src={project.thumbnail_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)', pointerEvents: 'none' }} />

        {/* Top-right: type pill + mute button */}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text)' }}>
            {project.media_type === 'video' ? 'Video' : 'Image'}
          </span>
          {project.media_type === 'video' && (
            <button onClick={toggleMute}
              style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {muted ? <VolumeX size={12} color="var(--text-faint)" /> : <Volume2 size={12} color="#fff" />}
            </button>
          )}
        </div>

        {/* Bottom stats + heart */}
        <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {project.views >= 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views}
            </span>
            <span style={{ fontSize: 11, color: liked ? '#f43f5e' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill={liked ? '#f43f5e' : 'none'} stroke={liked ? '#f43f5e' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              {project.likes + (liked ? 1 : 0)}
            </span>
          </div>
          <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? '#f43f5e' : 'none'} stroke={liked ? '#f43f5e' : 'rgba(255,255,255,0.7)'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>{project.title}</div>
        {showCreator && (
          <Link href={`/creators/${project.creator_username}`} style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', marginBottom: 8 }}>
            {project.creator_avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={project.creator_avatar} alt={project.creator_name} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#0d0d0d' }}>{project.creator_name[0]}</span>
              </div>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{project.creator_username}</span>
          </Link>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.tags.slice(0, 3).map(t => (
            <span key={t} style={{ fontSize: 9.5, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 6 }}>#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
