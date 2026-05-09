// ─── Creator Network — Types & Demo Data ──────────────────────────────────────

export type CreatorSpecialty =
  | 'Beauty' | 'Fitness' | 'Ecommerce' | 'Food & Beverage'
  | 'Tech' | 'Fashion' | 'Lifestyle' | 'Gaming' | 'Pets' | 'Local Business';

export interface CreatorProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  specialties: CreatorSpecialty[];
  available_for_work: boolean;
  featured: boolean;
  followers: number;
  projects_count: number;
  joined_at: string;
}

export interface CreatorProject {
  id: string;
  creator_id: string;
  creator_username: string;
  creator_name: string;
  creator_avatar: string | null;
  title: string;
  description: string;
  thumbnail_url: string;
  media_url: string;
  media_type: 'video' | 'image';
  tags: string[];
  likes: number;
  views: number;
  published: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_name: string;
  author_avatar: string | null;
  category: 'Feature Request' | 'Bug Report' | 'Idea' | 'General';
  title: string;
  body: string;
  upvotes: number;
  comment_count: number;
  status: 'Under Review' | 'Planned' | 'Building' | 'Launched' | null;
  created_at: string;
}

export interface CreatorInvite {
  id: string;
  admin_id: string;
  creator_id: string;
  project_brief: string;
  budget_range: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  created_at: string;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
];

const VIDEO_THUMBS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/be7f70f4-139f-4cb1-bcaa-964d79dc6a9e.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/a9a7a9fd-e332-4750-bdd9-859ab5f45948.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5e1cf241-a837-4b51-a46c-f0fb5d643f1f.png',
];

const DEMO_VIDEOS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-style-ve_2891981897.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-energetic-ugc-fitne_2891987468.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugcstyle-tes_2892041483.mp4',
];

export const DEMO_CREATORS: CreatorProfile[] = [
  { id: 'c1', username: 'sophiaai',    display_name: 'Sophia Chen',     avatar_url: AVATAR_URLS[0], bio: 'Beauty & skincare UGC creator. 3+ years making viral content for DTC brands.', specialties: ['Beauty', 'Lifestyle'],          available_for_work: true,  featured: true,  followers: 1240, projects_count: 18, joined_at: '2025-10-01' },
  { id: 'c2', username: 'marcfitness', display_name: 'Marc Laurent',    avatar_url: AVATAR_URLS[1], bio: 'Fitness & wellness content. I make brands look premium and authentic.',          specialties: ['Fitness', 'Lifestyle'],         available_for_work: true,  featured: true,  followers: 890,  projects_count: 12, joined_at: '2025-11-15' },
  { id: 'c3', username: 'ayatech',     display_name: 'Aya Osei',        avatar_url: AVATAR_URLS[2], bio: 'Tech & gadget UGC. Clear, punchy demos that convert cold audiences.',            specialties: ['Tech', 'Ecommerce'],            available_for_work: false, featured: false, followers: 2100, projects_count: 31, joined_at: '2025-09-20' },
  { id: 'c4', username: 'lukestyle',   display_name: 'Luke Morales',    avatar_url: AVATAR_URLS[3], bio: 'Fashion & lifestyle. I help brands feel culturally current.',                   specialties: ['Fashion', 'Lifestyle'],         available_for_work: true,  featured: false, followers: 560,  projects_count: 9,  joined_at: '2026-01-05' },
  { id: 'c5', username: 'emmafood',    display_name: 'Emma Nakamura',   avatar_url: AVATAR_URLS[4], bio: 'Food & beverage specialist. Tasty visuals that make people hungry.',            specialties: ['Food & Beverage', 'Lifestyle'], available_for_work: false, featured: true,  followers: 3400, projects_count: 44, joined_at: '2025-08-12' },
  { id: 'c6', username: 'joshlocal',   display_name: 'Josh Rivera',     avatar_url: AVATAR_URLS[5], bio: 'Local biz & ecommerce UGC. Authentic storytelling for real brands.',            specialties: ['Local Business', 'Ecommerce'],  available_for_work: true,  featured: false, followers: 320,  projects_count: 7,  joined_at: '2026-02-20' },
];

