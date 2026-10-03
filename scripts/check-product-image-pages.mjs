import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';

// Inspect production-rendered HTML/XML; no browser extensions or external writes.
const preview = new URL(process.argv[2] || 'http://localhost:3001');
const canonicalOrigin = process.argv[3] || 'https://www.kumaonrang.com';
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attribute = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] || '');
const schemasFrom = html => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap(match => JSON.parse(match[1]));
async function fetchHtml(path) {
  const response = await fetch(new URL(path, preview), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path}: response`);
  return response.text();
}
const sitemap = await fetchHtml('/sitemap.xml');
// Optional portable XML parser check; structural assertions below run everywhere.
let xmlParser = 'not available';
try {
  execFileSync('xmllint', ['--noout', '-'], { input: sitemap, stdio: ['pipe', 'pipe', 'pipe'] });
  xmlParser = 'xmllint: valid';
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
assert.match(sitemap, /xmlns:image="http:\/\/www.google.com\/schemas\/sitemap-image\/1\.1"/);
assert.doesNotMatch(sitemap, /<image:(?:caption|title|geo_location|license)[\s>]/, 'No deprecated image sitemap tags');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => ({
  page: new URL(decode(match[1].match(/<loc>(.*?)<\/loc>/)?.[1] || '')),
  images: [...match[1].matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map(image => decode(image[1])),
}));
assert.equal(new Set(entries.map(entry => entry.page.href)).size, entries.length);
const products = entries.filter(entry => entry.page.pathname.split('/').filter(Boolean).length === 2);
const queue = [...products], results = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const { page, images } = queue.shift();
    assert.equal(page.origin, canonicalOrigin, `${page.pathname}: canonical host`);
    const html = await fetchHtml(page.pathname);
    const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
    const schemas = schemasFrom(html);
    const product = schemas.find(schema => schema['@type'] === 'Product');
    const webPage = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.ok(product, `${page.pathname}: Product schema`);
    const gallery = product.image || [];
    assert.deepEqual(gallery.map(image => image.contentUrl), images, `${page.pathname}: sitemap matches actual gallery`);
    const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
    for (const image of gallery) {
      assert.equal(image['@type'], 'ImageObject');
      assert.equal(image.url, image.contentUrl);
      const tag = tags.find(tag => attribute(tag, 'src') === image.contentUrl);
      assert.ok(tag, `${page.pathname}: full image has crawlable img src without interaction`);
      assert.equal(attribute(tag, 'alt'), image.description, `${page.pathname}: alt and image schema agree`);
      if (gallery.length > 1) {
        const thumbnailUrl = image.contentUrl.replace(/(\/optimized\/v2\/[^/?]+)\.webp$/, '$1-card.webp');
        const thumbnail = tags.find(tag => attribute(tag, 'src') === thumbnailUrl && attribute(tag, 'aria-hidden') === 'true');
        assert.ok(thumbnail, `${page.pathname}: gallery thumbnail present`);
        assert.equal(attribute(thumbnail, 'alt'), image.description, `${page.pathname}: thumbnail describes its photo`);
        assert.equal(attribute(thumbnail, 'aria-hidden'), 'true', `${page.pathname}: labelled photo button avoids duplicate announcements`);
      }
      assert.ok(image.description.trim(), `${page.pathname}: photo described`);
      assert.ok(image.width > 0 && image.height > 0, `${page.pathname}: verified encoded dimensions`);
      assert.ok(!image.creator && !image.license && !image.copyrightNotice, 'No unconfirmed photography rights');
    }
    if (gallery.length) {
      assert.equal(webPage?.primaryImageOfPage?.contentUrl, gallery[0].contentUrl);
      assert.ok(tags.some(tag => attribute(tag, 'src') === gallery[0].contentUrl && attribute(tag, 'loading') !== 'lazy'),
        `${page.pathname}: initial visible photo is not lazy`);
      const og = [...head.matchAll(/<meta\b[^>]*>/g)].map(match => match[0])
        .find(tag => attribute(tag, 'property') === 'og:image');
      assert.equal(attribute(og || '', 'content'), gallery[0].contentUrl, `${page.pathname}: shares actual product photo`);
    }
    assert.match(head, /max-image-preview:large/, `${page.pathname}: large image preview allowed`);
    results.push({ path: page.pathname, photos: gallery.length, describedPhotos: gallery.length });
  }
}));
const robots = await fetchHtml('/robots.txt');
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \//i);
assert.match(robots, /Disallow: \/admin/i);
assert.doesNotMatch(robots, /(?:OAI-SearchBot|Claude-SearchBot|bingbot|Googlebot)[\s\S]*?Disallow: \/\s*(?:\n|$)/i);
const home = await fetchHtml('/');
const homePrimary = schemasFrom(home).find(schema => schema['@type'] === 'WebPage')?.primaryImageOfPage;
assert.ok(homePrimary?.contentUrl, 'Homepage identifies the actual featured product photograph');
const homeCard = homePrimary.contentUrl.replace(/(\/optimized\/v2\/[^/?]+)\.webp$/, '$1-card.webp');
assert.ok([...home.matchAll(/<img\b[^>]*>/g)].some(match => attribute(match[0], 'src') === homeCard &&
  attribute(match[0], 'alt') === homePrimary.description), 'Homepage hero photo matches its image metadata');
const homeHead = home.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
const homeOg = [...homeHead.matchAll(/<meta\b[^>]*>/g)].map(match => match[0])
  .find(tag => attribute(tag, 'property') === 'og:image');
assert.equal(attribute(homeOg || '', 'content'), homePrimary.contentUrl, 'Homepage share image matches the featured product');
const report = { checkedAt: new Date().toISOString(), preview: preview.origin, xmlParser,
  homepagePrimaryPhotoChecked: true,
  publicPagesInSitemap: entries.length, productPagesChecked: results.length,
  productPagesWithPhotos: results.filter(result => result.photos).length,
  galleryPhotosChecked: results.reduce((count, result) => count + result.photos, 0),
  uniqueImageUrls: new Set(products.flatMap(product => product.images)).size,
  results: results.sort((a, b) => a.path.localeCompare(b.path)) };
if (process.argv[4]) await fs.writeFile(process.argv[4], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
