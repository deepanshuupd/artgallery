"use client";

import { useEffect, type RefObject } from "react";

/** One observer for the homepage; no scroll handlers or per-frame React updates. */
export function useHomeAtmosphere(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const home = heroRef.current?.closest("main");
    if (!home || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(home.querySelectorAll<HTMLElement>("[data-home-reveal], [data-home-float]"));
    let observer: IntersectionObserver | undefined;

    const clear = () => {
      observer?.disconnect();
      targets.forEach(target => {
        delete target.dataset.homeEntered;
        delete target.dataset.homeVisible;
        delete target.dataset.homeReady;
        delete target.dataset.homeImmediate;
      });
      delete home.dataset.homePaused;
    };

    const visibility = () => {
      home.dataset.homePaused = document.hidden ? "true" : "false";
    };

    const start = () => {
      clear();
      if (preference.matches) return;
      visibility();
      // Observe the stable slot, not the moving card, so sideways entrances
      // start when their destination is visible (including on small phones).
      targets.forEach(target => {
        if (target.dataset.homeReveal?.endsWith("-product")) target.dataset.homeReady = "true";
      });
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          const element = target as HTMLElement;
          if (element.hasAttribute("data-home-float")) {
            // Do not allocate animation layers for sections not visited yet.
            if (isIntersecting || element.dataset.homeVisible) {
              element.dataset.homeVisible = String(isIntersecting);
            }
          } else if (isIntersecting) {
            element.dataset.homeEntered = "true";
            observer?.unobserve(element);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      targets.forEach(target => observer?.observe(target));
    };

    start();
    preference.addEventListener("change", start);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clear();
      preference.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [heroRef]);
}
