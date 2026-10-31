import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
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

const { searchProducts, parseSearch } = load('src/lib/product-search.ts');
const { getUpiLink, parseUpiAmount } = load('src/lib/payment.ts');
const piece = (name, category, price, extra = {}) => ({ id: name, name, category, price, description: '', details: [], published: true, ...extra });
const catalog = [
  piece('Wedding Brooches – Barati & Ladkiwale', 'Personalized Gifts', 45, { slug: 'weeding-brooch-collection' }),
  piece('Handmade MDF Rakhi', 'Personalized Gifts', 40, { slug: 'handmade-rakhii', details: ['Ideal for Raksha Bandhan and Rakhi gifting'] }),
  piece('Om Temple Bells – Set of 2', 'Personalized Gifts', 60, { details: ['Ideal for home temples, pooja rooms'] }),
  piece('Pahadi Girl Keychain', 'Keychains', 80),
  piece('Customised Aipan Nameplate', 'Personalized Gifts', 800),
  piece('Lotus Bandarwar', 'Home Decor', 1100, { details: ['Perfect for : Main door entrance, Diwali'] }),
];
const names = query => searchProducts(catalog, query)?.map(product => product.name);

test('an empty search leaves the catalogue alone', () => {
  assert.equal(searchProducts(catalog, '  '), undefined);
});

test('occasion words find pieces whose listings use related words', () => {
  assert.deepEqual(names('wedding'), ['Wedding Brooches – Barati & Ladkiwale']);
  assert.deepEqual(names('puja'), ['Om Temple Bells – Set of 2']);
  assert.deepEqual(names('diwali'), ['Lotus Bandarwar']);
  assert.deepEqual(names('raksha bandhan'), ['Handmade MDF Rakhi']);
});

test('spelling slips, plurals and split words still match', () => {
  assert.deepEqual(names('rakhii'), ['Handmade MDF Rakhi']);
  assert.deepEqual(names('keychains'), ['Pahadi Girl Keychain']);
  assert.deepEqual(names('name plate'), ['Customised Aipan Nameplate']);
  assert.deepEqual(names('key ring'), ['Pahadi Girl Keychain']);
});

test('price phrases filter by listed price', () => {
  assert.deepEqual(parseSearch('gifts under ₹100'), { terms: [], soft: ['gift'], maxPrice: 100, minPrice: undefined });
  assert.deepEqual(names('under 50'), ['Wedding Brooches – Barati & Ladkiwale', 'Handmade MDF Rakhi']);
  assert.deepEqual(names('aipan above 500'), ['Customised Aipan Nameplate']);
});

test('broad regional words never empty the results on their own', () => {
  assert.equal(names('pahadi keychain').length, 1);
  assert.deepEqual(names('kumaoni rakhi'), ['Handmade MDF Rakhi']);
});

test('UPI links carry only a valid confirmed amount', () => {
  assert.equal(parseUpiAmount('1240'), 1240);
  assert.equal(parseUpiAmount('12.5'), 12.5);
  assert.equal(parseUpiAmount(['99', '1']), 99);
  for (const bad of ['0', '-5', '1e3', '200000', 'abc', undefined]) assert.equal(parseUpiAmount(bad), undefined);
  assert.equal(getUpiLink({ id: 'shop@upi', name: 'Kumaon Rang' }, 1240), 'upi://pay?pa=shop@upi&pn=Kumaon%20Rang&cu=INR&tn=KumaonRang%20order&am=1240.00');
  assert.ok(!getUpiLink({ id: 'shop@upi', name: 'Kumaon Rang' }).includes('am='));
});

test('every synonym is a single word, so one shared word cannot match the whole shop', () => {
  assert.equal(names('hamper').length, 0);
  assert.deepEqual(searchProducts([...catalog, piece('Pichwai Jar Gift Combo', 'Curated Hampers', 299)], 'hamper').map(product => product.name), ['Pichwai Jar Gift Combo']);
});

test('Diwali groups follow the catalogue and show each piece once', () => {
  const { getDiwaliGroups } = load('src/lib/diwali-gifts.ts');
  const groups = getDiwaliGroups([
    ...catalog,
    piece('3 Layer Lotus Brass Diya', 'Personalized Gifts', 250, { details: ['Ideal for : Home , Pooja room & Festive Decor'] }),
    piece('Rakhii Hamper', 'Curated Hampers', 499, { published: false }),
  ]);
  assert.deepEqual(groups.map(group => [group.id, group.products.map(product => product.name)]), [
    ['doorway', ['Lotus Bandarwar']],
    ['light', ['3 Layer Lotus Brass Diya']],
    ['puja', ['Om Temple Bells – Set of 2']],
  ]);
});
