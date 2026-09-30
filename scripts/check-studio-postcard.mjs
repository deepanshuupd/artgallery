import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file, stubs = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const module = { exports: {} };
  const localRequire = name => {
    if (name in stubs) return stubs[name];
    if (name.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    return require(name);
  };
  runInNewContext(`(function(require, module, exports) { ${outputText}\n })`)(localRequire, module, module.exports);
  return module.exports;
}
const { StudioPostcard } = load('src/components/about/studio-postcard.tsx', {
  '@/components/home/craft-ornament': load('src/components/home/craft-ornament.tsx'),
  '@/components/icons': load('src/components/icons.tsx'),
});
const html = renderToStaticMarkup(React.createElement(StudioPostcard));
assert.match(html, /<dialog\b[^>]*id="studio-note"/);
assert.ok(!/<dialog[^>]*\bopen\b/.test(html), 'Envelope starts closed');
assert.match(html, /aria-haspopup="dialog" aria-expanded="false" aria-controls="studio-note"/);
assert.match(html, /aria-labelledby="studio-note-title"/);
assert.match(html, /aria-label="Close studio note"/);
assert.match(html, /Open Sneha’s studio note/);
assert.match(html, /href="https:\/\/www.instagram.com\/art_gallery_05s\/"/);
assert.match(html, /target="_blank" rel="noopener noreferrer"/);
assert.match(html, /opens in a new tab/);
assert.ok(!/<iframe|<script|<img/.test(html), 'No embed, script or image request');
const css = readFileSync(new URL('../src/components/about/studio-postcard.module.css', import.meta.url), 'utf8');
assert.match(css, /@keyframes paper-peek/);
assert.match(css, /@keyframes unseal/);
assert.match(css, /@keyframes lift-letter/);
assert.match(css, /data-paused="true"/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /focus-visible/);
assert.match(css, /animation: paper-peek 8s ease-in-out infinite/, 'Automatic eight-second cycle');
assert.match(css, /0%, 35%, 100%/, '2.8-second motion with a 5.2-second rest');
assert.match(css, /right: -38px; top: calc\(66px \+ env\(safe-area-inset-top/, 'Upper-right mobile position');
assert.match(css, /border-bottom: 3px solid #9d5945/, 'Contrasting terracotta paper edge');
assert.match(css, /background: #fff7eb/, 'Soft ivory paper instead of dark yellow');
assert.match(css, /unseal 1.1s/, 'Slower envelope flap');
assert.match(css, /lift-letter 1.3s .7s/, 'Letter waits for the flap, then lifts gently');
const source = readFileSync(new URL('../src/components/about/studio-postcard.tsx', import.meta.url), 'utf8');
assert.ok(!/setInterval|setTimeout|requestAnimationFrame|addEventListener\("scroll"/.test(source), 'No animation timer or scroll listener');
const { SiteHeader } = load('src/components/layout/site-header.tsx', {
  'next/link': { __esModule: true, default: ({ children, prefetch, ...props }) => React.createElement('a', props, children) },
  'next/navigation': { usePathname: () => '/' },
  '@/components/icons': load('src/components/icons.tsx'),
  '@/lib/navigation': { navigationItems: [{ label: 'Home', href: '/' }] },
  '@/components/layout/brand-mark': { BrandMark: () => React.createElement('span', null, 'KumaonRang') },
  '@/components/about/studio-postcard': { StudioPostcard },
});
const home = renderToStaticMarkup(React.createElement(SiteHeader));
assert.match(home, /<\/header><div[^>]*class="rail"/, 'Fixed postcard is outside the sticky header');
assert.equal((home.match(/id="studio-note"/g) || []).length, 1, 'One postcard on the homepage');
const headerSource = readFileSync(new URL('../src/components/layout/site-header.tsx', import.meta.url), 'utf8');
assert.match(headerSource, /\(pathname === "\/" \|\| pathname === "\/about"\) && !isOpen/, 'Shown on Home and Our Story; hidden while mobile menu is open');
assert.match(headerSource, /<StudioPostcard key=\{pathname\}/, 'Route changes reset the dialog and restore scrolling');
const aboutSource = readFileSync(new URL('../src/app/about/page.tsx', import.meta.url), 'utf8');
assert.ok(!aboutSource.includes('StudioPostcard'), 'About uses the shared postcard without duplication');
console.log('Studio postcard: accessible native dialog, Home/Our Story placement, eight-second CSS loop with longer rest, slower opening, upper-right mobile position, contrast, menu clearance and reduced-motion checks passed.');
