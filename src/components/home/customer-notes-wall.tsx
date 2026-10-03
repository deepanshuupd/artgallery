"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./customer-notes.module.css";

/** Server-rendered words and photos; CSS does the motion, not a JS carousel. */
export function CustomerNotesWall({ children }: { children: ReactNode }) {
  const wall = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = wall.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => { element.dataset.motion = preference.matches ? "off" : "on"; };
    const updateVisibility = () => { element.dataset.background = String(document.hidden); };
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) element.dataset.entered = "true";
    }, { threshold: 0.05 });
    updatePreference(); updateVisibility();
    element.dataset.ready = "true";
    observer.observe(element);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      for (const key of ["ready", "motion", "visible", "entered", "background"]) delete element.dataset[key];
    };
  }, []);
  return (
    <div ref={wall} className={styles.wall} data-paused={paused}>
      {children}
      <div className={styles.motionControls}>
        <button type="button" className={styles.motionButton} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
          <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
            {paused ? <path d="M5 3v10l8-5Z" /> : <path d="M4 3h2v10H4zM10 3h2v10h-2z" />}
          </svg>
          {paused ? "Resume the wall" : "Pause the wall"}
        </button>
      </div>
    </div>
  );
}
