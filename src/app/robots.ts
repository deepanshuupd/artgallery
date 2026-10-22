import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    // Explicit search/retrieval groups document our intent. Each repeats the
    // private-route exclusions: a specific group does not inherit '*' rules.
    // Training permissions remain unchanged; search visibility is independent.
    rules: ["*", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "Googlebot", "Googlebot-Image", "bingbot"]
      .map(userAgent => ({
        userAgent,
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      })),
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
