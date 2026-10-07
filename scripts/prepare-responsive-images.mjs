import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

// Offline derivatives, not a paid runtime image proxy. Sources are public,
// owner-approved photographs already displayed on the homepage. No DB writes.
if (!process.argv[2]) throw new Error("Usage: node scripts/prepare-responsive-images.mjs /path/to/lighthouse.json");
const report = JSON.parse(await readFile(process.argv[2], "utf8"));
let previous = {};
try { previous = JSON.parse(await readFile("src/data/responsive-images.json", "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
const observed = report.audits["network-requests"].details.items
  .filter(item => item.resourceType === "Image" && item.url.startsWith("https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/")
    && /(?:-card|\w+-photo-[a-f0-9]+)\.webp$/.test(item.url))
  .map(item => item.url);
// Subsequent reports show our same-origin derivatives, not original URLs.
// Keep previously approved exact sources when adding newly observed uploads.
const sources = [...new Set([...Object.keys(previous).filter(src => src.startsWith("https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/")), ...observed])];
sources.push("/brand/kumaonrang-logo-v3.webp");
const notes = JSON.parse(await readFile("src/data/customer-note-assets.json", "utf8"));
sources.push(notes["phone-cover-photo"].src);
await mkdir("public/images/responsive", { recursive: true });
const manifest = {};
for (const src of sources) {
  const local = src.startsWith("/") ? `public${src}` : Object.values(notes).find(note => note.src === src)?.localSrc;
  const input = local ? await readFile(local.startsWith("public") ? local : `public${local}`)
    : execFileSync("curl", ["--fail", "--silent", "--show-error", "--max-time", "30", src], { maxBuffer: 10 * 1024 * 1024 });
  const original = await sharp(input).metadata();
  const variants = [];
  for (const width of [...new Set([128, 256, 384, 540, 640].map(width => Math.min(width, original.width)))]) {
    const output = await sharp(input).resize({ width, withoutEnlargement: true })
      .webp({ quality: src.startsWith("/brand/") ? 90 : 78, effort: 6 }).toBuffer();
    const metadata = await sharp(output).metadata();
    const hash = createHash("sha256").update(output).digest("hex").slice(0, 12);
    const filename = `${hash}-${width}.webp`;
    await writeFile(`public/images/responsive/${filename}`, output);
    const variant = { src: `/images/responsive/${filename}`, width: metadata.width, height: metadata.height, bytes: output.length };
    // Photographs get a smaller modern format; crisp brand lettering stays WebP.
    if (!src.startsWith("/brand/")) {
      const avif = await sharp(input).resize({ width, withoutEnlargement: true })
        .avif({ quality: 50, effort: 6 }).toBuffer();
      const avifHash = createHash("sha256").update(avif).digest("hex").slice(0, 12);
      variant.avifSrc = `/images/responsive/${avifHash}-${width}.avif`;
      variant.avifBytes = avif.length;
      await writeFile(`public${variant.avifSrc}`, avif);
    }
    variants.push(variant);
  }
  manifest[src] = variants;
  console.log(`${src.split("/").pop()}: ${input.length} bytes → ${variants.map(v => `${v.width}w:${v.bytes}`).join(", ")}`);
}
await writeFile("src/data/responsive-images.json", `${JSON.stringify(manifest, null, 2)}\n`);
