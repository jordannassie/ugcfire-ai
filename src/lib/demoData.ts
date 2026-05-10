// ─── Demo Mode Utilities ────────────────────────────────────────────────────

export const DEMO_VIDEO_URL =
  'https://phhczohqidgrvcmszets.supabase.co/storage/v1/object/public/UGC%20Fire/video/alluring_swan_07128_httpss.mj.runVArsopscz9I_slow_motion_pers_c2fb5354-bceb-4ae0-8069-d65e46035d16_1.mp4'

export const DEMO_PHOTO_URL =
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/images/1a75fdad-d79b-4df6-a855-d10aa65335c7.png'

export const DEMO_COOKIE_NAME  = 'ugcfire_demo_mode'
export const DEMO_ROLE_COOKIE  = 'ugcfire_demo_role'
export const DEMO_EMAIL_KEY    = 'ugcfire_demo_user_email'
export const DEMO_COMPANY_KEY  = 'ugcfire_demo_company'
export const DEMO_NAME_KEY     = 'ugcfire_demo_user_name'

export type DemoRole = 'creator' | 'client' | 'admin'

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(DEMO_COOKIE_NAME) === 'true'
}

export function getDemoRole(): DemoRole | null {
  if (typeof window === 'undefined') return null
  const role = localStorage.getItem(DEMO_ROLE_COOKIE)
  if (role === 'creator' || role === 'admin' || role === 'client') return role
  return null
}

export function getDemoUserName(): string {
  if (typeof window === 'undefined') return 'Demo User'
  return localStorage.getItem(DEMO_NAME_KEY) ?? 'Demo User'
}

const ROLE_META: Record<DemoRole, { email: string; company: string; name: string }> = {
  creator: { email: 'creator@ugcfire.ai', company: 'Independent Creator', name: 'Demo Creator' },
  client:  { email: 'demo@ugcfire.ai',    company: 'Demo Brand',           name: 'Demo Client'  },
  admin:   { email: 'admin@ugcfire.ai',   company: 'UGCFire Admin',        name: 'UGCFire Admin'},
}

