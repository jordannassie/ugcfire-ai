import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // ── Creator legacy routes ──────────────────────────────────────────────
      { source: '/dashboard/create',              destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/image',               destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/video',               destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/uploads',             destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/brand-assets',        destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/strategy-ai',         destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/strategy-ai/:path*',  destination: '/dashboard/studio',       permanent: false },
      { source: '/dashboard/portfolio',           destination: '/dashboard/profile',      permanent: false },
      { source: '/dashboard/your-brand',          destination: '/dashboard/profile',      permanent: false },
      { source: '/dashboard/brand-brief',         destination: '/dashboard/profile',      permanent: false },
      { source: '/dashboard/weekly-uploads',      destination: '/dashboard/projects',     permanent: false },
      { source: '/dashboard/content-bins',        destination: '/dashboard/projects',     permanent: false },
      { source: '/dashboard/agreement',           destination: '/dashboard/projects',     permanent: false },
      { source: '/dashboard/team-chat',           destination: '/dashboard/messages',     permanent: false },
      { source: '/dashboard/support',             destination: '/dashboard/messages',     permanent: false },
      { source: '/dashboard/billing',             destination: '/dashboard/earnings',     permanent: false },
      { source: '/dashboard/plans',               destination: '/dashboard/earnings',     permanent: false },
      { source: '/dashboard/plan',                destination: '/dashboard/earnings',     permanent: false },
      { source: '/dashboard/checkout',            destination: '/dashboard/earnings',     permanent: false },
      // ── Public legacy routes ───────────────────────────────────────────────
      { source: '/discover',                      destination: '/creators',               permanent: false },
    ];
  },
};

export default nextConfig;
