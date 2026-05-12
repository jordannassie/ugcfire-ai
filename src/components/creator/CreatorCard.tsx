'use client';

import React from 'react';
import Link from 'next/link';
import { CreatorProfile, SPECIALTY_COLORS, SPECIALTY_TEXT } from '@/lib/creatorNetwork';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const PANEL  = 'var(--card)';
const BORDER = 'var(--border)';

interface Props {
  creator: CreatorProfile;
  adminActions?: boolean;
  onSave?: (id: string) => void;
  onFeature?: (id: string) => void;
  onInvite?: (id: string) => void;
}

export default function CreatorCard({ creator, adminActions, onSave, onFeature, onInvite }: Props) {
  return (
    <div style={{
      background: PANEL,
      border: `1px solid ${creator.featured ? 'rgba(163,230,53,0.25)' : BORDER}`,
      borderRadius: 18,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: creator.featured ? '0 0 28px rgba(163,230,53,0.06)' : 'none',
      transition: 'transform 0.15s, border-color 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      {/* Avatar section */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {/* Avatar with optional lime ring */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          {creator.available_for_work && (
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: `2.5px solid ${LIME}`,
              boxShadow: `0 0 12px rgba(163,230,53,0.5), inset 0 0 8px rgba(163,230,53,0.1)`,
              pointerEvents: 'none',
            }} />
          )}
          {creator.avatar_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={creator.avatar_url}
              alt={creator.display_name}
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(163,230,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: LIME }}>{creator.display_name[0]}</span>
            </div>
          )}
          {creator.featured && (
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, border: '2px solid #0d0d0d' }}>
              Featured
            </div>
          )}
        </div>

        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 2, textAlign: 'center' }}>{creator.display_name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 8 }}>@{creator.username}</div>

        {creator.available_for_work && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: LIME, letterSpacing: '0.05em', marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: LIME, display: 'inline-block', boxShadow: `0 0 6px ${LIME}` }} />
            Open to Work
          </div>
        )}

        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.65, textAlign: 'center', marginBottom: 12, maxWidth: 200 }}>
          {creator.bio.length > 80 ? creator.bio.slice(0, 80) + '…' : creator.bio}
        </p>

        {/* Specialties */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 14 }}>
          {creator.specialties.map(s => (
            <span key={s} style={{ fontSize: 10, fontWeight: 700, background: SPECIALTY_COLORS[s], color: SPECIALTY_TEXT[s], padding: '2px 8px', borderRadius: 20 }}>{s}</span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{creator.projects_count}</div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Projects</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}k` : creator.followers}</div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Followers</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link href={`/creators/${creator.username}`}
          style={{ display: 'block', textAlign: 'center', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 13, padding: '9px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.12s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b6f23f'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = LIME; }}>
          View Portfolio
        </Link>

        {adminActions && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onSave?.(creator.id)}
              style={{ flex: 1, padding: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit' }}>
              Save
            </button>
            <button onClick={() => onFeature?.(creator.id)}
              style={{ flex: 1, padding: '7px', background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: ORANGE, cursor: 'pointer', fontFamily: 'inherit' }}>
              Feature
            </button>
            <button onClick={() => onInvite?.(creator.id)}
              style={{ flex: 1, padding: '7px', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: LIME, cursor: 'pointer', fontFamily: 'inherit' }}>
              Invite
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