export function enterDemoMode(role: DemoRole) {
  const meta = ROLE_META[role]

  localStorage.setItem(DEMO_COOKIE_NAME,  'true')
  localStorage.setItem(DEMO_ROLE_COOKIE,  role)
  localStorage.setItem(DEMO_EMAIL_KEY,    meta.email)
  localStorage.setItem(DEMO_COMPANY_KEY,  meta.company)
  localStorage.setItem(DEMO_NAME_KEY,     meta.name)

  // Also set cookies so middleware can read them for SSR route guard
  const maxAge = 60 * 60 * 8 // 8 hours
  document.cookie = `${DEMO_COOKIE_NAME}=true; path=/; max-age=${maxAge}; SameSite=Lax`
  document.cookie = `${DEMO_ROLE_COOKIE}=${role}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function exitDemoMode() {
  localStorage.removeItem(DEMO_COOKIE_NAME)
  localStorage.removeItem(DEMO_ROLE_COOKIE)
  localStorage.removeItem(DEMO_EMAIL_KEY)
  localStorage.removeItem(DEMO_COMPANY_KEY)
  localStorage.removeItem(DEMO_NAME_KEY)

  const expired = 'expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
  document.cookie = `${DEMO_COOKIE_NAME}=; ${expired}`
  document.cookie = `${DEMO_ROLE_COOKIE}=; ${expired}`
}

// ─── Demo Plans ──────────────────────────────────────────────────────────────

export const DEMO_PLANS = [
  {
    id: 'plan-growth-demo',
    name: 'Growth',
    slug: 'growth',
    price_monthly: 1497,
    videos_per_month: 8,
    description: '8 content deliverables per month',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'plan-scale-demo',
    name: 'Scale',
    slug: 'scale',
    price_monthly: 2497,
    videos_per_month: 16,
    description: '16 content deliverables per month',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
]

// ─── Demo Company ────────────────────────────────────────────────────────────

export const DEMO_COMPANY = {
  id: 'company-demo-brand',
  name: 'Demo Brand',
  owner_user_id: 'user-demo-client',
  plan_id: 'plan-scale-demo',
  onboarding_status: 'completed',
  billing_status: 'active_mock',
  subscription_status: 'active_mock',
  showcase_permission: true,
  is_demo: true,
  created_at: '2026-04-01T00:00:00Z',
}

// ─── Demo Companies (Admin view) ─────────────────────────────────────────────

export const DEMO_COMPANIES = [
  {
    id: 'company-demo-brand',
    name: 'Demo Brand',
    owner_user_id: 'user-demo-client',
    plan_id: 'plan-scale-demo',
    plan_name: 'Scale',
    owner_email: 'demo@ugcfire.com',
    onboarding_status: 'completed',
    billing_status: 'active_mock',
    subscription_status: 'active_mock',
    showcase_permission: true,
    content_this_month: 8,
    last_activity: '2026-04-27T10:00:00Z',
  },
  {
    id: 'company-apex-fitness',
    name: 'Apex Fitness Co.',
    owner_user_id: 'user-apex',
    plan_id: 'plan-growth-demo',
    plan_name: 'Growth',
    owner_email: 'apex@apexfitness.com',
    onboarding_status: 'completed',
    billing_status: 'active_mock',
    subscription_status: 'active_mock',
    showcase_permission: true,
    content_this_month: 6,
    last_activity: '2026-04-26T14:00:00Z',
  },
  {
    id: 'company-glow-skin',
    name: 'Glow Skin Studio',
    owner_user_id: 'user-glow',
    plan_id: 'plan-scale-demo',
    plan_name: 'Scale',
    owner_email: 'hello@glowskinstudio.com',
    onboarding_status: 'completed',
    billing_status: 'active_mock',
    subscription_status: 'active_mock',
    showcase_permission: true,
    content_this_month: 5,
    last_activity: '2026-04-25T09:00:00Z',
  },
  {
    id: 'company-northstar',
    name: 'NorthStar Roofing',
    owner_user_id: 'user-northstar',
    plan_id: 'plan-growth-demo',
    plan_name: 'Growth',
    owner_email: 'info@northstarroofing.com',
    onboarding_status: 'completed',
    billing_status: 'past_due_mock',
    subscription_status: 'past_due_mock',
    showcase_permission: false,
    content_this_month: 3,
    last_activity: '2026-04-22T11:00:00Z',
  },
]

// ─── Demo Brand Brief ─────────────────────────────────────────────────────────

export const DEMO_BRAND_BRIEF = {
  id: 'brief-demo-brand',
  company_id: 'company-demo-brand',
  company_name: 'Demo Brand',
  website: 'https://demobrand.com',
  offer: 'Premium skincare products that transform your skin in 30 days',
  target_customer: 'Women 25-45, health-conscious, willing to invest in self-care',
  brand_voice: 'Confident, authentic, results-focused, warm',
  video_styles: 'Founder-style talking head, lifestyle B-roll, before/after reveals',
  examples: 'https://instagram.com/p/example1, https://tiktok.com/example2',
  notes: 'Avoid competitor mentions. Always show product in natural light.',
  assets_url: DEMO_PHOTO_URL,
  completed_at: '2026-04-01T00:00:00Z',
  created_at: '2026-04-01T00:00:00Z',
}

// ─── Demo Agreement ───────────────────────────────────────────────────────────

export const DEMO_AGREEMENT = {
  id: 'agreement-demo-brand',
  company_id: 'company-demo-brand',
  user_id: 'user-demo-client',
  plan_id: 'plan-scale-demo',
  agreement_version: 'v1.0',
  contract_title: 'UGCFire Service Agreement',
  contract_body: `This agreement is entered into between UGCFire ("Agency") and Demo Brand ("Client") effective April 1, 2026.

SERVICES
UGCFire will produce monthly photo and video content deliverables as specified in the selected plan. The Scale plan includes up to 16 content deliverables per month, including short-form videos, lifestyle photos, and ad creatives.

CONTENT OWNERSHIP
All finalized content delivered to Client is owned by Client upon delivery. UGCFire retains the right to use delivered content for portfolio, case study, and marketing purposes unless explicitly restricted in writing.

REVISIONS
Each content item includes up to 2 revision rounds. Additional revisions may incur extra fees.

BILLING
Subscription is billed monthly. Cancellation requires 14 days notice before the next billing cycle.

SHOWCASE RIGHTS
Client grants UGCFire permission to showcase delivered content in marketing materials, social media, and website with showcase rights accepted.

CONFIDENTIALITY
Both parties agree to keep business information confidential.

By signing, Client agrees to these terms.`,
  signed_name: 'Demo User',
  signed_email: 'demo@ugcfire.com',
  signed_at: '2026-04-01T10:00:00Z',
  accepted_checkbox: true,
  showcase_rights_checkbox: true,
  ip_address: '127.0.0.1',
  user_agent: 'Demo Mode',
  created_at: '2026-04-01T10:00:00Z',
}

// ─── Demo Billing ─────────────────────────────────────────────────────────────

export const DEMO_BILLING = {
  id: 'billing-demo-brand',
  company_id: 'company-demo-brand',
  plan_id: 'plan-scale-demo',
  billing_status: 'active_mock',
  subscription_status: 'active_mock',
  mock_mode: true,
  current_period_start: '2026-04-01T00:00:00Z',
  current_period_end: '2026-05-01T00:00:00Z',
  created_at: '2026-04-01T00:00:00Z',
}

// ─── Demo Content Items ───────────────────────────────────────────────────────

export const DEMO_CONTENT_ITEMS = [
  {
    id: 'content-1',
    company_id: 'company-demo-brand',
    title: 'Founder-style UGC Video',
    description: 'Direct-to-camera founder talking head ad with product demonstration',
    media_type: 'video',
    status: 'ready_for_review',
    week_label: 'Week 1 - May 2026',
    content_type: 'Talking Head',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T08:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T08:00:00Z',
  },
  {
    id: 'content-2',
    company_id: 'company-demo-brand',
    title: 'Product Demo Video',
    description: 'Hands-on product demonstration showing key benefits',
    media_type: 'video',
    status: 'approved',
    week_label: 'Week 1 - May 2026',
    content_type: 'Product Demo',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-25T08:00:00Z',
    approved_at: '2026-04-26T14:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-25T08:00:00Z',
  },
  {
    id: 'content-3',
    company_id: 'company-demo-brand',
    title: 'Problem / Solution Short',
    description: 'Hook-driven problem/solution format short-form ad',
    media_type: 'video',
    status: 'delivered',
    week_label: 'Week 2 - May 2026',
    content_type: 'Hook / Problem',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-20T08:00:00Z',
    approved_at: '2026-04-21T10:00:00Z',
    delivered_at: '2026-04-22T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-20T08:00:00Z',
  },
  {
    id: 'content-4',
    company_id: 'company-demo-brand',
    title: 'Product Lifestyle Photo',
    description: 'High-quality lifestyle product photography for social ads',
    media_type: 'photo',
    status: 'ready_for_review',
    week_label: 'Week 2 - May 2026',
    content_type: 'Lifestyle',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T09:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T09:00:00Z',
  },
  {
    id: 'content-5',
    company_id: 'company-demo-brand',
    title: 'Social Ad Photo Creative',
    description: 'Static image ad creative optimized for Facebook and Instagram',
    media_type: 'photo',
    status: 'approved',
    week_label: 'Week 3 - May 2026',
    content_type: 'Ad Creative',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-18T08:00:00Z',
    approved_at: '2026-04-19T12:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-18T08:00:00Z',
  },
  {
    id: 'content-6',
    company_id: 'company-demo-brand',
    title: 'Offer CTA Video',
    description: 'Direct response video with clear offer and call to action',
    media_type: 'video',
    status: 'in_production',
    week_label: 'Week 4 - May 2026',
    content_type: 'Direct Response',
    file_url: null,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T10:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T10:00:00Z',
  },
  {
    id: 'content-7',
    company_id: 'company-demo-brand',
    title: 'Testimonial Graphic',
    description: 'Social proof graphic with customer quote and product image',
    media_type: 'graphic',
    status: 'delivered',
    week_label: 'Week 3 - May 2026',
    content_type: 'Social Proof',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-15T08:00:00Z',
    approved_at: '2026-04-16T09:00:00Z',
    delivered_at: '2026-04-17T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-15T08:00:00Z',
  },
  {
    id: 'content-8',
    company_id: 'company-demo-brand',
    title: 'Carousel Image Set',
    description: '4-slide carousel for Instagram and Facebook ads',
    media_type: 'carousel',
    status: 'ready_for_review',
    week_label: 'Week 4 - May 2026',
    content_type: 'Carousel',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: false,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T11:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T11:00:00Z',
  },
  {
    id: 'content-9',
    company_id: 'company-demo-brand',
    title: 'Hero Hook Video',
    description: 'Pattern-interrupt hook designed to stop the scroll in the first two seconds',
    media_type: 'video',
    status: 'revision_requested',
    week_label: 'Week 1 - May 2026',
    content_type: 'Hook',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-26T08:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-26T08:00:00Z',
  },
  {
    id: 'content-10',
    company_id: 'company-demo-brand',
    title: 'Skincare Routine Tutorial',
    description: 'Step-by-step morning routine featuring the product line',
    media_type: 'video',
    status: 'approved',
    week_label: 'Week 2 - May 2026',
    content_type: 'Tutorial',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-24T08:00:00Z',
    approved_at: '2026-04-25T12:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-24T08:00:00Z',
  },
  {
    id: 'content-11',
    company_id: 'company-demo-brand',
    title: 'Packaging Reveal Reel',
    description: 'Unboxing-style reveal of new product packaging for reels',
    media_type: 'video',
    status: 'delivered',
    week_label: 'Week 1 - April 2026',
    content_type: 'Unboxing',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-01T08:00:00Z',
    approved_at: '2026-04-02T10:00:00Z',
    delivered_at: '2026-04-03T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-01T08:00:00Z',
  },
  {
    id: 'content-12',
    company_id: 'company-demo-brand',
    title: '30-Day Results Photo',
    description: 'Side-by-side before/after lifestyle photo showing visible results',
    media_type: 'photo',
    status: 'ready_for_review',
    week_label: 'Week 3 - May 2026',
    content_type: 'Before / After',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T08:30:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T08:30:00Z',
  },
  {
    id: 'content-13',
    company_id: 'company-demo-brand',
    title: 'Side-by-Side Comparison Graphic',
    description: 'Us vs them comparison graphic optimized for paid social',
    media_type: 'graphic',
    status: 'delivered',
    week_label: 'Week 2 - April 2026',
    content_type: 'Comparison',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-08T08:00:00Z',
    approved_at: '2026-04-09T11:00:00Z',
    delivered_at: '2026-04-10T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-08T08:00:00Z',
  },
  {
    id: 'content-14',
    company_id: 'company-demo-brand',
    title: 'Ingredient Deep Dive Video',
    description: 'Educational breakdown of key active ingredients and their benefits',
    media_type: 'video',
    status: 'in_production',
    week_label: 'Week 4 - May 2026',
    content_type: 'Educational',
    file_url: null,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T12:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T12:00:00Z',
  },
  {
    id: 'content-15',
    company_id: 'company-demo-brand',
    title: 'Unboxing Experience Video',
    description: 'First-time customer unboxing reaction for authentic social proof',
    media_type: 'video',
    status: 'ready_for_review',
    week_label: 'Week 3 - May 2026',
    content_type: 'Unboxing',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T07:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T07:00:00Z',
  },
  {
    id: 'content-16',
    company_id: 'company-demo-brand',
    title: 'Founders Journey Reel',
    description: 'Personal story-driven reel about why the brand was created',
    media_type: 'video',
    status: 'approved',
    week_label: 'Week 2 - May 2026',
    content_type: 'Founder Story',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-23T08:00:00Z',
    approved_at: '2026-04-24T14:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-23T08:00:00Z',
  },
  {
    id: 'content-17',
    company_id: 'company-demo-brand',
    title: 'Product Benefits Carousel',
    description: '5-slide benefit-focused carousel for Instagram feed',
    media_type: 'carousel',
    status: 'ready_for_review',
    week_label: 'Week 4 - May 2026',
    content_type: 'Carousel',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: false,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T11:30:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T11:30:00Z',
  },
  {
    id: 'content-18',
    company_id: 'company-demo-brand',
    title: 'Night Routine Walkthrough',
    description: 'Evening skincare routine video with ambient lighting',
    media_type: 'video',
    status: 'delivered',
    week_label: 'Week 1 - April 2026',
    content_type: 'Tutorial',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-03T08:00:00Z',
    approved_at: '2026-04-04T09:00:00Z',
    delivered_at: '2026-04-05T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-03T08:00:00Z',
  },
  {
    id: 'content-19',
    company_id: 'company-demo-brand',
    title: 'Morning Glow Photo Set',
    description: 'Three lifestyle shots showcasing the morning routine aesthetic',
    media_type: 'photo',
    status: 'approved',
    week_label: 'Week 3 - May 2026',
    content_type: 'Lifestyle',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-26T09:00:00Z',
    approved_at: '2026-04-27T10:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-26T09:00:00Z',
  },
  {
    id: 'content-20',
    company_id: 'company-demo-brand',
    title: 'Sale Event Ad Creative',
    description: 'Promotional graphic for the spring sale with discount offer',
    media_type: 'graphic',
    status: 'revision_requested',
    week_label: 'Week 3 - May 2026',
    content_type: 'Ad Creative',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: false,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-26T10:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-26T10:00:00Z',
  },
  {
    id: 'content-21',
    company_id: 'company-demo-brand',
    title: 'TikTok Hook Video v2',
    description: 'Revised short-form video with faster hook and clearer offer',
    media_type: 'video',
    status: 'ready_for_review',
    week_label: 'Week 4 - May 2026',
    content_type: 'Hook',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T06:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T06:00:00Z',
  },
  {
    id: 'content-22',
    company_id: 'company-demo-brand',
    title: 'Instagram Story Template Set',
    description: 'Branded story template pack with swipe-up CTA',
    media_type: 'graphic',
    status: 'delivered',
    week_label: 'Week 2 - April 2026',
    content_type: 'Story Template',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-10T08:00:00Z',
    approved_at: '2026-04-11T09:00:00Z',
    delivered_at: '2026-04-12T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-10T08:00:00Z',
  },
  {
    id: 'content-23',
    company_id: 'company-demo-brand',
    title: 'Testimonial Quote Graphic',
    description: 'Social proof graphic featuring a verified customer review',
    media_type: 'graphic',
    status: 'approved',
    week_label: 'Week 3 - May 2026',
    content_type: 'Social Proof',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-25T10:00:00Z',
    approved_at: '2026-04-26T11:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-25T10:00:00Z',
  },
  {
    id: 'content-24',
    company_id: 'company-demo-brand',
    title: 'Product Flatlay Hero Shot',
    description: 'Clean overhead product flatlay for website and ad creative',
    media_type: 'photo',
    status: 'delivered',
    week_label: 'Week 1 - April 2026',
    content_type: 'Product Shot',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-05T08:00:00Z',
    approved_at: '2026-04-06T09:00:00Z',
    delivered_at: '2026-04-07T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-05T08:00:00Z',
  },
  {
    id: 'content-25',
    company_id: 'company-demo-brand',
    title: 'Educational Value Video',
    description: 'Value-driven educational content about skincare ingredients',
    media_type: 'video',
    status: 'in_production',
    week_label: 'Week 4 - May 2026',
    content_type: 'Educational',
    file_url: null,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T13:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T13:00:00Z',
  },
  {
    id: 'content-26',
    company_id: 'company-demo-brand',
    title: 'Behind the Scenes Studio Clip',
    description: 'Raw BTS footage from production day to humanize the brand',
    media_type: 'video',
    status: 'approved',
    week_label: 'Week 2 - May 2026',
    content_type: 'Behind the Scenes',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-22T08:00:00Z',
    approved_at: '2026-04-23T14:00:00Z',
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-22T08:00:00Z',
  },
  {
    id: 'content-27',
    company_id: 'company-demo-brand',
    title: 'Social Proof Carousel',
    description: '6-slide review carousel combining star ratings and quotes',
    media_type: 'carousel',
    status: 'delivered',
    week_label: 'Week 2 - April 2026',
    content_type: 'Social Proof',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-12T08:00:00Z',
    approved_at: '2026-04-13T09:00:00Z',
    delivered_at: '2026-04-14T08:00:00Z',
    deleted_at: null,
    created_at: '2026-04-12T08:00:00Z',
  },
  {
    id: 'content-28',
    company_id: 'company-demo-brand',
    title: 'Competitor Comparison Video',
    description: 'Direct comparison showing advantages over leading competitor',
    media_type: 'video',
    status: 'revision_requested',
    week_label: 'Week 4 - May 2026',
    content_type: 'Comparison',
    file_url: DEMO_VIDEO_URL,
    thumbnail_url: null,
    can_showcase: false,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-26T12:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-26T12:00:00Z',
  },
  {
    id: 'content-29',
    company_id: 'company-demo-brand',
    title: 'Lifestyle Brand Photo Set',
    description: 'Aspirational lifestyle photos for brand feed and stories',
    media_type: 'photo',
    status: 'ready_for_review',
    week_label: 'Week 4 - May 2026',
    content_type: 'Lifestyle',
    file_url: DEMO_PHOTO_URL,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T10:30:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T10:30:00Z',
  },
  {
    id: 'content-30',
    company_id: 'company-demo-brand',
    title: 'Q&A Response Video',
    description: 'Direct-to-camera video answering top customer questions',
    media_type: 'video',
    status: 'in_production',
    week_label: 'Week 4 - May 2026',
    content_type: 'Q&A',
    file_url: null,
    thumbnail_url: null,
    can_showcase: true,
    uploaded_by: 'user-admin',
    uploaded_at: '2026-04-27T14:00:00Z',
    approved_at: null,
    delivered_at: null,
    deleted_at: null,
    created_at: '2026-04-27T14:00:00Z',
  },
]

// ─── Demo Client Uploads ──────────────────────────────────────────────────────

export const DEMO_CLIENT_UPLOADS = [
  {
    id: 'upload-1',
    company_id: 'company-demo-brand',
    uploaded_by: 'user-demo-client',
    file_url: DEMO_PHOTO_URL,
    file_name: 'demo-brand-logo.png',
    file_type: 'image/png',
    upload_category: 'Logo/Brand Asset',
    title: 'Demo Brand Logo',
    notes: 'Primary logo with transparent background, all variants included.',
    status: 'reviewed',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'upload-2',
    company_id: 'company-demo-brand',
    uploaded_by: 'user-demo-client',
    file_url: DEMO_PHOTO_URL,
    file_name: 'hero-product-photo.jpg',
    file_type: 'image/jpeg',
    upload_category: 'Product Photo',
    title: 'Hero Product Photo',
    notes: 'Main hero shot of the serum bottle on white background.',
    status: 'used',
    created_at: '2026-04-02T10:00:00Z',
  },
  {
    id: 'upload-3',
    company_id: 'company-demo-brand',
    uploaded_by: 'user-demo-client',
    file_url: DEMO_VIDEO_URL,
    file_name: 'raw-founder-clip.mp4',
    file_type: 'video/mp4',
    upload_category: 'Raw Video',
    title: 'Raw Founder Clip',
    notes: 'Unedited phone footage of founder talking about the product origin story.',
    status: 'submitted',
    created_at: '2026-04-05T10:00:00Z',
  },
  {
    id: 'upload-4',
    company_id: 'company-demo-brand',
    uploaded_by: 'user-demo-client',
    file_url: DEMO_VIDEO_URL,
    file_name: 'competitor-ad-reference.mp4',
    file_type: 'video/mp4',
    upload_category: 'Reference Video',
    title: 'Competitor Ad Reference',
    notes: 'Skincare brand ad we want to beat in performance. Note the hook structure.',
    status: 'submitted',
    created_at: '2026-04-06T10:00:00Z',
  },
  {
    id: 'upload-5',
    company_id: 'company-demo-brand',
    uploaded_by: 'user-demo-client',
    file_url: DEMO_VIDEO_URL,
    file_name: 'winning-ad-example.mp4',
    file_type: 'video/mp4',
    upload_category: 'Ad Example',
    title: 'Winning Ad Example',
    notes: 'Our best performing ad from last quarter. Keep the same energy.',
    status: 'reviewed',
    created_at: '2026-04-07T10:00:00Z',
  },
]

// ─── Demo Messages ────────────────────────────────────────────────────────────

export const DEMO_MESSAGES = [
  {
    id: 'msg-1',
    company_id: 'company-demo-brand',
    content_item_id: null,
    sender_user_id: 'user-admin',
    sender_role: 'admin',
    message: 'Welcome to UGCFire. We will use this chat for content direction, updates, and revisions.',
    read_at: '2026-04-01T10:05:00Z',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'msg-2',
    company_id: 'company-demo-brand',
    content_item_id: null,
    sender_user_id: 'user-demo-client',
    sender_role: 'client',
    message: 'Can we make next week\'s content more direct-response focused?',
    read_at: '2026-04-15T09:05:00Z',
    created_at: '2026-04-15T09:00:00Z',
  },
  {
    id: 'msg-3',
    company_id: 'company-demo-brand',
    content_item_id: null,
    sender_user_id: 'user-admin',
    sender_role: 'admin',
    message: 'Yes. We will strengthen the hooks, show more product close-ups, and add clearer CTAs.',
    read_at: '2026-04-15T10:05:00Z',
    created_at: '2026-04-15T10:00:00Z',
  },
  {
    id: 'msg-4',
    company_id: 'company-demo-brand',
    content_item_id: null,
    sender_user_id: 'user-demo-client',
    sender_role: 'client',
    message: 'Can we include more lifestyle photo content too?',
    read_at: null,
    created_at: '2026-04-20T14:00:00Z',
  },
  {
    id: 'msg-5',
    company_id: 'company-demo-brand',
    content_item_id: null,
    sender_user_id: 'user-admin',
    sender_role: 'admin',
    message: 'Absolutely. Upload any product photos or reference examples in My Uploads and we will use them.',
    read_at: null,
    created_at: '2026-04-20T15:00:00Z',
  },
]

// ─── Demo Revisions ───────────────────────────────────────────────────────────

export const DEMO_REVISIONS = [
  {
    id: 'revision-1',
    content_item_id: 'content-1',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    content_title: 'Founder-style UGC Video',
    requested_by: 'user-demo-client',
    revision_note: 'Can you make the first 3 seconds stronger and add a clearer CTA at the end? The hook feels a bit slow to get into the product.',
    status: 'open',
    created_at: '2026-04-27T09:00:00Z',
  },
  {
    id: 'revision-2',
    content_item_id: 'content-northstar-1',
    company_id: 'company-northstar',
    company_name: 'NorthStar Roofing',
    content_title: 'Customer Testimonial Video',
    requested_by: 'user-northstar',
    revision_note: 'Audio quality is low. Can we re-edit with background music removed and re-record the testimonial with better audio?',
    status: 'open',
    created_at: '2026-04-22T11:00:00Z',
  },
]

// ─── Demo Activity Logs ───────────────────────────────────────────────────────

export const DEMO_ACTIVITY_LOGS = [
  {
    id: 'log-1',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    actor_user_id: 'user-demo-client',
    actor_role: 'client',
    event_type: 'agreement_signed',
    event_message: 'Demo Brand signed the service agreement.',
    metadata: {},
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'log-2',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    actor_user_id: 'user-demo-client',
    actor_role: 'client',
    event_type: 'mock_payment_completed',
    event_message: 'Mock payment activated — Scale plan ($2,497/mo).',
    metadata: {},
    created_at: '2026-04-01T10:30:00Z',
  },
  {
    id: 'log-3',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    actor_user_id: 'user-demo-client',
    actor_role: 'client',
    event_type: 'onboarding_completed',
    event_message: 'Demo Brand completed onboarding.',
    metadata: {},
    created_at: '2026-04-01T11:00:00Z',
  },
  {
    id: 'log-4',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    actor_user_id: 'user-admin',
    actor_role: 'admin',
    event_type: 'content_uploaded',
    event_message: 'Week 1 content uploaded for Demo Brand (2 videos).',
    metadata: {},
    created_at: '2026-04-25T08:00:00Z',
  },
  {
    id: 'log-5',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    actor_user_id: 'user-demo-client',
    actor_role: 'client',
    event_type: 'client_approved_video',
    event_message: 'Client approved: Product Demo Video.',
    metadata: {},
    created_at: '2026-04-26T14:00:00Z',
  },
  {
    id: 'log-6',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    actor_user_id: 'user-demo-client',
    actor_role: 'client',
    event_type: 'client_requested_revision',
    event_message: 'Revision requested on Founder-style UGC Video.',
    metadata: {},
    created_at: '2026-04-27T09:00:00Z',
  },
  {
    id: 'log-7',
    company_id: 'company-apex-fitness',
    company_name: 'Apex Fitness Co.',
    actor_user_id: 'user-admin',
    actor_role: 'admin',
    event_type: 'content_uploaded',
    event_message: 'Week 1 content uploaded for Apex Fitness Co.',
    metadata: {},
    created_at: '2026-04-24T08:00:00Z',
  },
  {
    id: 'log-8',
    company_id: 'company-glow-skin',
    company_name: 'Glow Skin Studio',
    actor_user_id: 'user-admin',
    actor_role: 'admin',
    event_type: 'content_uploaded',
    event_message: 'Week 2 content uploaded for Glow Skin Studio.',
    metadata: {},
    created_at: '2026-04-25T09:00:00Z',
  },
  {
    id: 'log-9',
    company_id: 'company-northstar',
    company_name: 'NorthStar Roofing',
    actor_user_id: 'user-northstar',
    actor_role: 'client',
    event_type: 'client_requested_revision',
    event_message: 'NorthStar Roofing requested revision on testimonial video.',
    metadata: {},
    created_at: '2026-04-22T11:00:00Z',
  },
]

// ─── Demo Admin Stats ─────────────────────────────────────────────────────────

export const DEMO_ADMIN_STATS = {
  totalClients: 4,
  activeSubscriptions: 3,
  mockMrr: 2497 + 1497 + 2497, // Scale + Growth + Scale
  readyForReview: 3,
  openRevisions: 2,
  clientUploadsWaiting: 2,
  unreadMessages: 2,
  deliveredThisMonth: 2,
}

// ─── Demo Billing Records (Admin view) ───────────────────────────────────────

export const DEMO_BILLING_RECORDS = [
  {
    id: 'billing-demo-brand',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    plan_id: 'plan-scale-demo',
    plan_name: 'Scale',
    price_monthly: 2497,
    billing_status: 'active_mock',
    subscription_status: 'active_mock',
    mock_mode: true,
    current_period_start: '2026-04-01T00:00:00Z',
    current_period_end: '2026-05-01T00:00:00Z',
  },
  {
    id: 'billing-apex',
    company_id: 'company-apex-fitness',
    company_name: 'Apex Fitness Co.',
    plan_id: 'plan-growth-demo',
    plan_name: 'Growth',
    price_monthly: 1497,
    billing_status: 'active_mock',
    subscription_status: 'active_mock',
    mock_mode: true,
    current_period_start: '2026-04-01T00:00:00Z',
    current_period_end: '2026-05-01T00:00:00Z',
  },
  {
    id: 'billing-glow',
    company_id: 'company-glow-skin',
    company_name: 'Glow Skin Studio',
    plan_id: 'plan-scale-demo',
    plan_name: 'Scale',
    price_monthly: 2497,
    billing_status: 'active_mock',
    subscription_status: 'active_mock',
    mock_mode: true,
    current_period_start: '2026-04-01T00:00:00Z',
    current_period_end: '2026-05-01T00:00:00Z',
  },
  {
    id: 'billing-northstar',
    company_id: 'company-northstar',
    company_name: 'NorthStar Roofing',
    plan_id: 'plan-growth-demo',
    plan_name: 'Growth',
    price_monthly: 1497,
    billing_status: 'past_due_mock',
    subscription_status: 'past_due_mock',
    mock_mode: true,
    current_period_start: '2026-03-01T00:00:00Z',
    current_period_end: '2026-04-01T00:00:00Z',
  },
]

// ─── Demo Agreements (Admin view) ────────────────────────────────────────────

export const DEMO_AGREEMENTS = [
  {
    id: 'agreement-demo-brand',
    company_id: 'company-demo-brand',
    company_name: 'Demo Brand',
    plan_name: 'Scale',
    signed_name: 'Demo User',
    signed_email: 'demo@ugcfire.com',
    signed_at: '2026-04-01T10:00:00Z',
    agreement_version: 'v1.0',
    showcase_rights_checkbox: true,
    contract_title: 'UGCFire Service Agreement',
    contract_body: DEMO_AGREEMENT.contract_body,
  },
  {
    id: 'agreement-apex',
    company_id: 'company-apex-fitness',
    company_name: 'Apex Fitness Co.',
    plan_name: 'Growth',
    signed_name: 'Alex Apex',
    signed_email: 'apex@apexfitness.com',
    signed_at: '2026-03-15T10:00:00Z',
    agreement_version: 'v1.0',
    showcase_rights_checkbox: true,
    contract_title: 'UGCFire Service Agreement',
    contract_body: DEMO_AGREEMENT.contract_body,
  },
  {
    id: 'agreement-glow',
    company_id: 'company-glow-skin',
    company_name: 'Glow Skin Studio',
    plan_name: 'Scale',
    signed_name: 'Grace Glow',
    signed_email: 'hello@glowskinstudio.com',
    signed_at: '2026-03-10T10:00:00Z',
    agreement_version: 'v1.0',
    showcase_rights_checkbox: true,
    contract_title: 'UGCFire Service Agreement',
    contract_body: DEMO_AGREEMENT.contract_body,
  },
]

// ─── Demo Comments ────────────────────────────────────────────────────────────

export const DEMO_COMMENTS = [
  { id: 'comment-1', content_item_id: 'content-1',  company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'The hook at 0:00-0:03 feels weak. Can we punch it up?', is_internal: false, created_at: '2026-04-27T09:00:00Z' },
  { id: 'comment-2', content_item_id: 'content-1',  company_id: 'company-demo-brand', sender_user_id: 'user-admin',       sender_role: 'admin',  message: 'Got it. Will rework the opening with a stronger pattern interrupt.', is_internal: false, created_at: '2026-04-27T09:30:00Z' },
  { id: 'comment-3', content_item_id: 'content-4',  company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'Love the framing! Can we make the color grading warmer?', is_internal: false, created_at: '2026-04-27T09:15:00Z' },
  { id: 'comment-4', content_item_id: 'content-4',  company_id: 'company-demo-brand', sender_user_id: 'user-admin',       sender_role: 'admin',  message: 'Client wants warmer grade. Revisiting the LUT and lifting shadows.', is_internal: true, created_at: '2026-04-27T09:20:00Z' },
  { id: 'comment-5', content_item_id: 'content-8',  company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'Please replace slide 3 with the new product shot I just uploaded.', is_internal: false, created_at: '2026-04-27T11:30:00Z' },
  { id: 'comment-6', content_item_id: 'content-9',  company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'The CTA at the end is unclear. What exactly is the offer?', is_internal: false, created_at: '2026-04-26T10:00:00Z' },
  { id: 'comment-7', content_item_id: 'content-9',  company_id: 'company-demo-brand', sender_user_id: 'user-admin',       sender_role: 'admin',  message: 'Agreed. Adding "30-day free trial" overlay and a verbal CTA.', is_internal: false, created_at: '2026-04-26T10:30:00Z' },
  { id: 'comment-8', content_item_id: 'content-15', company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'Great energy! Just needs a tighter edit around the 0:15 mark.', is_internal: false, created_at: '2026-04-27T08:00:00Z' },
  { id: 'comment-9', content_item_id: 'content-20', company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'Wrong background color. Should be brand orange #FF3B1A not #FF5733.', is_internal: false, created_at: '2026-04-27T10:00:00Z' },
  { id: 'comment-10', content_item_id: 'content-20', company_id: 'company-demo-brand', sender_user_id: 'user-admin',      sender_role: 'admin',  message: 'Color fix noted. Updating the asset file now.', is_internal: false, created_at: '2026-04-27T10:15:00Z' },
  { id: 'comment-11', content_item_id: 'content-28', company_id: 'company-demo-brand', sender_user_id: 'user-demo-client', sender_role: 'client', message: 'Remove the competitor name entirely — legal concern.', is_internal: false, created_at: '2026-04-26T13:00:00Z' },
  { id: 'comment-12', content_item_id: 'content-28', company_id: 'company-demo-brand', sender_user_id: 'user-admin',      sender_role: 'admin',  message: 'Will replace with generic "leading brand" reference throughout.', is_internal: false, created_at: '2026-04-26T13:30:00Z' },
]

// ─── Demo Upload Batches ──────────────────────────────────────────────────────

export const DEMO_UPLOAD_BATCHES = [
  { id: 'batch-1', company_id: 'company-demo-brand', uploaded_by: 'user-admin', uploaded_by_role: 'admin', batch_name: 'Week 1 May 2026 Batch', item_count: 4, status: 'delivered', created_at: '2026-04-25T08:00:00Z' },
  { id: 'batch-2', company_id: 'company-demo-brand', uploaded_by: 'user-admin', uploaded_by_role: 'admin', batch_name: 'Week 2 May 2026 Batch', item_count: 5, status: 'ready_for_review', created_at: '2026-04-27T08:00:00Z' },
  { id: 'batch-3', company_id: 'company-demo-brand', uploaded_by: 'user-admin', uploaded_by_role: 'admin', batch_name: 'April Archive Batch',  item_count: 8, status: 'delivered', created_at: '2026-04-01T08:00:00Z' },
  { id: 'batch-4', company_id: 'company-apex-fitness', uploaded_by: 'user-admin', uploaded_by_role: 'admin', batch_name: 'Apex Week 1 Batch', item_count: 3, status: 'ready_for_review', created_at: '2026-04-24T08:00:00Z' },
  { id: 'batch-5', company_id: 'company-glow-skin',  uploaded_by: 'user-admin', uploaded_by_role: 'admin', batch_name: 'Glow Week 1-2 Batch', item_count: 4, status: 'approved', created_at: '2026-04-22T08:00:00Z' },
]

// ─── Admin Content Items (all companies) ─────────────────────────────────────

export const DEMO_ALL_CONTENT = [
  ...DEMO_CONTENT_ITEMS,
  // Apex Fitness Co.
  { id: 'content-apex-1', company_id: 'company-apex-fitness', company_name: 'Apex Fitness Co.', title: 'Transformation Story Video', description: 'Client transformation testimonial over 90 days', media_type: 'video', status: 'delivered', week_label: 'Week 1 - May 2026', content_type: 'Testimonial', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-20T08:00:00Z', approved_at: '2026-04-21T10:00:00Z', delivered_at: '2026-04-22T08:00:00Z', deleted_at: null, created_at: '2026-04-20T08:00:00Z' },
  { id: 'content-apex-2', company_id: 'company-apex-fitness', company_name: 'Apex Fitness Co.', title: 'Workout Highlights Reel', description: 'High-energy gym reel for Instagram and TikTok', media_type: 'video', status: 'ready_for_review', week_label: 'Week 2 - May 2026', content_type: 'Lifestyle', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-27T08:00:00Z', approved_at: null, delivered_at: null, deleted_at: null, created_at: '2026-04-27T08:00:00Z' },
  { id: 'content-apex-3', company_id: 'company-apex-fitness', company_name: 'Apex Fitness Co.', title: 'Protein Supplement Ad', description: 'Direct response ad for post-workout supplement', media_type: 'video', status: 'revision_requested', week_label: 'Week 2 - May 2026', content_type: 'Ad Creative', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: false, uploaded_by: 'user-admin', uploaded_at: '2026-04-26T08:00:00Z', approved_at: null, delivered_at: null, deleted_at: null, created_at: '2026-04-26T08:00:00Z' },
  { id: 'content-apex-4', company_id: 'company-apex-fitness', company_name: 'Apex Fitness Co.', title: 'Gym Tour Walkthrough', description: 'Facility tour video for local audience targeting', media_type: 'video', status: 'approved', week_label: 'Week 1 - May 2026', content_type: 'Brand Story', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-19T08:00:00Z', approved_at: '2026-04-20T11:00:00Z', delivered_at: null, deleted_at: null, created_at: '2026-04-19T08:00:00Z' },
  { id: 'content-apex-5', company_id: 'company-apex-fitness', company_name: 'Apex Fitness Co.', title: 'Membership Offer Graphic', description: 'Static ad for spring membership promotion', media_type: 'graphic', status: 'delivered', week_label: 'Week 1 - May 2026', content_type: 'Ad Creative', file_url: DEMO_PHOTO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-17T08:00:00Z', approved_at: '2026-04-18T09:00:00Z', delivered_at: '2026-04-19T08:00:00Z', deleted_at: null, created_at: '2026-04-17T08:00:00Z' },
  // Glow Skin Studio
  { id: 'content-glow-1', company_id: 'company-glow-skin', company_name: 'Glow Skin Studio', title: 'Facial Treatment ASMR Video', description: 'Relaxing treatment process video with ambient sound', media_type: 'video', status: 'approved', week_label: 'Week 1 - May 2026', content_type: 'Process', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-22T08:00:00Z', approved_at: '2026-04-23T10:00:00Z', delivered_at: null, deleted_at: null, created_at: '2026-04-22T08:00:00Z' },
  { id: 'content-glow-2', company_id: 'company-glow-skin', company_name: 'Glow Skin Studio', title: 'Product Close-Up Photo Set', description: 'Studio product photography of full treatment range', media_type: 'photo', status: 'ready_for_review', week_label: 'Week 2 - May 2026', content_type: 'Product Shot', file_url: DEMO_PHOTO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-27T09:00:00Z', approved_at: null, delivered_at: null, deleted_at: null, created_at: '2026-04-27T09:00:00Z' },
  { id: 'content-glow-3', company_id: 'company-glow-skin', company_name: 'Glow Skin Studio', title: 'Client Glow Results Video', description: 'Before and after transformation reveal video', media_type: 'video', status: 'delivered', week_label: 'Week 1 - May 2026', content_type: 'Before / After', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-18T08:00:00Z', approved_at: '2026-04-19T10:00:00Z', delivered_at: '2026-04-20T08:00:00Z', deleted_at: null, created_at: '2026-04-18T08:00:00Z' },
  { id: 'content-glow-4', company_id: 'company-glow-skin', company_name: 'Glow Skin Studio', title: 'Booking CTA Reel', description: 'Short urgency-driven reel driving appointment bookings', media_type: 'video', status: 'in_production', week_label: 'Week 2 - May 2026', content_type: 'Direct Response', file_url: null, thumbnail_url: null, can_showcase: true, uploaded_by: 'user-admin', uploaded_at: '2026-04-27T12:00:00Z', approved_at: null, delivered_at: null, deleted_at: null, created_at: '2026-04-27T12:00:00Z' },
  // NorthStar Roofing
  { id: 'content-northstar-1', company_id: 'company-northstar', company_name: 'NorthStar Roofing', title: 'Before / After Roof Reveal', description: 'Drone and ground-level before/after of completed job', media_type: 'video', status: 'delivered', week_label: 'Week 1 - May 2026', content_type: 'Before / After', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: false, uploaded_by: 'user-admin', uploaded_at: '2026-04-15T08:00:00Z', approved_at: '2026-04-16T10:00:00Z', delivered_at: '2026-04-17T08:00:00Z', deleted_at: null, created_at: '2026-04-15T08:00:00Z' },
  { id: 'content-northstar-2', company_id: 'company-northstar', company_name: 'NorthStar Roofing', title: 'Customer Testimonial Video', description: 'On-site testimonial from satisfied homeowner', media_type: 'video', status: 'revision_requested', week_label: 'Week 2 - May 2026', content_type: 'Testimonial', file_url: DEMO_VIDEO_URL, thumbnail_url: null, can_showcase: false, uploaded_by: 'user-admin', uploaded_at: '2026-04-22T08:00:00Z', approved_at: null, delivered_at: null, deleted_at: null, created_at: '2026-04-22T08:00:00Z' },
  { id: 'content-northstar-3', company_id: 'company-northstar', company_name: 'NorthStar Roofing', title: 'Emergency Repair Photo Ad', description: 'Storm damage service static ad for local targeting', media_type: 'photo', status: 'ready_for_review', week_label: 'Week 2 - May 2026', content_type: 'Ad Creative', file_url: DEMO_PHOTO_URL, thumbnail_url: null, can_showcase: false, uploaded_by: 'user-admin', uploaded_at: '2026-04-27T09:30:00Z', approved_at: null, delivered_at: null, deleted_at: null, created_at: '2026-04-27T09:30:00Z' },
]

// ─── Mock Marketplace Projects ───────────────────────────────────────────────

export type ProjectStatus = 'Posted' | 'Creators Invited' | 'In Progress' | 'Submitted' | 'Approved' | 'Completed'
export type EscrowStatus  = 'Not Funded' | 'Funded' | 'In Review' | 'Released'

export interface MockApplicant {
  id: string; name: string; role: string; initials: string; color: string;
  skills: string[]; portfolioCount: number; message: string;
  status: 'Applied' | 'Shortlisted' | 'Invited' | 'Declined';
}

export interface MockSubmission {
  id: string; creatorName: string; creatorInitials: string; creatorColor: string;
  title: string; notes: string; status: 'Pending' | 'Approved' | 'Revision Requested';
  submittedAt: string;
}

export interface MockProject {
  id: string; title: string; brandName: string; brandInitials: string; brandColor: string;
  category: string; contentType: string; description: string;
  budget: number; creatorPayMin: number; creatorPayMax: number; platformFee: number;
  deadline: string; daysLeft: number;
  status: ProjectStatus; escrowStatus: EscrowStatus;
  deliverables: string[]; skills: string[]; brief: string;
  assets: { name: string; type: string }[];
  applicants: MockApplicant[];
  submissions: MockSubmission[];
  icon: string;
}

const ORANGE = '#FF5C00'
const LIME   = '#a3e635'

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: 'proj-1',
    title: 'Skincare TikTok Ad Pack',
    brandName: 'GlowCo Beauty',
    brandInitials: 'GC',
    brandColor: '#f472b6',
    category: 'Beauty & Skincare',
    contentType: 'AI Video Ads',
    description: 'We need 3 UGC-style TikTok ads for our new vitamin C serum. Casual, relatable tone — think everyday person discovering the product.',
    budget: 450,
    creatorPayMin: 130,
    creatorPayMax: 180,
    platformFee: 45,
    deadline: 'May 17, 2026',
    daysLeft: 7,
    status: 'In Progress',
    escrowStatus: 'Funded',
    deliverables: ['3 × 30–60s UGC-style TikTok videos', '3 × thumbnail images', 'Raw files + captions'],
    skills: ['UGC Video', 'TikTok Ads', 'Skincare Knowledge'],
    brief: `Brand: GlowCo Beauty — Vitamin C Glow Serum\n\nCampaign Goal: Drive awareness and first-time purchases among women aged 22–35 on TikTok and Instagram Reels.\n\nTone: Casual, authentic, relatable. Think everyday person stumbling across this product and genuinely loving it — not polished influencer content.\n\nHook ideas:\n- "I stopped using my $80 serum for this $24 one"\n- "Dermatologists don't want you to know about this"\n- "Day 7 update — here's what happened to my dark spots"\n\nDo NOT use: clinical claims, before/after medical comparisons, competitor mentions.\n\nDeliverables: 3 videos at 9:16, 30–60 seconds each. Include captions and hook text overlay for at least 2 of the 3.`,
    assets: [
      { name: 'GlowCo_Primary_Logo.png', type: 'PNG' },
      { name: 'Product_Hero_Shot.jpg', type: 'JPG' },
      { name: 'Brand_Colors_Guide.pdf', type: 'PDF' },
    ],
    applicants: [
      { id: 'ap-1', name: 'Alex Rivera', role: 'AI Ad Creator', initials: 'AR', color: LIME, skills: ['UGC Video', 'Product Ads'], portfolioCount: 24, message: 'I specialize in exactly this style — casual TikTok hooks that convert. My last skincare project got 2.4M views.', status: 'Shortlisted' },
      { id: 'ap-2', name: 'Maya Chen', role: 'AI Visual Designer', initials: 'MC', color: '#22d3ee', skills: ['TikTok Ads', 'Lifestyle'], portfolioCount: 18, message: 'Huge fan of the GlowCo brand aesthetic. I can deliver authentic-feeling content that matches your vibe.', status: 'Invited' },
      { id: 'ap-3', name: 'Riley Park', role: 'AI Image Specialist', initials: 'RP', color: '#a855f7', skills: ['Skincare', 'UGC Style'], portfolioCount: 15, message: 'I have experience with beauty brands and understand the language that resonates with your target demo.', status: 'Applied' },
    ],
    submissions: [
      { id: 'sub-1', creatorName: 'Alex Rivera', creatorInitials: 'AR', creatorColor: LIME, title: 'Hook Draft v1 — "I stopped using my $80 serum"', notes: 'First pass at the opening hook. Happy to adjust pacing or swap the overlay text.', status: 'Pending', submittedAt: 'May 10, 2026' },
      { id: 'sub-2', creatorName: 'Maya Chen', creatorInitials: 'MC', creatorColor: '#22d3ee', title: 'Day-in-the-life routine angle', notes: 'Went with a more lifestyle-forward approach for variation.', status: 'Revision Requested', submittedAt: 'May 9, 2026' },
    ],
    icon: '✨',
  },
  {
    id: 'proj-2',
    title: 'Coffee Brand Product Visuals',
    brandName: 'Roast & Co.',
    brandInitials: 'RC',
    brandColor: '#b45309',
    category: 'Food & Beverage',
    contentType: 'AI Image Ads',
    description: 'Product photography pack for a premium cold brew brand. Minimal, moody, high-contrast aesthetic.',
    budget: 320,
    creatorPayMin: 90,
    creatorPayMax: 140,
    platformFee: 32,
    deadline: 'May 20, 2026',
    daysLeft: 10,
    status: 'Creators Invited',
    escrowStatus: 'Funded',
    deliverables: ['8 × product lifestyle images', '4 × flat-lay shots', 'White-background cutouts'],
    skills: ['Product Photography', 'AI Image Generation', 'Minimalist Aesthetic'],
    brief: `Brand: Roast & Co. — Premium Cold Brew Coffee\n\nWe need a full product visual pack for our new seasonal cold brew line (3 flavors: Original Black, Caramel, Oat Milk Vanilla).\n\nAesthetic: Dark, moody, premium. Think VSCO-grade lifestyle — condensation on glass, dramatic lighting, clean backgrounds.\n\nSettings: Kitchen countertop, outdoor café table, studio white. Mix of settings.\n\nDo: High contrast, rich shadows, close-up product details.\nDon't: Bright or pastel tones, cluttered compositions, stock-photo vibes.\n\nDeliverables: 8 lifestyle images + 4 flat-lays + white-bg cutouts for e-commerce. All at 4:5 and 1:1.`,
    assets: [
      { name: 'Roast_Logo_Dark.svg', type: 'SVG' },
      { name: 'Product_Reference.jpg', type: 'JPG' },
    ],
    applicants: [
      { id: 'ap-4', name: 'Sam Torres', role: 'AI Content Strategist', initials: 'ST', color: ORANGE, skills: ['Product Shots', 'Flat Lay'], portfolioCount: 22, message: 'I love moody food & beverage aesthetics. Portfolio has 3 cold brew projects.', status: 'Invited' },
      { id: 'ap-5', name: 'Casey Morgan', role: 'AI Image Specialist', initials: 'CM', color: '#f59e0b', skills: ['Minimalism', 'Product'], portfolioCount: 9, message: 'Available immediately. Minimal aesthetic is my default style.', status: 'Applied' },
    ],
    submissions: [],
    icon: '☕',
  },
  {
    id: 'proj-3',
    title: 'Fitness App AI UGC Videos',
    brandName: 'CoreFit App',
    brandInitials: 'CF',
    brandColor: LIME,
    category: 'Health & Fitness',
    contentType: 'UGC-Style Ads',
    description: 'Conversion-focused short-form video ads for a fitness app. Real results, authentic hooks.',
    budget: 600,
    creatorPayMin: 175,
    creatorPayMax: 250,
    platformFee: 60,
    deadline: 'May 15, 2026',
    daysLeft: 5,
    status: 'Submitted',
    escrowStatus: 'In Review',
    deliverables: ['5 × 15–45s video ads', 'At least 2 with hook overlays', 'Vertical 9:16 format'],
    skills: ['UGC Video', 'Fitness Content', 'Direct Response'],
    brief: `Brand: CoreFit App — Fitness & Workout Tracking\n\nGoal: Drive app installs from fitness enthusiasts aged 18–40. Platform: TikTok, Instagram Reels.\n\nAngle: Real people who would use this app. Not gym influencers — everyday fitness beginners or intermediate users.\n\nHook angles to explore:\n- "I tried every fitness app and deleted them all until this"\n- "This app paid for itself in 3 weeks"\n- "Why I stopped going to the gym (and still got results)"\n\nStyle: Phone screen recordings welcome. Walk through app features naturally. Raw, lo-fi is OK.\n\nDeliverables: 5 videos. Mix of hooks. 9:16 format only.`,
    assets: [
      { name: 'CoreFit_Brand_Kit.pdf', type: 'PDF' },
      { name: 'App_Screenshots.png', type: 'PNG' },
    ],
    applicants: [
      { id: 'ap-6', name: 'Jordan Kim', role: 'AI Video Creator', initials: 'JK', color: '#a855f7', skills: ['Direct Response', 'Fitness'], portfolioCount: 31, message: 'Direct response hooks are my specialty. Delivered 6 fitness brand projects last month.', status: 'Shortlisted' },
    ],
    submissions: [
      { id: 'sub-3', creatorName: 'Jordan Kim', creatorInitials: 'JK', creatorColor: '#a855f7', title: 'Hook Set A — "I tried every fitness app"', notes: 'Three variations of the hook — different pace and overlay text. Let me know which resonates.', status: 'Pending', submittedAt: 'May 10, 2026' },
      { id: 'sub-4', creatorName: 'Jordan Kim', creatorInitials: 'JK', creatorColor: '#a855f7', title: 'App walkthrough tutorial ad', notes: 'Screen recording style, casual narration. Tested two opening frames.', status: 'Approved', submittedAt: 'May 8, 2026' },
    ],
    icon: '💪',
  },
  {
    id: 'proj-4',
    title: 'Supplement Brand Launch Ads',
    brandName: 'PureForm',
    brandInitials: 'PF',
    brandColor: '#6366f1',
    category: 'Health & Nutrition',
    contentType: 'AI Video Ads',
    description: 'Launch campaign for a new pre-workout supplement. High-energy, direct-response style.',
    budget: 800,
    creatorPayMin: 240,
    creatorPayMax: 340,
    platformFee: 80,
    deadline: 'May 22, 2026',
    daysLeft: 12,
    status: 'Posted',
    escrowStatus: 'Not Funded',
    deliverables: ['4 × 30s video ads', '2 × 60s deep-dive videos', 'Static ad versions'],
    skills: ['High-energy Video', 'Direct Response', 'Supplement Industry'],
    brief: `Brand: PureForm — Pre-Workout Supplement\n\nProduct launch campaign for SURGE Pre-Workout. Target: gym-goers 20–35 who are tired of under-dosed supplements.\n\nTone: Confident, energetic, results-focused. Not bro-gym cringe — think clean, scientific edge with lifestyle appeal.\n\nAngles:\n- Performance comparison (without naming competitors)\n- Ingredient transparency ("Most pre-workouts hide behind proprietary blends...")\n- Day-in-the-life using SURGE\n\nFormat: Mix of 30s punchy ads and one longer 60s breakdown video.\n\nBudget is flexible for the right creator.`,
    assets: [
      { name: 'SURGE_Product_Images.zip', type: 'ZIP' },
      { name: 'PureForm_Brand_Guide.pdf', type: 'PDF' },
    ],
    applicants: [],
    submissions: [],
    icon: '⚡',
  },
  {
    id: 'proj-5',
    title: 'Local Restaurant Short-Form Ads',
    brandName: 'Harvest Table',
    brandInitials: 'HT',
    brandColor: '#f97316',
    category: 'Food & Beverage',
    contentType: 'UGC-Style Ads',
    description: 'Authentic-feeling social ads for a farm-to-table restaurant. Local audience, warm vibe.',
    budget: 280,
    creatorPayMin: 80,
    creatorPayMax: 120,
    platformFee: 28,
    deadline: 'May 24, 2026',
    daysLeft: 14,
    status: 'Creators Invited',
    escrowStatus: 'Funded',
    deliverables: ['4 × short-form videos', '6 × social image posts', 'Story formats'],
    skills: ['Food Content', 'Lifestyle Video', 'Local Marketing'],
    brief: `Brand: Harvest Table Restaurant — Durham, NC\n\nFarm-to-table restaurant promoting their new summer menu and dinner reservation experience.\n\nAudience: Local Durham residents, food lovers 28–50, health-conscious diners.\n\nVibe: Warm, earthy, inviting. Think Sunday afternoon, natural light, rustic wood tables.\n\nContent needed:\n- Menu reveal / food highlights\n- Behind-the-scenes kitchen clip\n- "Why we source locally" story beat\n- Reservation CTA content\n\nDeliverables: 4 videos (15–30s) + 6 social image posts. Include summer colors — warm oranges, greens.`,
    assets: [
      { name: 'Harvest_Logo.png', type: 'PNG' },
      { name: 'Menu_Summer_2026.pdf', type: 'PDF' },
    ],
    applicants: [
      { id: 'ap-7', name: 'Alex Rivera', role: 'AI Ad Creator', initials: 'AR', color: LIME, skills: ['Food Content', 'Lifestyle'], portfolioCount: 24, message: 'Love the farm-to-table concept. Warm lifestyle content is in my top portfolio pieces.', status: 'Invited' },
    ],
    submissions: [],
    icon: '🌿',
  },
  {
    id: 'proj-6',
    title: 'SaaS Explainer Video Concepts',
    brandName: 'ToolHive',
    brandInitials: 'TH',
    brandColor: '#22d3ee',
    category: 'Software & SaaS',
    contentType: 'AI Video Ads',
    description: 'Clear, engaging explainer videos for a B2B project management SaaS tool.',
    budget: 950,
    creatorPayMin: 280,
    creatorPayMax: 400,
    platformFee: 95,
    deadline: 'May 28, 2026',
    daysLeft: 18,
    status: 'Approved',
    escrowStatus: 'Released',
    deliverables: ['3 × 60–90s explainer videos', '1 × 30s social cut', 'Captions + thumbnails'],
    skills: ['SaaS Explainers', 'Screen Recording', 'B2B Marketing'],
    brief: `Brand: ToolHive — B2B Project Management Platform\n\nWe need explainer videos that communicate our value prop clearly without being boring. Target: startup ops leads, project managers, team leads at 10–200 person companies.\n\nKey messages:\n- "Stop juggling 6 tools — ToolHive replaces them all"\n- Time-to-value: 10-minute onboarding\n- Integrates with Slack, Notion, GitHub\n\nStyle: Screen-share walkthroughs with talking-head or voiceover. Clean, professional but approachable.\n\nDeliverables: 3 longer explainers + 1 punchy 30s version for paid social.`,
    assets: [
      { name: 'ToolHive_Brand_Kit.pdf', type: 'PDF' },
      { name: 'App_Demo_Access.txt', type: 'TXT' },
    ],
    applicants: [
      { id: 'ap-8', name: 'Jordan Kim', role: 'AI Video Creator', initials: 'JK', color: '#a855f7', skills: ['SaaS', 'Explainer'], portfolioCount: 31, message: 'B2B SaaS explainers are my niche. Happy to share samples.', status: 'Invited' },
    ],
    submissions: [
      { id: 'sub-5', creatorName: 'Jordan Kim', creatorInitials: 'JK', creatorColor: '#a855f7', title: 'Full Explainer — "Stop juggling 6 tools"', notes: 'Final version with captions and thumbnail. Ready for review.', status: 'Approved', submittedAt: 'May 6, 2026' },
      { id: 'sub-6', creatorName: 'Jordan Kim', creatorInitials: 'JK', creatorColor: '#a855f7', title: '30s Social Cut', notes: 'Punchy version optimized for TikTok / LinkedIn.', status: 'Approved', submittedAt: 'May 7, 2026' },
    ],
    icon: '💻',
  },
]

