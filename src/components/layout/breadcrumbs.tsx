import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/site";

export type Breadcrumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return <>
    <nav aria-label="Breadcrumb" className="store-breadcrumbs">
      <ol>{items.map((item, index) => <li key={item.href}>
        {index > 0 && <span aria-hidden="true">/</span>}
        {index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link prefetch={false} href={item.href}>{item.label}</Link>}
      </li>)}</ol>
    </nav>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: `${getSiteUrl()}${item.href}` })) }} />
  </>;
}