export const DEMO_PROJECTS: CreatorProject[] = [
  { id: 'p1', creator_id: 'c1', creator_username: 'sophiaai',    creator_name: 'Sophia Chen',   creator_avatar: AVATAR_URLS[0], title: 'Serum Launch Campaign',       description: 'Cinematic skincare reveal with before/after transformation.',  thumbnail_url: VIDEO_THUMBS[0], media_url: DEMO_VIDEOS[0], media_type: 'video', tags: ['Beauty', 'Skincare', 'UGC'],         likes: 248, views: 3100, published: true, created_at: '2026-04-10' },
  { id: 'p2', creator_id: 'c2', creator_username: 'marcfitness', creator_name: 'Marc Laurent',  creator_avatar: AVATAR_URLS[1], title: 'Pre-Workout Energy Ad',       description: 'High-energy gym video showcasing supplement performance.',      thumbnail_url: VIDEO_THUMBS[1], media_url: DEMO_VIDEOS[1], media_type: 'video', tags: ['Fitness', 'Supplements', 'Energy'],  likes: 187, views: 2400, published: true, created_at: '2026-04-08' },
  { id: 'p3', creator_id: 'c3', creator_username: 'ayatech',     creator_name: 'Aya Osei',      creator_avatar: AVATAR_URLS[2], title: 'Smart Home Product Demo',     description: 'Clean, punchy product walkthrough for tech audience.',         thumbnail_url: VIDEO_THUMBS[2], media_url: DEMO_VIDEOS[2], media_type: 'video', tags: ['Tech', 'Gadgets', 'Demo'],           likes: 312, views: 4200, published: true, created_at: '2026-04-05' },
  { id: 'p4', creator_id: 'c4', creator_username: 'lukestyle',   creator_name: 'Luke Morales',  creator_avatar: AVATAR_URLS[3], title: 'Summer Fashion Collection',   description: 'Authentic try-on style reel for DTC fashion brand.',           thumbnail_url: VIDEO_THUMBS[0], media_url: DEMO_VIDEOS[0], media_type: 'video', tags: ['Fashion', 'Try-on', 'Summer'],       likes: 94,  views: 1100, published: true, created_at: '2026-04-02' },
  { id: 'p5', creator_id: 'c5', creator_username: 'emmafood',    creator_name: 'Emma Nakamura', creator_avatar: AVATAR_URLS[4], title: 'Artisan Coffee Brand Story',  description: 'Warm, sensory-first video making viewers crave the product.',  thumbnail_url: VIDEO_THUMBS[1], media_url: DEMO_VIDEOS[1], media_type: 'video', tags: ['Food', 'Coffee', 'Lifestyle'],       likes: 521, views: 7800, published: true, created_at: '2026-03-30' },
  { id: 'p6', creator_id: 'c6', creator_username: 'joshlocal',   creator_name: 'Josh Rivera',   creator_avatar: AVATAR_URLS[5], title: 'Local Gym Member Story',      description: 'Testimonial-style video for local fitness studio.',            thumbnail_url: VIDEO_THUMBS[2], media_url: DEMO_VIDEOS[2], media_type: 'video', tags: ['Fitness', 'Local', 'Testimonial'],   likes: 67,  views: 890,  published: true, created_at: '2026-03-28' },
];

export const DEMO_POSTS: CommunityPost[] = [
  { id: 'post1', author_name: 'sophiaai',    author_avatar: AVATAR_URLS[0], category: 'Feature Request', title: 'Add music/audio sync for video generations',           body: 'Would love to be able to sync generated clips to a background track automatically.',                    upvotes: 142, comment_count: 18, status: 'Planned',      created_at: '2026-04-15' },
  { id: 'post2', author_name: 'marcfitness', author_avatar: AVATAR_URLS[1], category: 'Feature Request', title: 'Batch generate 10 videos at once',                     body: 'When running A/B tests for brands I need to produce multiple variations quickly.',                      upvotes: 98,  comment_count: 11, status: 'Building',     created_at: '2026-04-12' },
  { id: 'post3', author_name: 'ayatech',     author_avatar: AVATAR_URLS[2], category: 'Idea',            title: 'Creator collab projects — invite another creator',     body: 'Would be great to invite a fellow creator to co-produce a brand package.',                             upvotes: 76,  comment_count: 9,  status: 'Under Review', created_at: '2026-04-10' },
  { id: 'post4', author_name: 'emmafood',    author_avatar: AVATAR_URLS[4], category: 'Feature Request', title: 'Save prompt templates and reuse them',                 body: 'I keep writing similar prompts. A saved template system would save so much time.',                      upvotes: 211, comment_count: 24, status: 'Launched',     created_at: '2026-04-08' },
  { id: 'post5', author_name: 'lukestyle',   author_avatar: AVATAR_URLS[3], category: 'Bug Report',      title: 'Video aspect ratio not saving between sessions',       body: 'Every time I reload the dashboard my aspect ratio preference resets to 9:16.',                         upvotes: 34,  comment_count: 5,  status: 'Under Review', created_at: '2026-04-06' },
  { id: 'post6', author_name: 'joshlocal',   author_avatar: AVATAR_URLS[5], category: 'Idea',            title: 'Discovery feed algorithm — show trending content first', body: 'Right now discovery shows newest first. Trending/most liked should have priority for brand discovery.', upvotes: 55,  comment_count: 7,  status: null,           created_at: '2026-04-03' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const STATUS_COLORS: Record<NonNullable<CommunityPost['status']>, { bg: string; text: string }> = {
  'Under Review': { bg: 'rgba(255,200,0,0.12)',  text: '#fbbf24' },
  'Planned':      { bg: 'rgba(163,230,53,0.12)', text: '#a3e635' },
  'Building':     { bg: 'rgba(56,139,253,0.12)', text: '#60a5fa' },
  'Launched':     { bg: 'rgba(34,197,94,0.12)',  text: '#4ade80' },
};

export const SPECIALTY_COLORS: Record<CreatorSpecialty, string> = {
  'Beauty':         'rgba(236,72,153,0.15)',
  'Fitness':        'rgba(234,88,12,0.15)',
  'Ecommerce':      'rgba(99,102,241,0.15)',
  'Food & Beverage':'rgba(217,119,6,0.15)',
  'Tech':           'rgba(56,139,253,0.15)',
  'Fashion':        'rgba(236,72,153,0.15)',
  'Lifestyle':      'rgba(163,230,53,0.12)',
  'Gaming':         'rgba(139,92,246,0.15)',
  'Pets':           'rgba(251,146,60,0.15)',
  'Local Business': 'rgba(20,184,166,0.15)',
};

export const SPECIALTY_TEXT: Record<CreatorSpecialty, string> = {
  'Beauty':         '#f472b6',
  'Fitness':        '#fb923c',
  'Ecommerce':      '#818cf8',
  'Food & Beverage':'#fbbf24',
  'Tech':           '#60a5fa',
  'Fashion':        '#f472b6',
  'Lifestyle':      '#a3e635',
  'Gaming':         '#a78bfa',
  'Pets':           '#fb923c',
  'Local Business': '#2dd4bf',
};
