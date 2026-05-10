'use client';

import React from 'react';
import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';

const LIME   = '#a3e635';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

export default function PortfolioRedirectPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px 24px' }}>
      <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '40px 36px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${LIME}14`, border: `1px solid ${LIME}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <User size={22} color={LIME} strokeWidth={1.75} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>
          Your portfolio now lives on your creator profile.
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 28 }}>
          Showcase your best AI ads so brands and UGCFire can see your style — all in one place on your public profile.
        </p>
        <Link href="/dashboard/profile"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: LIME, color: '#0d0d0d', fontWeight: 800, fontSize: 14, borderRadius: 10, padding: '12px 24px', textDecoration: 'none' }}>
          Go to Profile <ArrowRight size={15} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
