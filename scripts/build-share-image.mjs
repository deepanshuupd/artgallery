// Builds the default 1200 x 630 link-preview image from the brand logo.
// node scripts/build-share-image.mjs
import { readFileSync } from "node:fs";
import sharp from "sharp";

const width = 1200, height = 630, band = 34;
const border = readFileSync("public/illustrations/aipan-welcome-border.svg", "utf8")
  .replace(/width="64" height="24"/, `width="${(band / 24) * 64}" height="${band}"`);
const borderPng = await sharp(Buffer.from(border)).png().toBuffer();
const strip = await sharp({ create: { width, height: band, channels: 4, background: "#994831" } })
  .composite([{ input: borderPng, tile: true, top: 0, left: 0 }]).png().toBuffer();

const logo = await sharp("public/brand/kumaonrang-logo-v3.png").resize({ width: 760 }).png().toBuffer();
const { height: logoHeight } = await sharp(logo).metadata();

const caption = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="80">
  <text x="50%" y="52" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="#3a2a22">Aipan art and Pahadi gifts from Pithoragarh, Uttarakhand</text>
</svg>`);

const top = Math.round((height - logoHeight - 80) / 2) - 6;
await sharp({ create: { width, height, channels: 3, background: "#fbf4e8" } })
  .composite([
    { input: strip, top: 0, left: 0 },
    { input: strip, top: height - band, left: 0 },
    { input: logo, top, left: Math.round((width - 760) / 2) },
    { input: caption, top: top + logoHeight + 4, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("public/brand/kumaonrang-share-1200x630.png");
console.log("wrote public/brand/kumaonrang-share-1200x630.png");
