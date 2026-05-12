import React from 'react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer style={{
      borderTop: `1px solid var(--border)`,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
      background: 'var(--sidebar-bg)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
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
            style={{ fontSize: 11, color: 'var(--text-faint)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-faint)'; }}>
            {l.label}
          </Link>
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 }}>
        AI Creator Network
      </span>
    </footer>
  );
}
