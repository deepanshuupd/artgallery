/**
 * Canonical public site URL, used for metadata, robots, and sitemap.
 * Keep this independent of the request host and Vercel deployment URLs.
 * The apex domain redirects to www, so all indexable URLs must use www.
 * Preview deployments and local development should also describe the public
 * canonical site rather than advertise temporary hosts to search engines.
 */
export function getSiteUrl(): string {
  return "https://www.kumaonrang.com";
}
