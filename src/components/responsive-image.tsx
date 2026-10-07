import type { ImgHTMLAttributes } from "react";
import { responsiveImage } from "@/lib/responsive-image";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  alt: string;
  sizes: string;
  fill?: boolean;
  priority?: boolean;
};

/** Pre-compressed, versioned assets with real browser-selected width candidates. */
export function ResponsiveImage({ src, alt, fill, priority, style, loading, ...props }: Props) {
  const { avifSrc, avifSrcSet, ...image } = responsiveImage(src);
  const fallback = (
    // These assets are optimized offline; Next's runtime optimizer stays disabled.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} {...image} alt={alt} decoding="async" loading={priority ? "eager" : loading ?? "lazy"}
      fetchPriority={priority ? "high" : props.fetchPriority}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style} />
  );
  if (!avifSrcSet) return fallback;
  return (
    <>
      {/* Only preload the supported modern format, never two copies of the hero. */}
      {priority && <link rel="preload" as="image" type="image/avif" href={avifSrc}
        imageSrcSet={avifSrcSet} imageSizes={props.sizes} fetchPriority="high" />}
      <picture style={{ display: "contents" }}>
        <source type="image/avif" srcSet={avifSrcSet} sizes={props.sizes} />
        {fallback}
      </picture>
    </>
  );
}
