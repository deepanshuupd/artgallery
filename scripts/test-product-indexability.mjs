import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Exercise the real route, metadata, schema and stock UI without service writes.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const modules = new Map();
let catalog = [];
function load(file) {
  const path = resolve(root, file);
  if (modules.has(path)) return modules.get(path).exports;
  const source = readFileSync(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const loadedModule = { exports: {} };
  modules.set(path, loadedModule);
  const localRequire = name => {
    if (name === '@/lib/products') return { getProducts: async () => catalog };
    if (name === 'next/navigation') return { notFound: () => { throw new Error('NOT_FOUND'); } };
    if (name === 'next/link') return function MockLink({ children, prefetch, ...props }) { return React.createElement('a', props, children); };
    if (name === 'next/image') return function MockImage({ fill, priority, ...props }) { return React.createElement('img', props); };
    if (name.endsWith('.module.css')) return new Proxy({}, { get: (_, key) => String(key) });
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name);
      const target = [base + '.ts', base + '.tsx'].find(existsSync);
      if (!target) throw new Error(`Unknown local import: ${name}`);
      return load(target);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { getProductPath, getProductByPublicSlug, slugify } = load('src/lib/catalog.ts');
const { generateOrderMessage, createWhatsAppLink, generateWhatsAppOrderLink } = load('src/lib/whatsapp.ts');
const { getProductHighlights, getMinimumPieceQuantity } = load('src/lib/product-highlights.ts');
const { selectRelatedProducts } = load('src/lib/related-products.ts');
const { default: ProductPage, generateMetadata } = load('src/app/[category]/[slug]/page.tsx');
const piece = overrides => ({
  id: 'one', slug: 'om-aipan-wall-decor', urlCategory: 'Frames', name: 'Om Aipan Wall Decor – Design 1',
  category: 'Frames', description: 'A 12-inch MDF wall decor with Aipan artwork.', story: '',
  price: 800, image: '', images: [], featured: false, details: ['MDF', '12 inches'],
  whatsappMessage: '', published: true, inStock: true, ...overrides,
});
const original = piece();
const factual = piece({ details: ['**Frame size** : 14inch', 'Base: MDF', 'Customisation: Name only; design unchanged', 'Minimum order quantity = 10pc', 'Size: 12inch', 'A lovely gift', 'Care: Soft dry cloth'] });
assert.deepEqual(getProductHighlights(factual), [
  { label: 'Minimum order', value: '10pc' },
  { label: 'Size', value: '14inch; 12inch' },
  { label: 'Material', value: 'MDF' },
  { label: 'Personalisation', value: 'Name only; design unchanged' },
], 'Retain supplied units, restrictions and conflicting values instead of inventing facts');
assert.deepEqual(getProductHighlights(original), [], 'Unlabelled text is not turned into an inferred specification');
assert.deepEqual(getProductHighlights(piece({ details: ['Material: ', 'Size:'] })), []);
assert.deepEqual(getProductHighlights(piece({ details: ['Care instructions: Washable with lukewarm water', 'Do not scrub with a hard brush'] })), [], 'Do not promote a partial care instruction without its continuation');
assert.equal(getMinimumPieceQuantity(factual), 10);
assert.equal(getMinimumPieceQuantity(piece({ details: ['Minimum order quantity = 2pc'] })), 2);
assert.equal(getMinimumPieceQuantity(piece({ details: ['Customization: Available on request (Moq-20pc)'] })), 1, 'A custom-order minimum does not apply to standard pieces');
assert.equal(getMinimumPieceQuantity(piece({ details: ['Minimum order quantity: 2 pairs. Single pair is not available.'] })), 1, 'Do not infer the selling unit or per-pair price');
const photographed = overrides => piece({ image: '/images/piece.webp', ...overrides });
const nearby = photographed({ id: 'nearby', slug: 'nearby', price: 750 });
const farther = photographed({ id: 'farther', slug: 'farther', price: 1500 });
const unavailable = photographed({ id: 'unavailable', slug: 'unavailable', inStock: false, price: 800 });
const candidates = [
  photographed({ id: 'photo', slug: 'photo', name: 'Customised A4 Photo Frame' }),
  photographed({ id: 'unpublished', slug: 'unpublished', published: false }),
  piece({ id: 'missing-photo', slug: 'missing-photo' }),
  unavailable, farther, nearby, { ...nearby }, original,
];
assert.deepEqual(selectRelatedProducts(original, candidates).map(item => item.id), ['nearby', 'farther', 'unavailable'], 'Recommend the same purpose, preferring stock and comparable prices; exclude drafts, missing photos, self and duplicate URLs');
assert.deepEqual(selectRelatedProducts(original, [...candidates].reverse()).map(item => item.id), ['nearby', 'farther', 'unavailable']);
const nameplate = photographed({ id: 'nameplate', slug: 'nameplate', name: 'Customised Aipan Nameplate', category: 'Personalized Gifts' });
assert.deepEqual(selectRelatedProducts(nameplate, [nearby]), [], 'Aipan nameplates do not get broad personalised-gift or wall-art recommendations');
const counter = photographed({ id: 'counter', slug: 'counter', name: 'Mantra Chant Counter', category: 'Personalized Gifts' });
assert.deepEqual(selectRelatedProducts(counter, [nameplate]), [], 'Hide the section rather than substitute unrelated personalised gifts');
assert.deepEqual(selectRelatedProducts(original, candidates, 0), []);
catalog = [factual, ...candidates];
const factualHtml = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ category: 'aipan-frames', slug: original.slug }) }));
assert.ok(factualHtml.indexOf('At a glance') < factualHtml.indexOf('id="product-order-title"'), 'Important facts are server-rendered before ordering');
assert.match(factualHtml, /Name only; design unchanged/);
assert.match(factualHtml, /More pieces like this/);
assert.match(factualHtml, /min="10"/);
assert.match(factualHtml, /value="10"/);
const renamed = piece({ name: 'A revised name', category: 'Keychains' });
assert.equal(getProductPath(original), getProductPath(renamed), 'Name and display category edits retain the URL');
assert.equal(getProductByPublicSlug([renamed], 'aipan-frames', original.slug), renamed);
assert.equal(getProductByPublicSlug([renamed], 'pahadi-keychains', original.slug), undefined);
const second = piece({ id: 'two', name: 'Om Aipan Wall Decor – Design 2', slug: 'om-aipan-wall-decor-90366ff1' });
assert.notEqual(getProductPath(original), getProductPath(second));
assert.equal(getProductByPublicSlug([original, second], 'aipan-frames', second.slug), second);
assert.equal(slugify('Caféine DéCOR 🎨'), 'cafeine-decor');
assert.equal(getProductByPublicSlug([piece({ published: false })], 'aipan-frames', original.slug), undefined);

