'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ChevronDown } from 'lucide-react';
import CommunityPostCard from '@/components/community/CommunityPostCard';
import { DEMO_POSTS, STATUS_COLORS, type CommunityPost } from '@/lib/creatorNetwork';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type Cat = CommunityPost['category'] | 'All';

const CATEGORIES: Cat[] = ['All', 'Feature Request', 'Idea', 'Bug Report', 'General'];
const STATUSES: (NonNullable<CommunityPost['status']> | 'All')[] = ['All', 'Under Review', 'Planned', 'Building', 'Launched'];

export default function CommunityPage() {
  const [category,  setCategory]  = useState<Cat>('All');
  const [status,    setStatus]    = useState<NonNullable<CommunityPost['status']> | 'All'>('All');
  const [posts,     setPosts]     = useState<CommunityPost[]>(DEMO_POSTS);
  const [newTitle,  setNewTitle]  = useState('');
  const [newBody,   setNewBody]   = useState('');
  const [newCat,    setNewCat]    = useState<CommunityPost['category']>('Feature Request');
  const [composing, setComposing] = useState(false);

  const filtered = useMemo(() => posts
    .filter(p => category === 'All' || p.category === category)
    .filter(p => status  === 'All' || p.status   === status)
    .sort((a, b) => b.upvotes - a.upvotes),
  [posts, category, status]);

  function submitPost() {
    if (!newTitle.trim()) return;
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      author_name: 'you',
      author_avatar: null,
      category: newCat,
      title: newTitle.trim(),
      body: newBody.trim(),
      upvotes: 0,
      comment_count: 0,
      status: null,
      created_at: new Date().toISOString(),
    };
    setPosts(prev => [post, ...prev]);
    setNewTitle('');
    setNewBody('');
    setComposing(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#f2f0eb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#0d0d0ddd', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}`, height: 60, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Image src={LOGO_URL} alt="UGCFire.ai" width={110} height={28} style={{ objectFit: 'contain', height: 26, width: 'auto' }} unoptimized />
        </Link>
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {[{ label: 'Discover', href: '/discover' }, { label: 'Community', href: '/community' }].map(l => (
            <Link key={l.label} href={l.href}
              style={{ fontSize: 13.5, fontWeight: 600, color: l.href === '/community' ? LIME : 'rgba(255,255,255,0.5)', padding: '5px 10px', borderBottom: l.href === '/community' ? `2px solid ${LIME}` : '2px solid transparent', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER}`, borderRadius: 8 }}>Login</Link>
          <Link href="/signup" style={{ fontSize: 13, fontWeight: 700, color: '#0d0d0d', textDecoration: 'none', padding: '6px 14px', background: LIME, borderRadius: 8 }}>Sign up</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.07em', marginBottom: 14 }}>
            💬 Community
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6 }}>Feature Board</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Vote on features, suggest ideas, and track what we&apos;re building.</p>
            </div>
            <button onClick={() => setComposing(c => !c)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              <Plus size={14} />
              New Post
            </button>
          </div>
        </div>

        {/* Compose */}
        {composing && (
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <select value={newCat} onChange={e => setNewCat(e.target.value as CommunityPost['category'])}
                  style={{ appearance: 'none', background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '7px 30px 7px 12px', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {(['Feature Request', 'Idea', 'Bug Report', 'General'] as CommunityPost['category'][]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Title (e.g. Add music sync for generated videos)"
              style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }}
            />
            <textarea
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              placeholder="Describe your idea or feature request…"
              rows={3}
              style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: 14, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setComposing(false)}
                style={{ padding: '8px 16px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={submitPost} disabled={!newTitle.trim()}
                style={{ padding: '8px 18px', background: newTitle.trim() ? LIME : 'rgba(163,230,53,0.3)', color: '#0d0d0d', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: newTitle.trim() ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                Post
              </button>
            </div>
          </div>
        )}

        {/* Status legend */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {(Object.entries(STATUS_COLORS) as [NonNullable<CommunityPost['status']>, { bg: string; text: string }][]).map(([s, c]) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: c.text }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.text }} />
              {s}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${category === c ? LIME : BORDER}`, background: category === c ? 'rgba(163,230,53,0.1)' : 'transparent', color: category === c ? LIME : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${status === s ? ORANGE : BORDER}`, background: status === s ? 'rgba(255,92,0,0.08)' : 'transparent', color: status === s ? ORANGE : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => <CommunityPostCard key={p.id} post={p} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
              No posts match this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
