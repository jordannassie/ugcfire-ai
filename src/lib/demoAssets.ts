// ─── Shared media constants ────────────────────────────────────────────────────

export const LOGO_URL =
  'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png';

export const UGC_VIDEOS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-style-ve_2891981897.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-energetic-ugc-fitne_2891987468.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugcstyle-tes_2892041483.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_make-ugc-video-with-this-_2892034073.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-cinematic-ugc-testi_2892073891.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-ugcstyle-vertical-s_2892334025.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-selfiest_2892474678.mp4',
];

export const PRODUCT_IMAGES = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/be7f70f4-139f-4cb1-bcaa-964d79dc6a9e.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/a9a7a9fd-e332-4750-bdd9-859ab5f45948.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5e1cf241-a837-4b51-a46c-f0fb5d643f1f.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/d0702dbc-8d8e-4f40-b4e7-7aa4d7b98cbc.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/video/Site%20reels/images/097881dc-4c18-4c17-8bf4-b106b302d197.png',
];

export const UGC_IMAGES = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/02952be0-8ac1-4d5d-98b6-daa52cb4fd08.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/010aa1e6-c801-4299-85c5-62b7c7462e31.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/6038b54b-e507-44e5-a160-691b1788f55a.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/9491597e-5c30-40cc-92cb-e606b4d0a037.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/df522445-4f8c-4c49-9dba-76b8131f0ada.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC%20images/6dacd0a5-e10c-4eaa-b6c2-ab1fae07726e.png',
];

// All selectable assets combined
export const ALL_DEMO_ASSETS = [...PRODUCT_IMAGES, ...UGC_IMAGES];

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface VideoGeneration {
  id: string;
  createdAt: string;
  videoSrc: string;
  model: string;
  duration: string;
  aspectRatio: string;
  resolution: string;
  prompt: string;
  referenceImages: string[];
}

export interface ImageGeneration {
  id: string;
  createdAt: string;
  imageSrc: string;
  model: string;
  aspectRatio: string;
  numImages: number;
  prompt: string;
  selectedAssets: string[];
}

// ─── localStorage keys ────────────────────────────────────────────────────────

export const LS_VIDEO_GENS  = 'ugcfire_video_generations';
export const LS_IMAGE_GENS  = 'ugcfire_image_generations';
export const LS_BRAND_ASSETS = 'ugcfire_brand_assets';

// ─── Demo seed data ────────────────────────────────────────────────────────────

export const DEMO_VIDEO_GENS: VideoGeneration[] = [
  {
    id: 'demo-v1',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    videoSrc: UGC_VIDEOS[0],
    model: 'UGC Fire 2.0',
    duration: '6s',
    aspectRatio: '9:16 (Vertical)',
    resolution: '1080p',
    prompt: 'Lifestyle product video of a fitness supplement bottle. Confident creator outdoors, natural lighting, authentic UGC style.',
    referenceImages: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[1], PRODUCT_IMAGES[2]],
  },
  {
    id: 'demo-v2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    videoSrc: UGC_VIDEOS[1],
    model: 'UGC Fire 2.0',
    duration: '6s',
    aspectRatio: '9:16 (Vertical)',
    resolution: '1080p',
    prompt: 'Energetic fitness creator promoting supplements. Dynamic movement, bright gym environment, UGC style.',
    referenceImages: [PRODUCT_IMAGES[1]],
  },
  {
    id: 'demo-v3',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    videoSrc: UGC_VIDEOS[2],
    model: 'UGC Fire 2.0',
    duration: '6s',
    aspectRatio: '9:16 (Vertical)',
    resolution: '1080p',
    prompt: 'Testimonial-style UGC video. Creator holding product in a natural outdoor setting, authentic feel.',
    referenceImages: [PRODUCT_IMAGES[2]],
  },
];

export const DEMO_IMAGE_GENS: ImageGeneration[] = [
  { id: 'demo-i1', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), imageSrc: UGC_IMAGES[0], model: 'Nano Banana 2', aspectRatio: '3:4', numImages: 4, prompt: 'Hyperrealistic UGC style image of a woman wearing the product outdoors in a sunny city. Casual lifestyle shot, natural lighting, authentic look.', selectedAssets: [PRODUCT_IMAGES[0]] },
  { id: 'demo-i2', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), imageSrc: UGC_IMAGES[1], model: 'Nano Banana 2', aspectRatio: '3:4', numImages: 4, prompt: 'Product lifestyle shot with creator holding item at beach, golden hour lighting.', selectedAssets: [PRODUCT_IMAGES[1]] },
  { id: 'demo-i3', createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(), imageSrc: PRODUCT_IMAGES[3], model: 'Nano Banana 2', aspectRatio: '1:1', numImages: 4, prompt: 'Clean studio product mockup shot. White background, professional lighting.', selectedAssets: [] },
  { id: 'demo-i4', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), imageSrc: UGC_IMAGES[2], model: 'Nano Banana 2', aspectRatio: '3:4', numImages: 4, prompt: 'UGC creator unboxing product, excited expression, home setting.', selectedAssets: [PRODUCT_IMAGES[2]] },
  { id: 'demo-i5', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), imageSrc: UGC_IMAGES[3], model: 'Nano Banana 2', aspectRatio: '3:4', numImages: 4, prompt: 'Street style photo with brand hat and t-shirt, urban background.', selectedAssets: [] },
  { id: 'demo-i6', createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), imageSrc: UGC_IMAGES[4], model: 'Nano Banana 2', aspectRatio: '3:4', numImages: 4, prompt: 'Lifestyle influencer with product in coffee shop setting, authentic candid look.', selectedAssets: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[1]] },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function formatGenDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return iso;
  }
}

export function loadFromLS<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToLS<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── Demo credits ──────────────────────────────────────────────────────────
export const LS_CREDITS      = 'ugcfire_demo_credits';
export const INITIAL_CREDITS = 125;

export function getCredits(): number {
  if (typeof window === 'undefined') return INITIAL_CREDITS;
  const stored = localStorage.getItem(LS_CREDITS);
  return stored !== null ? parseInt(stored, 10) : INITIAL_CREDITS;
}

export function subtractCredits(amount: number): number {
  if (typeof window === 'undefined') return INITIAL_CREDITS;
  const next = Math.max(0, getCredits() - amount);
  localStorage.setItem(LS_CREDITS, String(next));
  window.dispatchEvent(new Event('ugcfire:credits-updated'));
  return next;
}
