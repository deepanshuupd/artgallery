import type { Metadata } from "next";

import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  title: "Contact | Art Gallery by Sneha",
  description:
    "Get in touch with Art Gallery by Sneha for handmade gifts, customized frames, and curated hampers. Reach us on WhatsApp, Instagram, or from our studio in Pithoragarh, Uttarakhand.",
};

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.14),transparent_68%)]" />
        <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[rgba(185,131,116,0.1)] blur-3xl" />
        <div className="absolute -right-20 bottom-24 h-72 w-72 rounded-full bg-[rgba(122,130,114,0.1)] blur-3xl" />
      </div>

      <ContactSection />
    </main>
  );
}
