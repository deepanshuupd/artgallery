"use client";

import { useEffect, useRef } from "react";
import styles from "./diwali-greeting.module.css";

// Diwali 2026 falls on 8 November; the greeting retires itself after Bhai Dooj.
// Remove this component (and its use on the homepage) once the season has passed.
const greetUntil = Date.parse("2026-11-12T00:00:00+05:30");
const seenKey = "kumaonrang-diwali-greeting";
const showFor = 6000;
const climb = 700;
const palette = ["#ffcf5a", "#ff8a3d", "#ff5c8a", "#fff3da", "#e8473a"];

type Kind = "ring" | "peony" | "willow";
type Shot = { x: number; y: number; at: number; kind: Kind; colour: number };
type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; drag: number; gravity: number; image: HTMLCanvasElement; size: number; glitter: boolean };

// Bursts frame the greeting (a little above the middle), as fractions of the screen.
const phoneShow: Shot[] = [
  { x: .26, y: .2, at: 100, kind: "ring", colour: 0 },
  { x: .76, y: .15, at: 550, kind: "peony", colour: 2 },
  { x: .5, y: .1, at: 1100, kind: "willow", colour: 0 },
  { x: .2, y: .68, at: 1650, kind: "peony", colour: 1 },
  { x: .8, y: .64, at: 2100, kind: "ring", colour: 4 },
  { x: .62, y: .24, at: 2650, kind: "peony", colour: 3 },
  { x: .32, y: .12, at: 3150, kind: "willow", colour: 0 },
];
const wideShow: Shot[] = [
  { x: .22, y: .22, at: 100, kind: "ring", colour: 0 },
  { x: .78, y: .18, at: 500, kind: "peony", colour: 2 },
  { x: .5, y: .1, at: 950, kind: "willow", colour: 0 },
  { x: .1, y: .55, at: 1400, kind: "peony", colour: 1 },
  { x: .9, y: .5, at: 1800, kind: "ring", colour: 4 },
  { x: .36, y: .14, at: 2250, kind: "peony", colour: 3 },
  { x: .66, y: .3, at: 2700, kind: "ring", colour: 1 },
  { x: .86, y: .12, at: 3150, kind: "willow", colour: 0 },
];

function sprite(colour: string, scale: number) {
  const size = Math.ceil(32 * scale);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  const glow = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  glow.addColorStop(0, "#ffffff");
  glow.addColorStop(.18, colour);
  glow.addColorStop(.45, `${colour}40`);
  glow.addColorStop(1, `${colour}00`);
  context.fillStyle = glow;
  context.fillRect(0, 0, size, size);
  return canvas;
}

const easeOut = (p: number) => 1 - (1 - p) ** 3;

