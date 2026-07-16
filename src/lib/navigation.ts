export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "Curated Hampers", href: "/curated-hampers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
