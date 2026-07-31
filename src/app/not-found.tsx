import Link from "next/link";

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
        Let&apos;s get you back to something beautiful.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
          href="/"
        >
          Back to Home
        </Link>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-200/80 bg-white/80 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
          href="/collection"
        >
          Browse the Collection
        </Link>
      </div>
    </main>
  );
}
