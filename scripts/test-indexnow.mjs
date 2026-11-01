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

const { submitToIndexNow, indexNowKey } = load('src/lib/indexnow.ts');

test('the IndexNow key file is published and matches the key', () => {
  assert.equal(readFileSync(resolve(root, 'public', `${indexNowKey}.txt`), 'utf8').trim(), indexNowKey);
  assert.equal(readFileSync(resolve(root, 'scripts/indexnow-submit.mjs'), 'utf8').includes(indexNowKey), true);
});

test('IndexNow submits only this site’s URLs, and only from production', async () => {
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return { ok: true }; };
  try {
    delete process.env.VERCEL_ENV;
    await submitToIndexNow(['https://www.kumaonrang.com/collection']);
    assert.equal(calls.length, 0);
    process.env.VERCEL_ENV = 'production';
    await submitToIndexNow(['https://www.kumaonrang.com/collection', 'https://www.kumaonrang.com/collection', 'https://evil.example/x']);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.indexnow.org/indexnow');
    assert.deepEqual(calls[0].body.urlList, ['https://www.kumaonrang.com/collection']);
    assert.equal(calls[0].body.keyLocation, `https://www.kumaonrang.com/${indexNowKey}.txt`);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.VERCEL_ENV;
  }
});
