"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";
import { navigationItems } from "@/lib/navigation";

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
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[rgba(247,241,234,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="group shrink-0 text-stone-900 transition-colors duration-300 hover:text-stone-700"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <span className="block font-serif text-[1.35rem] font-semibold tracking-[0.08em] sm:text-2xl">
            Art Gallery
          </span>
          <span className="block text-[0.65rem] uppercase tracking-[0.34em] text-stone-500 sm:text-[0.68rem]">
            by Sneha
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                className={[
                  "rounded-full px-4 py-2 text-sm tracking-[0.16em] transition-all duration-300",
                  active
                    ? "bg-stone-900 text-stone-50 shadow-[0_10px_30px_rgba(51,40,33,0.16)]"
                    : "text-stone-700 hover:bg-white/70 hover:text-stone-950",
                ].join(" ")}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300/80 bg-white/70 text-stone-900 shadow-sm transition hover:bg-white md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-stone-200/80 bg-[rgba(255,253,252,0.96)] transition-[max-height,opacity] duration-300 md:hidden",
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
                key={item.href}
                className={[
                  "rounded-2xl px-4 py-3 text-sm tracking-[0.16em] transition-colors duration-300",
                  active
                    ? "bg-stone-900 text-stone-50"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-950",
                ].join(" ")}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
