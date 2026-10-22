// Read-only checks of actual production HTML. Run against a local production
// server first, then the deployed canonical site. Bot UAs test response parity,
// not whether a real AI provider has crawled, indexed or recommended the site.
import assert from 'node:assert/strict';
const origin = new URL(process.argv[2] || 'http://localhost:3024');
const canonical = 'https://www.kumaonrang.com';
const agents = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'Googlebot', 'Googlebot-Image', 'bingbot'];
const decode = value => value.replaceAll('&amp;', '&');
async function get(path, agent) {
  const response = await fetch(new URL(path, origin), {
    headers: agent ? { 'user-agent': agent } : {}, signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200, `${path} ${agent || 'browser'}`);
  assert.ok(!/noindex|noimageindex|\bnone\b/i.test(response.headers.get('x-robots-tag') || ''), path);
  return response.text();
}
const robots = await get('/robots.txt');
for (const agent of agents) {
  const block = robots.split(/\n\s*\n/).find(section => section.includes(`User-Agent: ${agent}\n`));
  assert.ok(block, `Explicit rules for ${agent}`);
  assert.match(block, /Allow: \/\s*\n/);
  assert.match(block, /Disallow: \/admin/);
  assert.match(block, /Disallow: \/api\//);
}
assert.ok(robots.includes(`Sitemap: ${canonical}/sitemap.xml`));
const sitemap = await get('/sitemap.xml');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => ({
  url: decode(match[1].match(/<loc>(.*?)<\/loc>/)[1]),
  images: [...match[1].matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map(image => decode(image[1])),
}));
const results = [];
for (const path of ['/pahadi-keychains', '/uttarakhand-gifts', '/aipan-frames', '/uttarakhand-souvenirs', '/kumaoni-gifts']) {
  const html = await get(path);
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
  assert.ok(head.includes(`rel="canonical" href="${canonical}${path}"`), path);
  assert.match(head, /property="og:image"/);
  assert.match(head, /max-image-preview:large/);
  assert.equal((main.match(/<h1\b/g) || []).length, 1);
  assert.match(main, /<picture/);
  assert.match(main, /type="image\/avif"/);
  assert.match(main, /srcSet="[^"]*\d+w/);
  assert.ok(!main.includes('/_next/image'), 'No runtime image optimizer');
  const image = [...main.matchAll(/<img\b[^>]*>/g)].find(match => match[0].includes('/images/responsive/'))?.[0];
  assert.ok(image, path + ' local compressed photograph');
  const src = decode(image.match(/\bsrc="([^"]+)"/)[1]);
  const asset = await fetch(new URL(src, origin));
  assert.equal(asset.status, 200, src);
  assert.ok((await asset.arrayBuffer()).byteLength > 0, src + ' nonempty image response');
  assert.match(asset.headers.get('content-type'), /image\/webp/);
  assert.ok(!/noindex|noimageindex|\bnone\b/i.test(asset.headers.get('x-robots-tag') || ''), src);
  const schemas = [...main.matchAll(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const collection = schemas.find(schema => schema['@type'] === 'CollectionPage');
  assert.ok(collection.primaryImageOfPage?.url, path + ' representative image');
  assert.ok(collection.mainEntity.numberOfItems > 0, path + ' real products');
  const entry = entries.find(entry => entry.url === canonical + path);
  assert.ok(entry?.images.length, path + ' image sitemap entry');
  if (path === '/pahadi-keychains') {
    assert.match(main, /id="keychain-gift-guide"/);
    assert.match(main, /Current listed prices/);
    assert.match(main, /party return gifts/);
    for (const agent of ['OAI-SearchBot', 'Claude-SearchBot', 'Googlebot']) {
      const botHtml = await get(path, agent);
      assert.match(botHtml, /id="keychain-gift-guide"/);
      assert.ok(botHtml.includes(`rel="canonical" href="${canonical}${path}"`));
    }
  }
  results.push({ path, status: 200, serverImages: (main.match(/<img\b/g) || []).length,
    schemaProducts: collection.mainEntity.numberOfItems, sitemapImages: entry.images.length });
}
console.log(JSON.stringify({ origin: origin.origin, explicitCrawlerGroups: agents.length, pages: results }, null, 2));
