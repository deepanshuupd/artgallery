import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

// Audit server HTML, including all product URLs discovered from the sitemap.
// The canonical host can differ from the local preview host intentionally.
const preview = new URL(process.argv[2] || 'http://localhost:3001');
const canonicalOrigin = process.argv[3] || 'https://www.kumaonrang.com';
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attribute = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] || '');
async function fetchHtml(path) {
  const response = await fetch(new URL(path, preview));
  assert.equal(response.status, 200, `${path}: status`);
  return response.text();
}
const sitemap = await fetchHtml('/sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(decode(match[1])));
assert.ok(urls.length, 'Sitemap must contain public pages');
assert.equal(new Set(urls.map(url => url.href)).size, urls.length, 'Duplicate sitemap URLs');
const categories = ['/pahadi-keychains', '/aipan-frames', '/uttarakhand-souvenirs', '/kumaoni-gifts'];
for (const path of categories) assert.ok(urls.some(url => url.pathname === path), `Missing category: ${path}`);
const results = [];
const queue = [...urls];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    const path = url.pathname;
    assert.equal(url.origin, canonicalOrigin, `${path}: sitemap host`);
    const html = await fetchHtml(path);
    const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
    const title = decode(head.match(/<title>(.*?)<\/title>/)?.[1] || '');
    const meta = [...head.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]);
    const description = attribute(meta.find(tag => attribute(tag, 'name') === 'description') || '', 'content');
    const canonical = attribute([...head.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).find(tag => attribute(tag, 'rel') === 'canonical') || '', 'href');
    const ogUrl = attribute(meta.find(tag => attribute(tag, 'property') === 'og:url') || '', 'content');
    assert.ok(title.length > 0 && title.length <= 60, `${path}: title length ${title.length}`);
    assert.ok(description.length > 0 && description.length <= 160, `${path}: description length ${description.length}`);
    assert.equal(new URL(canonical).pathname, path, `${path}: canonical path`);
    assert.equal(new URL(canonical).origin, canonicalOrigin, `${path}: canonical host`);
    assert.equal(new URL(ogUrl).href, new URL(canonical).href, `${path}: Open Graph URL`);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: exactly one H1`);
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
    const productPath = path.split('/').filter(Boolean).length === 2;
    if (productPath) {
      const product = schemas.find(schema => schema['@type'] === 'Product');
      assert.ok(product, `${path}: Product schema`);
      assert.equal(new URL(product.url).pathname, path, `${path}: Product URL`);
      assert.ok(product.offers && product.offers.priceCurrency === 'INR', `${path}: INR offer`);
    }
    if (productPath || categories.includes(path) || path === '/collection') {
      assert.ok(schemas.some(schema => schema['@type'] === 'BreadcrumbList'), `${path}: breadcrumbs`);
    }
    results.push({ path, title, description, titleCharacters: title.length, descriptionCharacters: description.length, product: productPath });
  }
}));
assert.equal(new Set(results.map(item => item.title)).size, results.length, 'Page titles must be unique');
assert.equal(new Set(results.map(item => item.description)).size, results.length, 'Page descriptions must be unique');
const missing = await fetch(new URL('/not-a-real-collection', preview));
assert.equal(missing.status, 404, 'Unknown collection must return 404');
const login = await fetchHtml('/admin/login');
assert.match(login, /<meta name="robots" content="[^"]*noindex/, 'Admin login must not be indexed');
const report = { pagesChecked: results.length, categoriesChecked: categories.length, productPagesChecked: results.filter(item => item.product).length, uniqueTitles: new Set(results.map(item => item.title)).size, uniqueDescriptions: new Set(results.map(item => item.description)).size, results: results.sort((a, b) => a.path.localeCompare(b.path)) };
if (process.argv[4]) await writeFile(process.argv[4], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