export function getProjectById(id: string): MockProject | undefined {
  return MOCK_PROJECTS.find(p => p.id === id)
}

// ─── Admin Marketplace Mock Data ─────────────────────────────────────────────

export interface AdminClient {
  id: string; brandName: string; contactName: string; contactEmail: string;
  activeProjects: number; totalSpend: number; paymentStatus: 'Current' | 'Pending' | 'Overdue';
  lastActivity: string; initials: string; color: string;
}

export interface AdminPayment {
  id: string; projectId: string; projectTitle: string;
  clientName: string; creatorName: string;
  projectBudget: number; creatorPayout: number; platformFee: number;
  escrowStatus: EscrowStatus; payoutStatus: 'Pending' | 'Released' | 'On Hold' | 'Refunded';
  date: string;
}

export interface AdminDispute {
  id: string; projectId: string; projectTitle: string;
  clientName: string; creatorName: string;
  issueType: 'Revision Requested' | 'Client Rejected' | 'Late Delivery' | 'Payment Hold' | 'Quality Review';
  amountAtRisk: number; status: 'Open' | 'In Review' | 'Resolved' | 'Escalated';
  lastMessage: string; createdAt: string;
}

export interface AdminActivity {
  id: string; type: 'project' | 'application' | 'submission' | 'payment' | 'dispute' | 'creator';
  message: string; detail: string; time: string; color: string;
}

