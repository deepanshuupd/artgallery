"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <nav className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
      <div className="flex items-center gap-8">
        <span className="font-serif text-lg text-stone-800">
          Sneha Admin
        </span>
        <div className="flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "font-medium text-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-md bg-stone-100 px-4 py-1.5 text-sm text-stone-600 transition hover:bg-stone-200"
      >
        Log out
      </button>
    </nav>
  );
}
