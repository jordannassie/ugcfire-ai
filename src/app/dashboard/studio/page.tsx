'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Play, Heart, Video, ImageIcon } from 'lucide-react';
import HoverVideoPreview from '@/components/shared/HoverVideoPreview';
import {
  DEMO_VIDEO_GENS, DEMO_IMAGE_GENS, LS_VIDEO_GENS, LS_IMAGE_GENS,
  loadFromLS, formatGenDate,
  type VideoGeneration, type ImageGeneration,
} from '@/lib/demoAssets';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type GenItem = (VideoGeneration & { kind: 'video' }) | (ImageGeneration & { kind: 'image' });

export default function StudioPage() {
  const [tab,      setTab]      = useState<'all' | 'images' | 'videos' | 'favorites'>('all');
  const [search,   setSearch]   = useState('');
  const [items,    setItems]    = useState<GenItem[]>([]);
  const [liked,    setLiked]    = useState<Set<string>>(new Set());
  const [mobile,   setMobile]   = useState(false);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const videos = loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS).map(g => ({ ...g, kind: 'video' as const }));
    const images = loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS).map(g => ({ ...g, kind: 'image' as const }));
    // merge + sort by date
    const merged: GenItem[] = [...videos, ...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setItems(merged);
  }, []);

  function toggleLike(id: string) {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = items.filter(item => {
    if (tab === 'videos' && item.kind !== 'video') return false;
    if (tab === 'images' && item.kind !== 'image') return false;
    if (tab === 'favorites' && !liked.has(item.id)) return false;
    if (search && !item.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: mobile ? '16px' : '28px', background: BG }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Studio</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>All your generated content in one place.</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#111', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 3, gap: 2 }}>
          {(['All', 'Images', 'Videos', 'Favorites'] as const).map(t => {
            const key = t.toLowerCase() as 'all' | 'images' | 'videos' | 'favorites';
            const isActive = tab === key;
            return (
              <button key={t} onClick={() => setTab(key)}
                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: isActive ? 700 : 500, background: isActive ? '#222' : 'none', border: 'none', cursor: 'pointer', color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', fontFamily: 'inherit', transition: 'all 0.12s', whiteSpace: 'nowrap' }}>
                {t}
              </button>
            );
          })}
        </div>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 7 }}>
            <Search size={13} color="rgba(255,255,255,0.3)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by prompt…"
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'rgba(255,255,255,0.55)', width: 180, fontFamily: 'inherit' }}
            />
          </div>
          <button style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.55)', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
            <Filter size={13} />
            Filter
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))', gap: mobile ? 8 : 12 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ borderRadius: 14, overflow: 'hidden', background: PANEL, border: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'border-color 0.15s', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; }}>

              {/* Media */}
              {item.kind === 'video' ? (
                <div style={{ position: 'relative' }}>
                  <HoverVideoPreview src={(item as VideoGeneration).videoSrc} autoPlay loop style={{ height: mobile ? 160 : 240 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                      <Play size={12} color="#fff" fill="#fff" />
                    </div>
                  </div>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={(item as ImageGeneration).imageSrc} alt="" style={{ width: '100%', height: mobile ? 140 : 200, objectFit: 'cover', display: 'block' }} />
              )}

              {/* Card footer */}
              <div style={{ padding: '10px 12px' }}>
                {/* Type badge + date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: item.kind === 'video' ? 'rgba(255,92,0,0.12)' : 'rgba(163,230,53,0.1)', border: `1px solid ${item.kind === 'video' ? 'rgba(255,92,0,0.3)' : 'rgba(163,230,53,0.25)'}`, borderRadius: 20, padding: '2px 8px' }}>
                    {item.kind === 'video'
                      ? <Video size={10} color={ORANGE} strokeWidth={2} />
                      : <ImageIcon size={10} color={LIME} strokeWidth={2} />
                    }
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.kind === 'video' ? ORANGE : LIME }}>{item.kind === 'video' ? 'Video' : 'Image'}</span>
                  </div>
                </div>

                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, lineHeight: 1.4 }}>
                  {item.prompt.slice(0, 60)}{item.prompt.length > 60 ? '…' : ''}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{item.model}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); toggleLike(item.id); }}
                      style={{ width: 24, height: 24, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={12} color={liked.has(item.id) ? '#ef4444' : 'rgba(255,255,255,0.3)'} fill={liked.has(item.id) ? '#ef4444' : 'none'} />
                    </button>
                    <button onClick={e => e.stopPropagation()}
                      style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Download size={11} color="rgba(255,255,255,0.5)" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {tab === 'videos' ? <Video size={22} color="rgba(255,255,255,0.2)" /> : <ImageIcon size={22} color="rgba(255,255,255,0.2)" />}
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>
            {tab === 'favorites' ? 'No favorites yet.' : 'No generations yet.'}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
            {tab === 'favorites' ? 'Heart content to save it here.' : 'Create your first image or video.'}
          </p>
        </div>
      )}
    </div>
  );
}