/** Starts the fireworks on the canvas and returns a function that stops them. */
function fireworks(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);

  const wide = width >= 768;
  const reach = Math.min(Math.max(Math.min(width, height) * .24, 80), 170);
  const grain = wide ? 2.5 : 2.1;
  const sprites = palette.map(colour => sprite(colour, scale));
  const [gold, , , white] = sprites;
  const rockets = (wide ? wideShow : phoneShow).map(shot => ({
    ...shot, x: shot.x * width, y: shot.y * height,
    fromX: (shot.x + (Math.random() - .5) * .08) * width, done: false,
  }));
  const sparks: Spark[] = [];
  const flashes: { x: number; y: number; age: number }[] = [];

  const add = (x: number, y: number, angle: number, speed: number, image: HTMLCanvasElement, size: number, life: number, drag: number, gravity: number, glitter: boolean) => {
    sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life, drag, gravity, image, size, glitter });
  };

  const explode = (rocket: (typeof rockets)[number]) => {
    const { x, y } = rocket;
    const image = sprites[rocket.colour];
    // With drag k, a spark launched at speed v travels v / k: so reach × k.
    if (rocket.kind === "ring") {
      // An Aipan-like double circle: an outer ring and an offset inner ring of gold dots.
      for (let i = 0; i < 36; i++) add(x, y, (i / 36) * Math.PI * 2, reach * 2.6, image, 1, 1.5, 2.6, 50, false);
      for (let i = 0; i < 18; i++) add(x, y, ((i + .5) / 18) * Math.PI * 2, reach * 1.45, gold, .8, 1.4, 2.6, 50, true);
    } else if (rocket.kind === "peony") {
      for (let i = 0; i < 72; i++) {
        add(x, y, Math.random() * Math.PI * 2, reach * 2.6 * (.35 + .65 * Math.sqrt(Math.random())),
          Math.random() < .25 ? white : image, 1, 1.2 + Math.random() * .6, 2.6, 60, Math.random() < .3);
      }
    } else {
      for (let i = 0; i < 56; i++) add(x, y, (i / 56) * Math.PI * 2 + Math.random() * .1, reach * 3.2 * (.8 + .2 * Math.random()), gold, .9, 2.4, 3.4, 45, true);
    }
    flashes.push({ x, y, age: 0 });
  };

  const dot = (image: HTMLCanvasElement, x: number, y: number, size: number, alpha: number) => {
    if (alpha <= 0) return;
    const glow = size * grain * 2.2;
    context.globalAlpha = Math.min(alpha, 1);
    context.drawImage(image, x - glow, y - glow, glow * 2, glow * 2);
  };

  const start = performance.now();
  let last = start;
  let frame = 0;
  const draw = (now: number) => {
    const dt = Math.min((now - last) / 1000, .05);
    const t = now - start;
    last = now;
    // Fade the last frame rather than clearing it, so sparks leave short trails.
    context.globalCompositeOperation = "destination-out";
    context.globalAlpha = 1;
    context.fillStyle = `rgba(0,0,0,${1 - .8 ** (dt * 60)})`;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    for (const rocket of rockets) {
      if (rocket.done || t < rocket.at) continue;
      const p = Math.min((t - rocket.at) / climb, 1);
      const x = rocket.fromX + (rocket.x - rocket.fromX) * easeOut(p);
      const y = height + 20 + (rocket.y - height - 20) * easeOut(p);
      dot(gold, x, y, 1.2, 1);
      add(x, y, Math.PI / 2 + (Math.random() - .5) * .6, 20 + Math.random() * 25, gold, .55, .35 + Math.random() * .2, 1, 20, false);
      if (p >= 1) {
        rocket.done = true;
        explode(rocket);
      }
    }

    let kept = 0;
    for (const spark of sparks) {
      const decay = Math.exp(-spark.drag * dt);
      spark.vx *= decay;
      spark.vy = spark.vy * decay + spark.gravity * dt;
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.age += dt;
      if (spark.age >= spark.life) continue;
      const left = spark.age / spark.life;
      let alpha = (1 - left) ** 1.4;
      if (spark.glitter && left > .45 && Math.random() < .5) alpha *= .2;
      dot(spark.image, spark.x, spark.y, spark.size, alpha);
      sparks[kept++] = spark;
    }
    sparks.length = kept;

    for (const flash of flashes) {
      flash.age += dt;
      dot(white, flash.x, flash.y, 4.5, 1 - flash.age / .22);
    }
    if (t < showFor) frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(frame);
}

/** A once-a-visit शुभ दीपावली greeting with fireworks over the homepage, in the Diwali season. */
export function DiwaliGreeting() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas || Date.now() >= greetUntil || document.hidden) return;
    try {
      if (sessionStorage.getItem(seenKey)) return;
    } catch { /* Private windows can refuse storage; the greeting still plays once per load. */ }

    let stop = () => {};
    let endTimer = 0;
    const interactions = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const finish = () => {
      stop();
      window.clearTimeout(endTimer);
      interactions.forEach(type => window.removeEventListener(type, dismiss));
      overlay.hidden = true;
      canvas.width = canvas.height = 0;
    };
    // Any tap, key or scroll lets the visitor straight through to the shop.
    const dismiss = () => {
      overlay.dataset.leaving = "true";
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(finish, 350);
    };

    const timer = window.setTimeout(() => {
      try { sessionStorage.setItem(seenKey, "1"); } catch { /* As above. */ }
      overlay.hidden = false;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) stop = fireworks(canvas);
      interactions.forEach(type => window.addEventListener(type, dismiss, { passive: true }));
      endTimer = window.setTimeout(finish, showFor);
    }, 500);

    return () => {
      window.clearTimeout(timer);
      finish();
    };
  }, []);

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true" hidden>
      <div className={styles.stage}>
        <div className={styles.veil} />
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.greeting}>
          <p className={styles.hindi} lang="hi">शुभ दीपावली</p>
          <p className={styles.english}>Happy Diwali from KumaonRang</p>
          <div className={styles.diyas}>
            <span className={styles.diya}><span className={styles.flame} /></span>
            <span className={styles.diya}><span className={styles.flame} /></span>
            <span className={styles.diya}><span className={styles.flame} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
