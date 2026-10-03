// Prepare first, then apply the reviewed manifest. Originals are never deleted.
// node scripts/optimize-product-images.mjs --prepare
// node scripts/optimize-product-images.mjs --apply /absolute/path/manifest.json
// node scripts/optimize-product-images.mjs --rollback /absolute/path/manifest.json
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

nextEnv.loadEnvConfig(process.cwd());
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!projectUrl || !serviceKey) throw new Error("Supabase server credentials are required.");
const db = createClient(projectUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const bucket = "product-images";
const storagePrefix = `${projectUrl}/storage/v1/object/public/${bucket}/`;
const [mode, manifestArgument] = process.argv.slice(2);
const save = (filename, value) => fs.writeFile(filename, JSON.stringify(value, null, 2));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
async function compress(source, dimension, maxBytes) {
  for (let attempt = 0; attempt < 5; attempt++) {
    for (const quality of [82, 75, 68]) {
      const result = await sharp(source).rotate()
        .resize({ width: dimension, height: dimension, fit: "inside", withoutEnlargement: true })
        .webp({ quality, effort: 5 }).toBuffer({ resolveWithObject: true });
      if (result.data.length <= maxBytes) return result;
    }
    dimension = Math.round(dimension * 0.8);
  }
  throw new Error("Could not meet the image byte budget");
}
const imageFields = (row) => ({ image_url: row.image_url, image_urls: row.image_urls });

async function products() {
  const { data, error } = await db.from("products").select("id,name,image_url,image_urls");
  if (error) throw new Error(error.message);
  return data;
}

if (mode === "--prepare") {
  const directory = await fs.mkdtemp("/private/tmp/kumaonrang-images-");
  const manifestPath = path.join(directory, "manifest.json");
  const rows = await products();
  const urls = [...new Set(rows.flatMap(row => [row.image_url, ...(row.image_urls ?? [])]).filter(Boolean))];
  const manifest = {
    projectUrl, createdAt: new Date().toISOString(), maxDimension: 1600, quality: 82, variantVersion: 2,
    products: rows.map(row => ({ id: row.id, name: row.name, original: imageFields(row) })),
    images: [],
  };
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      const url = urls[index];
      try {
        if (!url.startsWith(storagePrefix)) throw new Error("Outside the scoped product-images bucket");
        if (/\/optimized\/v2\/.+\.webp$/i.test(url)) {
          manifest.images.push({ originalUrl: url, status: "already-optimized" });
          continue;
        }
        const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
        if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
        const original = Buffer.from(await response.arrayBuffer());
        const metadata = await sharp(original).metadata();
        if ((metadata.pages ?? 1) > 1) throw new Error("Animated image left unchanged");
        const { data: converted, info } = await compress(original, 1600, 350 * 1024);
        const { data: card } = await compress(original, 800, 100 * 1024);
        const digest = createHash("sha256").update(converted).update(card).digest("hex");
        const objectPath = `optimized/v2/${digest}.webp`;
        const cardObjectPath = `optimized/v2/${digest}-card.webp`;
        const cardLocalPath = path.join(directory, `${digest}-card.webp`);
        await fs.writeFile(cardLocalPath, card);
        const localPath = path.join(directory, `${digest}.webp`);
        await fs.writeFile(localPath, converted);
        // A handful of originals allow side-by-side visual quality review.
        if (index < 3 || url.includes("1789135609898")) {
          await fs.writeFile(path.join(directory, `original-${index}.${metadata.format}`), original);
        }
        manifest.images.push({
          originalUrl: url, optimizedUrl: `${storagePrefix}${objectPath}`, objectPath, localPath,
          cardObjectPath, cardLocalPath, cardBytes: card.length,
          originalBytes: original.length, optimizedBytes: converted.length,
          originalWidth: metadata.width, originalHeight: metadata.height,
          width: info.width, height: info.height, status: "prepared",
        });
      } catch (error) {
        manifest.images.push({ originalUrl: url, status: "skipped", reason: error.message });
      }
      console.log(`Prepared ${index + 1}/${urls.length}`);
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  const replacements = new Map(manifest.images.filter(i => i.status === "prepared").map(i => [i.originalUrl, i.optimizedUrl]));
  for (const row of manifest.products) {
    row.optimized = {
      image_url: replacements.get(row.original.image_url) ?? row.original.image_url,
      image_urls: row.original.image_urls?.map(url => replacements.get(url) ?? url) ?? row.original.image_urls,
    };
  }
  await save(manifestPath, manifest);
  const prepared = manifest.images.filter(i => i.status === "prepared");
  const originalBytes = prepared.reduce((sum, i) => sum + i.originalBytes, 0);
  const optimizedBytes = prepared.reduce((sum, i) => sum + i.optimizedBytes + i.cardBytes, 0);
  console.log(JSON.stringify({ manifestPath, products: rows.length, images: urls.length, converted: prepared.length,
    originalBytes, optimizedBytes, reductionPercent: Math.round((1 - optimizedBytes / originalBytes) * 100),
    skipped: manifest.images.filter(i => i.status === "skipped"), samples: prepared.slice(0, 3),
  }, null, 2));
} else if (mode === "--apply" || mode === "--rollback") {
  if (!manifestArgument || !path.isAbsolute(manifestArgument)) throw new Error("An absolute manifest path is required.");
  const manifest = JSON.parse(await fs.readFile(manifestArgument, "utf8"));
  if (manifest.projectUrl !== projectUrl) throw new Error("Manifest belongs to another Supabase project.");
  if (mode === "--apply") {
    for (const item of manifest.images.filter(i => i.status === "prepared")) {
      const buffer = await fs.readFile(item.localPath);
      const cardBuffer = item.cardLocalPath ? await fs.readFile(item.cardLocalPath) : null;
      const hash = createHash("sha256").update(buffer);
      if (cardBuffer) hash.update(cardBuffer);
      const digest = hash.digest("hex");
      const version = cardBuffer ? "v2" : "v1";
      if (item.objectPath !== `optimized/${version}/${digest}.webp` ||
          (cardBuffer && item.cardObjectPath !== `optimized/v2/${digest}-card.webp`)) {
        throw new Error("Converted images failed their integrity check.");
      }
      const uploads = cardBuffer
        ? [{ objectPath: item.cardObjectPath, buffer: cardBuffer }, { objectPath: item.objectPath, buffer }]
        : [{ objectPath: item.objectPath, buffer }];
      for (const upload of uploads) {
        const { error } = await db.storage.from(bucket).upload(upload.objectPath, upload.buffer, {
          contentType: "image/webp", cacheControl: "31536000", upsert: false,
          headers: { "x-robots-tag": "all" },
        });
        if (error && String(error.statusCode) !== "409" && !/already exists|duplicate/i.test(error.message)) {
          throw new Error(`Upload failed: ${error.message}`);
        }
        const response = await fetch(`${storagePrefix}${upload.objectPath}`, { method: "HEAD", signal: AbortSignal.timeout(30000) });
        if (!response.ok || !response.headers.get("content-type")?.includes("image/webp")) {
          throw new Error("Uploaded image is not publicly readable as WebP; product URLs remain unchanged.");
        }
        if (response.headers.get("x-robots-tag")?.toLowerCase().trim() !== "all") {
          throw new Error("Image indexing is blocked by Storage; product URLs remain unchanged. Use the image-indexing migration for previously uploaded files.");
        }
      }
      item.status = "uploaded";
      await save(manifestArgument, manifest);
    }
  }
  let changed = 0;
  for (const row of manifest.products) {
    if (same(row.original, row.optimized)) continue;
    const expected = mode === "--apply" ? row.original : row.optimized;
    const target = mode === "--apply" ? row.optimized : row.original;
    const { data: current, error: readError } = await db.from("products").select("image_url,image_urls").eq("id", row.id).single();
    if (readError) throw new Error(readError.message);
    if (same(imageFields(current), target)) continue;
    if (!same(imageFields(current), expected)) throw new Error(`Product ${row.name} was edited after preparation; stopping to preserve those edits.`);
    let query = db.from("products").update(target).eq("id", row.id);
    query = expected.image_url == null ? query.is("image_url", null) : query.eq("image_url", expected.image_url);
    const { data: updated, error } = await query.select("image_url,image_urls").single();
    if (error || !same(imageFields(updated), target)) throw new Error(`Could not verify product update: ${error?.message ?? row.name}`);
    row.status = mode === "--apply" ? "applied" : "rolled-back";
    await save(manifestArgument, manifest);
    changed++;
  }
  console.log(JSON.stringify({ mode, changed, manifestPath: manifestArgument, originalsRetained: true }, null, 2));
} else {
  throw new Error("Choose --prepare, --apply <manifest>, or --rollback <manifest>.");
}
