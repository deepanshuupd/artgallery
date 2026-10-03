import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Pure, read-only regression tests. No browser, network, credentials or database writes.
// Transpiling in memory also works on Node versions without native TypeScript support.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const moduleCache = new Map();

function loadLocalModule(file) {
  const path = resolve(root, file);
  if (moduleCache.has(path)) return moduleCache.get(path).exports;
  const source = readFileSync(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const module = { exports: {} };
  moduleCache.set(path, module);
  const requireLocal = name => {
    if (name.startsWith('@/')) return loadLocalModule(`src/${name.slice(2)}.ts`);
    if (name.startsWith('.')) {
      const target = resolve(dirname(path), name);
      return loadLocalModule(target.endsWith('.ts') ? target : `${target}.ts`);
    }
    throw new Error(`Pure image helpers must not depend on external service ${name}`);
  };
  // Use the same JS realm as the test inputs to make prototype checks meaningful.
  new Function('require', 'module', 'exports', outputText)(requireLocal, module, module.exports);
  return module.exports;
}

const {
  productCardImage,
  getProductImageUrls,
  normalizeImageMetadata,
  getProductImage,
  createProductImageStem,
  PRODUCT_IMAGE_UPLOAD_OPTIONS,
} = loadLocalModule('src/lib/product-image.ts');
const { getProductImageObjects } = loadLocalModule('src/lib/product-image-schema.ts');

for (const [name, helper] of Object.entries({
  productCardImage,
  getProductImageUrls,
  normalizeImageMetadata,
  getProductImage,
  createProductImageStem,
})) {
  assert.equal(typeof helper, 'function', `${name} must be exported`);
}

const storage = 'https://example.supabase.co/storage/v1/object/public/product-images';
const detail = `${storage}/optimized/v2/golu-devta-aipan-frame-abc123.webp`;
const second = `${storage}/optimized/v2/golu-devta-aipan-frame-def456.webp`;
const legacy = `${storage}/optimized/v1/1789135609898-johgnw4puje.webp`;
const original = `${storage}/1789135609898-johgnw4puje.jpeg`;
const relative = '/brand/kumaonrang-logo.png';

function product(overrides = {}) {
  return {
    id: 'product-1',
    name: 'Golu devta Aipan frame',
    category: 'Frames',
    description: '',
    story: '',
    price: 1400,
    image: detail,
    images: [detail, second],
    featured: false,
    details: [],
    whatsappMessage: '',
    ...overrides,
  };
}

const checks = [];
const check = (name, run) => checks.push({ name, run });

check('primary-first URL normalization, deduplication and legacy fallback', () => {
  assert.deepEqual(getProductImageUrls(product({ image: ` ${detail} `, images: [second, detail, ` ${second} `] })), [detail, second]);
  assert.deepEqual(getProductImageUrls(product({ image: original, images: [] })), [original]);
  assert.deepEqual(getProductImageUrls(product({ image: original, images: undefined })), [original]);
  assert.deepEqual(getProductImageUrls(product({ image: '', images: [null, ' ', second] })), [second]);
  assert.deepEqual(getProductImageUrls(product({ image: '', images: [] })), []);
  assert.deepEqual(getProductImageUrls(product({ image: '', images: 'not-an-array' })), []);
});

check('unsafe or malformed URL schemes are excluded without discarding valid images', () => {
  const unsafe = [
    'javascript:alert(1)', 'data:image/png;base64,abcd', 'blob:https://example.com/id',
    'file:///tmp/photo.jpg', '//other.example/image.webp', 'https://',
    'https://user:password@example.com/image.webp', '/\\other.example/image.webp',
    12, {}, null,
  ];
  const validHttp = 'http://example.com/product-photo.jpg';
  assert.deepEqual(getProductImageUrls(product({ image: 'javascript:alert(1)', images: [...unsafe, detail, validHttp, relative] })), [detail, validHttp, relative]);
});

check('card images use only guaranteed v2 pairs; older published URLs remain untouched', () => {
  assert.equal(productCardImage(detail), detail.replace(/\.webp$/, '-card.webp'));
  assert.equal(productCardImage(legacy), legacy);
  assert.equal(productCardImage(original), original);
  assert.equal(productCardImage(relative), relative);
  const v1WithoutSubfolder = `${storage}/optimized/1789135609898-johgnw4puje.webp`;
  assert.equal(productCardImage(v1WithoutSubfolder), v1WithoutSubfolder);
});

check('alt text defaults describe the actual product, without invented angles or keyword stuffing', () => {
  const item = product({ name: '  Golu devta Aipan frame \n ' });
  const primary = getProductImage(item);
  const gallery = getProductImage(item, second);
  assert.equal(primary.src, detail);
  assert.equal(primary.cardSrc, productCardImage(detail));
  assert.equal(primary.alt, 'Golu devta Aipan frame');
  assert.equal(gallery.alt, 'Golu devta Aipan frame');
  assert.equal(primary.caption, undefined);
  assert.equal(gallery.caption, undefined);
  assert.equal(getProductImage(item, 'https://unrelated.example/unlisted.webp').src, detail);
  assert.equal(getProductImage(item, 'javascript:alert(1)').src, detail);
  assert.equal(getProductImage(product({ image: '', images: [], name: ' \n ' })).alt, 'Product photograph');
  assert.equal(getProductImage(product({ image: '', images: [] })).src, '');
});

check('URL-keyed metadata survives gallery reordering and drops removed images', () => {
  const raw = {
    [detail]: { alt: 'Golu devta Aipan frame with white decorative lines', caption: 'The Aipan frame shown in the product photograph.' },
    [second]: { alt: 'A second photograph of the Golu devta Aipan frame' },
    [original]: { alt: 'Removed image metadata must not remain attached' },
  };
  const reordered = normalizeImageMetadata(raw, [second, detail]);
  assert.equal(reordered[detail].alt, raw[detail].alt);
  assert.equal(reordered[second].alt, raw[second].alt);
  assert.ok(!Object.hasOwn(reordered, original));
  const normalizedProduct = product({ images: [second, detail], imageMetadata: reordered });
  assert.equal(getProductImage(normalizedProduct, second).alt, raw[second].alt);
  assert.equal(getProductImage(normalizedProduct, detail).caption, raw[detail].caption);
  assert.deepEqual(normalizeImageMetadata(raw, []), {});
});

check('metadata must be an own-property, URL-keyed object, not arrays or prototype data', () => {
  for (const raw of [null, undefined, true, 12, 'plain string', [], [{ alt: 'array entry' }], new Date()]) {
    assert.deepEqual(normalizeImageMetadata(raw, [detail]), {});
  }
  const nullMap = Object.create(null);
  nullMap[detail] = { alt: 'Saved product photograph description' };
  assert.equal(normalizeImageMetadata(nullMap, [detail])[detail].alt, nullMap[detail].alt);
  assert.deepEqual(normalizeImageMetadata(Object.create({ [detail]: { alt: 'Inherited description' } }), [detail]), {});
  for (const value of ['not-an-object', [], 42, null, new Date()]) {
    const normalized = normalizeImageMetadata({ [detail]: value }, [detail]);
    assert.ok(!normalized[detail]?.alt);
  }
  const polluted = JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}');
  assert.deepEqual(normalizeImageMetadata(polluted, [detail]), {});
  assert.equal({}.polluted, undefined);
});

