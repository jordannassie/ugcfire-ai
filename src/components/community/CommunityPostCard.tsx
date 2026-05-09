'use client';

import React, { useState } from 'react';
import { CommunityPost, STATUS_COLORS } from '@/lib/creatorNetwork';

const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.08)';
const LIME   = '#a3e635';

const CAT_COLORS: Record<CommunityPost['category'], { bg: string; text: string }> = {
  'Feature Request': { bg: 'rgba(163,230,53,0.1)',  text: '#a3e635' },
  'Bug Report':      { bg: 'rgba(239,68,68,0.1)',   text: '#f87171' },
  'Idea':            { bg: 'rgba(99,102,241,0.12)', text: '#818cf8' },
  'General':         { bg: 'rgba(255,255,255,0.06)',text: 'rgba(255,255,255,0.5)' },
};

interface Props {
  post: CommunityPost;
}

export default function CommunityPostCard({ post }: Props) {
  const [upvoted, setUpvoted] = useState(false);
  const cat = CAT_COLORS[post.category];

  return (
    <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 16, transition: 'border-color 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; }}>

      {/* Upvote column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
        <button onClick={() => setUpvoted(u => !u)}
          style={{ width: 36, height: 36, borderRadius: 10, background: upvoted ? 'rgba(163,230,53,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${upvoted ? 'rgba(163,230,53,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={upvoted ? LIME : 'none'} stroke={upvoted ? LIME : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: upvoted ? LIME : '#fff' }}>{post.upvotes + (upvoted ? 1 : 0)}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: cat.bg, color: cat.text, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em' }}>
            {post.category}
          </span>
          {post.status && (
            <span style={{ fontSize: 10, fontWeight: 700, background: STATUS_COLORS[post.status].bg, color: STATUS_COLORS[post.status].text, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em' }}>
              {post.status}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{post.title}</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, marginBottom: 10 }}>
          {post.body.length > 140 ? post.body.slice(0, 140) + '…' : post.body}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {post.author_avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={post.author_avatar} alt={post.author_name} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#0d0d0d' }}>{post.author_name[0]}</span>
            </div>
          )}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>@{post.author_name}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            {post.comment_count}
          </span>
        </div>
      </div>
    </div>
  );
}
