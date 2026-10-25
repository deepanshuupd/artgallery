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
let catalog = [];
function load(file) {
  const path = resolve(root, file);
  if (modules.has(path)) return modules.get(path).exports;
  const loadedModule = { exports: {} };
  modules.set(path, loadedModule);
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } });
  const localRequire = name => {
    if (name === '@/lib/products') return { getProducts: async () => catalog };
    if (name === 'next/link') return function MockLink({ children, prefetch, ...props }) { return React.createElement('a', props, children); };
    if (name === 'next/image') return function MockImage({ fill, priority, ...props }) { return React.createElement('img', props); };
    if (name.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
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
const bulk = load('src/lib/bulk-orders.ts');
const piece = { id: 'girl', slug: 'pahadi-girl-keychain', name: 'Pahadi Girl Keychain', category: 'Keychains', price: 80, image: '/images/girl.webp', images: [], details: [], description: 'A Pahadi keepsake.', published: true, inStock: true };
const details = { occasion: 'Wedding / return gifts', quantity: '30', budget: '200', date: '2026-12-10', pincode: '262501', packaging: 'Names: Riya & Aman\nIndividual wrapping.' };
test('bulk choices exclude drafts, stock-outs, missing photos, invalid prices and duplicate URLs', () => {
  assert.deepEqual(bulk.getBulkProducts([piece, { ...piece, id: 'duplicate' }, { ...piece, slug: 'draft', published: false }, { ...piece, slug: 'missing', image: '' }, { ...piece, slug: 'out', inStock: false }, { ...piece, slug: 'invalid', price: NaN }]), [{ path: '/pahadi-keychains/pahadi-girl-keychain', name: piece.name, price: 80, unit: 'item' }]);
});
test('bulk brief separates budget from listed price, quotes requests and does not imply stock or an order', () => {
  const result = bulk.prepareBulkEnquiry(details, bulk.getBulkProducts([piece])[0]);
  assert.match(result.message, /Wedding & bulk gifts enquiry/);
  assert.match(result.message, /Gifts needed: 30/);
  assert.match(result.message, /Listed reference price: ₹80 per item \(not a bulk quote\)/);
  assert.match(result.message, /Budget per gift: ₹200/);
  assert.match(result.message, /Occasion date: 10 Dec 2026/);
  assert.match(result.message, /Delivery PIN code: 262501/);
  assert.match(result.message, /> Names: Riya & Aman\n> Individual wrapping/);
  assert.match(result.message, /quote enquiry, not a confirmed order/);
  assert.equal(new URL(result.url).searchParams.get('text'), result.message);
  assert.doesNotMatch(result.message, /Product subtotal|discount|free shipping/i);
});
test('quantity alone is sufficient; invalid quantities, budget, PIN and calendar dates are rejected', () => {
  const minimal = { occasion: '', quantity: '1', budget: '', date: '', pincode: '', packaging: '' };
  assert.match(bulk.prepareBulkEnquiry(minimal).message, /please help me choose/);
  for (const quantity of ['', '0', '-1', '1.5', '1e2', '10000', 'NaN']) assert.throws(() => bulk.prepareBulkEnquiry({ ...minimal, quantity }));
  for (const budget of ['-1', '0', 'NaN', '1.234']) assert.throws(() => bulk.prepareBulkEnquiry({ ...minimal, budget }));
  assert.throws(() => bulk.prepareBulkEnquiry({ ...minimal, pincode: '123' }));
  assert.throws(() => bulk.prepareBulkEnquiry({ ...minimal, date: '2026-02-30' }));
});
test('bulk page renders real product links, one heading, metadata and an accessible enquiry before hydration', async () => {
  catalog = [piece];
  const page = load('src/app/bulk-orders/page.tsx');
  const html = renderToStaticMarkup(await page.default());
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /href="\/pahadi-keychains\/pahadi-girl-keychain"/);
  assert.match(html, /alt="[^"]+"/);
  assert.match(html, /Number of gifts/);
  assert.match(html, /Review my gift enquiry/);
  assert.doesNotMatch(html, /href="https:\/\/wa.me/);
  assert.equal(page.metadata.alternates.canonical, 'https://www.kumaonrang.com/bulk-orders');
});
test('optional order fields are disclosed, and measurement remains off without an account decision', () => {
  const { WhatsAppOrderSheet } = load('src/components/products/whatsapp-order-sheet.tsx');
  const html = renderToStaticMarkup(React.createElement(WhatsAppOrderSheet, { product: piece, open: false, onClose() {}, quantity: 1, onQuantityChange() {} }));
  assert.match(html, /<details class="optionalDetails"><summary>/);
  assert.match(html, /Delivery PIN code/);
  assert.doesNotMatch(html, /<details class="optionalDetails" open/);
  const measurement = load('src/lib/commerce-events.ts');
  assert.equal(measurement.commerceMeasurementEnabled, false);
  assert.doesNotThrow(() => measurement.commerceEvent('whatsapp_handoff', 'bulk'));
});
test('only explicit included-contents lists are promoted from older hamper descriptions', () => {
  const { getProductHighlights } = load('src/lib/product-highlights.ts');
  const { generateProductOrderMessage } = load('src/lib/whatsapp.ts');
  const hamper = { ...piece, category: 'Curated Hampers', name: 'Pichwai Jar Gift Combo', description: "A gift combo.\nWhat's Included\n• 2 Pichwai Jars\n• Premium PVC Gift Bag\n\nNote: Available in the design shown.", details: [] };
  assert.deepEqual(getProductHighlights(hamper), [{ label: 'Included', value: '2 Pichwai Jars; Premium PVC Gift Bag' }]);
  assert.match(generateProductOrderMessage(hamper), /Included: 2 Pichwai Jars; Premium PVC Gift Bag/);
  assert.deepEqual(getProductHighlights({ ...hamper, description: 'Photographed with jars and flowers.\n• A lovely gift' }), []);
  assert.deepEqual(getProductHighlights({ ...hamper, details: ['Included: One jar only'] }), [{ label: 'Included', value: 'One jar only' }]);
  assert.doesNotMatch(getProductHighlights(hamper)[0].value, /Note:|design shown/);
});
test('prepared measurement is production-only, respects DNT, limits properties and cannot break ordering', async () => {
  const source = readFileSync(resolve(root, 'src/lib/commerce-events.ts'), 'utf8').replace('commerceMeasurementEnabled = false', 'commerceMeasurementEnabled = true');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const calls = [];
  const browser = (host, dnt = '0', fail = false) => {
    const compiled = { exports: {} };
    new Function('require', 'module', 'exports', 'window', 'navigator', outputText)(name => {
      assert.equal(name, '@vercel/analytics');
      return { track: (...args) => { if (fail) throw new Error('Unavailable'); calls.push(args); } };
    }, compiled, compiled.exports, { location: { hostname: host } }, { doNotTrack: dnt });
    return compiled.exports;
  };
  browser('localhost').commerceEvent('whatsapp_handoff', 'bulk');
  browser('www.kumaonrang.com', '1').commerceEvent('cart_add', 'cart');
  browser('www.kumaonrang.com').commerceEvent('whatsapp_handoff', 'product', 'catalogue-id');
  browser('www.kumaonrang.com', '0', true).commerceEvent('enquiry_review', 'bulk');
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(calls, [['whatsapp_handoff', { entry: 'product', product: 'catalogue-id' }]]);
});
