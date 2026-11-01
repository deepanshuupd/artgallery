import { getSiteUrl } from "@/lib/site";

// IndexNow tells Bing (which ChatGPT search draws on), Yandex and others that a
// page changed, instead of waiting for a crawl. The key is public by design:
// it must match public/<key>.txt so engines can verify the site owns it.
export const indexNowKey = "371d026b93b55bf75def10799134cd9f";

/** Submits same-site URLs; only from production, so previews never announce themselves. */
export async function submitToIndexNow(urls: string[]) {
  if (process.env.VERCEL_ENV !== "production") return;
  const site = getSiteUrl();
  const urlList = [...new Set(urls)].filter(url => url.startsWith(`${site}/`) || url === site).slice(0, 10000);
  if (!urlList.length) return;
  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key: indexNowKey, keyLocation: `${site}/${indexNowKey}.txt`, urlList }),
    signal: AbortSignal.timeout(5000),
  });
}
