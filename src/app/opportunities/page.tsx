import Link from 'next/link';
import PublicHeader from '@/components/public/PublicHeader';
import { MOCK_PROJECTS } from '@/lib/demoData';

const LIME   = '#a3e635';
const ORANGE = '#FF5C00';
const BG     = '#0d0d0d';
const PANEL  = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';

export const metadata = {
  title: 'Opportunities — UGCFire.ai',
  description: 'Browse paid brand projects and get invited to create AI ads, videos, and graphics.',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Beauty & Skincare': '◆', 'Food & Beverage': '◆', 'Health & Fitness': '◆',
  'Health & Nutrition': '◆', 'Software & SaaS': '◆', 'E-commerce': '◆', default: '◆',
};

export default function OpportunitiesPage() {
  const openProjects = MOCK_PROJECTS.filter(p => p.status !== 'Completed');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${BG}; color: #f2f0eb; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .opp-card { background: ${PANEL}; border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 22px; text-decoration: none; display: flex; flex-direction: column; transition: border-color 0.2s, transform 0.2s; }
        .opp-card:hover { border-color: rgba(163,230,53,0.25); transform: translateY(-2px); }
        @media (max-width: 900px) { .opps-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .opps-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <PublicHeader activePage="opportunities" />

      <main style={{ paddingTop: 60, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ background: '#060606', borderBottom: `1px solid ${BORDER}`, padding: '48px 24px 44px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.18)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 18 }}>
              Brand Projects
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.1 }}>
              Open Opportunities
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.42)', maxWidth: 520, lineHeight: 1.75 }}>
              Browse paid brand projects. Build your portfolio on UGCFire and get invited to apply.
            </p>
          </div>
        </div>

        {/* Opportunities grid */}
        <div style={{ padding: '48px 24px 72px', maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{openProjects.length} open projects</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.18)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: LIME }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: LIME, boxShadow: `0 0 4px ${LIME}` }} />
              Live projects
            </div>
          </div>

          <div className="opps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
            {openProjects.map(opp => (
              <Link key={opp.id} href={`/opportunities/${opp.id}`} className="opp-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {opp.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{opp.title}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', padding: '2px 9px', borderRadius: 20, display: 'inline-block' }}>{opp.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: LIME }}>${opp.creatorPayMin}–${opp.creatorPayMax}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>per project</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Deadline: {opp.deadline}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{opp.deliverables.length} deliverable{opp.deliverables.length !== 1 ? 's' : ''} · {opp.contentType}</div>
                </div>
                <div style={{ display: 'block', width: '100%', textAlign: 'center', background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 12, padding: '9px', borderRadius: 9 }}>
                  View &amp; Apply →
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '40px 24px' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>Build your portfolio to unlock projects</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.7 }}>
              Create AI ads, publish your work, and turn on Open to Work. Brands discover creators through their portfolio.
            </p>
            <Link href="/dashboard/create" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: LIME, color: '#0d0d0d', fontWeight: 700, fontSize: 14, padding: '12px 26px', borderRadius: 10, textDecoration: 'none' }}>
              Start Creating Free
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
