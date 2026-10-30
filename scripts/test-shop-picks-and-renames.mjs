import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const modules = new Map();
function load(file) {
  const path = resolve(root, file);
  if (modules.has(path)) return modules.get(path).exports;
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const loadedModule = { exports: {} };
  modules.set(path, loadedModule);
  const localRequire = name => {
    if (name === 'next/link') return function MockLink({ children, prefetch, ...props }) { return React.createElement('a', props, children); };
    if (name.endsWith('.module.css')) return new Proxy({}, { get: (_, key) => String(key) });
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name);
      if (base.endsWith('.json')) return require(base);
      const target = [base + '.ts', base + '.tsx'].find(existsSync);
      if (!target) throw new Error(`Unknown local import: ${name}`);
      return load(target);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const catalog = load('src/lib/catalog.ts');
const { selectShopPicks, ShopPicks } = load('src/components/home/shop-picks.tsx');
const product = (name, category, extra = {}) => ({ id: name, name, category, slug: extra.slug, published: true, featured: true, image: 'x.webp', images: ['x.webp'], price: 100, ...extra });

test('a renamed product URL redirects only once the corrected slug is published', () => {
  const before = [product('Wedding Brooches', 'Personalized Gifts', { slug: 'weeding-brooch-collection' })];
  assert.equal(catalog.getRenamedProductPath(before, 'kumaoni-gifts', 'weeding-brooch-collection'), undefined);
  assert.ok(catalog.getProductByPublicSlug(before, 'kumaoni-gifts', 'weeding-brooch-collection'));

  const after = [product('Wedding Brooches', 'Personalized Gifts', { slug: 'wedding-brooch-collection' })];
  assert.equal(catalog.getRenamedProductPath(after, 'kumaoni-gifts', 'weeding-brooch-collection'), '/kumaoni-gifts/wedding-brooch-collection');
  assert.equal(catalog.getRenamedProductPath(after, 'kumaoni-gifts', 'handmade-rakhii'), undefined);
  assert.equal(catalog.getRenamedProductPath(after, 'aipan-frames', 'weeding-brooch-collection'), undefined);
});

test('picks are featured, photographed and in stock, one category at a time', () => {
  const products = [
    product('Frame A', 'Frames'), product('Frame B', 'Frames'), product('Frame C', 'Frames'),
    product('Keychain A', 'Keychains'), product('Hamper A', 'Curated Hampers'),
    product('Not featured', 'Home Decor', { featured: false }),
    product('No photo', 'Fridge Magnets', { image: '' }),
    product('Sold out', 'Personalized Gifts', { inStock: false }),
  ];
  assert.deepEqual(selectShopPicks(products).map(item => item.name),
    ['Frame A', 'Keychain A', 'Hamper A', 'Frame B', 'Frame C']);
  assert.equal(selectShopPicks(products, 2).length, 2);
});

test('the picks section is omitted when nothing qualifies', () => {
  assert.equal(renderToStaticMarkup(React.createElement(ShopPicks, { products: [product('Hidden', 'Frames', { featured: false })] })), '');
  const html = renderToStaticMarkup(React.createElement(ShopPicks, { products: [product('Frame A', 'Frames', { slug: 'frame-a', price: 1400 })] }));
  assert.match(html, /Sneha’s picks/);
  assert.match(html, /href="\/collection"/);
  // A quiet shelf: each pick links to its product with name and price, no cart controls.
  assert.match(html, /href="\/aipan-frames\/frame-a"/);
  assert.match(html, /Frame A/);
  assert.match(html, /₹1,400/);
  assert.doesNotMatch(html, /Add to cart|% off/);
});