check('stored descriptions are clean, bounded plain text; unrelated fields are not trusted', () => {
  const normalized = normalizeImageMetadata({
    [detail]: {
      alt: '  <b>Golu devta</b> \n Aipan frame  ',
      caption: ' <p>White decorative lines</p> \t around the frame. ',
      onerror: 'alert(1)',
      license: 'https://invented.example/license',
      creator: 'Invented photographer',
    },
    [second]: { alt: 'x'.repeat(2000), caption: 'y'.repeat(2000) },
  }, [detail, second]);
  assert.equal(normalized[detail].alt, 'Golu devta Aipan frame');
  assert.equal(normalized[detail].caption, 'White decorative lines around the frame.');
  assert.ok(normalized[second].alt.length <= 300);
  assert.ok(normalized[second].caption.length <= 500);
  for (const field of ['onerror', 'license', 'creator']) assert.ok(!Object.hasOwn(normalized[detail], field));
  const blank = normalizeImageMetadata({ [detail]: { alt: ' \n ', caption: '<p> </p>' } }, [detail]);
  assert.ok(!blank[detail]?.alt);
  assert.ok(!blank[detail]?.caption);
});

check('only sensible positive integer dimensions are retained and exposed', () => {
  const stored = normalizeImageMetadata({
    [detail]: { alt: 'Golu devta Aipan frame', width: 1200, height: 1600, cardWidth: 480, cardHeight: 640 },
  }, [detail]);
  const image = getProductImage(product({ imageMetadata: stored }));
  assert.equal(image.width, 1200);
  assert.equal(image.height, 1600);
  assert.equal(image.cardWidth, 480);
  assert.equal(image.cardHeight, 640);
  const bounds = normalizeImageMetadata({ [detail]: { width: 1, height: 20000 } }, [detail]);
  assert.equal(bounds[detail].width, 1);
  assert.equal(bounds[detail].height, 20000);
  for (const invalid of [0, -1, 0.5, 1200.5, 20001, Infinity, NaN, '1200', null]) {
    const normalized = normalizeImageMetadata({ [detail]: { width: invalid, height: invalid, cardWidth: invalid, cardHeight: invalid } }, [detail]);
    for (const field of ['width', 'height', 'cardWidth', 'cardHeight']) assert.ok(!normalized[detail]?.[field], `${field} rejects ${String(invalid)}`);
  }
});

