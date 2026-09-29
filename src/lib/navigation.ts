export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/collection" },
  { label: "Hampers", href: "/curated-hampers" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];
