import React from 'react';
import Link from 'next/link';

const BORDER = 'rgba(255,255,255,0.06)';

export default function AppFooter() {
  return (
    <footer style={{
      borderTop: `1px solid ${BORDER}`,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
      background: '#0a0a0a',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
        UGCFire.ai
      </span>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {[
          { label: 'Help',    href: '/dashboard/support' },
          { label: 'Terms',   href: '/terms'             },
          { label: 'Privacy', href: '/privacy'           },
          { label: 'Contact', href: '/dashboard/support' },
        ].map(l => (
          <Link key={l.label} href={l.href}
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.22)'; }}>
            {l.label}
          </Link>
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontWeight: 500 }}>
        AI Creator Network
      </span>
    </footer>
  );
}
