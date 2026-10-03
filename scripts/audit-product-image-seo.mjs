// Read-only by default. --write-dimensions adds verified encoded dimensions only.
// Never renames, converts, uploads or deletes photographs, and never invents alt/captions.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

nextEnv.loadEnvConfig(process.cwd());
const apply = process.argv.includes('--write-dimensions');
const reportArgument = process.argv.find(arg => arg.startsWith('--report='));
const reportPath = path.resolve(reportArgument?.slice('--report='.length) || 'reports/image-seo/catalogue-audit.json');
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = apply ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
assert.equal(projectUrl, 'https://psqdrmdyucsyiuugvitd.supabase.co', 'Use only the KumaonRang project');
assert.ok(key, apply ? 'Server-side Supabase credential required for dimension backfill' : 'Public Supabase configuration required');
const db = createClient(projectUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
const prefix = `${projectUrl}/storage/v1/object/public/product-images/`;
const { data: rows, error } = await db.from('products')
  .select('id,name,category,image_url,image_urls,image_metadata,created_at')
  .eq('is_available', true).order('created_at', { ascending: false });
assert.ifError(error);
const urlsFor = row => [...new Set([row.image_url, ...(Array.isArray(row.image_urls) ? row.image_urls : [])]
  .filter(url => typeof url === 'string' && url.trim()).map(url => url.trim()))];
const cardFor = url => url.replace(/(\/optimized\/v2\/[^/?]+)\.webp$/, '$1-card.webp');
const detailUrls = [...new Set(rows.flatMap(urlsFor))];
const requestUrls = [...new Set(detailUrls.flatMap(url => [url, cardFor(url)]))];
const images = new Map();
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < requestUrls.length) {
    const url = requestUrls[cursor++];
    try {
      assert.ok(url.startsWith(prefix), 'Outside the scoped public product-images bucket');
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'error' });
      assert.equal(response.status, 200, `HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const metadata = await sharp(bytes).metadata();
      const rotated = [5, 6, 7, 8].includes(metadata.orientation);
      const width = rotated ? metadata.height : metadata.width;
      const height = rotated ? metadata.width : metadata.height;
      assert.ok(width > 0 && height > 0 && width <= 20000 && height <= 20000, 'Invalid dimensions');
      images.set(url, { url, status: 200, contentType: response.headers.get('content-type'),
        cacheControl: response.headers.get('cache-control'), robots: response.headers.get('x-robots-tag'),
        width, height, format: metadata.format, bytes: bytes.length });
    } catch (error) {
      images.set(url, { url, error: error.message });
    }
  }
}));

const report = {
  checkedAt: new Date().toISOString(), projectUrl, mode: apply ? 'write-verified-dimensions' : 'read-only',
  productCount: rows.length,
  productsWithPhotos: rows.filter(row => urlsFor(row).length).length,
  uniqueDetailPhotos: detailUrls.length,
  assetsChecked: images.size,
  successfulAssets: [...images.values()].filter(image => image.status === 200).length,
  failures: [...images.values()].filter(image => image.error),
  // HTTP 200 is not sufficient: restrictive response headers block image indexing.
  indexingBlockers: [...images.values()].filter(image => image.status === 200 &&
    /(?:^|[,\s:])(?:none|noindex|noimageindex)(?:$|[,\s])/i.test(image.robots || '')),
  productsMissingPhotos: rows.filter(row => !urlsFor(row).length).map(row => ({ id: row.id, name: row.name.trim() })),
  products: rows.map(row => {
    const urls = urlsFor(row);
    const originalMetadata = row.image_metadata || {};
    const proposedMetadata = { ...originalMetadata };
    for (const url of urls) {
      const detail = images.get(url);
      const card = images.get(cardFor(url));
      if (detail?.status !== 200) continue;
      proposedMetadata[url] = { ...originalMetadata[url], width: detail.width, height: detail.height,
        ...(card?.status === 200 ? { cardWidth: card.width, cardHeight: card.height } : {}) };
    }
    return { id: row.id, name: row.name.trim(), category: row.category,
      originalImageUrl: row.image_url, originalImageUrls: row.image_urls,
      originalMetadata, proposedMetadata,
      // Product names are truthful fallbacks, not a photo-by-photo visual review.
      editorialReviewNeeded: urls.filter(url => !originalMetadata[url]?.alt),
      images: urls.map(url => ({ detail: images.get(url), card: images.get(cardFor(url)) })) };
  }),
};
await fs.mkdir(path.dirname(reportPath), { recursive: true });
// Save the snapshot BEFORE writes so existing metadata is recoverable.
await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');

if (apply) {
  report.dimensionUpdates = { updated: [], unchanged: [], conflicts: [] };
  const arrayLiteral = values => `{${values.map(value => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')}}`;
  for (const item of report.products) {
    if (JSON.stringify(item.originalMetadata) === JSON.stringify(item.proposedMetadata)) {
      report.dimensionUpdates.unchanged.push(item.id); continue;
    }
    // Compare-and-swap: do not overwrite a photo edit that happened during the audit.
    let query = db.from('products').update({ image_metadata: item.proposedMetadata })
      .eq('id', item.id).eq('image_metadata', JSON.stringify(item.originalMetadata));
    query = item.originalImageUrl === null ? query.is('image_url', null) : query.eq('image_url', item.originalImageUrl);
    query = item.originalImageUrls === null ? query.is('image_urls', null) : query.eq('image_urls', arrayLiteral(item.originalImageUrls));
    const { data, error: updateError } = await query.select('id');
    if (updateError) throw new Error(`Dimension update failed for ${item.id}: ${updateError.message}`);
    report.dimensionUpdates[data.length ? 'updated' : 'conflicts'].push(item.id);
    // Preserve partial completion evidence if interrupted.
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  }
  const { data: verification, error: verificationError } = await db.from('products').select('id,image_metadata')
    .in('id', report.dimensionUpdates.updated);
  assert.ifError(verificationError);
  for (const row of verification || []) {
    const proposal = report.products.find(product => product.id === row.id)?.proposedMetadata;
    assert.deepEqual(row.image_metadata, proposal, `Persisted dimensions for ${row.id}`);
  }
  report.dimensionUpdates.verified = verification?.length || 0;
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
}

console.log(JSON.stringify({ productCount: report.productCount, productsWithPhotos: report.productsWithPhotos,
  uniqueDetailPhotos: report.uniqueDetailPhotos, assetsChecked: report.assetsChecked,
  successfulAssets: report.successfulAssets, failures: report.failures.length,
  indexingBlockers: report.indexingBlockers.length,
  productsMissingPhotos: report.productsMissingPhotos.map(product => product.name),
  dimensionUpdates: report.dimensionUpdates ? { updated: report.dimensionUpdates.updated.length,
    unchanged: report.dimensionUpdates.unchanged.length, conflicts: report.dimensionUpdates.conflicts.length,
    verified: report.dimensionUpdates.verified } : undefined, reportPath }, null, 2));
if (report.failures.length || report.indexingBlockers.length) process.exitCode = 1;
