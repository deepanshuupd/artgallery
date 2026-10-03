// New immutable copies fix Storage's default noindex header. No recompression,
// overwriting or deletion. Review --prepare before --apply; retain the manifest.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isDeepStrictEqual as same } from 'node:util';
import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import ts from 'typescript';

nextEnv.loadEnvConfig(process.cwd());
const [mode, manifestArgument] = process.argv.slice(2);
assert.ok(['--prepare', '--apply', '--rollback'].includes(mode), 'Choose --prepare, --apply <manifest>, or --rollback <manifest>');
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
assert.equal(projectUrl, 'https://psqdrmdyucsyiuugvitd.supabase.co', 'Only the KumaonRang project is in scope');
const key = mode === '--prepare' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY;
assert.ok(key, 'Required Supabase configuration is missing');
const db = createClient(projectUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = db.storage.from('product-images');
const prefix = `${projectUrl}/storage/v1/object/public/product-images/`;
const source = await fs.readFile(new URL('../src/lib/product-image.ts', import.meta.url), 'utf8');
const helperModule = { exports: {} };
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
new Function('require', 'module', 'exports', outputText)(() => { throw new Error('Image helpers must remain pure'); }, helperModule, helperModule.exports);
const { createProductImageStem, getProductImageUrls, productCardImage, PRODUCT_IMAGE_UPLOAD_OPTIONS } = helperModule.exports;
const urlsFor = row => getProductImageUrls({ image: row.image_url, images: row.image_urls });
const fields = row => ({ image_url: row.image_url, image_urls: row.image_urls, image_metadata: row.image_metadata });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const save = (filename, value) => fs.writeFile(filename, JSON.stringify(value, null, 2) + '\n');
const blocked = robots => /(?:^|[,\s:])(?:none|noindex|noimageindex)(?:$|[,\s])/i.test(robots || '');
async function readImage(url) {
  assert.ok(url.startsWith(prefix), 'Outside the scoped product-images bucket');
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Image response: ${url}`);
  assert.match(response.headers.get('content-type') || '', /^image\/webp\b/);
  const bytes = Buffer.from(await response.arrayBuffer());
  return { bytes, robots: response.headers.get('x-robots-tag'), cacheControl: response.headers.get('cache-control') };
}

if (mode === '--prepare') {
  const { data: rows, error } = await db.from('products')
    .select('id,name,image_url,image_urls,image_metadata').eq('is_available', true);
  assert.ifError(error);
  const directory = await fs.mkdtemp('/private/tmp/kumaonrang-indexable-images-');
  const manifestPath = path.join(directory, 'manifest.json');
  const manifest = { version: 1, projectUrl, createdAt: new Date().toISOString(),
    originalsRetained: true, recompressed: false,
    products: rows.map(row => ({ id: row.id, name: row.name, original: fields(row) })), images: [] };
  const urls = [...new Set(rows.flatMap(urlsFor))];
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < urls.length) {
      const originalUrl = urls[cursor++];
      assert.match(originalUrl, /\/optimized\/v2\/[^/?]+\.webp$/, 'This byte-preserving migration requires an existing v2 WebP pair');
      const originalCardUrl = productCardImage(originalUrl);
      const [detail, card] = await Promise.all([readImage(originalUrl), readImage(originalCardUrl)]);
      if (!blocked(detail.robots) && !blocked(card.robots)) {
        manifest.images.push({ originalUrl, status: 'already-indexable' }); continue;
      }
      const owner = rows.find(row => urlsFor(row).includes(originalUrl));
      const digest = createHash('sha256').update(detail.bytes).update(card.bytes).digest('hex');
      const stem = createProductImageStem(owner.name, `indexable-${digest}`);
      const objectPath = `${stem}.webp`, cardObjectPath = `${stem}-card.webp`;
      const localPath = path.join(directory, `${digest}.webp`), cardLocalPath = path.join(directory, `${digest}-card.webp`);
      const metadata = await sharp(detail.bytes).metadata(), cardMetadata = await sharp(card.bytes).metadata();
      assert.equal(metadata.format, 'webp'); assert.equal(cardMetadata.format, 'webp');
      await Promise.all([fs.writeFile(localPath, detail.bytes), fs.writeFile(cardLocalPath, card.bytes)]);
      manifest.images.push({ originalUrl, originalCardUrl, originalRobots: detail.robots, originalCardRobots: card.robots,
        url: `${prefix}${objectPath}`, cardUrl: `${prefix}${cardObjectPath}`, objectPath, cardObjectPath,
        localPath, cardLocalPath, detailHash: hash(detail.bytes), cardHash: hash(card.bytes),
        detailBytes: detail.bytes.length, cardBytes: card.bytes.length,
        width: metadata.width, height: metadata.height, cardWidth: cardMetadata.width, cardHeight: cardMetadata.height,
        status: 'prepared' });
    }
  }));
  const replacements = new Map(manifest.images.filter(image => image.status === 'prepared').map(image => [image.originalUrl, image]));
  for (const product of manifest.products) {
    const replaceUrl = url => replacements.get(url)?.url || url;
    const metadata = { ...(product.original.image_metadata || {}) };
    for (const url of urlsFor(product.original)) {
      const image = replacements.get(url);
      if (!image) continue;
      metadata[image.url] = { ...metadata[url], width: image.width, height: image.height,
        cardWidth: image.cardWidth, cardHeight: image.cardHeight };
      delete metadata[url];
    }
    product.indexable = { image_url: replaceUrl(product.original.image_url),
      image_urls: product.original.image_urls?.map(replaceUrl) ?? product.original.image_urls, image_metadata: metadata };
  }
  manifest.additionalStorageBytes = manifest.images.reduce((total, image) => total + (image.detailBytes || 0) + (image.cardBytes || 0), 0);
  await save(manifestPath, manifest);
  console.log(JSON.stringify({ manifestPath, products: rows.length, uniquePhotos: urls.length,
    pairsToCopy: replacements.size, additionalStorageBytes: manifest.additionalStorageBytes,
    originalsRetained: true, recompressed: false }, null, 2));
} else {
  assert.ok(manifestArgument && path.isAbsolute(manifestArgument), 'An absolute manifest path is required');
  const manifest = JSON.parse(await fs.readFile(manifestArgument, 'utf8'));
  assert.equal(manifest.version, 1); assert.equal(manifest.projectUrl, projectUrl);
  const { data: currentRows, error } = await db.from('products').select('id,name,image_url,image_urls,image_metadata')
    .in('id', manifest.products.map(product => product.id));
  assert.ifError(error);
  // Stop before uploading if an editor changed a photograph or its descriptions.
  for (const product of manifest.products) {
    const current = currentRows.find(row => row.id === product.id);
    assert.ok(current && current.name === product.name, `Product changed after preparation: ${product.id}`);
    assert.ok(same(fields(current), product.original) || same(fields(current), product.indexable),
      `Product photos or metadata changed after preparation: ${product.name}`);
  }
  if (mode === '--apply') {
    assert.ok(manifest.additionalStorageBytes <= 100 * 1024 * 1024, 'Review a migration larger than 100 MiB separately');
    for (const image of manifest.images.filter(image => image.status !== 'already-indexable')) {
      assert.ok(image.url === `${prefix}${image.objectPath}` && image.cardUrl === productCardImage(image.url));
      assert.ok(image.cardObjectPath === image.objectPath.replace(/\.webp$/, '-card.webp'));
      assert.match(image.objectPath, /^optimized\/v2\/[a-z0-9-]+-indexable-[a-f0-9]{64}\.webp$/);
      for (const variant of [
        { path: image.cardObjectPath, file: image.cardLocalPath, hash: image.cardHash },
        { path: image.objectPath, file: image.localPath, hash: image.detailHash },
      ]) {
        assert.equal(path.dirname(variant.file), path.dirname(manifestArgument), 'Prepared files must belong to this manifest');
        const bytes = await fs.readFile(variant.file);
        assert.equal(hash(bytes), variant.hash, 'Prepared file integrity');
        const { error: uploadError } = await bucket.upload(variant.path, bytes, PRODUCT_IMAGE_UPLOAD_OPTIONS);
        if (uploadError && String(uploadError.statusCode) !== '409' && !/already exists|duplicate/i.test(uploadError.message)) throw uploadError;
        // Also verify resumptions: a duplicate object may have an old robots header.
        const check = await readImage(`${prefix}${variant.path}`);
        assert.equal(check.robots?.toLowerCase().trim(), 'all', 'Storage must allow indexing before publishing the URL');
        assert.match(check.cacheControl || '', /max-age=31536000/);
        assert.equal(hash(check.bytes), variant.hash, 'Uploaded photograph must remain byte-for-byte identical');
      }
      image.status = 'uploaded-and-verified';
      await save(manifestArgument, manifest);
    }
  }
  let changed = 0;
  const arrayLiteral = values => `{${values.map(value => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')}}`;
  for (const product of manifest.products) {
    const expected = mode === '--apply' ? product.original : product.indexable;
    const target = mode === '--apply' ? product.indexable : product.original;
    const { data: current, error: readError } = await db.from('products').select('image_url,image_urls,image_metadata').eq('id', product.id).single();
    assert.ifError(readError);
    if (same(fields(current), target)) continue;
    assert.deepEqual(fields(current), expected, `Preserve concurrent edits to ${product.name}`);
    let query = db.from('products').update(target).eq('id', product.id).eq('name', product.name)
      .eq('image_metadata', JSON.stringify(expected.image_metadata));
    query = expected.image_url === null ? query.is('image_url', null) : query.eq('image_url', expected.image_url);
    query = expected.image_urls === null ? query.is('image_urls', null) : query.eq('image_urls', arrayLiteral(expected.image_urls));
    const { data: updated, error: updateError } = await query.select('image_url,image_urls,image_metadata').single();
    assert.ifError(updateError); assert.deepEqual(fields(updated), target, `Verify saved image URLs and descriptions for ${product.name}`);
    product.status = mode === '--apply' ? 'applied-and-verified' : 'rolled-back-and-verified';
    await save(manifestArgument, manifest); changed++;
  }
  console.log(JSON.stringify({ mode, changed, manifestPath: manifestArgument,
    originalsRetained: true, recompressed: false, additionalStorageBytes: manifest.additionalStorageBytes }, null, 2));
}
