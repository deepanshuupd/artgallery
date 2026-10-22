// Build-time compression of publicly rendered catalogue photos. No credentials,
// storage writes, runtime image service, or paid APIs. Existing immutable sources
// remain valid; new admin uploads fall back to their original until regenerated.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import sharp from 'sharp';

const origin = 'https://www.kumaonrang.com';
const storage = 'https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/';
const manifestPath = 'src/data/responsive-images.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const originalByVariant = new Map();
for (const [source, variants] of Object.entries(manifest)) {
  if (!source.startsWith(storage + 'optimized/v2/') || !source.endsWith('-card.webp')) continue;
  for (const variant of variants) originalByVariant.set(variant.src, source);
}
const sources = new Set();
for (const path of ['/pahadi-keychains', '/aipan-frames', '/uttarakhand-souvenirs', '/kumaoni-gifts', '/curated-hampers', '/uttarakhand-gifts']) {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(30000), redirect: 'error' });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    const src = tag[0].match(/\bsrc="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
    const source = originalByVariant.get(src) || src;
    if (source?.startsWith(storage + 'optimized/v2/') && source.endsWith('-card.webp')) sources.add(source);
  }
}
assert.ok(sources.size, 'No public source photos found; inspect the rendered markup before retrying.');
await mkdir('public/images/responsive', { recursive: true });
let added = 0;
let sourceBytes = 0;
let mobileWebpBytes = 0;
let mobileAvifBytes = 0;
for (const src of sources) {
  if (manifest[src]?.length) continue;
  const response = await fetch(src, { signal: AbortSignal.timeout(30000), redirect: 'error' });
  assert.equal(response.status, 200, 'Source photo unavailable');
  assert.ok(!/(?:^|[,\s])(?:none|noindex|noimageindex)(?:$|[,\s])/i.test(response.headers.get('x-robots-tag') || ''), 'Source photo blocks indexing');
  const input = Buffer.from(await response.arrayBuffer());
  assert.ok(input.length < 10 * 1024 * 1024, 'Unexpectedly large source photo');
  const metadata = await sharp(input).metadata();
  assert.ok(metadata.width > 0 && metadata.height > 0);
  const name = new URL(src).pathname.split('/').pop().split('-indexable-')[0].replace(/[^a-z0-9-]/gi, '').slice(0, 70);
  const variants = [];
  for (const width of [...new Set([256, 384, 640].map(size => Math.min(size, metadata.width)))]) {
    const webp = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer();
    const avif = await sharp(input).resize({ width, withoutEnlargement: true }).avif({ quality: 50, effort: 4 }).toBuffer();
    const actual = await sharp(webp).metadata();
    const webpHash = createHash('sha256').update(webp).digest('hex').slice(0, 12);
    const avifHash = createHash('sha256').update(avif).digest('hex').slice(0, 12);
    const webpPath = `/images/responsive/${name}-${webpHash}-${width}.webp`;
    const avifPath = `/images/responsive/${name}-${avifHash}-${width}.avif`;
    await writeFile(`public${webpPath}`, webp);
    await writeFile(`public${avifPath}`, avif);
    variants.push({ src: webpPath, width: actual.width, height: actual.height, bytes: webp.length, avifSrc: avifPath, avifBytes: avif.length });
  }
  manifest[src] = variants;
  added++;
  sourceBytes += input.length;
  mobileWebpBytes += variants[0].bytes;
  mobileAvifBytes += variants[0].avifBytes;
}
await writeFile(manifestPath + '.tmp', JSON.stringify(manifest, null, 2) + '\n');
await rename(manifestPath + '.tmp', manifestPath);
console.log(JSON.stringify({ publicCardPhotos: sources.size, newlyOptimized: added, sourceBytes, mobileWebpBytes, mobileAvifBytes }, null, 2));
