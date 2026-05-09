'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { ChevronRight, Globe } from 'lucide-react';
import CreatorProjectCard from '@/components/creator/CreatorProjectCard';
import PublicHeader from '@/components/public/PublicHeader';
import { DEMO_CREATORS, DEMO_PROJECTS, SPECIALTY_COLORS, SPECIALTY_TEXT } from '@/lib/creatorNetwork';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

export default function CreatorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const creator  = useMemo(() => DEMO_CREATORS.find(c => c.username === username), [username]);
  const projects = useMemo(() => DEMO_PROJECTS.filter(p => p.creator_username === username), [username]);

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

      {/* Nav */}
      <PublicHeader activePage="creators" />

      {/* Breadcrumb */}
      <div style={{ marginTop: 60, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 6, background: '#0d0d0d', borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/discover" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
        >Discover</Link>
        <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
        <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>{creator.display_name}</span>
      </div>

      {/* Cover banner */}
      <div style={{ height: 180, background: 'linear-gradient(135deg, rgba(163,230,53,0.08) 0%, rgba(255,92,0,0.06) 50%, rgba(163,230,53,0.04) 100%)', borderBottom: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* Profile header */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginTop: -56, marginBottom: 32, display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {creator.available_for_work && (
              <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: `3px solid ${LIME}`, boxShadow: `0 0 20px rgba(163,230,53,0.5)` }} />
            )}
            {creator.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={creator.avatar_url} alt={creator.display_name}
                style={{ width: 112, height: 112, borderRadius: '50%', objectFit: 'cover', border: '4px solid #0d0d0d', display: 'block' }} />
            ) : (
              <div style={{ width: 112, height: 112, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #0d0d0d' }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: '#0d0d0d' }}>{creator.display_name[0]}</span>
              </div>
            )}
          </div>

          <div style={{ flex: 1, paddingBottom: 8, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{creator.display_name}</h1>
              {creator.featured && (
                <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,92,0,0.12)', color: ORANGE, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,92,0,0.2)' }}>
                  ✦ Featured Creator
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>@{creator.username}</div>

            {creator.available_for_work && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.05em', marginBottom: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, boxShadow: `0 0 6px ${LIME}` }} />
                Available for Work
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {creator.specialties.map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 700, background: SPECIALTY_COLORS[s], color: SPECIALTY_TEXT[s], padding: '3px 10px', borderRadius: 20 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
            {creator.available_for_work && (
              <Link href="/signup"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>
                Invite to Project
              </Link>
            )}
            <Link href="/signup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1e1e1e', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, padding: '10px 16px', borderRadius: 10, textDecoration: 'none', border: `1px solid ${BORDER}` }}>
              <Globe size={13} />
              Follow
            </Link>
          </div>
        </div>

        {/* Bio + stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, marginBottom: 40, alignItems: 'start' }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 540 }}>{creator.bio}</p>
          <div style={{ display: 'flex', gap: 28, background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 24px', flexShrink: 0 }}>
            {[
              { label: 'Projects', value: creator.projects_count },
              { label: 'Followers', value: creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}k` : creator.followers },
              { label: 'Member since', value: new Date(creator.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div style={{ width: 1, background: BORDER }} />}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Portfolio grid */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.02em' }}>
            Portfolio <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>({projects.length})</span>
          </h2>
          {projects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
              {projects.map(p => <CreatorProjectCard key={p.id} project={p} showCreator={false} />)}
            </div>
          ) : (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>No published projects yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
