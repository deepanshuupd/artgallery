"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import styles from "./inspectable-product-photo.module.css";

const magnification = 2.4;
const clamp = (value: number) => Math.max(0, Math.min(100, value));
const supportsHover = (event: PointerEvent<HTMLButtonElement>) => event.pointerType === "mouse"
  && window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;

type Gesture = {
  x: number; y: number; originX: number; originY: number;
  width: number; height: number; hover: boolean; moved: boolean;
};

/** Inspect the existing full-size source; zoom never requests another image. */
export function InspectableProductPhoto({ src, alt, label, imageClassName, priority = false, sizes, onError }: {
  src: string; alt: string; label: string; imageClassName: string;
  priority?: boolean; sizes: string; onError: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const origin = useRef({ x: 50, y: 50 });
  const gesture = useRef<Gesture | null>(null);
  const pendingFrame = useRef<number | null>(null);
  const helpId = useId();

  useEffect(() => () => {
    if (pendingFrame.current !== null) cancelAnimationFrame(pendingFrame.current);
  }, []);

  function position(x: number, y: number) {
    origin.current = { x: clamp(x), y: clamp(y) };
    if (pendingFrame.current !== null) return;
    pendingFrame.current = requestAnimationFrame(() => {
      buttonRef.current?.style.setProperty("--inspect-x", `${origin.current.x}%`);
      buttonRef.current?.style.setProperty("--inspect-y", `${origin.current.y}%`);
      pendingFrame.current = null;
    });
  }

  function pointAt(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    position((event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100);
  }

  function begin(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const hover = supportsHover(event);
    gesture.current = { x: event.clientX, y: event.clientY, originX: origin.current.x, originY: origin.current.y,
      width: rect.width, height: rect.height, hover, moved: false };
    if (zoomed && !hover) event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary) return;
    const drag = gesture.current;
    if (drag && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8) drag.moved = true;
    if (!zoomed) return;
    if (supportsHover(event)) pointAt(event);
    else if (drag) {
      position(drag.originX - (event.clientX - drag.x) / (drag.width * (magnification - 1)) * 100,
        drag.originY - (event.clientY - drag.y) / (drag.height * (magnification - 1)) * 100);
    }
  }

  return <>
    <button ref={buttonRef} type="button" className={styles.photo} data-magnified={zoomed || undefined}
      aria-label={label} aria-pressed={zoomed} aria-describedby={helpId} disabled={!loaded}
      onPointerEnter={event => { if (loaded && supportsHover(event)) { pointAt(event); setZoomed(true); } }}
      onPointerLeave={event => { if (supportsHover(event)) { setZoomed(false); gesture.current = null; } }}
      onPointerDown={begin} onPointerMove={move}
      onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerCancel={() => { if (gesture.current) gesture.current.moved = true; }}
      onBlur={() => { setZoomed(false); gesture.current = null; }}
      onClick={event => {
        // Mouse users inspect on hover. A swipe or drag must never become a zoom toggle.
        if (event.detail !== 0 && (gesture.current?.hover || gesture.current?.moved)) return;
        if (!zoomed) {
          const rect = event.currentTarget.getBoundingClientRect();
          position(event.detail === 0 ? 50 : (event.clientX - rect.left) / rect.width * 100,
            event.detail === 0 ? 50 : (event.clientY - rect.top) / rect.height * 100);
        } else position(50, 50);
        setZoomed(previous => !previous);
      }}
      onKeyDown={event => {
        if (event.key === "Escape" && zoomed) { event.preventDefault(); event.stopPropagation(); setZoomed(false); return; }
        if (!zoomed || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        position(origin.current.x + (event.key === "ArrowRight" ? 10 : event.key === "ArrowLeft" ? -10 : 0),
          origin.current.y + (event.key === "ArrowDown" ? 10 : event.key === "ArrowUp" ? -10 : 0));
      }}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes}
        className={`${imageClassName} ${styles.image}`} draggable={false}
        onLoad={() => setLoaded(true)} onError={onError} />
      <span className={styles.hint} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5M7 10h6" />{!zoomed && <path d="M10 7v6" />}</svg>
        <span className={styles.mouseHint}>{zoomed ? "Move to inspect · 2.4×" : "Hover to zoom"}</span>
        <span className={styles.touchHint}>{zoomed ? "Drag to inspect · tap to reset" : "Tap to zoom"}</span>
      </span>
    </button>
    <span id={helpId} className="sr-only">Hover and move to inspect. On touch screens, tap to zoom, drag to explore and tap to reset. With a keyboard, press Enter to zoom, arrow keys to explore and Escape to reset.</span>
  </>;
}
