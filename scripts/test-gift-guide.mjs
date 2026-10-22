import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Exercise server HTML and metadata without writes or external services.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const modules = new Map();
let catalogue = [];
function load(file) {
  const path = resolve(root, file);
  if (modules.has(path)) return modules.get(path).exports;
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const loaded = { exports: {} };
  modules.set(path, loaded);
  const localRequire = name => {
    if (name === '@/lib/products') return { getProducts: async () => catalogue };
    if (name === '@/components/products/product-showcase') return { ProductShowcase: () => null };
    if (name === 'next/navigation') return { notFound: () => { throw new Error('NOT_FOUND'); } };
    if (name === 'next/link') return function MockLink({ children, prefetch, ...props }) { return React.createElement('a', props, children); };
    if (name === 'next/image') return function MockImage({ fill, priority, ...props }) { return React.createElement('img', props); };
    if (name.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name);
      if (base.endsWith('.json')) return JSON.parse(readFileSync(base, 'utf8'));
      const target = [base + '.ts', base + '.tsx'].find(existsSync);
      assert.ok(target, `Resolvable local import: ${name}`);
      return load(target);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, loaded, loaded.exports);
  return loaded.exports;
}

const { getGiftGuideIdeas, getGiftGuideCover } = load('src/lib/gift-guide.ts');
const { default: GiftGuide, generateMetadata } = load('src/app/uttarakhand-gifts/page.tsx');
const { generateMetadata: categoryMetadata } = load('src/app/[category]/page.tsx');
const { KeychainBuyingGuide } = load('src/components/products/keychain-buying-guide.tsx');
const { CollectionSchema } = load('src/components/seo/collection-schema.tsx');
const product = (category, slug, price, extra = {}) => ({
  id: slug, slug, urlCategory: category, category, name: slug.replaceAll('-', ' '),
  price, image: `/images/${slug}.webp`, images: [], published: true, inStock: true,
  description: 'A real catalogue description.', story: '', details: [], featured: false, whatsappMessage: '',
  ...extra,
});
const frameImage = 'https://example.supabase.co/storage/v1/object/public/product-images/optimized/v2/golu-devta-abc.webp';
const girl = product('Keychains', 'pahadi-girl-keychain', 80);
const frame = product('Frames', 'golu-devta-aipan-frame', 1400, {
  image: frameImage, name: 'Golu Devta Aipan frame', details: ['Minimum order quantity = 2pc'],
  imageMetadata: { [frameImage]: { alt: 'Golu Devta artwork inside a red Aipan frame', width: 1200, height: 1500 } },
});
const magnet = product('Fridge Magnets', 'pahadi-happy-couple-fridge-magnet', 60);
const nameplate = product('Personalized Gifts', 'customised-aipan-nameplate', 600);
const hamper = product('Curated Hampers', 'pichwai-jar-gift-combo', 500);
const fixtures = [hamper, nameplate, frame, girl, magnet];
const snapshot = JSON.stringify(fixtures);
catalogue = fixtures;
const ideas = getGiftGuideIdeas(catalogue);
assert.equal(ideas.length, 5);
assert.deepEqual(ideas.map(idea => idea.product?.id), [girl.id, frame.id, magnet.id, nameplate.id, hamper.id]);
assert.equal(getGiftGuideCover(catalogue), frame);
assert.equal(JSON.stringify(fixtures), snapshot, 'Do not mutate the catalogue');

