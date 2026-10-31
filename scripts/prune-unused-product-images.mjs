// Find storage images nothing uses, back them up, then delete only the backed-up copies.
// node scripts/prune-unused-product-images.mjs --prepare /absolute/backup/folder
// node scripts/prune-unused-product-images.mjs --apply /absolute/backup/folder/manifest.json
// An image counts as used when its path appears in any product row (every column, published or not)
// or in any source, data or script file; a "-card" variant counts as used when its main image is.
import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!projectUrl || !serviceKey) throw new Error("Supabase server credentials are required.");
const db = createClient(projectUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = "product-images";
// Skip very recent uploads: an admin may be mid-way through adding a product.
const recentMs = 2 * 24 * 60 * 60 * 1000;
const textFile = /\.(ts|tsx|js|mjs|json|css|md|sql|txt|html)$/;
const [mode, target] = process.argv.slice(2);

async function listAll(prefix = "") {
  const found = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.storage.from(bucket).list(prefix, { limit: 1000, offset });
    if (error) throw new Error(error.message);
    for (const entry of data) {
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) found.push({ name, size: entry.metadata?.size ?? 0, createdAt: entry.created_at });
      else found.push(...await listAll(name));
    }
    if (data.length < 1000) return found;
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const texts = await Promise.all(entries.map(entry => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" || entry.name.startsWith(".") ? "" : walk(full);
    return textFile.test(entry.name) ? fs.readFile(full, "utf8") : "";
  }));
  return texts.join("\n");
}

async function usedText() {
  const { data, error } = await db.from("products").select("*");
  if (error) throw new Error(error.message);
  const code = await Promise.all(["src", "app", "scripts", "supabase", "public"].map(walk));
  const rows = JSON.stringify(data);
  // Keep both spellings so percent-encoded URLs still match their storage names.
  return [rows, rows.replace(/%[0-9A-F]{2}/gi, match => { try { return decodeURIComponent(match); } catch { return match; } }), ...code].join("\n");
}

async function unused() {
  const [objects, haystack] = await Promise.all([listAll(), usedText()]);
  const now = Date.now();
  const isUsed = name => haystack.includes(name) || haystack.includes(name.replace(/-card\.webp$/, ".webp"));
  return objects.filter(object => !isUsed(object.name) && now - Date.parse(object.createdAt) > recentMs);
}

if (mode === "--prepare") {
  if (!target || !path.isAbsolute(target)) throw new Error("Pass an absolute backup folder.");
  const candidates = await unused();
  for (const [index, object] of candidates.entries()) {
    const { data, error } = await db.storage.from(bucket).download(object.name);
    if (error) throw new Error(`${object.name}: ${error.message}`);
    const bytes = Buffer.from(await data.arrayBuffer());
    const file = path.join(target, object.name);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, bytes);
    object.backedUpBytes = bytes.length;
    if ((index + 1) % 50 === 0) console.log(`Backed up ${index + 1}/${candidates.length}`);
  }
  const manifestPath = path.join(target, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify({ projectUrl, bucket, createdAt: new Date().toISOString(), objects: candidates }, null, 2));
  const total = candidates.reduce((sum, object) => sum + object.backedUpBytes, 0);
  console.log(`${candidates.length} unused images (${(total / 1048576).toFixed(1)} MB) backed up. Manifest: ${manifestPath}`);
} else if (mode === "--apply") {
  const manifest = JSON.parse(await fs.readFile(target, "utf8"));
  const stillUnused = new Set((await unused()).map(object => object.name));
  const folder = path.dirname(target);
  const safe = [];
  for (const object of manifest.objects) {
    const stat = await fs.stat(path.join(folder, object.name)).catch(() => null);
    if (stillUnused.has(object.name) && stat?.size === object.backedUpBytes && stat.size > 0) safe.push(object.name);
  }
  for (let index = 0; index < safe.length; index += 100) {
    const { error } = await db.storage.from(bucket).remove(safe.slice(index, index + 100));
    if (error) throw new Error(error.message);
  }
  console.log(`Deleted ${safe.length} of ${manifest.objects.length} listed images; the rest are in use again or lack a verified backup.`);
} else {
  throw new Error("Use --prepare <backup folder> or --apply <manifest.json>.");
}
