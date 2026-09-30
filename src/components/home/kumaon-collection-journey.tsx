"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CraftOrnament } from "./craft-ornament";
import { journeyProgress } from "./kumaon-journey-progress";
import { getCategoryPath } from "@/lib/catalog";
import type { ProductCategory } from "@/types/product";
import styles from "./kumaon-collection-journey.module.css";

const collections: { name: ProductCategory; label: string; note: string; action: string; tilt: number }[] = [
  { name: "Keychains", label: "Pahadi keychains", note: "A little home, wherever you go.", action: "Shop keychains", tilt: -16 },
  { name: "Frames", label: "Aipan & frames", note: "The colours of Kumaon, at home.", action: "Shop frames", tilt: 5 },
  { name: "Fridge Magnets", label: "Fridge magnets", note: "The hills, in your everyday.", action: "Shop magnets", tilt: 18 },
  { name: "Personalized Gifts", label: "Personalised gifts", note: "Your people. Your memories.", action: "Find a gift", tilt: -9 },
];

function JourneyCard({ collection, image, index }: { collection: typeof collections[number]; image?: string; index: number }) {
  const [failed, setFailed] = useState(false);
  return <Link prefetch={false} href={`/${getCategoryPath(collection.name)}`} data-journey-card className={styles.card}
    style={{ "--tilt": `${collection.tilt}deg`, "--depth": index === 1 ? 4 : 3 - index, "--mobile-scale": index === 1 ? 1.45 : 0.94, "--desktop-scale": index === 1 ? 1.16 : 0.88 } as CSSProperties}>
    <div className={styles.photo}>
      {image && !failed ? <Image src={image} alt={collection.label} fill quality={70}
        sizes="(max-width: 767px) 65vw, (max-width: 1279px) 36vw, 420px"
        className={collection.name === "Fridge Magnets" ? styles.cover : styles.contain} onError={() => setFailed(true)} />
        : <span className={styles.fallback}>{collection.label}</span>}
    </div>
    <div className={styles.cardCopy}><h3>{collection.label}</h3><p>{collection.note}</p><span>{collection.action}</span></div>
  </Link>;
}

export function KumaonCollectionJourney({ images }: { images: Partial<Record<ProductCategory, string>> }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [browseDirectly, setBrowseDirectly] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || browseDirectly) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pin = section.querySelector<HTMLElement>(`.${styles.pin}`);
    const grid = section.querySelector<HTMLElement>(`.${styles.grid}`);
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-card]"));
    if (!pin || !grid) return;
    let frame = 0, top = 0, span = 1, nearby = true, previous = -1;

    const render = () => {
      frame = 0;
      if (!nearby || preference.matches || !section.dataset.motion) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - top) / span));
      if (progress === previous) return;
      previous = progress;
      Object.entries(journeyProgress(progress)).forEach(([key, value]) => section.style.setProperty(`--${key}`, value.toFixed(4)));
    };
    const schedule = () => { if (!frame && nearby && !preference.matches) frame = requestAnimationFrame(render); };
    const measure = () => {
      if (preference.matches || window.innerHeight < 520) { delete section.dataset.motion; return; }
      section.dataset.motion = "active";
      top = section.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(pin).top);
      span = Math.max(1, section.offsetHeight - pin.offsetHeight);
      const centerX = grid.clientWidth / 2, centerY = grid.clientHeight / 2;
      const mobile = window.innerWidth < 768;
      // Read geometry on resize only, never on each scroll frame.
      const geometry = cards.map((card, index) => {
        const photoCenter = (card.firstElementChild as HTMLElement).offsetHeight / 2;
        return {
          card, photoCenter, x: centerX - (card.offsetLeft + card.offsetWidth / 2), y: centerY - (card.offsetTop + photoCenter),
          fanX: (index % 2 ? 1 : -1) * grid.clientWidth * (mobile ? 0.2 : 0.13),
          fanY: (index < 2 ? -1 : 1) * grid.clientHeight * (mobile ? 0.14 : 0.13),
        };
      });
      geometry.forEach(({ card, photoCenter, x, y, fanX, fanY }) => {
        card.style.setProperty("--photo-center", `${photoCenter}px`);
        card.style.setProperty("--fold-x", `${x}px`); card.style.setProperty("--fold-y", `${y}px`);
        card.style.setProperty("--fan-x", `${fanX}px`); card.style.setProperty("--fan-y", `${fanY}px`);
      });
      previous = -1;
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => { nearby = entry.isIntersecting; if (nearby) schedule(); }, { rootMargin: "200px 0px" });
    const resize = new ResizeObserver(measure);
    measure(); observer.observe(section); resize.observe(grid);
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", measure);
    preference.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", measure); preference.removeEventListener("change", measure);
      delete section.dataset.motion;
      Object.keys(journeyProgress(0)).forEach(key => section.style.removeProperty(`--${key}`));
      cards.forEach(card => ["--photo-center", "--fold-x", "--fold-y", "--fan-x", "--fan-y"].forEach(key => card.style.removeProperty(key)));
    };
  }, [browseDirectly]);

  return <section ref={sectionRef} className={styles.journey} aria-labelledby="collections-title"
    onFocusCapture={event => { if ((event.target as HTMLElement).closest("[data-journey-card]")) setBrowseDirectly(true); }}>
    <div className={styles.pin}>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.rang} lang="hi">रंग</span><CraftOrnament className={styles.ornament} />
        <svg className={styles.hills} viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none"><path d="M-20 340 220 130 380 245 640 30 810 200 1030 95 1460 330"/><path d="M-20 390 220 240 380 330 640 145 810 310 1030 205 1460 380"/><path d="M-20 420 320 300 550 360 850 255 1130 350 1460 285"/></svg>
      </div>
      <header className={styles.heading}><div><p className="craft-eyebrow">Little things. Lasting connections.</p><h2 id="collections-title">Find your piece of <em>Kumaon.</em></h2></div><Link href="/collection" prefetch={false} className={styles.shopAll}>Shop all pieces</Link></header>
      <div className={styles.grid}>{collections.map((collection, index) => <JourneyCard key={collection.name} collection={collection} image={images[collection.name]} index={index} />)}</div>
      <div className={styles.direction}>
        <div className={styles.captions} aria-hidden="true"><span className={styles.opening}>It starts with our colours.</span><span className={styles.middle}>A little art. A little belonging.</span><span className={styles.closing}>Four ways to keep Kumaon close.</span></div>
        <button type="button" className={styles.skip} onClick={() => setBrowseDirectly(true)}>Browse without motion</button>
        <span className={styles.scrollHint} aria-hidden="true">Scroll to unfold <span>↓</span></span>
      </div><div className={styles.progress} aria-hidden="true"><span /></div>
    </div>
  </section>;
}
