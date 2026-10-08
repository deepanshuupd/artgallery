import type { Product } from "@/types/product";

export type ProductHighlight = { label: string; value: string };

const factLabels = [
  { label: "Minimum order", pattern: /^(minimum order(?: quantity)?|moq)$/i },
  { label: "Size", pattern: /^(?:frame |product )?(?:size|dimensions)$/i },
  { label: "Material", pattern: /^(?:material|base|fabric)$/i },
  { label: "Personalisation", pattern: /^(?:customi[sz]ation|personali[sz]ation)$/i },
  { label: "Included", pattern: /^(?:includes|included|contents|package contents|set includes)$/i },
  { label: "Display", pattern: /^(?:mounting|display|hanging)$/i },
];

/** Promote explicitly labelled catalogue facts without inferring missing specs. */
export function getProductHighlights(product: Pick<Product, "details">): ProductHighlight[] {
  const facts = product.details.flatMap(detail => {
    const match = detail.replace(/\*\*/g, "").trim().match(/^([^:=]+)\s*[:=]\s*(.+)$/);
    if (!match) return [];
    const type = factLabels.find(item => item.pattern.test(match[1].trim()));
    return type ? [{ label: type.label, value: match[2].trim() }] : [];
  });
  return factLabels.flatMap(({ label }) => {
    const values = [...new Set(facts.filter(fact => fact.label === label).map(fact => fact.value))];
    return values.length ? [{ label, value: values.join("; ") }] : [];
  }).slice(0, 4);
}

/** Only unqualified piece-count minimums map directly to the quantity stepper. */
export function getMinimumPieceQuantity(product: Pick<Product, "details">): number {
  const fact = getProductHighlights(product).find(item => item.label === "Minimum order");
  const match = fact?.value.match(/^(\d+)\s*(?:pcs?|pieces?)\.?$/i);
  const quantity = match ? Number(match[1]) : 1;
  return quantity >= 1 && quantity <= 999 ? quantity : 1;
}
