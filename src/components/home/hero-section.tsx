"use client";

import Link from "next/link";
import { useRef } from "react";
import { ResponsiveImage } from "@/components/responsive-image";
import { useHomeAtmosphere } from "./use-home-atmosphere";
import atmosphere from "./home-atmosphere.module.css";
import styles from "./hero-section.module.css";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  useHomeAtmosphere(heroRef);

  return (
    <section ref={heroRef} className={`${styles.hero} ${atmosphere.hero}`} aria-labelledby="welcome-title">
      <div className={styles.scene} aria-hidden="true">
        <ResponsiveImage className={styles.forest} src="/video/pine-poster-mobile-v1.webp" alt="" width={720} height={1280} sizes="(max-width: 767px) 100vw, 50vw" priority />
        <ResponsiveImage className={styles.village} src="/images/culture/kumaon-village-v1.webp" alt="" width={1672} height={941} sizes="(max-width: 767px) 100vw, 50vw" priority />
        <ResponsiveImage className={styles.welcome} src="/images/culture/kumaoni-welcome-v1.webp" alt="" width={1024} height={1536} sizes="(max-width: 767px) 82vw, 38vw" priority />
      </div>
      <div className={`heritage-hero__copy ${styles.copy}`} data-home-reveal="hero-copy">
        <p className={`craft-eyebrow ${styles.location}`}><span aria-hidden="true">✦</span> Pithoragarh, Uttarakhand</p>
        <h1 id="welcome-title">Bring home<br /><em>the colours of Kumaon</em></h1>
        <p className={`heritage-hero__intro ${styles.intro}`}>In the colours of Aipan. In a familiar Pahadi face, the little things that make a place feel like home.</p>
        <p className={`heritage-hero__description ${styles.description}`}>Discover Aipan-inspired art, Pahadi keepsakes and personal gifts from Sneha’s small shop in Pithoragarh — for your home, and the people who feel like it.</p>
        <div className={`craft-actions ${styles.actions}`}>
          <Link prefetch={false} href="/collection" className={styles.primary}>Browse the shop</Link>
          <Link prefetch={false} href="/curated-hampers" className={styles.secondary}>Explore gift hampers</Link>
        </div>
      </div>
    </section>
  );
}
