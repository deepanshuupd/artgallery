"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { RocketBottleArt } from "./rocket-bottle-art";
import { createRocketShow } from "./rocket-show";
import styles from "./diwali-rocket-bottle.module.css";

// Diwali 2026 falls on 8 November; the bottle retires itself after Bhai Dooj.
// Remove this component (and its use in the root layout) once the season has passed.
const seasonEnds = Date.parse("2026-11-12T00:00:00+05:30");
const helloKey = "kumaonrang-rocket-hello";
const comboWindow = 450;
const fuseBurn = 950;

/** A rocket in a bottle on the homepage: the first tap lights its fuse, then each tap launches. */
export function DiwaliRocketBottle() {
  const onHome = usePathname() === "/";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const helloRef = useRef<HTMLSpanElement>(null);
  const fuseRef = useRef<SVGPathElement>(null);
  const fuseCoreRef = useRef<SVGPathElement>(null);
  const emberRef = useRef<SVGCircleElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const mouthRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const fuse = fuseRef.current;
    const fuseCore = fuseCoreRef.current;
    const ember = emberRef.current;
    const hello = helloRef.current;
    const tipMark = tipRef.current;
    const mouthMark = mouthRef.current;
    if (!onHome || !button || !canvas || !fuse || !fuseCore || !ember || !hello || !tipMark || !mouthMark || Date.now() >= seasonEnds) return;
    button.hidden = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastBuzz = 0;
    // Android vibrates on these; iPhone browsers don't let a page vibrate.
    const buzz = (ms: number) => {
      const now = performance.now();
      // Browsers refuse vibration before the visitor's first tap.
      if (now - lastBuzz < 70 || navigator.userActivation?.hasBeenActive === false) return;
      lastBuzz = now;
      try { navigator.vibrate?.(ms); } catch { /* Not every browser allows it. */ }
    };
    const show = still ? null : createRocketShow(canvas, () => buzz(6));
    const timers = new Set<number>();
    const later = (run: () => void, ms: number) => {
      const id = window.setTimeout(() => { timers.delete(id); run(); }, ms);
      timers.add(id);
      return id;
    };
    let combo = 0;
    let lastFire = 0;
    let reload = 0;
    let holdStart = 0;
    let holdRepeat = 0;
    let lit = still;
    let lighting = false;
    let burnFrame = 0;
    const fuseLength = fuse.getTotalLength();

    // Where a point of the drawn fuse is on screen, for sparks from the canvas.
    const onScreen = (length: number) => {
      const point = fuse.getPointAtLength(length);
      const matrix = fuse.getScreenCTM();
      if (!matrix) return { x: 0, y: 0, local: point };
      return { x: matrix.a * point.x + matrix.c * point.y + matrix.e, y: matrix.b * point.x + matrix.d * point.y + matrix.f, local: point };
    };
    const restoreFuse = () => {
      fuse.style.strokeDasharray = "";
      fuseCore.style.opacity = "";
      const tip = fuse.getPointAtLength(fuseLength);
      ember.setAttribute("cx", String(tip.x));
      ember.setAttribute("cy", String(tip.y));
    };

    const fire = () => {
      hello.removeAttribute("data-show");
      const now = performance.now();
      combo = now - lastFire < comboWindow ? combo + 1 : 1;
      lastFire = now;
      // The press: a quick squash and spring, and the rocket leaves the bottle.
      button.removeAttribute("data-kick");
      void button.offsetWidth;
      button.dataset.kick = "true";
      button.dataset.fired = "true";
      window.clearTimeout(reload);
      reload = later(() => { delete button.dataset.fired; }, 380);
      buzz(combo > 1 ? 12 : 10);
      if (!show) {
        button.removeAttribute("data-glow");
        void button.offsetWidth;
        button.dataset.glow = "true";
        return;
      }
      // Rockets leave from the leaning rocket's tip; the fireball sits on the bottle's lip.
      const tip = tipMark.getBoundingClientRect();
      const lip = mouthMark.getBoundingClientRect();
      const rockets = combo === 1 ? (Math.random() < .5 ? 2 : 3) : Math.random() < .6 ? 1 : 2;
      for (let i = 0; i < rockets; i++) {
        later(() => show.launch(tip.left, tip.top, { ring: combo >= 4 && Math.random() < .35, spread: combo >= 3 ? .62 : .35 }), i * 70);
      }
      if (combo >= 2) show.heat(lip.left + lip.width / 2, lip.top);
    };

    // The first tap lights the fuse: the spark runs down the thread, spitting
    // sparks, the rocket shivers on its stick, then lifts off.
    const light = () => {
      lighting = true;
      hello.removeAttribute("data-show");
      button.dataset.lighting = "true";
      fuseCore.style.opacity = "0";
      const start = performance.now();
      let lastFizz = 0;
      const burn = (now: number) => {
        const p = Math.min((now - start) / fuseBurn, 1);
        const left = fuseLength * (1 - p);
        const spot = onScreen(left);
        fuse.style.strokeDasharray = `${left} ${fuseLength}`;
        ember.setAttribute("cx", String(spot.local.x));
        ember.setAttribute("cy", String(spot.local.y));
        if (now - lastFizz > 45) {
          show?.fizz(spot.x, spot.y);
          lastFizz = now;
        }
        if (now - lastBuzz > 150) buzz(5);
        if (p < 1) { burnFrame = requestAnimationFrame(burn); return; }
        button.dataset.shake = "true";
        later(() => {
          delete button.dataset.shake;
          delete button.dataset.lighting;
          lighting = false;
          lit = true;
          fire();
          later(restoreFuse, 400);
        }, 260);
      };
      burnFrame = requestAnimationFrame(burn);
    };

    const tap = () => {
      if (lighting) return;
      if (lit) fire();
      else light();
    };
    const stopHold = () => {
      window.clearTimeout(holdStart);
      window.clearInterval(holdRepeat);
    };
    // Holding the bottle keeps it firing, like holding WhatsApp's heart.
    const press = (event: PointerEvent) => {
      if (event.button !== 0) return;
      tap();
      stopHold();
      holdStart = window.setTimeout(() => { holdRepeat = window.setInterval(() => { if (lit && !lighting) fire(); }, 140); }, 280);
    };
    // Keyboard presses arrive as clicks without a pointer.
    const click = (event: MouseEvent) => { if (event.detail === 0) tap(); };
    const menu = (event: Event) => event.preventDefault();
    const releases = ["pointerup", "pointercancel", "pointerleave"];
    button.addEventListener("pointerdown", press);
    button.addEventListener("click", click);
    button.addEventListener("contextmenu", menu);
    releases.forEach(type => button.addEventListener(type, stopHold));

    // Once a visit, the bottle says hello.
    try {
      if (!sessionStorage.getItem(helloKey)) {
        sessionStorage.setItem(helloKey, "1");
        later(() => { hello.dataset.show = "true"; }, 1200);
        later(() => hello.removeAttribute("data-show"), 7000);
      }
    } catch { /* Without storage, the bottle simply waits to be tapped. */ }

    return () => {
      stopHold();
      cancelAnimationFrame(burnFrame);
      timers.forEach(id => window.clearTimeout(id));
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("click", click);
      button.removeEventListener("contextmenu", menu);
      releases.forEach(type => button.removeEventListener(type, stopHold));
      show?.destroy();
      restoreFuse();
      button.hidden = true;
    };
  }, [onHome]);

  if (!onHome) return null;
  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <button ref={buttonRef} type="button" className={styles.bottle} aria-label="Light a Diwali rocket" hidden>
        <RocketBottleArt rocketClassName={styles.rocket} fuseRef={fuseRef} fuseCoreRef={fuseCoreRef} emberRef={emberRef} emberClassName={styles.ember} tipRef={tipRef} mouthRef={mouthRef} />
        <span ref={helloRef} className={styles.hello} aria-hidden="true"><span lang="hi">शुभ दीपावली!</span> Tap to light 🎆</span>
      </button>
    </>
  );
}
