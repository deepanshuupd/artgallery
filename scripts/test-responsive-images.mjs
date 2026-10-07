import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsx from "react/jsx-runtime";

const manifest = JSON.parse(readFileSync("src/data/responsive-images.json", "utf8"));
function load(file, require) {
  const exports = {};
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  runInNewContext(compiled.outputText, { exports, require });
  return exports;
}
const helper = load("src/lib/responsive-image.ts", () => manifest);
const { ResponsiveImage } = load("src/components/responsive-image.tsx", name =>
  name === "react/jsx-runtime" ? jsx : helper);

test("all width candidates are real, hash-addressed WebPs with correct dimensions", async () => {
  assert.ok(Object.keys(manifest).length >= 10);
  for (const variants of Object.values(manifest)) {
    assert.equal(new Set(variants.map(v => v.width)).size, variants.length);
    for (const variant of variants) {
      const bytes = readFileSync(`public${variant.src}`);
      assert.equal(bytes.length, variant.bytes);
      const meta = await sharp(bytes).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, variant.width);
      assert.equal(meta.height, variant.height);
      assert.ok(variant.src.includes(createHash("sha256").update(bytes).digest("hex").slice(0, 12)));
      if (variant.avifSrc) {
        const avif = readFileSync(`public${variant.avifSrc}`);
        const avifMeta = await sharp(avif).metadata();
        assert.equal(avif.length, variant.avifBytes);
        assert.equal(avifMeta.format, "heif");
        assert.equal(avifMeta.compression, "av1");
        assert.equal(avifMeta.width, variant.width);
        assert.equal(avifMeta.height, variant.height);
        assert.ok(variant.avifSrc.includes(createHash("sha256").update(avif).digest("hex").slice(0, 12)));
      }
    }
  }
});

test("known photos have genuine width descriptors; unknown uploads keep their source", () => {
  const known = Object.keys(manifest)[0];
  assert.ok(helper.responsiveImage(known).srcSet.includes("128w"));
  const unknown = "https://example.com/new-admin-upload.webp";
  assert.equal(helper.responsiveImage(unknown).src, unknown);
  assert.equal(helper.responsiveImage(unknown).srcSet, undefined);
});

test("hero candidates are discoverable and eagerly loaded in server HTML", () => {
  const src = Object.keys(manifest).find(src => src.includes("golu-devta"));
  const html = renderToStaticMarkup(jsx.jsx(ResponsiveImage, {
    src, alt: "Golu Devta Aipan Frame", priority: true, fill: true, sizes: "298px",
  }));
  assert.match(html, /srcSet="[^"]*384w/);
  assert.match(html, /loading="eager"/);
  assert.match(html, /fetchPriority="high"/);
  assert.match(html, /alt="Golu Devta Aipan Frame"/);
  assert.match(html, /position:absolute/);
  assert.match(html, /<picture/);
  assert.match(html, /<source type="image\/avif"/);
  assert.equal((html.match(/rel="preload"/g) ?? []).length, 1);
  assert.match(html, /as="image" type="image\/avif"/);
  assert.ok(!html.includes("/_next/image"));
});

test("mobile hero uses a smaller AVIF with a WebP fallback", () => {
  const hero = Object.entries(manifest).find(([src]) => src.includes("golu-devta"))[1];
  assert.ok(hero.find(v => v.width === 540).avifBytes < 50000);
  assert.ok(hero.every(v => v.src.endsWith(".webp") && v.avifSrc.endsWith(".avif")));
});

test("below-fold photos remain lazy and preserve intrinsic aspect ratio", () => {
  const html = renderToStaticMarkup(jsx.jsx(ResponsiveImage, {
    src: "/brand/kumaonrang-logo-v3.webp", alt: "", sizes: "120px", width: 512, height: 248,
  }));
  assert.match(html, /loading="lazy"/);
  assert.match(html, /width="512"/);
  assert.match(html, /height="248"/);
});

test("small review photos and logo variants materially reduce transfer size", () => {
  for (const [src, variants] of Object.entries(manifest)) {
    if (!src.includes("-photo-") && !src.startsWith("/brand/")) continue;
    const mobile = variants.find(v => v.width === 256);
    const full = variants.at(-1);
    assert.ok(mobile.bytes < full.bytes * 0.6, src);
  }
});
