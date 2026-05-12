'use client';

import React from 'react';
import Image from 'next/image';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const ORANGE   = '#FF5C00';

const NAV_COLS = [
  {
    title: 'Platform',
    links: [
      ['Studio',        '/dashboard/studio'],
      ['Creators',      '/creators'],
      ['Opportunities', '/opportunities'],
      ['Hire',          '/hire'],
      ['Pricing',       '/pricing'],
    ],
  },
  {
    title: 'Social',
    links: [
      ['Instagram', 'https://www.instagram.com/ugcfire'],
      ['TikTok',    'https://www.tiktok.com/@ugcfire'],
      ['X',         'https://x.com/ugcfire'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Terms of Service', '/terms'],
      ['Privacy Policy',   '/privacy'],
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.10)', padding: '40px 24px 28px', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Top row: logo + nav cols */}
        <div style={{ display: 'flex', gap: 48, marginBottom: 32, flexWrap: 'wrap' }}>

          {/* Brand */}
          <div style={{ flex: '0 0 auto', marginRight: 8 }}>
            <Image
              src={LOGO_URL}
              alt="UGCFire.ai"
              width={110} height={30}
              style={{ objectFit: 'contain', height: 28, width: 'auto', marginBottom: 12 }}
              unoptimized
            />
            <p style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.8, maxWidth: 220 }}>
              The AI Creator Network. Create AI ads, build your portfolio, get paid by brands.
            </p>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600, marginBottom: 14 }}>
                {col.title}
              </div>
              {col.links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ display: 'block', fontSize: 13, color: 'var(--text-faint)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#f2f0eb'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-faint)'; }}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>© 2026 UGCFire.ai. All rights reserved.</span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            Built for AI creators. <span style={{ color: ORANGE }}>●</span>
          </span>
        </div>

      </div>
    </footer>
  );
}
