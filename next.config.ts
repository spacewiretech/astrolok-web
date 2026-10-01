import type { NextConfig } from "next";

/*
  Static media that is not content-hashed (frame sequences, hero video, images).
  A week in cache with background revalidation keeps repeat visits fast without
  pinning an outdated file for a year if a sequence is re-encoded under the same name.
*/
const MEDIA_CACHE = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  // Don't auto-generate AGENTS.md / CLAUDE.md on `next dev`.
  agentRules: false,

  images: {
    // AVIF first for the hero screens; WebP fallback.
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return ["/frames-optimized/:path*", "/frames/:path*", "/videos/:path*", "/images/:path*", "/og.jpg"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: MEDIA_CACHE }],
    }));
  },

  async redirects() {
    // One canonical host: www.astrolok.app → astrolok.app (http → https is handled by the host/CDN).
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.astrolok.app" }],
        destination: "https://astrolok.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
