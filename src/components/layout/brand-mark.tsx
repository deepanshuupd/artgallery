import { brand } from "@/lib/brand";
import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

/** Shared mountain wordmark used in the header, footer and structured brand identity. */
export function BrandMark({ className = "", priority = true }: BrandMarkProps) {
  return (
    <span aria-label={brand.name} className={`brand-mark ${className}`} role="img">
      <Image
        className="brand-mark__image"
        src="/brand/kumaonrang-logo-v3.webp"
        alt=""
        width={512}
        height={248}
        sizes="(max-width: 767px) 120px, 136px"
        priority={priority}
      />
    </span>
  );
}
