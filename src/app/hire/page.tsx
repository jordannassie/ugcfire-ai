import Link from 'next/link';
import PublicHeader from '@/components/public/PublicHeader';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

export const metadata = {
  title: 'Post a Project — UGCFire.ai',
  description: 'Post a project and connect with AI creators who make brand-ready ads, videos, and graphics.',
};

export default function HirePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${BG}; color: #f2f0eb; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      <PublicHeader activePage="hire" />

      <main style={{ paddingTop: 60, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            Post a Project
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 36 }}>
            Connect with vetted AI creators who make brand-ready ads, videos, and graphics. UGCFire manages quality from brief to final delivery.
          </p>

          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '28px 24px', marginBottom: 36 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>What you get:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {[
                'Post projects with budgets and deliverables',
                'Browse and invite AI creator profiles',
                'Review and approve ad work before payment',
                'Managed delivery — UGCFire ensures quality',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: LIME, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/client/post-project"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ORANGE, color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
              Post a Project
            </Link>
            <Link href="/creators"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', border: `1px solid ${BORDER}` }}>
              Browse Creators
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
