// Announce every page in the live sitemap to IndexNow (Bing and partners).
// Run after a deploy that adds or changes many pages:
// node scripts/indexnow-submit.mjs
const site = "https://www.kumaonrang.com";
const key = "371d026b93b55bf75def10799134cd9f";

const keyFile = await fetch(`${site}/${key}.txt`);
if (!keyFile.ok || (await keyFile.text()).trim() !== key) throw new Error("The IndexNow key file is not live yet; deploy first.");
const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (!urlList.length) throw new Error("No URLs found in the sitemap.");
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
});
// 200 and 202 both mean accepted; 202 means the key is still being verified.
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (!response.ok) process.exit(1);
