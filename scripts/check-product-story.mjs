import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Render-only regression checks; no authentication, uploads or database writes.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
function loadComponent(file, stubs = {}) {
  const source = readFileSync(resolve(root, file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const module = { exports: {} };
  const localRequire = name => {
    if (Object.hasOwn(stubs, name)) return stubs[name];
    if (name.endsWith('.module.css')) return { story: 'story', heading: 'heading', ornament: 'ornament', label: 'label', copy: 'copy' };
    return require(name);
  };
  runInNewContext(`(function(require, module, exports) { ${outputText}\n })`)(localRequire, module, module.exports);
  return module.exports;
}

const ornament = loadComponent('src/components/home/craft-ornament.tsx');
const { ProductStory } = loadComponent('src/components/products/product-story.tsx', {
  '@/components/home/craft-ornament': ornament,
});
const renderStory = story => renderToStaticMarkup(React.createElement(ProductStory, { story }));
assert.equal(renderStory(''), '');
assert.equal(renderStory(' \n '), '');
const text = 'A memory of home, made into something to keep.\nA second paragraph.';
const storyHtml = renderStory(text);
assert.ok(storyHtml.includes(text), 'The saved story and its paragraph breaks must be preserved');
assert.match(storyHtml, /aria-label="The story behind this piece"/);
assert.ok(!storyHtml.includes('A little Kumaon. A little closer to home.'), 'Do not replace admin text with a fixed tagline');
assert.ok(renderStory('<script>bad()</script>').includes('&lt;script&gt;'), 'Story content must remain escaped text');

const unused = () => { throw new Error('Render tests must not write to external services'); };
const { ProductForm } = loadComponent('src/app/admin/_components/product-form.tsx', {
  'next/navigation': { useRouter: () => ({ push: unused, refresh: unused }) },
  'next/image': () => null,
  '@/lib/supabase/client': { createClient: unused },
  '@/lib/product-image-upload': { prepareProductImages: unused },
  '@/lib/product-image': { productCardImage: unused },
  '@/app/admin/actions': { refreshPublicCatalog: unused },
  '@/components/products/product-story': { ProductStory },
});
for (const mode of ['create', 'edit']) {
  const html = renderToStaticMarkup(React.createElement(ProductForm, { mode, initial: { story: text } }));
  assert.ok(html.includes('Product story / closing note (optional)'));
  assert.ok(html.includes('Storefront preview'));
  assert.ok(html.includes(text), `${mode}: saved story must populate the form and preview`);
}
const emptyForm = renderToStaticMarkup(React.createElement(ProductForm, { mode: 'create' }));
assert.ok(!emptyForm.includes('Storefront preview'), 'An empty story should not generate a storefront section');
console.log('Product story: empty, populated, escaped, create/edit form and preview checks passed. No database writes.');
