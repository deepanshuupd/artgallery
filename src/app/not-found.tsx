import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { collections } from "@/lib/collections";
import { searchShortcuts } from "@/lib/product-search";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500">
        Page not found
      </p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        This page has wandered off.
      </h1>
      <p className="mt-5 max-w-md text-base leading-8 text-stone-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Search the shop, or start from one of these.
      </p>
      {/* A plain GET form, so search works before any JavaScript loads. */}
      <form action="/collection" method="get" role="search" className="store-search mt-8 w-full max-w-md">
        <label htmlFor="not-found-search" className="sr-only">Search the shop</label>
        <SearchIcon className="h-4 w-4 shrink-0" />
        <input id="not-found-search" name="q" type="search" placeholder="Try “wedding” or “frame”" />
        <button type="submit" className="shrink-0 px-2 text-sm font-semibold text-[var(--color-geru)]">Search</button>
      </form>
      <nav aria-label="Popular searches" className="mt-5 flex flex-wrap justify-center gap-2">
        {searchShortcuts.map(shortcut => <Link key={shortcut.query} prefetch={false} href={shortcut.query === "diwali" ? "/diwali-gifts" : `/collection?q=${encodeURIComponent(shortcut.query)}`} className="inline-flex min-h-9 items-center rounded-full border border-stone-300 bg-[#fffaf1] px-4 text-xs font-semibold text-stone-700">{shortcut.label}</Link>)}
      </nav>
      <nav aria-label="Shop categories" className="mt-8 grid w-full max-w-md grid-cols-2 gap-2 text-left text-sm">
        {collections.map(collection => <Link key={collection.slug} prefetch={false} href={`/${collection.slug}`} className="flex min-h-11 items-center border-l-2 border-[rgba(168,69,48,0.25)] px-3 text-stone-700 hover:border-[var(--color-geru)] hover:text-[var(--color-geru)]">{collection.label}</Link>)}
        <Link prefetch={false} href="/curated-hampers" className="flex min-h-11 items-center border-l-2 border-[rgba(168,69,48,0.25)] px-3 text-stone-700 hover:border-[var(--color-geru)] hover:text-[var(--color-geru)]">Gift hampers</Link>
      </nav>
      <Link
        className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
        href="/"
      >
        Back to Home
      </Link>
    </main>
  );
}
