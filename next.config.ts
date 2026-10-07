import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from overwriting a running development server's assets.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  outputFileTracingRoot: path.join(__dirname),
  // Keep descriptions and social metadata in <head>, including for audits.
  htmlLimitedBots: /.*/,
  async headers() {
    // Versioned, pre-compressed decoration is served directly by the CDN.
    return [
      "/video/pine-wind-mobile-v1.mp4", "/video/pine-wind-desktop-v1.mp4",
      "/video/pine-poster-mobile-v1.webp", "/video/pine-poster-desktop-v1.webp",
      "/images/responsive/:path*",
    ].map(source => ({ source, headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }));
  },
  images: {
    // Serve source images directly to avoid Vercel Image Optimization usage.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 180, 240, 320],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
