import { brand } from "@/lib/brand";

type BrandMarkProps = {
  className?: string;
};

/** The bilingual wordmark uses Latin and Devanagari as one visual signature. */
export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span aria-label={brand.name} className={`brand-mark ${className}`} role="img">
      <span aria-hidden="true" className="brand-mark__latin">Kumaon</span>
      <span aria-hidden="true" className="brand-mark__devanagari" lang="hi">
        रंग
      </span>
    </span>
  );
}