export const ADMIN_CLIENTS: AdminClient[] = [
  { id: 'client-1', brandName: 'GlowCo Beauty',  contactName: 'Sarah Kim',    contactEmail: 'sarah@glowco.com',   activeProjects: 2, totalSpend: 770,   paymentStatus: 'Current', lastActivity: '2 hours ago',   initials: 'GC', color: '#f472b6' },
  { id: 'client-2', brandName: 'Roast & Co.',    contactName: 'Marco Lima',   contactEmail: 'marco@roastco.com',  activeProjects: 1, totalSpend: 320,   paymentStatus: 'Current', lastActivity: '1 day ago',     initials: 'RC', color: '#b45309' },
  { id: 'client-3', brandName: 'CoreFit App',    contactName: 'Tyler Brown',  contactEmail: 'tyler@corefit.app',  activeProjects: 1, totalSpend: 600,   paymentStatus: 'Pending', lastActivity: '3 hours ago',   initials: 'CF', color: '#a3e635' },
  { id: 'client-4', brandName: 'PureForm',       contactName: 'Jessica Chen', contactEmail: 'jess@pureform.co',   activeProjects: 1, totalSpend: 800,   paymentStatus: 'Current', lastActivity: '5 hours ago',   initials: 'PF', color: '#6366f1' },
  { id: 'client-5', brandName: 'Harvest Table',  contactName: 'David Park',   contactEmail: 'david@harvesttable.com', activeProjects: 1, totalSpend: 280, paymentStatus: 'Current', lastActivity: '1 day ago',   initials: 'HT', color: '#f97316' },
  { id: 'client-6', brandName: 'ToolHive',       contactName: 'Anika Shah',   contactEmail: 'anika@toolhive.io',  activeProjects: 0, totalSpend: 950,   paymentStatus: 'Current', lastActivity: '3 days ago',    initials: 'TH', color: '#22d3ee' },
]

