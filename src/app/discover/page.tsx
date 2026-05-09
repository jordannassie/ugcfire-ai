'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import CreatorProjectCard from '@/components/creator/CreatorProjectCard';
import {
  DEMO_CREATORS, DEMO_PROJECTS,
  type CreatorSpecialty,
} from '@/lib/creatorNetwork';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const ALL_SPECIALTIES: CreatorSpecialty[] = [
  'Beauty', 'Fitness', 'Ecommerce', 'Food & Beverage', 'Tech', 'Fashion', 'Lifestyle', 'Local Business',
];

type FeedView = 'projects' | 'creators';

export default function DiscoverPage() {
  const [view,      setView]      = useState<FeedView>('projects');
  const [specialty, setSpecialty] = useState<CreatorSpecialty | 'All'>('All');
  const [search,    setSearch]    = useState('');
  const [afwOnly,   setAfwOnly]   = useState(false);

  const filteredProjects = useMemo(() => DEMO_PROJECTS.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.creator_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty !== 'All' && !p.tags.some(t => t.toLowerCase().includes(specialty.toLowerCase()))) return false;
    return true;
  }), [search, specialty]);

  const filteredCreators = useMemo(() => DEMO_CREATORS.filter(c => {
    if (afwOnly && !c.available_for_work) return false;
    if (search && !c.display_name.toLowerCase().includes(search.toLowerCase()) && !c.username.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty !== 'All' && !c.specialties.some(s => s === specialty)) return false;
    return true;
  }), [search, specialty, afwOnly]);

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
              style={{ fontSize: 13.5, fontWeight: 600, color: l.href === '/discover' ? LIME : 'rgba(255,255,255,0.5)', padding: '5px 10px', borderBottom: l.href === '/discover' ? `2px solid ${LIME}` : '2px solid transparent', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER}`, borderRadius: 8 }}>Login</Link>
          <Link href="/signup" style={{ fontSize: 13, fontWeight: 700, color: '#0d0d0d', textDecoration: 'none', padding: '6px 14px', background: LIME, borderRadius: 8 }}>Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(163,230,53,0.06) 0%, transparent 100%)', borderBottom: `1px solid ${BORDER}`, padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
          ✦ Creator Network
        </div>
        <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
          Discover AI UGC Creators
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Browse AI-generated ad projects and creator portfolios. Find your next brand collab.
        </p>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 440, margin: '0 auto', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 14px', gap: 10 }}>
          <Search size={16} color="rgba(255,255,255,0.3)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search creators or projects…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>

          {/* View toggle */}
          <div style={{ display: 'flex', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 3, gap: 3 }}>
            {(['projects', 'creators'] as FeedView[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                  background: view === v ? LIME : 'transparent',
                  color: view === v ? '#0d0d0d' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.12s' }}>
                {v === 'projects' ? '🎬 Projects' : '👤 Creators'}
              </button>
            ))}
          </div>

          {/* Specialty pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['All', ...ALL_SPECIALTIES] as (CreatorSpecialty | 'All')[]).map(s => (
              <button key={s} onClick={() => setSpecialty(s)}
                style={{ padding: '5px 13px', borderRadius: 20, border: `1px solid ${specialty === s ? LIME : BORDER}`, background: specialty === s ? 'rgba(163,230,53,0.1)' : 'transparent', color: specialty === s ? LIME : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Available for Work toggle (creators view only) */}
          {view === 'creators' && (
            <button onClick={() => setAfwOnly(a => !a)}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1px solid ${afwOnly ? 'rgba(163,230,53,0.4)' : BORDER}`, background: afwOnly ? 'rgba(163,230,53,0.1)' : 'transparent', color: afwOnly ? LIME : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: afwOnly ? LIME : 'rgba(255,255,255,0.2)', boxShadow: afwOnly ? `0 0 6px ${LIME}` : 'none' }} />
              Available for Work only
            </button>
          )}
        </div>

        {/* Feed */}
        {view === 'projects' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14, paddingBottom: 60 }}>
            {filteredProjects.map(p => <CreatorProjectCard key={p.id} project={p} />)}
            {filteredProjects.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                No projects found for this filter.
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, paddingBottom: 60 }}>
            {filteredCreators.map(c => <CreatorCard key={c.id} creator={c} />)}
            {filteredCreators.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                No creators match this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