for (const override of [
  { published: false }, { inStock: false }, { image: '', images: [] },
  { price: 0 }, { price: -1 }, { price: Number.NaN }, { name: '  ' },
]) {
  const changed = { ...frame, ...override };
  assert.equal(getGiftGuideIdeas([changed]).find(idea => idea.category === 'Frames').product, undefined);
  assert.equal(getGiftGuideCover([changed]), undefined);
}
const unrelated = product('Personalized Gifts', 'tea-light-candle', 30);
const keychainHtml = renderToStaticMarkup(React.createElement(KeychainBuyingGuide, { products: [
  girl, { ...girl, price: 1 },
  product('Keychains', 'unpublished', 1, { published: false }),
  product('Keychains', 'sold-out', 2, { inStock: false }),
  product('Keychains', 'group-design', 120, { details: ['Minimum order quantity = 2pc'] }),
  unrelated,
] }));
assert.match(keychainHtml, /range from ₹80 to ₹120/);
assert.match(keychainHtml, /minimum 2 pieces/);
assert.match(keychainHtml, /party return gifts/);
assert.match(keychainHtml, /not automatically an Aipan design/);
assert.doesNotMatch(keychainHtml, /href="[^"]*(?:unpublished|sold-out|tea-light-candle)/);
assert.equal(renderToStaticMarkup(React.createElement(KeychainBuyingGuide, { products: [] })), '');
const collectionHtml = renderToStaticMarkup(React.createElement(CollectionSchema, {
  products: [girl, { ...girl, image: '/wrong-duplicate.webp' }, { ...unrelated, published: false }],
  path: '/pahadi-keychains', name: 'Pahadi keychains', description: 'Current designs',
}));
const collectionSchema = JSON.parse(collectionHtml.match(/>([\s\S]*)<\/script>/)[1]);
assert.equal(collectionSchema.mainEntity.numberOfItems, 1);
assert.equal(collectionSchema.primaryImageOfPage.url, 'https://www.kumaonrang.com/images/pahadi-girl-keychain.webp');
assert.equal(collectionSchema.mainEntity.itemListElement[0].image, collectionSchema.primaryImageOfPage.url);
assert.equal(getGiftGuideIdeas([unrelated]).find(idea => idea.category === 'Personalized Gifts').product, undefined,
  'Do not present an unrelated candle as a personalised nameplate');
const wrongCategory = { ...frame, category: 'Keychains' };
assert.equal(getGiftGuideCover([wrongCategory]), undefined, 'Do not use a product moved to an unrelated category');
const alternative = product('Frames', 'om-aipan-wall-decor', 800);
assert.equal(getGiftGuideCover([{ ...frame, inStock: false }, alternative]), alternative);
assert.equal(getGiftGuideCover([girl]), girl, 'Use a genuine pictured alternative for the guide preview');

catalogue = fixtures;
const html = renderToStaticMarkup(await GiftGuide());
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal((html.match(/<img\b/g) || []).length, 5);
assert.equal((html.match(/loading="lazy"/g) || []).length, 5);
assert.match(html, /golu-devta-abc-card\.webp/, 'Use existing compressed card imagery in the visible guide');
assert.match(html, /alt="Golu Devta artwork inside a red Aipan frame"/);
assert.match(html, /₹1,400/);
assert.match(html, /Minimum order: 2 pieces/);
assert.match(html, /href="\/aipan-frames\/golu-devta-aipan-frame"/);
assert.match(html, /href="\/aipan-art"/);
assert.match(html, /<details[^>]*id="wedding-gifts"/);
assert.match(html, /Questions before you gift/);
assert.doesNotMatch(html, /free delivery|aggregateRating|fake review/i);
const schema = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'CollectionPage');
assert.equal(schema.mainEntity.numberOfItems, 5);
assert.equal(schema.primaryImageOfPage.url, frameImage);
assert.equal(schema.mainEntity.itemListElement[0].image, 'https://www.kumaonrang.com/images/pahadi-girl-keychain.webp');
assert.ok(schema.mainEntity.itemListElement.every(item => item.url.startsWith('https://www.kumaonrang.com/')));