export const ADMIN_PAYMENTS: AdminPayment[] = [
  { id: 'pay-1', projectId: 'proj-6', projectTitle: 'SaaS Explainer Videos',    clientName: 'ToolHive',      creatorName: 'Jordan Kim',  projectBudget: 950, creatorPayout: 340, platformFee: 95, escrowStatus: 'Released',   payoutStatus: 'Released', date: 'May 8, 2026'  },
  { id: 'pay-2', projectId: 'proj-3', projectTitle: 'Fitness App AI UGC Videos', clientName: 'CoreFit App',  creatorName: 'Jordan Kim',  projectBudget: 600, creatorPayout: 250, platformFee: 60, escrowStatus: 'In Review',  payoutStatus: 'Pending',  date: 'May 10, 2026' },
  { id: 'pay-3', projectId: 'proj-1', projectTitle: 'Skincare TikTok Ad Pack',   clientName: 'GlowCo Beauty',creatorName: 'Alex Rivera', projectBudget: 450, creatorPayout: 180, platformFee: 45, escrowStatus: 'Funded',     payoutStatus: 'On Hold',  date: 'May 10, 2026' },
  { id: 'pay-4', projectId: 'proj-5', projectTitle: 'Local Restaurant Ads',      clientName: 'Harvest Table',creatorName: 'Alex Rivera', projectBudget: 280, creatorPayout: 120, platformFee: 28, escrowStatus: 'Funded',     payoutStatus: 'Pending',  date: 'May 9, 2026'  },
  { id: 'pay-5', projectId: 'proj-2', projectTitle: 'Coffee Brand Visuals',      clientName: 'Roast & Co.', creatorName: 'Sam Torres',  projectBudget: 320, creatorPayout: 140, platformFee: 32, escrowStatus: 'Funded',     payoutStatus: 'Pending',  date: 'May 8, 2026'  },
  { id: 'pay-6', projectId: 'proj-4', projectTitle: 'Supplement Brand Ads',      clientName: 'PureForm',    creatorName: '—',           projectBudget: 800, creatorPayout: 340, platformFee: 80, escrowStatus: 'Not Funded', payoutStatus: 'Pending',  date: 'May 5, 2026'  },
]

