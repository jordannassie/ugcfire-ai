'use client';

import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BORDER = 'var(--border)';

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  Pro:        { bg: 'rgba(163,230,53,0.12)',  text: LIME   },
  Creator:    { bg: 'rgba(255,92,0,0.12)',    text: ORANGE },
  Starter:    { bg: 'rgba(234,179,8,0.12)',   text: '#eab308' },
  Enterprise: { bg: 'rgba(139,92,246,0.12)',  text: '#a78bfa' },
  Free:       { bg: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.5)' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:    { bg: 'rgba(34,197,94,0.1)',  text: '#22c55e' },
  Inactive:  { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.38)' },
  Suspended: { bg: 'rgba(239,68,68,0.1)',  text: '#ef4444' },
};

const DEMO_USERS = [
  { id: 1,  name: 'Sarah Johnson', email: 'sarah.j@example.com',    plan: 'Pro',        status: 'Active',   joined: 'May 9, 2026',   color: '#8b5cf6' },
  { id: 2,  name: 'Mike Chen',     email: 'mike.chen@example.com',  plan: 'Creator',    status: 'Active',   joined: 'May 9, 2026',   color: '#06b6d4' },
  { id: 3,  name: 'Alex Rivera',   email: 'alex.rivera@example.com',plan: 'Starter',    status: 'Active',   joined: 'May 9, 2026',   color: '#22c55e' },
  { id: 4,  name: 'Jessica Lee',   email: 'jessica.lee@example.com',plan: 'Pro',        status: 'Active',   joined: 'May 8, 2026',   color: ORANGE    },
  { id: 5,  name: 'Ryan Patel',    email: 'ryan.patel@example.com', plan: 'Creator',    status: 'Active',   joined: 'May 7, 2026',   color: '#f472b6' },
  { id: 6,  name: 'Emma Nguyen',   email: 'emma.n@example.com',     plan: 'Enterprise', status: 'Active',   joined: 'May 6, 2026',   color: '#a78bfa' },
  { id: 7,  name: 'Jordan Kim',    email: 'j.kim@example.com',      plan: 'Pro',        status: 'Active',   joined: 'May 5, 2026',   color: '#34d399' },
  { id: 8,  name: 'Taylor Smith',  email: 't.smith@example.com',    plan: 'Free',       status: 'Inactive', joined: 'May 4, 2026',   color: '#fbbf24' },
  { id: 9,  name: 'Chris Wang',    email: 'c.wang@example.com',     plan: 'Starter',    status: 'Active',   joined: 'May 3, 2026',   color: '#60a5fa' },
  { id: 10, name: 'Morgan Hall',   email: 'm.hall@example.com',     plan: 'Creator',    status: 'Active',   joined: 'May 2, 2026',   color: '#f87171' },
  { id: 11, name: 'Sam Torres',    email: 's.torres@example.com',   plan: 'Pro',        status: 'Active',   joined: 'May 1, 2026',   color: '#c084fc' },
  { id: 12, name: 'Avery Scott',   email: 'a.scott@example.com',    plan: 'Free',       status: 'Suspended',joined: 'Apr 30, 2026',  color: '#94a3b8' },
];

function Badge({ label, colors }: { label: string; colors: { bg: string; text: string } }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: colors.bg, color: colors.text }}>
      {label}
    </span>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = DEMO_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4 }}>Users</h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>{DEMO_USERS.length.toLocaleString()} total users on the platform.</p>
        </div>
        <button style={{ background: LIME, color: '#0d0d0d', border: 'none', padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Invite User
        </button>
      </div>

      {/* Search */}
      <div style={{ background: 'var(--card)', border: `1px solid ${BORDER}`, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '8px 14px', gap: 9, marginBottom: 16, maxWidth: 380 }}>
        <Search size={13} color="var(--text-faint)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', width: '100%', fontFamily: 'inherit' }} />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>

        {/* Table head */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1fr 1.2fr 80px', padding: '10px 18px', borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
          {['Name', 'Email', 'Plan', 'Status', 'Joined', ''].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((u, i) => (
          <div key={u.id}
            style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1fr 1.2fr 80px', padding: '13px 18px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.12s', cursor: 'default' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
            {/* Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: u.color + '2a', border: `1px solid ${u.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: u.color }}>{u.name[0]}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{u.name}</span>
            </div>
            {/* Email */}
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</span>
            {/* Plan */}
            <Badge label={u.plan} colors={PLAN_COLORS[u.plan] ?? PLAN_COLORS.Free} />
            {/* Status */}
            <Badge label={u.status} colors={STATUS_COLORS[u.status] ?? STATUS_COLORS.Inactive} />
            {/* Joined */}
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{u.joined}</span>
            {/* Action */}
            <button style={{ background: 'var(--card-2)', border: `1px solid rgba(255,255,255,0.1)`, color: 'var(--text)', padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'inherit' }}>
              View <ChevronRight size={11} />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
            No users match your search.
          </div>
        )}
      </div>
    </div>
  );
}
