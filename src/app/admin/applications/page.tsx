'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Check, Star, X } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

type ReviewStatus = 'New' | 'Shortlisted' | 'Invited' | 'Declined';

interface FlatApplication {
  appId: string; projectId: string; projectTitle: string; brandName: string;
  creatorName: string; creatorInitials: string; creatorColor: string;
  role: string; skills: string[]; portfolioCount: number;
  message: string; originalStatus: string;
}

const STATUS_COLORS: Record<ReviewStatus, { color: string; bg: string; border: string }> = {
  'New':        { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',   border: 'rgba(34,211,238,0.25)' },
  'Shortlisted':{ color: LIME,     bg: 'rgba(163,230,53,0.1)',   border: 'rgba(163,230,53,0.25)' },
  'Invited':    { color: ORANGE,   bg: `${ORANGE}18`,            border: `${ORANGE}30`           },
  'Declined':   { color: '#6b7280',bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
};

export const dynamic = 'force-dynamic';

export default function AdminApplicationsPage() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'All' | ReviewStatus>('All');
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>({});

  const allApps = useMemo<FlatApplication[]>(() => {
    const list: FlatApplication[] = [];
    MOCK_PROJECTS.forEach(p => {
      p.applicants.forEach(a => {
        list.push({
          appId: a.id, projectId: p.id, projectTitle: p.title, brandName: p.brandName,
          creatorName: a.name, creatorInitials: a.initials, creatorColor: a.color,
          role: a.role, skills: a.skills, portfolioCount: a.portfolioCount,
          message: a.message, originalStatus: a.status,
        });
      });
    });
    return list;
  }, []);

  function getStatus(app: FlatApplication): ReviewStatus {
    if (statuses[app.appId]) return statuses[app.appId];
    if (app.originalStatus === 'Shortlisted') return 'Shortlisted';
    if (app.originalStatus === 'Invited') return 'Invited';
    if (app.originalStatus === 'Declined') return 'Declined';
    return 'New';
  }

  function setAction(appId: string, action: ReviewStatus) {
    setStatuses(prev => ({ ...prev, [appId]: action }));
  }

  const filtered = allApps.filter(a => {
    const match = !search || a.creatorName.toLowerCase().includes(search.toLowerCase()) || a.projectTitle.toLowerCase().includes(search.toLowerCase());
    const st    = getStatus(a);
    return match && (filter === 'All' || st === filter);
  });

  const counts = { All: allApps.length, New: 0, Shortlisted: 0, Invited: 0, Declined: 0 };
  allApps.forEach(a => { const s = getStatus(a); counts[s]++; });

  return (
    <>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Application Review Queue
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
            {counts.New} new applications waiting for review
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 300 }}>
            <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search creator or project..."
              style={{ width: '100%', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 12px 9px 32px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['All', 'New', 'Shortlisted', 'Invited', 'Declined'] as const).map(f => {
              const c = f === 'All' ? 'rgba(255,255,255,0.45)' : STATUS_COLORS[f]?.color ?? 'rgba(255,255,255,0.45)';
              return (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${filter === f ? c : BORDER}`,
                    background: filter === f ? `${c}18` : 'transparent',
                    color: filter === f ? c : 'rgba(255,255,255,0.45)' }}>
                  {f} {counts[f as keyof typeof counts] > 0 ? `(${counts[f as keyof typeof counts]})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Application cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '48px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
              No applications match your filters.
            </div>
          ) : filtered.map(app => {
            const st     = getStatus(app);
            const sc     = STATUS_COLORS[st];
            const isNew  = st === 'New';
            return (
              <div key={app.appId} style={{ background: PANEL, border: `1px solid ${isNew ? 'rgba(34,211,238,0.18)' : BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {/* Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${app.creatorColor}20`, border: `2px solid ${app.creatorColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: app.creatorColor, flexShrink: 0 }}>
                    {app.creatorInitials}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{app.creatorName}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{app.role}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '2px 9px', borderRadius: 20 }}>{st}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                      Applied to: <Link href={`/admin/projects/${app.projectId}`} style={{ color: ORANGE, textDecoration: 'none', fontWeight: 600 }}>{app.projectTitle}</Link>
                      <span style={{ marginLeft: 6, color: 'rgba(255,255,255,0.3)' }}>· {app.brandName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {app.skills.map(sk => (
                        <span key={sk} style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '2px 8px' }}>{sk}</span>
                      ))}
                      <span style={{ fontSize: 10, background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.2)', color: LIME, borderRadius: 6, padding: '2px 8px' }}>
                        {app.portfolioCount} portfolio pieces
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      &ldquo;{app.message}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                    <button onClick={() => setAction(app.appId, 'Shortlisted')} disabled={st === 'Shortlisted'}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, cursor: st === 'Shortlisted' ? 'default' : 'pointer', fontFamily: 'inherit', border: `1px solid ${LIME}40`, background: st === 'Shortlisted' ? `${LIME}18` : 'transparent', color: LIME, opacity: st === 'Declined' ? 0.4 : 1 }}>
                      <Star size={12} strokeWidth={2} /> Shortlist
                    </button>
                    <button onClick={() => setAction(app.appId, 'Invited')} disabled={st === 'Invited'}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, cursor: st === 'Invited' ? 'default' : 'pointer', fontFamily: 'inherit', border: `1px solid ${ORANGE}40`, background: st === 'Invited' ? `${ORANGE}18` : 'transparent', color: ORANGE, opacity: st === 'Declined' ? 0.4 : 1 }}>
                      <Check size={12} strokeWidth={2.5} /> Invite
                    </button>
                    <button onClick={() => setAction(app.appId, 'Declined')} disabled={st === 'Declined'}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, cursor: st === 'Declined' ? 'default' : 'pointer', fontFamily: 'inherit', border: `1px solid rgba(107,114,128,0.3)`, background: st === 'Declined' ? 'rgba(107,114,128,0.15)' : 'transparent', color: st === 'Declined' ? '#6b7280' : 'rgba(255,255,255,0.4)' }}>
                      <X size={12} strokeWidth={2.5} /> Decline
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
