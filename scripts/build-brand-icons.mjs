import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Run from the repository root after updating public/brand/kumaonrang-logo.png.
// Preserve the supplied artwork without relying on installed browser fonts.
const source = await readFile("public/brand/kumaonrang-logo.png");
const { width, height } = await sharp(source).metadata();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="64" fill="#fffaf1"/><image x="8" y="${(512 - 496 * height / width) / 2}" width="496" height="${496 * height / width}" href="data:image/png;base64,${source.toString("base64")}"/></svg>\n`;
await writeFile("app/icon.svg", svg);
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("app/apple-icon.png");

const sizes = [16, 32, 48, 64, 256];
const images = await Promise.all(sizes.map(size =>
  sharp(Buffer.from(svg)).resize(size, size).png().toBuffer(),
));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index] % 256;
  header[entry + 1] = sizes[index] % 256;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile("app/favicon.ico", Buffer.concat([header, ...images]));
