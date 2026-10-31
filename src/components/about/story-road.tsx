"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

import { hillContours, plainLines } from "@/lib/contours";
import { BaleshwarTemple, KoliDhekLake, PanchachuliPeaks } from "./story-landmarks";
import styles from "./story-road.module.css";

type Ground = "plains" | "deodar" | "pine" | "dusk";

// Seeded, so server and client draw the same hills. More rings, higher ground.
const CONTOURS: Record<Ground, string[]> = {
  plains: plainLines(7, 16),
  deodar: hillContours(11, 2, 9),
  pine: hillContours(23, 3, 11),
  dusk: hillContours(41, 2, 10),
};

// Existing catalogue photograph of an Om Aipan frame on a Pichora-yellow ground.
const frameImage = "https://psqdrmdyucsyiuugvitd.supabase.co/storage/v1/object/public/product-images/optimized/v2/handmade-aipan-wall-decor-with-pichora-background-indexable-5e671ce8d1df803d98ac06e7bd75feba5d82fab9df7c0ad2014d03c09c2911b4";
const frameHref = "/aipan-frames/handmade-aipan-wall-decor-with-pichora-background";

/**
 * Altitudes from each town's Wikipedia infobox, checked 31 October 2026.
 * The road is how the story is told: no chapter claims to have happened in its town.
 */
