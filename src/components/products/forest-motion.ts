type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

/** Attach one visibility controller. Sources stay detached until the page is ready. */
export function attachForestMotion(scene: HTMLElement, video: HTMLVideoElement, options: {
  isPaused: () => boolean; onAvailability: (available: boolean) => void;
}) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  let visible = false;
  let loaded = document.readyState === "complete";
  let disposed = false;
  let failed = false;
  let loadTimer: ReturnType<typeof setTimeout> | undefined;
  const permitted = () => !failed && !reduced.matches && !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
  const sync = () => {
    if (disposed) return;
    const allowed = permitted();
    options.onAvailability(allowed);
    if (!allowed || !visible || !loaded || document.hidden || options.isPaused()) { video.pause(); return; }
    if (!video.getAttribute("src")) video.src = window.matchMedia("(max-width: 767px)").matches ? "/video/pine-wind-mobile-v1.mp4" : "/video/pine-wind-desktop-v1.mp4";
    void video.play().catch(() => { /* Autoplay refusal keeps the complete poster. */ });
  };
  const ready = () => { loadTimer = setTimeout(() => { loaded = true; sync(); }, 350); };
  const error = () => { failed = true; sync(); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .15; sync(); }, {
    threshold: [0, .15], rootMargin: window.matchMedia("(max-width: 767px)").matches ? "-66px 0px 0px" : "-100px 0px 0px",
  });
  observer.observe(scene);
  reduced.addEventListener("change", sync);
  connection?.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  scene.addEventListener("forest-motion-change", sync);
  video.addEventListener("error", error);
  if (!loaded) window.addEventListener("load", ready, { once: true });
  sync();
  return () => {
    disposed = true;
    observer.disconnect();
    clearTimeout(loadTimer);
    window.removeEventListener("load", ready);
    reduced.removeEventListener("change", sync);
    connection?.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    scene.removeEventListener("forest-motion-change", sync);
    video.removeEventListener("error", error);
    video.pause();
  };
}
