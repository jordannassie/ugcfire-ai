'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import PublicHeader from '@/components/public/PublicHeader';
import { DEMO_CREATORS, type CreatorSpecialty } from '@/lib/creatorNetwork';

const LIME   = '#a3e635';
const BG     = '#0d0d0d';
const BORDER = 'rgba(255,255,255,0.07)';

const ALL_SPECIALTIES: CreatorSpecialty[] = [
  'Beauty', 'Fitness', 'Ecommerce', 'Food & Beverage', 'Tech', 'Fashion', 'Lifestyle', 'Local Business',
];

export default function CreatorsPage() {
  const [specialty, setSpecialty] = useState<CreatorSpecialty | 'All'>('All');
  const [search,    setSearch]    = useState('');
  const [afwOnly,   setAfwOnly]   = useState(false);

  const filtered = useMemo(() => DEMO_CREATORS.filter(c => {
    if (afwOnly && !c.available_for_work) return false;
    if (search && !c.display_name.toLowerCase().includes(search.toLowerCase()) && !c.username.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty !== 'All' && !c.specialties.some(s => s === specialty)) return false;
    return true;
  }), [search, specialty, afwOnly]);

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#f2f0eb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <PublicHeader activePage="creators" />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(163,230,53,0.06) 0%, transparent 100%)', borderBottom: `1px solid ${BORDER}`, padding: '48px 24px 40px', textAlign: 'center', marginTop: 60 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
          Creator Network
        </div>
        <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
          Browse AI Creators
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          Vetted AI creators producing UGC-style image and video ads for brand campaigns.
        </p>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, maxWidth: 340, background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <Search size={13} color="rgba(255,255,255,0.3)" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search creators..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#fff', width: '100%', fontFamily: 'inherit' }} />
          </div>

          {/* Available for work toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 12, color: afwOnly ? LIME : 'rgba(255,255,255,0.45)', fontWeight: afwOnly ? 700 : 500, background: afwOnly ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${afwOnly ? 'rgba(163,230,53,0.25)' : BORDER}`, borderRadius: 8, padding: '7px 12px', userSelect: 'none' }}>
            <input type="checkbox" checked={afwOnly} onChange={e => setAfwOnly(e.target.checked)} style={{ display: 'none' }} />
            Available for work
          </label>
        </div>

        {/* Specialty filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {(['All', ...ALL_SPECIALTIES] as const).map(s => (
            <button key={s} onClick={() => setSpecialty(s)}
              style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${specialty === s ? 'rgba(163,230,53,0.35)' : BORDER}`, background: specialty === s ? 'rgba(163,230,53,0.1)' : 'transparent', color: specialty === s ? LIME : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 18, fontWeight: 500 }}>
          {filtered.length} creator{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, paddingBottom: 60 }}>
          {filtered.map(creator => (
            <CreatorCard key={creator.username} creator={creator} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            No creators match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
