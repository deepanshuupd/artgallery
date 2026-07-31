export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-[var(--color-rose-clay)]"
        />
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-stone-500">
          Loading…
        </p>
      </div>
    </div>
  );
}
