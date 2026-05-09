'use client';

import React, { useState } from 'react';
import { Search, MessageCircle, ChevronRight } from 'lucide-react';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const BORDER = 'rgba(255,255,255,0.08)';

const STATUS_COLORS = {
  Open:     { bg: 'rgba(255,92,0,0.12)',    text: ORANGE    },
  Pending:  { bg: 'rgba(234,179,8,0.12)',   text: '#eab308' },
  Resolved: { bg: 'rgba(34,197,94,0.1)',    text: '#22c55e' },
};

const PRIORITY_COLORS = {
  High:   { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444' },
  Medium: { bg: 'rgba(234,179,8,0.1)',   text: '#eab308' },
  Low:    { bg: 'rgba(255,255,255,0.06)',text: 'rgba(255,255,255,0.4)' },
};

const DEMO_TICKETS = [
  { id: 'TKT-001', user: 'Sarah Johnson',  email: 'sarah.j@example.com',    subject: 'Video generation stuck at 80%',          status: 'Open',     priority: 'High',   time: '5m ago'   },
  { id: 'TKT-002', user: 'Mike Chen',      email: 'mike.chen@example.com',  subject: 'Cannot upload images larger than 5MB',   status: 'Pending',  priority: 'Medium', time: '14m ago'  },
  { id: 'TKT-003', user: 'Alex Rivera',    email: 'alex.rivera@example.com',subject: 'How to cancel my subscription?',          status: 'Open',     priority: 'Low',    time: '32m ago'  },
  { id: 'TKT-004', user: 'Emma Nguyen',    email: 'emma.n@example.com',     subject: 'Brand assets not saving correctly',       status: 'Resolved', priority: 'High',   time: '1h ago'   },
  { id: 'TKT-005', user: 'Ryan Patel',     email: 'ryan.patel@example.com', subject: 'Download button not working on mobile',   status: 'Pending',  priority: 'Medium', time: '2h ago'   },
  { id: 'TKT-006', user: 'Jessica Lee',    email: 'jessica.lee@example.com',subject: 'Billing charge appeared twice',           status: 'Open',     priority: 'High',   time: '3h ago'   },
  { id: 'TKT-007', user: 'Jordan Kim',     email: 'j.kim@example.com',      subject: 'How do I change my aspect ratio default?',status: 'Resolved', priority: 'Low',    time: '5h ago'   },
  { id: 'TKT-008', user: 'Taylor Smith',   email: 't.smith@example.com',    subject: 'Account suspended — needs review',        status: 'Open',     priority: 'High',   time: '7h ago'   },
  { id: 'TKT-009', user: 'Chris Wang',     email: 'c.wang@example.com',     subject: 'Prompt enhancement not triggering',       status: 'Pending',  priority: 'Low',    time: '1d ago'   },
  { id: 'TKT-010', user: 'Morgan Hall',    email: 'm.hall@example.com',     subject: 'Can I get a refund for failed generation?',status: 'Resolved', priority: 'Medium', time: '1d ago'   },
];

type TabKey = 'All' | 'Open' | 'Pending' | 'Resolved';

function Badge({ label, colors }: { label: string; colors: { bg: string; text: string } }) {
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: colors.bg, color: colors.text }}>{label}</span>;
}

export default function AdminSupportPage() {
  const [tab,    setTab]    = useState<TabKey>('All');
  const [search, setSearch] = useState('');

  const filtered = DEMO_TICKETS.filter(t => {
    if (tab !== 'All' && t.status !== tab) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase()) && !t.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts: Record<TabKey, number> = {
    All:      DEMO_TICKETS.length,
    Open:     DEMO_TICKETS.filter(t => t.status === 'Open').length,
    Pending:  DEMO_TICKETS.filter(t => t.status === 'Pending').length,
    Resolved: DEMO_TICKETS.filter(t => t.status === 'Resolved').length,
  };

  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Support</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{counts.Open} open tickets need attention.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 9, display: 'flex', alignItems: 'center', padding: '7px 12px', gap: 8 }}>
            <Search size={13} color="rgba(255,255,255,0.3)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'rgba(255,255,255,0.55)', width: 180, fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
        {(['All', 'Open', 'Pending', 'Resolved'] as TabKey[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '10px 16px', fontSize: 13, fontWeight: tab === t ? 700 : 500, background: 'none', border: 'none', cursor: 'pointer', color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)', borderBottom: tab === t ? `2px solid ${ORANGE}` : '2px solid transparent', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7 }}>
            {t}
            <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '1px 7px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{counts[t]}</span>
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div style={{ background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1.8fr 2.5fr 80px 90px 80px 60px', padding: '10px 18px', borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
          {['ID', 'User', 'Subject', 'Status', 'Priority', 'Created', ''].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.map((ticket, i) => (
          <div key={ticket.id}
            style={{ display: 'grid', gridTemplateColumns: '80px 1.8fr 2.5fr 80px 90px 80px 60px', padding: '13px 18px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.12s', cursor: 'default' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>

            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{ticket.id}</span>

            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ticket.user}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)' }}>{ticket.email}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageCircle size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</span>
            </div>

            <Badge label={ticket.status} colors={STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS]} />
            <Badge label={ticket.priority} colors={PRIORITY_COLORS[ticket.priority as keyof typeof PRIORITY_COLORS]} />

            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{ticket.time}</span>

            <button style={{ background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.1)`, color: 'rgba(255,255,255,0.6)', padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'inherit' }}>
              View <ChevronRight size={11} />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No tickets match your filter.
          </div>
        )}
      </div>
    </div>
  );
}
