import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from overwriting a running development server's assets.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  outputFileTracingRoot: path.join(__dirname),
  // Keep descriptions and social metadata in <head>, including for audits.
  htmlLimitedBots: /.*/,
  async redirects() {
    // The project's public vercel.app address served a full copy of the shop that search
    // engines were indexing; send it, path and all, to the real domain. Preview and team
    // addresses are left alone so deployments can still be checked before release.
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "artgallery-cyan.vercel.app" }],
      destination: "https://www.kumaonrang.com/:path*",
      permanent: true,
    }];
  },
  async headers() {
    // Versioned, pre-compressed decoration is served directly by the CDN.
    const immutable = [
      "/video/pine-wind-mobile-v1.mp4", "/video/pine-wind-desktop-v1.mp4",
      "/video/pine-poster-mobile-v1.webp", "/video/pine-poster-desktop-v1.webp",
      "/images/responsive/:path*",
    ].map(source => ({ source, headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }));
    // Baseline hardening for every response; no CSP yet, as it needs a full audit of third-party scripts.
    const security = { source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] };
    return [...immutable, security];
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
