import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Nothing on the site is displayed above ~1200 CSS px (the lightbox), and
    // the sources top out at 2400 — the default ladder goes to 3840.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2400],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
