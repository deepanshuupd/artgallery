import { brand } from "@/lib/brand";
import { ResponsiveImage } from "@/components/responsive-image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

/** Shared mountain wordmark used in the header, footer and structured brand identity. */
export function BrandMark({ className = "", priority = true }: BrandMarkProps) {
  return (
    // The name sits on the image itself, where search crawlers read it as well as screen readers.
    <span className={`brand-mark ${className}`}>
      <ResponsiveImage
        className="brand-mark__image"
        src="/brand/kumaonrang-logo-v3.webp"
        alt={brand.name}
        width={512}
        height={248}
        sizes="(max-width: 767px) 120px, 136px"
        priority={priority}
      />
    </span>
  );
}