export const ADMIN_DISPUTES: AdminDispute[] = [
  { id: 'disp-1', projectId: 'proj-1', projectTitle: 'Skincare TikTok Ad Pack',   clientName: 'GlowCo Beauty', creatorName: 'Maya Chen',  issueType: 'Revision Requested', amountAtRisk: 130, status: 'Open',      lastMessage: 'Client requesting color grading changes on draft 2.', createdAt: 'May 10, 2026' },
  { id: 'disp-2', projectId: 'proj-3', projectTitle: 'Fitness App AI UGC Videos', clientName: 'CoreFit App',   creatorName: 'Jordan Kim', issueType: 'Client Rejected',     amountAtRisk: 250, status: 'In Review', lastMessage: 'Client says the screen recording quality is too low.', createdAt: 'May 9, 2026'  },
  { id: 'disp-3', projectId: 'proj-2', projectTitle: 'Coffee Brand Visuals',      clientName: 'Roast & Co.', creatorName: 'Sam Torres', issueType: 'Late Delivery',       amountAtRisk: 140, status: 'In Review', lastMessage: 'Creator missed deadline by 2 days without notice.', createdAt: 'May 8, 2026'  },
  { id: 'disp-4', projectId: 'proj-5', projectTitle: 'Local Restaurant Ads',      clientName: 'Harvest Table',creatorName: 'Alex Rivera',issueType: 'Quality Review',      amountAtRisk: 80,  status: 'Resolved',  lastMessage: 'Admin reviewed — quality meets standard. Approved.', createdAt: 'May 7, 2026'  },
]

