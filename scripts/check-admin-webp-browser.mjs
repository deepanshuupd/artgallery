import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';

// Reproducible browser harness; it serves on loopback only, outside Next routes.
// Uses the installed webpack, not a new runtime/test dependency or auth bypass.
const require = createRequire(import.meta.url);
const bundled = require('next/dist/compiled/webpack/webpack'); bundled.init();
const root = process.cwd(), output = await mkdtemp(path.join(tmpdir(), 'kumaon-webp-browser-'));
await mkdir(path.join(output, 'results'));
const source = path.join(root, 'public/images/aipan/red-white-aipan-artwork.webp');
const fixtures = new Map([
  ['phone-photo.jpg', await sharp(source).resize({ width: 4000 }).withMetadata({ orientation: 6 }).jpeg({ quality: 95 }).toBuffer()],
  ['transparent.png', await sharp({ create: { width: 700, height: 500, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: Buffer.from('<svg width="700" height="500"><circle cx="350" cy="250" r="180" fill="#a84530"/></svg>') }]).png().toBuffer()],
  ['existing.webp', await readFile(source)],
]);
if (process.argv[3] && existsSync(process.argv[3])) fixtures.set('iphone.heic', await readFile(process.argv[3]));
const compiler = bundled.webpack({ mode: 'development', devtool: false, target: 'web',
  entry: path.join(root, 'scripts/fixtures/webp-browser.ts'),
  output: { path: output, filename: 'harness.js', publicPath: '/' },
  resolve: { extensions: ['.ts', '.js'] },
  module: { rules: [{ test: /\.ts$/, loader: path.join(root, 'scripts/fixtures/typescript-browser-loader.cjs') }, { test: /\.wasm$/, type: 'asset/resource' }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => {
  compiler.close(() => {});
  if (error || stats.hasErrors()) reject(error || new Error(stats.toString({ all: false, errors: true })));
  else resolve();
}));
const mime = name => ({ '.js': 'text/javascript', '.wasm': 'application/wasm', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.heic': 'image/heic' })[path.extname(name)] || 'application/octet-stream';
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (request.method === 'GET' && url.pathname === '/') { response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin WebP verification</title><style>body{font:16px system-ui;margin:24px;max-width:1000px;background:#fffaf1;color:#332821}button{padding:12px;margin:8px 0}pre{white-space:pre-wrap;font-size:12px}input{margin:12px 0}</style><div id="app"></div><script src="/harness.js"></script>'); return; }
    if (request.method === 'GET' && url.pathname === '/fixtures') { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify([...fixtures.keys()])); return; }
    if (request.method === 'GET' && url.pathname.startsWith('/fixture/')) {
      const name = path.basename(url.pathname), bytes = fixtures.get(name);
      if (!bytes) { response.writeHead(404); response.end(); return; }
      response.setHeader('Content-Type', mime(name)); response.end(bytes); return;
    }
    if (request.method === 'POST' && url.pathname === '/result') {
      const chunks = []; let length = 0;
      for await (const chunk of request) { length += chunk.length; if (length > 10 * 1024 * 1024) throw new Error('Test result too large'); chunks.push(chunk); }
      const bytes = Buffer.concat(chunks), metadata = await sharp(bytes).metadata();
      if (metadata.format !== 'webp') throw new Error('Output is not WebP');
      const name = (url.searchParams.get('name') || 'result.webp').replace(/[^a-z0-9._-]/gi, '-');
      await writeFile(path.join(output, 'results', name), bytes);
      response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify({ format: metadata.format, width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha })); return;
    }
    if (request.method !== 'GET') { response.writeHead(405); response.end(); return; }
    const name = path.basename(url.pathname);
    const bytes = await readFile(path.join(output, name));
    response.setHeader('Content-Type', mime(name)); response.end(bytes);
  } catch (error) { response.writeHead(400); response.end(error.message); }
});
server.listen(Number(process.argv[2] || 3034), '127.0.0.1', () => console.log(JSON.stringify({ url: `http://127.0.0.1:${server.address().port}`, output, fixtures: [...fixtures.keys()] })));
