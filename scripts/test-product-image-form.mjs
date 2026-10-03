import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Exercise the real form handlers with in-memory React/Storage stubs.
// No browser session, credentials, uploads or database writes.
function load(file, stubs) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const require = name => {
    if (Object.hasOwn(stubs, name)) return stubs[name];
    throw new Error(`Unexpected dependency in isolated test: ${name}`);
  };
  new Function('require', 'module', 'exports', 'document', 'crypto', outputText)(require, module, module.exports,
    { getElementById: () => ({ focus() {} }) }, { randomUUID: () => 'test-unique-id' });
  return module.exports;
}
const helpers = load('src/lib/product-image.ts', {});
const prefix = 'https://example.supabase.co/storage/v1/object/public/product-images/';
const first = `${prefix}optimized/v2/frame-a.webp`, second = `${prefix}optimized/v2/frame-b.webp`;
const variants = { card: { name: 'card.webp' }, detail: { name: 'detail.webp' },
  width: 1200, height: 1600, cardWidth: 600, cardHeight: 800 };

function harness(initial = {}, options = {}) {
  const state = [], calls = { uploads: [], removed: [], saved: [], navigation: [] };
  let cursor = 0;
  const react = { useId: () => 'test', useRef: () => ({ current: null }), useState: value => {
    const index = cursor++;
    if (!(index in state)) state[index] = typeof value === 'function' ? value() : value;
    return [state[index], next => { state[index] = typeof next === 'function' ? next(state[index]) : next; }];
  } };
  const jsx = (type, props) => ({ type, props: props || {} });
  const storage = { upload: async (path, file, uploadOptions) => {
    calls.uploads.push({ path, file, options: uploadOptions });
    return { error: options.failDetail && !path.endsWith('-card.webp') ? { message: 'Mock detail failure' } : null };
  }, remove: async paths => { calls.removed.push(paths); return { error: null }; },
  getPublicUrl: path => ({ data: { publicUrl: `${prefix}${path}` } }) };
  const db = { storage: { from: name => { assert.equal(name, 'product-images'); return storage; } },
    from: name => { assert.equal(name, 'products'); return {
      insert: async payload => { calls.saved.push(payload); return { error: null }; },
      update: payload => ({ eq: async () => { calls.saved.push(payload); return { error: null }; } }),
    }; } };
  const { ProductForm } = load('src/app/admin/_components/product-form.tsx', {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'next/image': 'mock-image', 'next/navigation': { useRouter: () => ({
      push: path => calls.navigation.push(path), refresh() {},
    }) }, '@/lib/product-image': helpers,
    '@/lib/supabase/client': { createClient: () => db },
    '@/lib/product-image-upload': { prepareProductImages: options.prepare || (async () => variants) },
    '@/app/admin/actions': { refreshPublicCatalog: async () => {} },
    '@/components/products/product-story': { ProductStory: 'mock-story' },
  });
  let tree;
  const render = () => { cursor = 0; tree = ProductForm({ mode: 'edit', productId: 'test-product', initial }); return tree; };
  const nodes = node => {
    if (Array.isArray(node)) return node.flatMap(nodes);
    if (!node || typeof node !== 'object') return [];
    return [node, ...nodes(node.props?.children)];
  };
  const find = predicate => { const node = nodes(tree).find(predicate); assert.ok(node, 'Expected form control'); return node; };
  const field = suffix => find(node => node.props?.id === `test-${suffix}`);
  const button = label => find(node => node.props?.['aria-label'] === label);
  const upload = files => find(node => node.type === 'input' && node.props.type === 'file').props.onChange({ target: { files } });
  const save = () => tree.props.onSubmit({ preventDefault() {} });
  render();
  return { render, field, button, upload, save, state, calls };
}

