import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/components/products/product-detail-view.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const element = React.createElement;
const product = {
  id: 'frame', name: 'Aipan frame', category: 'Frames', price: 1400,
  description: 'A hand-painted frame. A longer story.', details: ['MDF base'], inStock: true,
};
function load(react = React, observer) {
  const module = { exports: {} };
  const imports = {
    react,
    'next/image': ({ fill, priority, ...props }) => element('img', props),
    'next/link': ({ prefetch, ...props }) => element('a', props),
    '@/lib/product-image': { getProductImageUrls: () => [], getProductImage: () => ({}) },
    '@/lib/pricing': { formatPrice: value => `INR ${value}`, getDiscount: () => null },
    '@/components/icons': { WhatsAppIcon: () => null },
    './whatsapp-order-sheet': { WhatsAppOrderSheet: () => null },
    './quantity-control': { QuantityControl: ({ value, minimum }) => element('input', { 'aria-label': 'Quantity', value, min: minimum, readOnly: true }) },
    './use-product-dialog': { useProductDialog: () => ({ current: null }) },
    './product-story': { ProductStory: () => null },
    '@/data/shop-ordering': { shopOrdering: { dispatch: 'If your requested quantity is in stock, dispatch takes 2–3 days.' } },
    '@/lib/product-highlights': { getMinimumPieceQuantity: p => p.minimum ?? 1, getProductHighlights: () => [{ label: 'Material', value: 'MDF' }] },
    './inspectable-product-photo': { InspectableProductPhoto: () => null },
    '@/components/cart/cart-controls': { AddToCartButton: ({ unavailable, quantity }) => element('button', { disabled: unavailable, 'data-quantity': quantity }, 'Add to cart') },
  };
  const localRequire = name => name.endsWith('.module.css')
    ? { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) }
    : imports[name] ?? require(name);
  new Function('require', 'module', 'exports', 'IntersectionObserver', compiled)(localRequire, module, module.exports, observer);
  return module.exports.ProductDetailView;
}
const View = load();
const render = overrides => renderToStaticMarkup(element(View, { product: { ...product, ...overrides } }));

test('quick purchase is available in initial HTML, with subtotal and delivery caveat', () => {
  const html = render();
  assert.match(html, /<aside class="mobileBar" aria-label="Quick purchase">/);
  assert.match(html, /INR 1400/);
  assert.match(html, /1 item · delivery extra/);
  assert.doesNotMatch(html, /<aside[^>]*hidden/);
});
test('buying precedes specs and expandable fulfilment without removing policy details', () => {
  const html = render();
  const actions = html.indexOf('class="buyingActions"');
  assert.ok(actions < html.indexOf('class="fulfilmentDetails"'));
  assert.ok(actions < html.indexOf('class="highlights"'));
  assert.match(html, /<details class="fulfilmentDetails"><summary>/);
  assert.match(html, /dispatch takes 2–3 days/);
  assert.match(html, /Change-of-mind returns aren’t accepted/);
  assert.match(html, /href="\/shipping-policy"/);
  assert.match(html, /href="\/returns-policy"/);
});
test('quick purchase respects minimum quantities and out-of-stock enquiries', () => {
  const html = render({ minimum: 10 });
  assert.match(html, /INR 14000/);
  assert.match(html, /10 items · delivery extra/);
  assert.match(html, /data-quantity="10"/);
  const out = render({ inStock: false });
  assert.match(out, /<button disabled="" data-quantity="1">Add to cart/);
  assert.match(out, /Ask Sneha<\/button><\/aside>/);
  assert.doesNotMatch(out, /dispatch takes 2–3 days/);
});
test('one observer hides only the duplicate bar and disconnects on unmount', () => {
  const effects = [], updates = [];
  let instance;
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; instance = this; }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  const react = { ...React,
    useId: () => 'test-id', useRef: () => ({ current: {} }),
    useState: initial => [initial, value => updates.push(value)],
    useEffect: effect => effects.push(effect),
  };
  load(react, Observer)({ product });
  const cleanup = effects[0]();
  assert.ok(instance.target);
  assert.deepEqual(instance.options.threshold, [0, .5]);
  instance.callback([{ isIntersecting: true, intersectionRatio: .25 }]);
  instance.callback([{ isIntersecting: true, intersectionRatio: .75 }]);
  instance.callback([{ isIntersecting: false, intersectionRatio: 0 }]);
  assert.deepEqual(updates, [false, true, false]);
  cleanup();
  assert.equal(instance.disconnected, true);
});
