import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/home/use-home-atmosphere.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });

function mount(reduced = false) {
  const reveal = { dataset: {}, hasAttribute: () => false };
  const floating = { dataset: {}, hasAttribute: name => name === "data-home-float" };
  const product = { dataset: { homeReveal: "hero-product" }, hasAttribute: () => false };
  const home = { dataset: {}, querySelectorAll: () => [reveal, floating, product] };
  const mediaListeners = new Map();
  const documentListeners = new Map();
  const preference = {
    matches: reduced,
    addEventListener: (name, callback) => mediaListeners.set(name, callback),
    removeEventListener: name => mediaListeners.delete(name),
  };
  const document = {
    hidden: false,
    addEventListener: (name, callback) => documentListeners.set(name, callback),
    removeEventListener: name => documentListeners.delete(name),
  };
  const observers = [];
  class Observer {
    targets = new Set();
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
    emit(target, isIntersecting) { this.callback([{ target, isIntersecting }]); }
  }
  const exported = {};
  let cleanup;
  runInNewContext(compiled.outputText, {
    exports: exported,
    require: name => {
      assert.equal(name, "react");
      return { useEffect: callback => { cleanup = callback(); } };
    },
    window: { IntersectionObserver: Observer, matchMedia: () => preference },
    IntersectionObserver: Observer,
    document,
  });
  exported.useHomeAtmosphere({ current: { closest: () => home } });
  return { reveal, floating, product, home, preference, document, observers, mediaListeners, documentListeners, cleanup };
}

test("product entrances are armed in stable slots and land only once", () => {
  const scene = mount();
  assert.equal(scene.product.dataset.homeReady, "true");
  assert.equal(scene.product.dataset.homeEntered, undefined);
  scene.observers[0].emit(scene.product, true);
  assert.equal(scene.product.dataset.homeEntered, "true");
  assert.equal(scene.observers[0].targets.has(scene.product), false);
  scene.cleanup();
  assert.equal(scene.product.dataset.homeReady, undefined);
  assert.equal(scene.product.dataset.homeEntered, undefined);
});

test("unvisited artwork stays static and visible artwork pauses offscreen", () => {
  const scene = mount();
  const observer = scene.observers[0];
  observer.emit(scene.floating, false);
  assert.equal(scene.floating.dataset.homeVisible, undefined);
  observer.emit(scene.floating, true);
  assert.equal(scene.floating.dataset.homeVisible, "true");
  observer.emit(scene.floating, false);
  assert.equal(scene.floating.dataset.homeVisible, "false");
  assert.equal(observer.targets.has(scene.floating), true);
  observer.emit(scene.floating, true);
  assert.equal(scene.floating.dataset.homeVisible, "true");
  scene.cleanup();
});

test("text entrances play once and release their observer", () => {
  const scene = mount();
  scene.observers[0].emit(scene.reveal, true);
  assert.equal(scene.reveal.dataset.homeEntered, "true");
  assert.equal(scene.observers[0].targets.has(scene.reveal), false);
  scene.cleanup();
});

test("reduced motion does not allocate an observer", () => {
  const scene = mount(true);
  assert.equal(scene.observers.length, 0);
  assert.equal(scene.reveal.dataset.homeEntered, undefined);
  assert.equal(scene.product.dataset.homeReady, undefined);
  scene.cleanup();
});

test("live reduced-motion changes and cleanup remove enhancement state", () => {
  const scene = mount();
  scene.observers[0].emit(scene.floating, true);
  scene.observers[0].emit(scene.reveal, true);
  scene.preference.matches = true;
  scene.mediaListeners.get("change")();
  assert.equal(scene.observers[0].targets.size, 0);
  assert.equal(scene.floating.dataset.homeVisible, undefined);
  assert.equal(scene.reveal.dataset.homeEntered, undefined);
  scene.cleanup();
  assert.equal(scene.mediaListeners.size, 0);
  assert.equal(scene.documentListeners.size, 0);
});

test("background tabs pause ambient animations", () => {
  const scene = mount();
  scene.document.hidden = true;
  scene.documentListeners.get("visibilitychange")();
  assert.equal(scene.home.dataset.homePaused, "true");
  scene.document.hidden = false;
  scene.documentListeners.get("visibilitychange")();
  assert.equal(scene.home.dataset.homePaused, "false");
  scene.cleanup();
});

test("story wheel keeps rotating separately from its one-time entrance", () => {
  const story = readFileSync(new URL("../src/components/home/heritage-story.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/components/home/home-atmosphere.module.css", import.meta.url), "utf8");
  assert.match(story, /className=\{atmosphere.storyWheel\} data-home-float/);
  assert.match(css, /animation: story-wheel-turn 48s linear infinite/);
  assert.match(css, /\.storyWheel\[data-home-visible="true"\] > svg\s*\{\s*animation-play-state: running/);
  assert.match(css, /main\[data-home-paused="true"\].*\.storyWheel > svg \{ animation-play-state: paused/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.storyWheel > svg \{ animation: none !important/);
});

test("mobile featured artwork has a fitted backdrop without changing desktop framing", () => {
  const css = readFileSync(new URL("../src/components/home/home-atmosphere.module.css", import.meta.url), "utf8");
  const hero = readFileSync(new URL("../src/components/home/hero-section.tsx", import.meta.url), "utf8");
  const mobile = css.match(/@media \(max-width: 767px\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(mobile, "Phone-only rules must remain scoped below the existing desktop breakpoint");
  assert.match(mobile, /max-width: 336px;/);
  assert.match(mobile, /padding: 28px 12px 12px;/);
  assert.match(mobile, /\.heroProduct \{ max-width: none; \}/, "The card fills its phone backdrop instead of staying at 260px");
  assert.match(mobile, /grid-template-columns: minmax\(0, 1fr\) auto;/, "Long product names may wrap without squeezing the price");
  assert.match(css, /\.heritage-artwork__photo img\) \{ object-fit: contain;/, "Complete product photos remain visible");
  assert.match(css, /@media \(min-width: 768px\) \{[\s\S]*\.heroProduct \{ max-width: 330px; \}/);
  assert.match(hero, /sizes="\(max-width: 375px\) calc\(100vw - 78px\), \(max-width: 767px\) 298px,/);
});
