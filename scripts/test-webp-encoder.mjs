import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';
import ts from 'typescript';
import encode, { init } from '@jsquash/webp/encode.js';
import { simd } from 'wasm-feature-detect';

// Real libwebp bytes, no cloud upload or admin bypass. Select the same binary as
// the installed encoder; supplying bytes avoids Node's unsupported file fetch.
await init({ wasmBinary: readFileSync(new URL(`../node_modules/@jsquash/webp/codec/enc/webp_enc${await simd() ? '_simd' : ''}.wasm`, import.meta.url)) });
const clientCode = ts.transpileModule(readFileSync('src/lib/product-webp-encoder.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText.replaceAll('import.meta.url', '"file:///test/product-webp-encoder.ts"');
const workerCode = ts.transpileModule(readFileSync('src/lib/product-webp-worker.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function harness({ nativeType = 'image/png', nullBlob = false, invalidNative = false, failWorker = false, badWorkerBytes = false } = {}) {
  const calls = { native: 0, workers: 0, terminated: 0, messages: [] };
  class Worker {
    constructor() {
      calls.workers++;
      this.scope = { postMessage: data => queueMicrotask(() => this.onmessage?.({ data })) };
      new Function('require', 'module', 'exports', 'self', workerCode)(name => {
        assert.equal(name, '@jsquash/webp/encode.js');
        return { __esModule: true, default: badWorkerBytes ? async () => new ArrayBuffer(20) : encode };
      }, { exports: {} }, {}, this.scope);
    }
    postMessage(request, transfer) {
      calls.messages.push(request);
      assert.equal(transfer[0], request.pixels);
      if (failWorker) { queueMicrotask(() => this.onerror({ preventDefault() {} })); return; }
      void this.scope.onmessage({ data: request });
    }
    terminate() { calls.terminated++; }
  }
  const loaded = { exports: {} };
  new Function('module', 'exports', 'Worker', clientCode)(loaded, loaded.exports, Worker);
  const pixels = new Uint8ClampedArray(64 * 32 * 4);
  for (let i = 0; i < pixels.length; i += 4) { pixels[i] = 180; pixels[i + 1] = 45; pixels[i + 2] = 32; pixels[i + 3] = i < 64 * 4 ? 0 : 255; }
  const canvas = { width: 64, height: 32,
    getContext: () => ({ getImageData: () => ({ data: pixels.slice(), width: 64, height: 32 }) }),
    toBlob(callback, type) {
      calls.native++;
      assert.equal(type, 'image/webp');
      const header = new TextEncoder().encode('RIFFxxxxWEBPxxxx');
      callback(nullBlob ? null : new Blob([invalidNative ? new Uint8Array(20) : header], { type: nativeType }));
    },
  };
  return { ...loaded.exports, canvas, calls };
}

test('native WebP takes the fast path and never starts a worker', async () => {
  const h = harness({ nativeType: 'image/webp' }), encoder = h.createProductWebpEncoder();
  const blob = await encoder.encode(h.canvas, .92);
  assert.equal(await h.isWebp(blob), true);
  assert.equal(h.calls.workers, 0);
  encoder.close();
});
test('Safari PNG fallback creates real decodable WebP, preserves dimensions/transparency and reuses one worker', async () => {
  const h = harness(), encoder = h.createProductWebpEncoder();
  const detail = await encoder.encode(h.canvas, .92);
  const card = await encoder.encode(h.canvas, .86);
  assert.equal(h.calls.native, 1, 'Do not repeatedly encode full PNGs after discovering Safari’s limitation');
  assert.equal(h.calls.workers, 1);
  for (const blob of [detail, card]) {
    const metadata = await sharp(Buffer.from(await blob.arrayBuffer())).metadata();
    assert.equal(metadata.format, 'webp'); assert.equal(metadata.width, 64); assert.equal(metadata.height, 32); assert.equal(metadata.hasAlpha, true);
    const { data, info } = await sharp(Buffer.from(await blob.arrayBuffer())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(data[3], 0); assert.equal(data[(info.width * 2) * 4 + 3], 255);
  }
  encoder.close(); assert.equal(h.calls.terminated, 1);
});
test('null native results and mislabeled non-WebP bytes also use the real fallback', async () => {
  for (const options of [{ nullBlob: true }, { nativeType: 'image/webp', invalidNative: true }]) {
    const h = harness(options), encoder = h.createProductWebpEncoder();
    assert.equal((await sharp(Buffer.from(await (await encoder.encode(h.canvas, .89)).arrayBuffer())).metadata()).format, 'webp');
    encoder.close(); assert.equal(h.calls.terminated, 1);
  }
});
test('worker loading failures and invalid codec output fail safely and release resources', async () => {
  for (const options of [{ failWorker: true }, { badWorkerBytes: true }]) {
    const h = harness(options), encoder = h.createProductWebpEncoder();
    await assert.rejects(encoder.encode(h.canvas, .92), /converter|invalid photo/);
    encoder.close(); assert.equal(h.calls.terminated, 1);
  }
});
