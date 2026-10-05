import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import sharp from "sharp";

// Read-only checks. Originals are optional and never required by CI or the app.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => readFileSync(path.join(root, relative), "utf8");
const assets = JSON.parse(read("src/data/customer-note-assets.json"));
const notesModule = { exports: {} };
const compiled = ts.transpileModule(read("src/data/customer-notes.ts"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
new Function("require", "module", "exports", compiled.outputText)(name => {
  assert.equal(name, "./customer-note-assets.json");
  return assets;
}, notesModule, notesModule.exports);
const notes = notesModule.exports.customerNotes;

test("genuine notes preserve wording, private names and source distinctions", () => {
  assert.deepEqual(notes.slice(0, 5).map(note => note.author), ["Kanishak", "Sargam", "Ankita", "Tamanna", "Dinesh"]);
  assert.equal(notes.length, 9, "The repeated Sargam screenshot must not become an extra testimonial");
  assert.ok(notes.slice(5).every(note => note.author === "A customer"));
  assert.equal(notes.find(note => note.id === "nameplate").photo, undefined, "Do not publish the house identifier in the photo");
  assert.equal(notes[0].messages[0], "Recieved 💗\nBest quality and finishing\nreally like thattt😭");
  assert.deepEqual(notes[1].messages, [
    "Mujhe parcel receive hogya hai and i really like it ✨",
    "I'm so happy with your art. I truly loved it, and I really like your work. It’s absolutely beautiful! ✨",
  ]);
  assert.deepEqual(notes[2].messages, ["Bhut accha hai", "Bhot acha lga unhe", "Thank u so much 😊🙏"]);
  assert.equal(notes[2].attribution, "Shared by Ankita");
  assert.equal(notes[2].sourceLabel, "Includes forwarded feedback");
  assert.equal(notes[3].messages[0], "Bht pyare h...🫶❤️");
  assert.equal(notes[4].messages[0], "Looks good");
  assert.equal(notes[3].sourceLabel, "Keychain design feedback");
  assert.equal(notes[4].sourceLabel, "Keychain design feedback");
  assert.equal(notes[3].date, undefined);
  assert.equal(notes[4].date, undefined);
  for (const note of notes) {
    assert.ok(note.messages.join("\n").includes(note.excerpt), "Excerpts must be verbatim portions of the received messages");
    assert.ok(note.shop.href.startsWith("/"));
    assert.ok(!("rating" in note));
  }
});

test("only twelve sanitized, metadata-free WebPs are public and hash-addressed", async () => {
  assert.equal(Object.keys(assets).length, 12);
  assert.equal(readdirSync(path.join(root, "public/customer-notes")).length, 12);
  for (const [id, asset] of Object.entries(assets)) {
    assert.match(asset.localSrc, /^\/customer-notes\/[a-z-]+-[a-f0-9]{12}\.webp$/);
    assert.equal(asset.src, `https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/customer-notes/v1/${path.basename(asset.localSrc)}`);
    const bytes = readFileSync(path.join(root, "public", asset.localSrc));
    const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    assert.ok(asset.localSrc.endsWith(`-${digest}.webp`));
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(bytes.length, asset.bytes);
    if (id.endsWith("-photo")) assert.ok(bytes.length < 60000, "Page photographs stay small");
  }
});

const originals = "/Users/deepanshuupadhyaya/Downloads";
const crops = [
  { id: "kanishak-message", file: "WhatsApp Image 2026-10-03 at 12.23.29.jpeg", left: 32, top: 445, width: 478, height: 814 },
  { id: "sargam-message", file: "WhatsApp Image 2026-10-03 at 12.23.30.jpeg", left: 26, top: 967, width: 588, height: 333 },
  { id: "ankita-message", file: "WhatsApp Image 2026-10-03 at 12.20.41.jpeg", left: 32, top: 333, width: 473, height: 1030 },
  { id: "tamanna-message", file: "WhatsApp Image 2026-10-03 at 12.20.40.jpeg", left: 29, top: 948, width: 390, height: 81 },
  { id: "dinesh-message", file: "WhatsApp Image 2026-10-03 at 12.23.30 (1).jpeg", left: 26, top: 1365, width: 427, height: 74 },
  { id: "family-frame-message", file: "WhatsApp Image 2026-10-03 at 12.32.37.jpeg", left: 122, top: 995, width: 420, height: 260 },
  { id: "parcel-message", file: "WhatsApp Image 2026-10-03 at 12.32.38 (2).jpeg", left: 47, top: 350, width: 626, height: 165 },
  { id: "phone-cover-message", file: "WhatsApp Image 2026-10-03 at 12.32.38 (1).jpeg", left: 72, top: 612, width: 505, height: 771 },
  { id: "nameplate-message", file: "WhatsApp Image 2026-10-03 at 12.32.39.jpeg", left: 27, top: 1125, width: 545, height: 354 },
];

test("message evidence is pixel-identical to the authorized original crops", {
  skip: !crops.every(crop => existsSync(path.join(originals, crop.file))),
}, async () => {
  for (const { id, file, ...rect } of crops) {
    const originalPixels = await sharp(path.join(originals, file)).extract(rect).removeAlpha().raw().toBuffer();
    const publicPixels = await sharp(path.join(root, "public", assets[id].localSrc)).removeAlpha().raw().toBuffer();
    assert.ok(originalPixels.equals(publicPixels), `${id} must retain the original message pixels`);
  }
});

test("homepage placement and lightweight, accessible enhancement stay intact", () => {
  const homepage = read("src/app/page.tsx");
  assert.ok(homepage.indexOf("<FeaturedCollections") < homepage.indexOf("<CustomerNotes"));
  assert.ok(homepage.indexOf("<CustomerNotes") < homepage.indexOf("<HeritageStory"));
  const wall = read("src/components/home/customer-notes-wall.tsx");
  const section = read("src/components/home/customer-notes.tsx");
  const stories = read("src/app/customer-stories/page.tsx");
  assert.match(wall, /children: ReactNode/, "Quotes stay server-rendered, passed through a small client island");
  assert.match(wall, /IntersectionObserver/);
  assert.match(wall, /visibilitychange/);
  assert.match(wall, /aria-pressed=\{paused\}/);
  assert.match(section, /loading="lazy"/);
  assert.match(section, /aria-hidden="true" inert/, "Visual repeats are not extra accessible reviews");
  assert.doesNotMatch(section, /screenshot\.src/, "Heavy evidence images are not on the homepage");
  assert.doesNotMatch(`${wall}\n${section}`, /<dialog|setInterval|framer-motion|from "motion|aggregateRating|reviewRating|five customer|Next customer|activeIndex/i);
  assert.match(stories, /<details/);
  assert.match(stories, /loading="lazy" unoptimized/);
  assert.match(read("src/app/sitemap.ts"), /"\/customer-stories"/);
  assert.match(read("src/components/home/customer-notes.module.css"), /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(read("src/components/home/customer-notes.module.css"), /\.wall:focus-within/, "The resume control must resume motion even while it keeps keyboard focus");
});

test("review attribution remains legible at the mobile base breakpoint", () => {
  const css = read("src/components/home/customer-notes.module.css");
  const declaration = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rule = css.match(new RegExp(`${escaped} \\{([^}]+)\\}`));
    assert.ok(rule, `Missing ${selector}`);
    return rule[1];
  };
  const names = declaration(".words figcaption");
  const sources = declaration(".words figcaption > span:last-child");
  assert.match(names, /font-size: 14px/);
  assert.match(names, /font-weight: 600/);
  assert.match(sources, /font-size: 13px/);
  assert.match(declaration(".source"), /font-size: 13px/);
  const variables = rule => Object.fromEntries(
    [...rule.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()])
  );
  const property = (rule, name) => {
    const match = rule.match(new RegExp(`(?:^|;)\\s*${name}:\\s*([^;]+)`));
    assert.ok(match, `Missing ${name} declaration`);
    return match[1].trim();
  };
  const resolveColour = (value, tokens, seen = new Set()) => {
    if (/^#[a-f0-9]{6}$/i.test(value)) return value;
    const match = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/);
    assert.ok(match, `Unsupported colour: ${value}`);
    const [, name, fallback] = match;
    if (Object.hasOwn(tokens, name)) {
      assert.ok(!seen.has(name), `Circular colour token: ${name}`);
      return resolveColour(tokens[name], tokens, new Set([...seen, name]));
    }
    assert.ok(fallback, `Missing colour token and fallback: ${name}`);
    return resolveColour(fallback.trim(), tokens, seen);
  };
  const section = declaration(".section");
  const palette = read("src/components/home/home-palette.module.css").match(/\.page\s*\{([^}]+)\}/);
  assert.ok(palette, "Missing homepage palette");
  const contexts = [
    ["default", variables(section)],
    ["homepage", { ...variables(palette[1]), ...variables(section) }],
  ];
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255);
    const linear = channels.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  };
  for (const [context, tokens] of contexts) {
    const background = resolveColour(property(section, "background"), tokens);
    for (const rule of [names, sources, declaration(".footer p"), declaration(".motionButton")]) {
      const foreground = resolveColour(property(rule, "color"), tokens);
      const light = Math.max(luminance(foreground), luminance(background));
      const dark = Math.min(luminance(foreground), luminance(background));
      const ratio = (light + .05) / (dark + .05);
      assert.ok(ratio >= 7, `${context} ${foreground} on ${background} needs at least 7:1 contrast, got ${ratio.toFixed(2)}`);
    }
  }
});