check('future upload paths use the product name safely and never add invented SEO terms', () => {
  assert.equal(createProductImageStem(' Golu Devta Aipan Frame ', 'abc123'), 'optimized/v2/golu-devta-aipan-frame-abc123');
  assert.match(createProductImageStem(' Golu Devta Aipan Frame ', 'ABC123'), /^optimized\/v2\/golu-devta-aipan-frame-[a-zA-Z0-9-]+$/);
  assert.equal(createProductImageStem('Pichwai Jar Gift Combo', 'safe-123'), 'optimized/v2/pichwai-jar-gift-combo-safe-123');
  assert.equal(createProductImageStem('Café & Keepsake', 'safe'), 'optimized/v2/cafe-keepsake-safe');
  assert.equal(createProductImageStem('', 'safe'), 'optimized/v2/product-safe');
  assert.equal(createProductImageStem('रंग', 'safe'), 'optimized/v2/product-safe');
  const long = createProductImageStem('a'.repeat(240), 'safe');
  assert.ok(long.replace('optimized/v2/', '').replace('-safe', '').length <= 80);
  assert.match(createProductImageStem('../ / Aipan? <script> Frame', 'safe'), /^optimized\/v2\/[a-z0-9-]+-safe$/);
  for (const unsafe of ['', '../escape', 'slash/name', 'space token', '<script>', 'a'.repeat(81)]) {
    assert.throws(() => createProductImageStem('Frame', unsafe), undefined, `Invalid token ${unsafe} must be rejected`);
  }
});

check('new WebP uploads explicitly allow indexing without overwriting cached images', () => {
  assert.deepEqual(PRODUCT_IMAGE_UPLOAD_OPTIONS, {
    contentType: 'image/webp', cacheControl: '31536000', upsert: false,
    headers: { 'x-robots-tag': 'all' },
  });
});

check('ImageObjects expose the complete gallery, with real dimensions and no invented rights', () => {
  const photos = getProductImageObjects(product({
    images: [detail, second],
    imageMetadata: { [detail]: { alt: 'Full Golu Devta Aipan frame', caption: 'A description supplied by the owner.', width: 1200, height: 1600 },
      [second]: { width: 960 } },
  }), 'https://www.kumaonrang.com');
  assert.equal(photos.length, 2);
  assert.equal(photos[0].contentUrl, detail);
  assert.equal(photos[0].url, detail);
  assert.equal(photos[0].name, 'Full Golu Devta Aipan frame');
  assert.equal(photos[0].caption, 'A description supplied by the owner.');
  assert.equal(photos[0].width, 1200);
  assert.equal(photos[0].height, 1600);
  assert.ok(!Object.hasOwn(photos[1], 'width'), 'Incomplete dimension pairs omitted');
  for (const photo of photos) {
    assert.ok(!photo.contentUrl.includes('-card.webp'), 'Full source photo, not thumbnail');
    for (const field of ['creator', 'creditText', 'copyrightNotice', 'license']) assert.ok(!Object.hasOwn(photo, field));
  }
  assert.equal(getProductImageObjects(product({ image: '/photos/aipan-frame.webp', images: [] }), 'https://www.kumaonrang.com')[0].contentUrl,
    'https://www.kumaonrang.com/photos/aipan-frame.webp');
  assert.deepEqual(getProductImageObjects(product({ image: '', images: [] }), 'https://www.kumaonrang.com'), []);
});

check('Inherited metadata fields cannot publish unreviewed descriptions', () => {
  Object.prototype.alt = 'Inherited unsafe description';
  Object.prototype.width = 900;
  try {
    assert.deepEqual(normalizeImageMetadata({ [detail]: { caption: 'Real caption' } }, [detail]), { [detail]: { caption: 'Real caption' } });
  } finally {
    delete Object.prototype.alt;
    delete Object.prototype.width;
  }
});

let failed = 0;
for (const { name, run } of checks) {
  try {
    run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}
if (failed) process.exitCode = 1;
else console.log(`Product image SEO: ${checks.length} pure regression groups passed. No external writes.`);