export const ADMIN_ACTIVITY: AdminActivity[] = [
  { id: 'act-1', type: 'submission', message: 'New submission',      detail: 'Jordan Kim submitted "Fitness App Hook Set A" for CoreFit App',         time: '12m ago',  color: '#FF5C00'  },
  { id: 'act-2', type: 'application',message: 'New application',    detail: 'Riley Park applied to "Skincare TikTok Ad Pack" (GlowCo Beauty)',        time: '28m ago',  color: '#22d3ee'  },
  { id: 'act-3', type: 'payment',    message: 'Escrow funded',       detail: 'CoreFit App funded escrow $600 for Fitness App AI UGC Videos',           time: '1h ago',   color: '#a3e635'  },
  { id: 'act-4', type: 'dispute',    message: 'Dispute opened',      detail: 'GlowCo Beauty requested revision on Skincare TikTok Ad Pack',            time: '2h ago',   color: '#ef4444'  },
  { id: 'act-5', type: 'creator',    message: 'Creator joined',      detail: 'Casey Morgan completed profile and turned on Open to Work',              time: '3h ago',   color: '#a3e635'  },
  { id: 'act-6', type: 'project',    message: 'Project posted',      detail: 'PureForm posted "Supplement Brand Launch Ads" — $800 budget',           time: '5h ago',   color: '#FF5C00'  },
  { id: 'act-7', type: 'payment',    message: 'Payout released',     detail: 'Jordan Kim received $340 payout for SaaS Explainer Videos',             time: '1d ago',   color: '#a3e635'  },
  { id: 'act-8', type: 'application',message: 'Application shortlisted', detail: 'Alex Rivera shortlisted for Skincare TikTok Ad Pack',              time: '1d ago',   color: '#22d3ee'  },
]