test("wall motion pauses offscreen and in background tabs; cleanup removes enhancement", () => {
  const element = { dataset: {} };
  const mediaListeners = new Map();
  const documentListeners = new Map();
  const preference = { matches: false, addEventListener: (name, fn) => mediaListeners.set(name, fn), removeEventListener: name => mediaListeners.delete(name) };
  const document = { hidden: false, addEventListener: (name, fn) => documentListeners.set(name, fn), removeEventListener: name => documentListeners.delete(name) };
  let observer, cleanup;
  class Observer {
    constructor(callback) { this.callback = callback; observer = this; }
    observe(target) { this.target = target; }
    disconnect() { this.target = null; }
    emit(isIntersecting) { this.callback([{ isIntersecting }]); }
  }
  const output = ts.transpileModule(read("src/components/home/customer-notes-wall.tsx"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const exported = {};
  runInNewContext(output.outputText, {
    exports: exported,
    require: name => {
      if (name === "react") return { useRef: () => ({ current: element }), useState: () => [false, () => {}], useEffect: fn => { cleanup = fn(); } };
      if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
      if (name === "./customer-notes.module.css") return {};
      throw new Error(`Unexpected dependency ${name}`);
    },
    window: { IntersectionObserver: Observer, matchMedia: () => preference },
    IntersectionObserver: Observer, document,
  });
  exported.CustomerNotesWall({ children: null });
  assert.equal(element.dataset.ready, "true");
  assert.equal(element.dataset.motion, "on");
  observer.emit(true);
  assert.equal(element.dataset.visible, "true");
  assert.equal(element.dataset.entered, "true");
  observer.emit(false);
  assert.equal(element.dataset.visible, "false");
  document.hidden = true;
  documentListeners.get("visibilitychange")();
  assert.equal(element.dataset.background, "true");
  preference.matches = true;
  mediaListeners.get("change")();
  assert.equal(element.dataset.motion, "off");
  cleanup();
  assert.equal(Object.keys(element.dataset).length, 0);
  assert.equal(documentListeners.size, 0);
  assert.equal(mediaListeners.size, 0);
});

test("storage publisher accepts only inspected derivatives and never overwrites", () => {
  const publisher = read("scripts/prepare-customer-notes.mjs");
  assert.match(publisher, /upsert: false/);
  assert.match(publisher, /actual\.equals\(buffer\)/);
  assert.match(publisher, /lossless: true/);
  assert.match(publisher, /Expected the existing public catalogue bucket/);
  assert.doesNotMatch(publisher, /createBucket|updateBucket|\.remove\(/);
});
