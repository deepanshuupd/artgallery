"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500">
        Something went wrong
      </p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        We hit an unexpected snag.
      </h1>
      <p className="mt-5 max-w-md text-base leading-8 text-stone-600">
        Please try again in a moment. If it keeps happening, reach us on
        WhatsApp and we&apos;ll help you directly.
      </p>
      <button
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
