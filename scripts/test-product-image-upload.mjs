import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Test encoded dimensions with a controlled canvas, not real uploads.
const module = { exports: {} };
const { outputText } = ts.transpileModule(readFileSync('src/lib/product-image-upload.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const canvases = [];
let closed = 0;
const document = { createElement: tag => {
  assert.equal(tag, 'canvas');
  const canvas = { width: 0, height: 0, calls: 0,
    getContext: () => ({ drawImage() {} }),
    toBlob(callback, mime, quality) {
      assert.equal(mime, 'image/webp'); assert.ok(quality >= 0.86);
      // Every result exceeds its soft byte budget. The first, full-sized result
      // wins, even though a smaller canvas is tried later and finally cleared.
      const bytes = (canvases.indexOf(canvas) === 0 ? 600000 : 180000) + canvas.calls++ * 20000;
      callback(new Blob([new Uint8Array(bytes)], { type: mime }));
    } };
  canvases.push(canvas); return canvas;
} };
new Function('require', 'module', 'exports', 'document', 'createImageBitmap', outputText)(
  () => { throw new Error('Native decode succeeds; HEIC must not be loaded'); }, module, module.exports, document,
  async () => ({ width: 4000, height: 3000, close() { closed++; } }),
);
const result = await module.exports.prepareProductImages(new File(['source'], 'artwork.jpg', { type: 'image/jpeg' }));
assert.equal(result.width, 1920); assert.equal(result.height, 1440);
assert.equal(result.cardWidth, 960); assert.equal(result.cardHeight, 720);
assert.equal(result.detail.size, 600000); assert.equal(result.card.size, 180000);
assert.equal(result.detail.type, 'image/webp'); assert.equal(result.card.type, 'image/webp');
assert.equal(closed, 1);
for (const canvas of canvases) { assert.equal(canvas.width, 1); assert.equal(canvas.height, 1); }
console.log('PASS chosen WebP bytes retain their own dimensions, quality floor, aspect ratio and cleanup; soft budgets do not reject detailed artwork. No uploads.');
