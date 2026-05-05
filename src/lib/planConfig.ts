/**
 * UGCFire — centralized plan configuration.
 * Import this anywhere pricing or plan feature data is needed so the
 * numbers and copy are always consistent between public site and dashboard.
 */

export const BOOKING_CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1r9yLOh-Z6nt5dZAgnKaR9iXZ6ea-kOkrJxLqctzq_0C4uLmNgX2FpB6zTQl26FqmN21-zAquz?gv=true'

export interface PlanConfig {
  key: 'starter' | 'growth' | 'scale' | 'custom'
  name: string
  monthlyPrice: number | null
  yearlyMonthlyPrice: number | null
  deliverables: number | null
  priceSuffix: string           // e.g. "one-time", "/mo", ""
  assetsLabel: string           // e.g. "3 content assets"
  tagline: string
  badge: string | null
  salesOnly: boolean
  desc: string
  includes: string[]
  cta: string
  dashboardFeatures: string[]
}

export const PLAN_CONFIG: PlanConfig[] = [
  {
    key: 'starter',
    name: 'Starter Pack',
    monthlyPrice: 500,
    yearlyMonthlyPrice: null,
    deliverables: 3,
    priceSuffix: 'one-time',
    assetsLabel: '3 content assets',
    tagline: 'Test UGCFire with a simple one-time content pack.',
    badge: null,
    salesOnly: false,
    desc: 'Test UGCFire with a simple one-time content pack.',
    includes: [
      '1 quick content strategy call',
      '3 content assets',
      'Branded images, ad creatives, or 1 short video',
      'Hooks, captions, and creative direction',
      'Studio delivery folder',
      '1 revision round included',
    ],
    cta: 'Select Starter',
    dashboardFeatures: [
      '1 quick content strategy call',
      '3 content assets',
      'Branded images, ad creatives, or 1 short video',
      'Hooks, captions, and creative direction',
      'Studio delivery folder',
      '1 revision round included',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    monthlyPrice: 2500,
    yearlyMonthlyPrice: 2000,
    deliverables: 8,
    priceSuffix: '/mo',
    assetsLabel: '8 content assets/month',
    tagline: 'Best for small businesses that need consistent monthly content.',
    badge: null,
    salesOnly: false,
    desc: 'Best for small businesses that need consistent monthly content.',
    includes: [
      '1 monthly content strategy call',
      '8 content assets/month',
      'Photos / AI photo-style images',
      'Ad creatives and social posts',
      'UGC-style short videos',
      'Hooks, captions, and creative direction',
      'Studio delivery folder',
      '1 revision round included',
      'Cancel anytime',
    ],
    cta: 'Select Growth',
    dashboardFeatures: [
      '1 monthly content strategy call',
      '8 content assets/month',
      'Photos / AI photo-style images',
      'Ad creatives and social posts',
      'UGC-style short videos',
      'Hooks, captions, and creative direction',
      'Studio delivery folder',
      '1 revision round included',
      'Cancel anytime',
    ],
  },
  {
    key: 'scale',
    name: 'Scale',
    monthlyPrice: 5000,
    yearlyMonthlyPrice: 4000,
    deliverables: 20,
    priceSuffix: '/mo',
    assetsLabel: '20 content assets/month',
    tagline: 'Best for brands that want more content volume and creative testing.',
    badge: 'Most Popular',
    salesOnly: false,
    desc: 'Best for brands that want more content volume and creative testing.',
    includes: [
      '1 monthly content strategy call',
      '20 content assets/month',
      'Photos / AI photo-style images',
      'Ad creatives and social posts',
      'UGC-style short videos',
      'Hooks, captions, and creative direction',
      'Studio delivery folder',
      '1 revision round included',
      'Priority delivery',
      'Cancel anytime',
    ],
    cta: 'Select Scale',
    dashboardFeatures: [
      '1 monthly content strategy call',
      '20 content assets/month',
      'Photos / AI photo-style images',
      'Ad creatives and social posts',
      'UGC-style short videos',
      'Hooks, captions, and creative direction',
      'Studio delivery folder',
      '1 revision round included',
      'Priority delivery',
      'Cancel anytime',
    ],
  },
  {
    key: 'custom',
    name: 'Custom / Agencies',
    monthlyPrice: null,
    yearlyMonthlyPrice: null,
    deliverables: null,
    priceSuffix: '',
    assetsLabel: 'Custom volume',
    tagline: 'For brands or agencies that need custom volume, white-label support, or a custom content workflow.',
    badge: null,
    salesOnly: true,
    desc: 'For brands or agencies that need custom volume, white-label support, or a custom content workflow.',
    includes: [
      'Custom monthly content assets',
      'Custom content workflow',
      'Agency / white-label support',
      'Team collaboration',
      'Strategy support',
      'Studio delivery system',
      '1 revision round included',
      'Priority delivery',
    ],
    cta: 'Talk to Sales',
    dashboardFeatures: [
      'Custom monthly content assets',
      'Custom content workflow',
      'Agency / white-label support',
      'Team collaboration',
      'Strategy support',
      'Studio delivery system',
      '1 revision round included',
      'Priority delivery',
    ],
  },
]

/** Returns the display price string for a given plan (fixed prices, no billing cycle). */
export function getDisplayPrice(
  plan: PlanConfig,
): { main: string; unit: string; note: string | null } {
  if (plan.salesOnly) return { main: 'Custom', unit: '', note: null }
  if (plan.key === 'starter') return { main: `$${plan.monthlyPrice!.toLocaleString()}`, unit: 'one-time', note: null }
  return { main: `$${plan.monthlyPrice!.toLocaleString()}`, unit: '/mo', note: null }
}
