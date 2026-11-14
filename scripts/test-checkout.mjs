import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
  const loaded = { exports: {} };
  modules.set(path, loaded);
  const localRequire = name => {
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name);
      if (base.endsWith('.json')) return require(base);
      const target = [base + '.ts', base + '.tsx'].find(existsSync);
      if (!target) throw new Error(`Unknown local import: ${name}`);
      return load(target);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, loaded, loaded.exports);
  return loaded.exports;
}

const checkout = load('src/lib/checkout.ts');
const { shopDelivery } = load('src/data/shop-ordering.ts');
const product = (overrides = {}) => ({ id: 'frame', slug: 'golu-frame', name: 'Golu Devta Aipan Frame', category: 'Frames', price: 1400, image: '', images: [], details: [], published: true, inStock: true, ...overrides });
const customer = (overrides = {}) => ({ name: 'Asha Joshi', phone: '+91 98765 43210', address: 'House 4, Station Road', city: 'Pithoragarh', state: 'Uttarakhand', pincode: '262501', ...overrides });

test('delivery is the flat charge below the threshold and free from it', () => {
  assert.equal(checkout.deliveryFor(0), shopDelivery.charge);
  assert.equal(checkout.deliveryFor(shopDelivery.freeFrom - 0.01), shopDelivery.charge);
  assert.equal(checkout.deliveryFor(shopDelivery.freeFrom), 0);
  assert.deepEqual({ ...shopDelivery }, { charge: 100, freeFrom: 1799 });
});

test('the database charges the same delivery as the website', () => {
  const dir = resolve(root, 'supabase/migrations');
  const sql = readdirSync(dir).filter(file => /order/.test(file)).map(file => readFileSync(resolve(dir, file), 'utf8')).join('\n');
  const rule = sql.match(/delivery := case when subtotal >= (\d+) then 0 else (\d+) end;/);
  assert.ok(rule, 'place_order sets delivery');
  assert.equal(Number(rule[1]), shopDelivery.freeFrom);
  assert.equal(Number(rule[2]), shopDelivery.charge);
});

test('phone numbers and UPI references are accepted as people type them', () => {
  assert.equal(checkout.normalisePhone('+91 98765 43210'), '9876543210');
  assert.equal(checkout.normalisePhone('09876543210'), '9876543210');
  assert.equal(checkout.normalisePhone('5876543210'), '');
  assert.equal(checkout.normalisePhone('98765'), '');
  assert.equal(checkout.normaliseUpiReference(' 4123 4567 8901 '), '412345678901');
  assert.equal(checkout.normaliseUpiReference('T2311141234567890'), 'T2311141234567890');
  assert.equal(checkout.normaliseUpiReference('12-34'), '');
});

test('checkout needs a full Indian delivery address', () => {
  const parsed = checkout.parseCheckoutRequest({ items: [{ productId: 'frame', quantity: 1 }], customer: customer() });
  assert.equal(parsed.customer.phone, '9876543210');
  assert.equal(parsed.items[0].request, '');
  assert.throws(() => checkout.parseCheckoutRequest({ items: [{ productId: 'frame', quantity: 1 }], customer: customer({ pincode: '062501' }) }), /PIN code/);
  assert.throws(() => checkout.parseCheckoutRequest({ items: [{ productId: 'frame', quantity: 1 }], customer: customer({ state: 'Atlantis' }) }), /state/);
  assert.throws(() => checkout.parseCheckoutRequest({ items: [{ productId: 'frame', quantity: 1 }], customer: customer({ phone: '12345' }) }), /mobile/);
  assert.throws(() => checkout.parseCheckoutRequest({ items: [], customer: customer() }), /Add products/);
});

test('orders are priced from the catalogue, never from the browser', () => {
  const one = checkout.priceCheckout([{ productId: 'frame', quantity: 1, request: '', price: 1 }], [product()]);
  assert.deepEqual([one.subtotal, one.delivery, one.total], [1400, 100, 1500]);
  assert.equal(one.items[0].price, 1400);
  const two = checkout.priceCheckout([{ productId: 'frame', quantity: 2, request: 'Name: Asha' }], [product()]);
  assert.deepEqual([two.subtotal, two.delivery, two.total], [2800, 0, 2800]);
  assert.equal(two.items[0].request, 'Name: Asha');
  assert.throws(() => checkout.priceCheckout([{ productId: 'frame', quantity: 1, request: '' }], [product({ inStock: false })]), /out of stock/);
  assert.throws(() => checkout.priceCheckout([{ productId: 'gone', quantity: 1, request: '' }], [product()]), /no longer available/);
  assert.throws(() => checkout.priceCheckout([{ productId: 'frame', quantity: 1, request: '' }], [product({ details: ['Minimum order: 10 pcs'] })]), /minimum order is 10/);
  assert.equal(checkout.orderLabel(1001), 'KR-1001');
});

test('payment screenshots stay private and limited to the order’s own folder', () => {
  const sql = readFileSync(resolve(root, 'supabase/migrations/20261114150000_add_payment_screenshots.sql'), 'utf8');
  assert.match(sql, /'payment-proofs', 'payment-proofs', false, 5242880/);
  assert.match(sql, /o\.status = 'awaiting_payment'/);
  assert.match(sql, /\) < 3;/);
  assert.doesNotMatch(sql, /for select\s+to anon/);
  const orders = readFileSync(resolve(root, 'src/lib/orders.ts'), 'utf8');
  assert.match(orders, /path\.startsWith\(`\$\{id\}\/`\)/);
});