{
  const form = harness({ name: 'Aipan frame', price: '1400', image_url: first, image_urls: [second],
    image_metadata: { [first]: { alt: 'Primary photo', caption: 'First caption' }, [second]: { alt: 'Second photo' } } });
  assert.deepEqual(form.state[0].image_urls, [first, second], 'Primary-only legacy source is retained');
  form.button('Move photograph 1 later').props.onClick(); form.render();
  assert.deepEqual(form.state[0].image_urls, [second, first]);
  assert.equal(form.field('image-alt-1').props.value, 'Primary photo');
  form.field('image-caption-1').props.onChange({ target: { value: 'Updated caption' } }); form.render();
  form.button('Remove photograph 1').props.onClick(); form.render();
  await form.save();
  assert.deepEqual(form.calls.saved[0].image_urls, [first]);
  assert.equal(form.calls.saved[0].image_metadata[first].caption, 'Updated caption');
  assert.ok(!form.calls.saved[0].image_metadata[second]);
  assert.deepEqual(form.calls.removed, [], 'Removing an existing gallery reference never deletes the original object');
  console.log('PASS legacy primary, reorder, caption edit, reference removal and persisted pairing');
}
{
  const form = harness({ name: ' ' });
  await form.upload([{ name: 'new.jpg' }]);
  assert.equal(form.calls.uploads.length, 0);
  assert.match(form.state[3], /product name/);
  console.log('PASS unnamed products cannot upload keywordless images');
}
{
  let finish;
  const form = harness({ name: 'Pichwai Jar Gift Combo', price: '500', image_url: first, image_urls: [first],
    image_metadata: { [first]: { caption: 'Original caption' } } },
  { prepare: () => new Promise(resolve => { finish = resolve; }) });
  const uploading = form.upload([{ name: 'new.jpg' }]); form.render();
  form.field('image-caption-0').props.onChange({ target: { value: 'Edited during upload' } }); form.render();
  finish(variants); await uploading; form.render();
  assert.equal(form.state[0].image_metadata[first].caption, 'Edited during upload');
  assert.equal(form.calls.uploads.length, 2);
  for (const upload of form.calls.uploads) {
    assert.match(upload.path, /^optimized\/v2\/pichwai-jar-gift-combo-test-unique-id(?:-card)?\.webp$/);
    assert.deepEqual(upload.options, helpers.PRODUCT_IMAGE_UPLOAD_OPTIONS);
    assert.equal(upload.options.headers['x-robots-tag'], 'all');
    assert.equal(upload.options.upsert, false);
  }
  assert.match(form.calls.uploads[0].path, /-card\.webp$/);
  const newUrl = form.state[0].image_urls[1];
  assert.equal(form.state[0].image_metadata[newUrl].alt, 'Pichwai Jar Gift Combo');
  assert.equal(form.state[0].image_metadata[newUrl].width, 1200);
  assert.equal(form.state[0].image_metadata[newUrl].cardHeight, 800);
  await form.save();
  assert.equal(form.calls.saved[0].image_metadata[newUrl].alt, 'Pichwai Jar Gift Combo');
  assert.deepEqual(form.calls.navigation, ['/admin/products']);
  console.log('PASS future WebP upload, indexing header, real dimensions, concurrent caption edit and save');
}
{
  const form = harness({ name: 'Aipan frame', price: '1400', image_url: first, image_urls: [first] }, { failDetail: true });
  await form.upload([{ name: 'new.jpg' }]); form.render();
  assert.deepEqual(form.state[0].image_urls, [first]);
  assert.equal(form.calls.removed.length, 1);
  assert.deepEqual(form.calls.removed[0], [form.calls.uploads[0].path]);
  assert.match(form.calls.removed[0][0], /test-unique-id-card\.webp$/);
  assert.match(form.state[3], /Mock detail failure/);
  console.log('PASS incomplete pair is not published; cleanup targets only the new test upload');
}
{
  const six = Array.from({ length: 6 }, (_, index) => `${prefix}optimized/v2/legacy-${index}.webp`);
  const form = harness({ name: 'Legacy gallery', price: '400', image_url: six[0], image_urls: six });
  await form.save();
  assert.deepEqual(form.calls.saved[0].image_urls, six);
  console.log('PASS saving an older gallery does not truncate existing photographs');
}
{
  const form = harness({ name: 'Out-of-stock Aipan frame', price: '1400', is_available: true, is_published: true });
  form.field('is-available').props.onChange({ target: { checked: false } }); form.render();
  await form.save();
  assert.equal(form.calls.saved[0].is_available, false);
  assert.equal(form.calls.saved[0].is_published, true, 'Changing stock must not unpublish the product');
  form.field('is-published').props.onChange({ target: { checked: false } }); form.render();
  // Model a fresh edit after the successful save, without issuing service writes.
  const draft = harness({ name: 'Draft frame', price: '1400', is_available: true, is_published: false });
  await draft.save();
  assert.equal(draft.calls.saved[0].is_available, true);
  assert.equal(draft.calls.saved[0].is_published, false, 'Unpublishing must not invent an out-of-stock state');
  assert.ok(!Object.hasOwn(draft.calls.saved[0], 'slug'), 'Routine form edits cannot replace the permanent URL');
  console.log('PASS stock and publication save independently, preserving permanent URLs');
}
console.log('Product form: 6 isolated workflow groups passed. No external writes.');
