// Exact, user-authorized pixel crops. No generated/reconstructed customer messages.
// Prepare locally, visually inspect every output, then explicitly --publish.
// Originals remain in Downloads; only these privacy-safe derivatives are uploaded.
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = path.resolve("public/customer-notes");
const manifestPath = path.resolve("src/data/customer-note-assets.json");
const bucket = "product-images";
const prefix = "customer-notes/v1";
const sourceDirectory = "/Users/deepanshuupadhyaya/Downloads";
const crops = [
  { id: "kanishak-message", file: "WhatsApp Image 2026-10-03 at 12.23.29.jpeg", left: 32, top: 445, width: 478, height: 814, kind: "message" },
  { id: "kanishak-photo", file: "WhatsApp Image 2026-10-03 at 12.23.29.jpeg", left: 44, top: 462, width: 448, height: 620, kind: "photo" },
  { id: "sargam-message", file: "WhatsApp Image 2026-10-03 at 12.23.30.jpeg", left: 26, top: 967, width: 588, height: 333, kind: "message" },
  { id: "ankita-message", file: "WhatsApp Image 2026-10-03 at 12.20.41.jpeg", left: 32, top: 333, width: 473, height: 1030, kind: "message" },
  { id: "ankita-photo", file: "WhatsApp Image 2026-10-03 at 12.20.41.jpeg", left: 44, top: 386, width: 448, height: 631, kind: "photo" },
  { id: "tamanna-message", file: "WhatsApp Image 2026-10-03 at 12.20.40.jpeg", left: 29, top: 948, width: 390, height: 81, kind: "message" },
  { id: "dinesh-message", file: "WhatsApp Image 2026-10-03 at 12.23.30 (1).jpeg", left: 26, top: 1365, width: 427, height: 74, kind: "message" },
  { id: "family-frame-message", file: "WhatsApp Image 2026-10-03 at 12.32.37.jpeg", left: 122, top: 995, width: 420, height: 260, kind: "message" },
  { id: "parcel-message", file: "WhatsApp Image 2026-10-03 at 12.32.38 (2).jpeg", left: 47, top: 350, width: 626, height: 165, kind: "message" },
  { id: "phone-cover-message", file: "WhatsApp Image 2026-10-03 at 12.32.38 (1).jpeg", left: 72, top: 612, width: 505, height: 771, kind: "message" },
  { id: "phone-cover-photo", file: "WhatsApp Image 2026-10-03 at 12.32.38 (1).jpeg", left: 81, top: 624, width: 449, height: 586, kind: "photo" },
  // The nameplate photo contains a house identifier: retain only the message.
  { id: "nameplate-message", file: "WhatsApp Image 2026-10-03 at 12.32.39.jpeg", left: 27, top: 1125, width: 545, height: 354, kind: "message" },
];

if (process.argv.includes("--publish")) {
  const { default: nextEnv } = await import("@next/env");
  const { createClient } = await import("@supabase/supabase-js");
  nextEnv.loadEnvConfig(process.cwd());
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (projectUrl !== "https://psqdrmdyucsyiuugvitd.supabase.co" || !key) {
    throw new Error("Expected KumaonRang project and server-only storage credentials.");
  }
  const db = createClient(projectUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: settings, error: bucketError } = await db.storage.getBucket(bucket);
  if (bucketError) throw new Error(bucketError.message);
  if (!settings.public) throw new Error("Expected the existing public catalogue bucket; no access policies were changed.");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  for (const asset of Object.values(manifest)) {
    if (!/^\/customer-notes\/[a-z-]+-[a-f0-9]{12}\.webp$/.test(asset.localSrc)) throw new Error("Unexpected asset path.");
    const buffer = await fs.readFile(path.join(outputDirectory, path.basename(asset.localSrc)));
    const digest = createHash("sha256").update(buffer).digest("hex").slice(0, 12);
    if (!asset.localSrc.endsWith(`-${digest}.webp`)) throw new Error("Asset changed since preparation.");
    const objectPath = `${prefix}/${path.basename(asset.localSrc)}`;
    const publicUrl = `${projectUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
    const existing = await fetch(publicUrl, { method: "HEAD", signal: AbortSignal.timeout(15000) });
    if (!existing.ok) {
      if (existing.status !== 400 && existing.status !== 404) throw new Error(`Storage preflight failed: ${existing.status}`);
      const { error } = await db.storage.from(bucket).upload(objectPath, buffer, {
        contentType: "image/webp", cacheControl: "3600", upsert: false,
      });
      if (error) throw new Error(error.message);
    }
    const response = await fetch(publicUrl, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Public verification failed: ${response.status}`);
    const actual = Buffer.from(await response.arrayBuffer());
    if (!actual.equals(buffer)) throw new Error("Uploaded asset does not match the inspected derivative.");
    asset.src = publicUrl;
    console.log(`Verified ${path.basename(asset.localSrc)} (${buffer.length} bytes)`);
  }
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
} else {
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  const previous = JSON.parse(await fs.readFile(manifestPath, "utf8").catch(() => "{}"));
  const manifest = {};
  for (const { id, file, kind, ...rect } of crops) {
    const image = sharp(path.join(sourceDirectory, file)).extract(rect);
    // Lossless message crops preserve the exact pixels and omit all source metadata.
    const { data, info } = await image.webp(kind === "message" ? { lossless: true, effort: 5 } : { quality: 84, effort: 5 }).toBuffer({ resolveWithObject: true });
    const digest = createHash("sha256").update(data).digest("hex").slice(0, 12);
    const filename = `${id}-${digest}.webp`;
    await fs.writeFile(path.join(outputDirectory, filename), data);
    const localSrc = `/customer-notes/${filename}`;
    manifest[id] = { src: previous[id]?.localSrc === localSrc ? previous[id].src : localSrc, localSrc, width: info.width, height: info.height, bytes: data.length };
    console.log(`${id}: ${info.width}×${info.height}, ${data.length} bytes`);
  }
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
