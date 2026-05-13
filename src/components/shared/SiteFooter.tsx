'use client';

import React from 'react';
import Image from 'next/image';

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';
const ORANGE   = '#FF5C00';
const FAINT    = 'rgba(255,255,255,0.40)';

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ugcfire',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@ugcfire',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@UGCFire',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19 31.64 31.64 0 000 12a31.64 31.64 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.64 31.64 0 0024 12a31.64 31.64 0 00-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
      </svg>
    ),
  },
];

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
    title: 'Legal',
    links: [
      ['Terms of Service', '/terms'],
      ['Privacy Policy',   '/privacy'],
    ],
  },
];

const OFFICES = [
  { city: 'Dallas', state: 'TX' },
  { city: 'Newport Beach', state: 'CA' },
  { city: 'Miami', state: 'FL' },
];

export default function SiteFooter() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.10)', padding: '40px 24px 28px', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'flex', gap: 48, marginBottom: 32, flexWrap: 'wrap' }}>

          {/* Brand + social icons */}
          <div style={{ flex: '0 0 auto', marginRight: 8, minWidth: 200 }}>
            <Image
              src={LOGO_URL}
              alt="UGCFire.ai"
              width={110} height={30}
              style={{ objectFit: 'contain', height: 28, width: 'auto', marginBottom: 12 }}
              unoptimized
            />
            <p style={{ fontSize: 13, color: FAINT, lineHeight: 1.8, maxWidth: 220, marginBottom: 18 }}>
              The AI Creator Network. Create AI ads, build your portfolio, get paid by brands.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: FAINT, textDecoration: 'none', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${ORANGE}60`;
                    (e.currentTarget as HTMLAnchorElement).style.background = `${ORANGE}14`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = FAINT;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.09)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: FAINT, fontWeight: 600, marginBottom: 14 }}>
                {col.title}
              </div>
              {col.links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ display: 'block', fontSize: 13, color: FAINT, textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#f2f0eb'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = FAINT; }}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}

          {/* Office locations */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: FAINT, fontWeight: 600, marginBottom: 14 }}>
              Office Locations
            </div>
            {OFFICES.map(o => (
              <div key={o.city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={FAINT} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <span style={{ fontSize: 13, color: FAINT }}>{o.city}, {o.state}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: FAINT }}>© 2026 UGCFire.ai. All rights reserved.</span>
          <span style={{ fontSize: 12, color: FAINT }}>
            Built for AI creators. <span style={{ color: ORANGE }}>●</span>
          </span>
        </div>

      </div>
    </footer>
  );
}
