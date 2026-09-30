import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { brand } from "@/lib/brand";
import { navigationItems } from "@/lib/navigation";
import { generateGeneralInquiryLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-[rgba(168,69,48,0.2)] bg-[var(--color-espresso)] px-4 py-7 text-[var(--color-biswar)] sm:mt-16 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr] lg:gap-14">
        <div>
          <Link aria-label={brand.name} className="inline-block text-4xl" href="/">
            <BrandMark className="brand-mark--inverse text-4xl" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-stone-300">
            {brand.descriptor}. Aipan-inspired art, Pahadi keepsakes, and
            personal gifts made in Pithoragarh.
          </p>
        </div>

        <div>
          <p className="text-[0.66rem] font-medium uppercase tracking-[0.24em] text-[var(--color-champagne)]">
            Explore
          </p>
          <nav className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1" aria-label="Footer navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                className="inline-flex min-h-11 items-center text-sm text-stone-200 transition hover:text-[var(--color-champagne)]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="inline-flex min-h-11 items-center text-sm text-stone-200 transition hover:text-[var(--color-champagne)]"
              href="/uttarakhand-gifts"
            >
              Uttarakhand gifts
            </Link>
            <Link
              className="inline-flex min-h-11 items-center text-sm text-stone-200 transition hover:text-[var(--color-champagne)]"
              href="/pithoragarh-aipan-art"
            >
              Aipan art guide
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-[0.66rem] font-medium uppercase tracking-[0.24em] text-[var(--color-champagne)]">
            From the hills
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-200">
            Pithoragarh, Uttarakhand<br />
            India
          </p>
          <a
            className="mt-5 inline-flex min-h-11 items-center rounded-full border border-[rgba(255,250,241,0.3)] px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-biswar)] transition hover:border-[var(--color-champagne)] hover:text-[var(--color-champagne)]"
            href={generateGeneralInquiryLink()}
            rel="noreferrer"
            target="_blank"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-xs text-stone-400 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} KumaonRang. Made in Kumaon.</p>
        <p>Colour · Craft · Keepsakes</p>
      </div>
    </footer>
  );
}
