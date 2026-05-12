'use client';

import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { ADMIN_CLIENTS, MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL = 'var(--card)';
const BORDER = 'var(--border)';

const PAYMENT_CONFIG: Record<string, { color: string; bg: string }> = {
  'Current': { color: LIME,     bg: 'rgba(163,230,53,0.1)'  },
  'Pending': { color: '#22d3ee',bg: 'rgba(34,211,238,0.1)'  },
  'Overdue': { color: '#ef4444',bg: 'rgba(239,68,68,0.1)'   },
};

export const dynamic = 'force-dynamic';

export default function AdminClientsPage() {
  const [search, setSearch] = useState('');

  const filtered = ADMIN_CLIENTS.filter(c =>
    !search || c.brandName.toLowerCase().includes(search.toLowerCase()) || c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpend   = ADMIN_CLIENTS.reduce((s, c) => s + c.totalSpend, 0);
  const activeCount  = ADMIN_CLIENTS.filter(c => c.activeProjects > 0).length;
  const overdueCount = ADMIN_CLIENTS.filter(c => c.paymentStatus === 'Overdue').length;

  return (
    <>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ padding: '28px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Client Management
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
            {ADMIN_CLIENTS.length} marketplace clients · ${totalSpend.toLocaleString()} total project spend
          </p>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Clients',     value: String(ADMIN_CLIENTS.length),    color: '#22d3ee' },
            { label: 'With Active Projects', value: String(activeCount),          color: ORANGE    },
            { label: 'Total Spend',       value: `$${totalSpend.toLocaleString()}`, color: LIME    },
            { label: 'Overdue Payments',  value: String(overdueCount),            color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 20 }}>
          <Search size={13} color="var(--text-faint)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
            style={{ width: '100%', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 12px 9px 32px', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        </div>

        {/* Client cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(client => {
            const ps      = PAYMENT_CONFIG[client.paymentStatus];
            const projects = MOCK_PROJECTS.filter(p => p.brandName === client.brandName);
            return (
              <div key={client.id} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                  {/* Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${client.color}20`, border: `2px solid ${client.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: client.color, flexShrink: 0 }}>
                    {client.initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{client.brandName}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: ps.color, background: ps.bg, padding: '2px 9px', borderRadius: 20, border: `1px solid ${ps.color}30` }}>
                        {client.paymentStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                      {client.contactName} · <span style={{ color: 'var(--text-faint)' }}>{client.contactEmail}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: ORANGE, lineHeight: 1 }}>{client.activeProjects}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Active Projects</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: LIME, lineHeight: 1 }}>${client.totalSpend.toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Total Spend</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.4 }}>{client.lastActivity}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Last Activity</div>
                      </div>
                    </div>
                  </div>

                  {/* Projects preview + CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}>
                    {projects.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right' }}>
                        {projects.slice(0, 2).map(p => (
                          <div key={p.id} style={{ marginBottom: 2 }}>{p.icon} {p.title}</div>
                        ))}
                        {projects.length > 2 && <div>+{projects.length - 2} more</div>}
                      </div>
                    )}
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', background: `${ORANGE}18`, border: `1px solid ${ORANGE}35`, color: ORANGE }}>
                      <ExternalLink size={12} strokeWidth={2} /> View Client
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