let metadata = await generateMetadata();
assert.equal(metadata.alternates.canonical, 'https://www.kumaonrang.com/uttarakhand-gifts');
assert.equal(metadata.openGraph.images[0].url, frameImage);
assert.equal(metadata.openGraph.images[0].alt, frame.imageMetadata[frameImage].alt);
assert.equal(metadata.openGraph.images[0].width, 1200);
assert.equal(metadata.openGraph.images[0].height, 1500);
assert.equal(metadata.twitter.card, 'summary_large_image');
for (const [category, expected] of [
  ['aipan-frames', frameImage], ['pahadi-keychains', girl.image],
  ['uttarakhand-souvenirs', magnet.image], ['kumaoni-gifts', nameplate.image],
]) {
  const result = await categoryMetadata({ params: Promise.resolve({ category }) });
  assert.equal(result.openGraph.images[0].url, expected);
  assert.equal(result.alternates.canonical, `https://www.kumaonrang.com/${category}`);
}
catalogue = fixtures.map(item => item.id === girl.id ? { ...item, price: 95 } : item);
assert.match(renderToStaticMarkup(await GiftGuide()), /₹95/, 'Prices follow current data, not editorial copy');
catalogue = fixtures.map(item => ({ ...item, published: false }));
const emptyHtml = renderToStaticMarkup(await GiftGuide());
assert.equal((emptyHtml.match(/<img\b/g) || []).length, 0);
assert.doesNotMatch(emptyHtml, /href="\/aipan-frames\/golu-devta-aipan-frame"/);
assert.match(emptyHtml, /href="\/aipan-frames"/, 'Keep category navigation when no eligible sample exists');
metadata = await generateMetadata();
assert.equal(metadata.openGraph.images, undefined);
assert.equal(metadata.twitter.card, 'summary');
assert.match(readFileSync(resolve(root, 'app/uttarakhand-gifts/page.tsx'), 'utf8'), /generateMetadata/);
console.log('Gift guide: catalogue selection, exclusions, live prices, minimum quantity, server HTML, lazy card images, canonical links, metadata, category previews and matching schema passed.');

// Optional integration check against a running preview; all requests are GETs.
if (process.argv[2]) {
  const preview = new URL(process.argv[2]);
  const response = await fetch(new URL('/uttarakhand-gifts', preview));
  assert.equal(response.status, 200);
  const responseHtml = await response.text();
  const main = responseHtml.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  const schemas = [...main.matchAll(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const guide = schemas.find(item => item['@type'] === 'CollectionPage');
  assert.ok(guide.mainEntity.numberOfItems > 0, 'Live catalogue supplies real guide examples');
  const count = guide.mainEntity.numberOfItems;
  assert.equal((main.match(/<img\b/g) || []).length, count);
  assert.equal((main.match(/loading="lazy"/g) || []).length, count);
  assert.match(responseHtml.match(/<head>[\s\S]*?<\/head>/)[0], /property="og:image"/);
  assert.match(responseHtml, /rel="canonical" href="https:\/\/www.kumaonrang.com\/uttarakhand-gifts"/);
  const results = await Promise.all(guide.mainEntity.itemListElement.map(async item => {
    const path = new URL(item.url).pathname;
    const productResponse = await fetch(new URL(path, preview));
    assert.equal(productResponse.status, 200, path);
    const productHtml = await productResponse.text();
    const product = [...productHtml.matchAll(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'Product');
    assert.ok(product, path + ' Product schema');
    const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(product.offers.price));
    assert.ok(main.includes(price), path + ' listed price matches product');
    return { path, price, status: productResponse.status };
  }));
  for (const category of ['aipan-frames', 'pahadi-keychains', 'uttarakhand-souvenirs', 'kumaoni-gifts']) {
    const categoryResponse = await fetch(new URL('/' + category, preview));
    assert.equal(categoryResponse.status, 200);
    const categoryHtml = await categoryResponse.text();
    assert.match(categoryHtml.match(/<head>[\s\S]*?<\/head>/)[0], /property="og:image"/);
  }
  console.log(JSON.stringify({ guide: response.status, visiblePictures: count, lazyImages: count, matchingSchemaItems: count, categoryPreviews: 4, productLinksAndPrices: results }, null, 2));
}
