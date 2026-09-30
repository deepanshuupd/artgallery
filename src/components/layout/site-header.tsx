"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CloseIcon, MenuIcon, SparkleIcon } from "@/components/icons";
import { navigationItems } from "@/lib/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import styles from "./site-header.module.css";

function HamperSparkles() {
  return <span className={styles.sparkles} aria-hidden="true">
    <SparkleIcon className={styles.starOne} />
    <SparkleIcon className={styles.starTwo} />
    <SparkleIcon className={styles.starThree} />
  </span>;
}

function isActivePath(currentPath: string, href: string) {
  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(168,69,48,0.16)] bg-[rgba(255,250,241,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
        <Link
          className="group flex shrink-0 flex-col items-center text-stone-900 transition-colors duration-300 hover:text-stone-700"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <BrandMark className="text-[1.7rem] sm:text-[2.3rem]" />
          <span className="block text-[0.5rem] uppercase tracking-[0.22em] text-stone-600 sm:text-[0.55rem]">
            Art from the hills
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                prefetch={false}
                key={item.href}
                className={[
                  "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300",
                  item.href === "/curated-hampers" ? styles.hamperLink : "",
                  active
                    ? "bg-[var(--color-geru)] text-[var(--color-biswar)] shadow-[0_10px_24px_rgba(168,69,48,0.2)]"
                    : "text-stone-700 hover:bg-[rgba(168,69,48,0.08)] hover:text-[var(--color-geru)]",
                ].join(" ")}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.href === "/curated-hampers" && <HamperSparkles />}
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(168,69,48,0.25)] bg-[var(--color-biswar)] text-[var(--color-geru)] shadow-sm transition hover:bg-white md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-[rgba(168,69,48,0.16)] bg-[rgba(255,250,241,0.98)] transition-[max-height,opacity] duration-300 md:hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
        id="mobile-navigation"
        inert={!isOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6"
        >
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                prefetch={false}
                key={item.href}
                className={[
                  "flex min-h-11 items-center rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-300",
                  item.href === "/curated-hampers" ? styles.hamperLink : "",
                  active
                    ? "bg-[var(--color-geru)] text-[var(--color-biswar)]"
                    : "text-stone-700 hover:bg-[rgba(168,69,48,0.08)] hover:text-[var(--color-geru)]",
                ].join(" ")}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.href === "/curated-hampers" && <HamperSparkles />}
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
