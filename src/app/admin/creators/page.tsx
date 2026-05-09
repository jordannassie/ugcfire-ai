'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import { DEMO_CREATORS, type CreatorSpecialty } from '@/lib/creatorNetwork';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

const ALL_SPECIALTIES: (CreatorSpecialty | 'All')[] = [
  'All', 'Beauty', 'Fitness', 'Ecommerce', 'Food & Beverage', 'Tech', 'Fashion', 'Lifestyle', 'Local Business',
];

export const dynamic = 'force-dynamic';

export default function AdminCreatorsPage() {
  const [filter,  setFilter]  = useState<'All' | 'Available' | 'Featured' | 'Saved'>('All');
  const [spec,    setSpec]    = useState<CreatorSpecialty | 'All'>('All');
  const [search,  setSearch]  = useState('');
  const [saved,   setSaved]   = useState<Set<string>>(new Set());
  const [featured,setFeatured]= useState<Set<string>>(new Set(DEMO_CREATORS.filter(c => c.featured).map(c => c.id)));
  const [inviteModal, setInviteModal] = useState<string | null>(null);
  const [inviteNote,  setInviteNote]  = useState('');

  const creators = useMemo(() => {
    return DEMO_CREATORS.filter(c => {
      if (search && !c.display_name.toLowerCase().includes(search.toLowerCase()) && !c.username.toLowerCase().includes(search.toLowerCase())) return false;
      if (spec !== 'All' && !c.specialties.includes(spec as CreatorSpecialty)) return false;
      if (filter === 'Available' && !c.available_for_work) return false;
      if (filter === 'Featured' && !featured.has(c.id)) return false;
      if (filter === 'Saved' && !saved.has(c.id)) return false;
      return true;
    });
  }, [search, spec, filter, saved, featured]);

  function handleSave(id: string) {
    setSaved(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function handleFeature(id: string) {
    setFeatured(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function handleInvite(id: string) { setInviteModal(id); setInviteNote(''); }

  const creator = inviteModal ? DEMO_CREATORS.find(c => c.id === inviteModal) : null;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 28 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Creator Network</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>Discover, feature, and invite top AI UGC creators.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Creators', value: DEMO_CREATORS.length },
          { label: 'Available for Work', value: DEMO_CREATORS.filter(c => c.available_for_work).length, color: LIME },
          { label: 'Featured', value: featured.size, color: ORANGE },
          { label: 'Saved', value: saved.size },
        ].map(s => (
          <div key={s.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color || '#fff', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 12px', flex: '0 0 220px' }}>
          <Search size={13} color="rgba(255,255,255,0.3)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search creators…"
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'inherit', width: '100%' }} />
        </div>

        {/* Status filter */}
        {(['All', 'Available', 'Featured', 'Saved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filter === f ? LIME : BORDER}`, background: filter === f ? 'rgba(163,230,53,0.1)' : 'transparent', color: filter === f ? LIME : 'rgba(255,255,255,0.45)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {f}
          </button>
        ))}

        {/* Specialty */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ALL_SPECIALTIES.slice(0, 6).map(s => (
            <button key={s} onClick={() => setSpec(s as CreatorSpecialty | 'All')}
              style={{ padding: '5px 11px', borderRadius: 20, border: `1px solid ${spec === s ? ORANGE : BORDER}`, background: spec === s ? 'rgba(255,92,0,0.08)' : 'transparent', color: spec === s ? ORANGE : 'rgba(255,255,255,0.4)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16, paddingBottom: 40 }}>
        {creators.map(c => (
          <CreatorCard
            key={c.id}
            creator={{ ...c, featured: featured.has(c.id) }}
            adminActions
            onSave={handleSave}
            onFeature={handleFeature}
            onInvite={handleInvite}
          />
        ))}
        {creators.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            No creators match this filter.
          </div>
        )}
      </div>

      {/* Invite modal */}
      {inviteModal && creator && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setInviteModal(null); }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 460 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Invite to Project</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              Send a project brief to <strong style={{ color: LIME }}>{creator.display_name}</strong>
            </p>
            <textarea
              value={inviteNote}
              onChange={e => setInviteNote(e.target.value)}
              placeholder="Describe the project brief, budget, timeline…"
              rows={5}
              style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setInviteModal(null)}
                style={{ padding: '9px 18px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={() => setInviteModal(null)}
                style={{ padding: '9px 18px', background: LIME, color: '#0d0d0d', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
