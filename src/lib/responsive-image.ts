import variants from "../data/responsive-images.json";

type Variant = { src: string; width: number; height: number; bytes: number; avifSrc?: string; avifBytes?: number };
const images: Record<string, Variant[]> = variants;

/** Exact immutable-source matching prevents stale photographs after admin edits. */
export function responsiveImage(src: string) {
  const candidates = images[src];
  if (!candidates?.length) return { src, srcSet: undefined, avifSrc: undefined, avifSrcSet: undefined };
  const avif = candidates.filter(image => image.avifSrc);
  return {
    src: candidates[candidates.length - 1].src,
    srcSet: candidates.map(image => `${image.src} ${image.width}w`).join(", "),
    avifSrc: avif.at(-1)?.avifSrc,
    avifSrcSet: avif.length ? avif.map(image => `${image.avifSrc} ${image.width}w`).join(", ") : undefined,
  };
}
