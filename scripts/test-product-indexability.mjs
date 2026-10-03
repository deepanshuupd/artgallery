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
  const module = { exports: {} };
  modules.set(path, module);
  const localRequire = name => {
    if (name === '@/lib/products') return { getProducts: async () => catalog };
    if (name === 'next/navigation') return { notFound: () => { throw new Error('NOT_FOUND'); } };
    if (name === 'next/link') return ({ children, prefetch, ...props }) => React.createElement('a', props, children);
    if (name === 'next/image') return ({ fill, priority, ...props }) => React.createElement('img', props);
    if (name.endsWith('.module.css')) return new Proxy({}, { get: (_, key) => String(key) });
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name);
      const target = [base + '.ts', base + '.tsx'].find(existsSync);
      if (!target) throw new Error(`Unknown local import: ${name}`);
      return load(target);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  return module.exports;
}
const { getProductPath, getProductByPublicSlug, slugify } = load('src/lib/catalog.ts');
const { generateOrderMessage } = load('src/lib/whatsapp.ts');
const { default: ProductPage, generateMetadata } = load('src/app/[category]/[slug]/page.tsx');
const piece = overrides => ({
  id: 'one', slug: 'om-aipan-wall-decor', urlCategory: 'Frames', name: 'Om Aipan Wall Decor – Design 1',
  category: 'Frames', description: 'A 12-inch MDF wall decor with Aipan artwork.', story: '',
  price: 800, image: '', images: [], featured: false, details: ['MDF', '12 inches'],
  whatsappMessage: '', published: true, inStock: true, ...overrides,
});
const original = piece();
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
console.log('Product indexability: permanent URLs, duplicate designs, draft exclusion, SSR specifications, canonical, stock schema/UI and availability enquiry passed. No external writes.');
