import assert from "node:assert/strict";
import sharp from "sharp";

// Read-only HTTP checks of actual generated metadata, including the sharing UA.
const base = process.argv[2];
if (!base) throw new Error("Usage: node scripts/check-home-link-preview.mjs http://localhost:PORT");
const preview = "https://www.kumaonrang.com/brand/kumaonrang-favicon-source.png";
const headers = { "user-agent": "WhatsApp/2.23.20.0" };
const home = await fetch(new URL("/", base), { headers });
assert.equal(home.status, 200);
const html = await home.text();
const meta = (page, key) => [...page.matchAll(/<meta\b[^>]*>/g)]
  .filter(([tag]) => tag.includes(`property="${key}"`) || tag.includes(`name="${key}"`))
  .map(([tag]) => tag.match(/content="([^"]*)"/)?.[1]);
assert.deepEqual(meta(html, "og:image"), [preview]);
assert.deepEqual(meta(html, "og:image:width"), ["512"]);
assert.deepEqual(meta(html, "og:image:height"), ["512"]);
assert.deepEqual(meta(html, "og:image:type"), ["image/png"]);
assert.deepEqual(meta(html, "twitter:image"), [preview]);
assert.deepEqual(meta(html, "twitter:card"), ["summary"]);
assert.match(html, /rel="icon"[^>]*href="\/icon\.svg/);

const image = await fetch(new URL("/brand/kumaonrang-favicon-source.png", base), { headers });
assert.equal(image.status, 200);
assert.match(image.headers.get("content-type"), /image\/png/);
const bytes = Buffer.from(await image.arrayBuffer());
const details = await sharp(bytes).metadata();
assert.equal(details.width, 512);
assert.equal(details.height, 512);
assert.ok(bytes.length < 300000, "Preview must remain small enough for sharing clients");

const product = await fetch(new URL("/aipan-frames/golu-devta-aipan-frame", base), { headers });
assert.equal(product.status, 200);
const productImages = meta(await product.text(), "og:image");
assert.ok(productImages.length > 0);
assert.ok(productImages.every(src => src !== preview), "Product previews must keep their product photos");
console.log("PASS: homepage shares the 512px brand icon; favicon and product previews remain intact.");