for (const stock of [true, false, undefined]) {
  catalog = [piece({ inStock: stock })];
  const props = { params: Promise.resolve({ category: 'aipan-frames', slug: original.slug }) };
  const metadata = await generateMetadata(props);
  assert.equal(metadata.alternates.canonical, 'https://www.kumaonrang.com/aipan-frames/om-aipan-wall-decor');
  const html = renderToStaticMarkup(await ProductPage(props));
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const product = schemas.find(item => item['@type'] === 'Product');
  assert.equal(product.offers.price, 800);
  assert.equal(product.offers.priceCurrency, 'INR');
  assert.equal(product.offers.availability, stock === undefined ? undefined : `https://schema.org/${stock ? 'InStock' : 'OutOfStock'}`);
  assert.ok(html.includes('MDF'), 'Specifications must be present in server HTML');
  if (stock === false) {
    assert.match(html, /Currently out of stock/);
    assert.match(html, /Ask about availability/);
  }
}
catalog = [piece({ published: false })];
const draft = { params: Promise.resolve({ category: 'aipan-frames', slug: original.slug }) };
assert.equal((await generateMetadata(draft)).robots.index, false);
await assert.rejects(ProductPage(draft), /NOT_FOUND/);
const message = generateOrderMessage({ productName: original.name, category: 'Frames', inStock: false });
assert.match(message, /when this product will be available/);
assert.doesNotMatch(message, /interested in placing an order/);
const originalNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;
try {
  for (const configured of ['8266064457', '+91 82660 64457', '08266064457']) {
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER = configured;
    const link = new URL(createWhatsAppLink('A name & an occasion'));
    assert.equal(link.origin, 'https://wa.me');
    assert.equal(link.pathname, '/918266064457', 'Local and international configuration reach the same business');
    assert.equal(link.searchParams.get('text'), 'A name & an occasion');
  }
  const prepared = new URL(generateWhatsAppOrderLink(original, 'Name: Riya & Aman', 3, '262501', '2026-11-08'));
  const text = prepared.searchParams.get('text');
  assert.match(text, /Quantity: 3/);
  assert.match(text, /Name: Riya & Aman/);
  assert.match(text, /Delivery PIN code: 262501/);
  assert.match(text, /Occasion date: 2026-11-08 \(please confirm if delivery is possible\)/);
  assert.doesNotMatch(generateOrderMessage({ productName: original.name, category: 'Frames' }), /PIN code|Occasion date/);
} finally {
  if (originalNumber === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;
  else process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER = originalNumber;
}
console.log('Product indexability: factual highlights, relevant alternatives, permanent URLs, draft exclusion, SSR specifications, canonical, stock schema/UI and WhatsApp enquiries passed. No external writes.');