const STOPS: { id: string; town: string; altitude: number; ground: Ground; sign: boolean; content: ReactNode; landmark?: { scene: ReactNode; caption: string } }[] = [
  {
    id: "plains", town: "Tanakpur", altitude: 255, ground: "plains", sign: false,
    content: <>
      <h2 id="road-home-title" className={styles.title}>The road home</h2>
      <p className={styles.lead}>Pithoragarh sits high in the hills. From the plains at Tanakpur, the road climbs through Champawat and Lohaghat to reach it.</p>
      <p className={styles.lead}>Come up with us. We’ll tell you how KumaonRang began on the way.</p>
    </>,
  },
  {
    id: "name", town: "Champawat", altitude: 1615, ground: "deodar", sign: true,
    landmark: { scene: <BaleshwarTemple />, caption: "Baleshwar Temple, Champawat: carved in stone by the Chand kings." },
    content: <>
      <h2 id="name-meaning-title" className={styles.name}>Kumaon <span aria-hidden="true">+</span> <span lang="hi">रंग</span></h2>
      <p className={styles.translation}>The colours of Kumaon.</p>
      <div className={styles.prose}>
        <p><strong>Kumaon</strong> is our region, in the eastern part of Uttarakhand. <strong>Rang (<span lang="hi">रंग</span>)</strong> means colour. Together, they hold the idea behind everything we share.</p>
        <p>The red and white of Aipan. The greens of the hills. The colours of a festival, a familiar face, a memory of home.</p>
      </div>
    </>,
  },
  {
    id: "making", town: "Lohaghat", altitude: 1754, ground: "pine", sign: true,
    landmark: { scene: <KoliDhekLake />, caption: "Koli Dhek lake, Lohaghat." },
    content: <div className={styles.making}>
      <div className={styles.prose}>
        <h2 id="sneha-story-title">An interest in art, a connection to home</h2>
        <p>Sneha’s enthusiasm for art and her curiosity about her Kumaoni heritage came together in making. Frames, Aipan-inspired work and keepsakes became ways to share the culture she felt connected to.</p>
        <p>She began posting her work on Instagram. The response from customers gave her the encouragement to keep creating, and to grow KumaonRang beyond those first conversations.</p>
        <a className={styles.link} href="https://www.instagram.com/kumaonrang/" target="_blank" rel="noopener noreferrer">Visit Sneha’s Instagram<span className="sr-only"> (opens in a new tab)</span></a>
      </div>
      <figure className={styles.artwork}>
        <Link href={frameHref} prefetch={false}>
          <picture>
            <source media="(max-width: 767px)" srcSet={`${frameImage}-card.webp`} />
            <Image src={`${frameImage}.webp`} alt="Framed red and white Om Aipan artwork on a yellow Pichora-inspired background" width={1200} height={1600} sizes="(max-width: 767px) 70vw, 380px" />
          </picture>
        </Link>
        <figcaption><Link href={frameHref} prefetch={false}>Aipan wall decor with a Pichora background</Link></figcaption>
      </figure>
    </div>,
  },
  {
    id: "home", town: "Pithoragarh", altitude: 1627, ground: "dusk", sign: true,
    landmark: { scene: <PanchachuliPeaks />, caption: "The five Panchachuli peaks of Pithoragarh district, at first light." },
    content: <>
      <h2 id="arrival-title">Home, in the Soar valley</h2>
      <div className={styles.prose}>
        <p>Pithoragarh rests in the Soar valley, among four hills: Chandak, Dhwaj, Thal Kedar and Kundar. This is where KumaonRang lives.</p>
        <p>The encouragement from those first customers led to this website: a home for the growing collection, where you can find a gift and speak directly with Sneha.</p>
      </div>
      <p className={styles.blessing} lang="hi">पहाड़ों से, प्यार के साथ</p>
      <p className={styles.blessingTranslation}>From the hills, with love.</p>
      <div className={styles.actions}>
        <Link prefetch={false} href="/contact" className={styles.primary}>Start a conversation</Link>
        <Link prefetch={false} href="/collection" className={styles.secondary}>Explore the collection</Link>
      </div>
    </>,
  },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * A hill road the way it is built: long straight stretches cut across the
 * slope, joined by tight hairpin bends. Straight across the plains; the
 * stretches shorten and the hairpins come faster as it climbs.
 */
function roadPath(height: number, lane: number, plainsEnd: number, width: number): string {
  const margin = width / 2 + 2;
  const left = margin, right = lane - margin;
  let seed = 7;
  const next = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const points: [number, number][] = [[lane * 0.55, 0], [lane * 0.5, plainsEnd * 0.55], [lane * 0.58, plainsEnd]];
  // Clear road between stacked traverses: the parapet's width plus a gap.
  const traverse = width * 2.6 + 6;
  let y = plainsEnd;
  let x = lane * 0.58;
  while (y < height) {
    const climb = (y - plainsEnd) / Math.max(1, height - plainsEnd);
    // A long run along the valley, drifting across the lane.
    y = Math.min(height, y + (220 - climb * 110) * (0.8 + next() * 0.4));
    x = left + (right - left) * (0.25 + next() * 0.5);
    points.push([x, y]);
    if (y >= height) break;
    // Then a stack of hairpins up the slope: near-flat traverses, wall to wall.
    const bends = 3 + Math.round(next() * 2 + climb * 2);
    let side = x > lane / 2 ? 0 : 1;
    for (let bend = 0; bend < bends && y < height; bend++) {
      y = Math.min(height, y + traverse * (0.9 + next() * 0.3));
      points.push([side === 0 ? left : right, y]);
      side = 1 - side;
    }
  }
  // Straight lines, each corner rounded into a hairpin of the road's own width.
  const radius = width * 1.3;
  let path = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 1; index < points.length - 1; index++) {
    const [ax, ay] = points[index - 1], [px, py] = points[index], [bx, by] = points[index + 1];
    const inLength = Math.hypot(px - ax, py - ay), outLength = Math.hypot(bx - px, by - py);
    const r = Math.min(radius, inLength / 2, outLength / 2);
    const startX = px - ((px - ax) / inLength) * r, startY = py - ((py - ay) / inLength) * r;
    const endX = px + ((bx - px) / outLength) * r, endY = py + ((by - py) / outLength) * r;
    path += `L${startX.toFixed(1)} ${startY.toFixed(1)}Q${px.toFixed(1)} ${py.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  return `${path}L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
}

export function StoryRoad() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current, svg = svgRef.current, hud = hudRef.current;
    if (!section || !svg || !hud) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shape = svg.querySelector<SVGPathElement>("[data-road-shape]");
    const driven = Array.from(svg.querySelectorAll<SVGPathElement>("[data-road-driven]"));
    const roads = Array.from(svg.querySelectorAll<SVGPathElement>("[data-road]"));
    const marker = svg.querySelector<SVGGElement>("[data-road-marker]");
    const town = hud.querySelector<HTMLElement>("[data-hud-town]");
    const altitude = hud.querySelector<HTMLElement>("[data-hud-altitude]");
    if (!shape || !marker || !town || !altitude) return;
    let top = 0, height = 1, length = 1, frame = 0, shown = "", near = false;
    let anchors: { y: number; altitude: number; town: string }[] = [];

    const render = () => {
      frame = 0;
      const y = window.scrollY + window.innerHeight * 0.6 - top;
      const progress = clamp(y / height);
      const offset = reduce.matches ? 0 : length * (1 - progress);
      driven.forEach(path => { path.style.strokeDashoffset = `${offset}`; });
      const point = shape.getPointAtLength(length * progress);
      marker.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
      // Altitude runs straight between the towns' real heights.
      let metres = anchors[0]?.altitude ?? 0, here = anchors[0]?.town ?? "";
      for (let index = 0; index < anchors.length; index++) {
        const current = anchors[index], next = anchors[index + 1];
        if (y < current.y) break;
        here = current.town;
        metres = next ? current.altitude + (next.altitude - current.altitude) * clamp((y - current.y) / (next.y - current.y)) : current.altitude;
      }
      const label = `${Math.round(metres).toLocaleString("en-IN")}`;
      if (label + here !== shown) { altitude.textContent = label; town.textContent = here; shown = label + here; }
      const rect = section.getBoundingClientRect();
      // The corner altimeter appears once the Tanakpur sign has scrolled past.
      hud.dataset.on = String(y > (anchors[0]?.y ?? 0) && rect.bottom > window.innerHeight * 0.6);
    };
    const schedule = () => { if (!frame && near) frame = requestAnimationFrame(render); };
    const measure = () => {
      top = section.getBoundingClientRect().top + window.scrollY;
      height = section.offsetHeight;
      const lane = parseFloat(getComputedStyle(section).getPropertyValue("--lane")) || 44;
      const stopEls = Array.from(section.querySelectorAll<HTMLElement>("[data-stop]"));
      svg.setAttribute("viewBox", `0 0 ${lane} ${height}`);
      const roadWidth = parseFloat(getComputedStyle(section).getPropertyValue("--road-width")) || 12;
      const d = roadPath(height, lane, stopEls[1]?.offsetTop ?? height / 4, roadWidth);
      roads.forEach(path => path.setAttribute("d", d));
      length = shape.getTotalLength();
      driven.forEach(path => { path.style.strokeDasharray = `${length}`; });
      // Each town's height holds while you read its stop, then climbs toward the next.
      anchors = stopEls.map((el, index) => ({
        y: index === 0 ? el.offsetHeight * 0.75 : el.offsetTop + Math.min(el.offsetHeight * 0.35, 300),
        altitude: Number(el.dataset.altitude), town: el.dataset.town ?? "",
      }));
      shown = "";
      render();
    };
    // Each town "arrives" once, when a good part of it is on screen; its small loops run only while visible.
    section.dataset.js = "true";
    const stopEls = Array.from(section.querySelectorAll<HTMLElement>("[data-stop]"));
    const arrival = new IntersectionObserver(entries => entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      el.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting && entry.intersectionRatio > 0.2) el.dataset.arrived = "true";
    }), { threshold: [0, 0.2, 0.4] });
    stopEls.forEach(el => arrival.observe(el));
    const observer = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; if (!near) hud.dataset.on = "false"; schedule(); }, { rootMargin: "100px 0px" });
    const resize = new ResizeObserver(measure);
    measure();
    observer.observe(section);
    resize.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    reduce.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); arrival.disconnect(); delete section.dataset.js; resize.disconnect();
      window.removeEventListener("scroll", schedule); reduce.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.road} aria-labelledby="road-home-title">
      <svg ref={svgRef} className={styles.roadSvg} aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <mask id="road-driven-mask" maskUnits="userSpaceOnUse">
            <path data-road data-road-driven className={styles.maskStroke} />
          </mask>
        </defs>
        <path data-road className={styles.ghost} />
        {/* The built road, revealed as you scroll: parapet, edge lines, asphalt, centre line. */}
        <g mask="url(#road-driven-mask)">
          <path data-road className={styles.parapet} />
          <path data-road className={styles.parapetPaint} />
          <path data-road className={styles.edge} />
          <path data-road data-road-shape className={styles.asphalt} />
          <path data-road className={styles.centre} />
        </g>
        <g data-road-marker className={styles.marker}><circle r="7" /><circle r="3" /></g>
      </svg>

      <ol className={styles.stops}>
        {STOPS.map(stop => (
          <li key={stop.id} className={`story-stop ${styles.stop}`} data-stop data-ground={stop.ground} data-altitude={stop.altitude} data-town={stop.town}>
            <svg className={styles.contours} viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              {CONTOURS[stop.ground].map((d, index) => <path key={index} d={d} />)}
            </svg>
            <div className={styles.stopInner}>
              {stop.sign && <p className={styles.sign}><span className={styles.signTown}>{stop.town}</span><span className={styles.signAltitude}>{stop.altitude.toLocaleString("en-IN")} m</span></p>}
              {stop.content}
            </div>
            {stop.landmark && (
              <figure className={styles.landmark}>
                {stop.landmark.scene}
                <figcaption>{stop.landmark.caption}</figcaption>
              </figure>
            )}
          </li>
        ))}
      </ol>

      <div ref={hudRef} className={styles.hud} data-on="false" aria-hidden="true">
        <span className={styles.hudTown} data-hud-town>{STOPS[0].town}</span>
        <span className={styles.hudAltitude}><span data-hud-altitude>{STOPS[0].altitude}</span> m</span>
      </div>
    </section>
  );
}
