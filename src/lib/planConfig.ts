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
      '1 quick strategy call',
      '3 branded content assets',
      'Images, ad creatives, or 1 short video',
      'Hooks + captions included',
      '1 revision round',
    ],
    cta: 'Get Started',
    dashboardFeatures: [
      '1 quick strategy call',
      '3 branded content assets',
      'Images, ad creatives, or 1 short video',
      'Hooks + captions included',
      '1 revision round',
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
    tagline: 'For small businesses that need consistent monthly content.',
    badge: null,
    salesOnly: false,
    desc: 'For small businesses that need consistent monthly content.',
    includes: [
      '1 monthly strategy call',
      'Branded images + ad creatives',
      'UGC-style short videos',
      'Hooks + captions included',
      '1 revision round',
    ],
    cta: 'Book Growth Call',
    dashboardFeatures: [
      '1 monthly strategy call',
      'Branded images + ad creatives',
      'UGC-style short videos',
      'Hooks + captions included',
      '1 revision round',
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
    tagline: 'For brands that want more content volume and creative testing.',
    badge: 'Most Popular',
    salesOnly: false,
    desc: 'For brands that want more content volume and creative testing.',
    includes: [
      '1 monthly strategy call',
      'More images, ads + videos',
      'Priority delivery',
      'Hooks + captions included',
      '1 revision round',
    ],
    cta: 'Select Scale',
    dashboardFeatures: [
      '1 monthly strategy call',
      'More images, ads + videos',
      'Priority delivery',
      'Hooks + captions included',
      '1 revision round',
    ],
  },
  {
    key: 'custom',
    name: 'Custom / Agencies',
    monthlyPrice: null,
    yearlyMonthlyPrice: null,
    deliverables: null,
    priceSuffix: '',
    assetsLabel: 'Custom content volume',
    tagline: 'For agencies and brands that need a custom workflow.',
    badge: null,
    salesOnly: true,
    desc: 'For agencies and brands that need a custom workflow.',
    includes: [
      'Custom monthly content assets',
      'Agency / white-label support',
      'Strategy support',
      'Studio delivery system',
      'Priority delivery',
    ],
    cta: 'Talk to Sales',
    dashboardFeatures: [
      'Custom monthly content assets',
      'Agency / white-label support',
      'Strategy support',
      'Studio delivery system',
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
