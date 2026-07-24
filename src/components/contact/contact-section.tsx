"use client";

import { motion } from "motion/react";

import { ContactForm } from "@/components/contact/contact-form";
import { generateGeneralInquiryLink } from "@/lib/whatsapp";

const instagramProfiles = [
  {
    handle: "art_gallery_05s",
    name: "Art Gallery by Sneha",
    note: "Keychains, frames, magnets, and everyday handmade pieces.",
    href: "https://www.instagram.com/art_gallery_05s/",
  },
  {
    handle: "snehacuratedhampers",
    name: "Sneha Curated Hampers",
    note: "Styled gift boxes and seasonal hamper edits.",
    href: "https://www.instagram.com/snehacuratedhampers/",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect height="4" rx="1" width="18" x="3" y="8" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5" />
    </svg>
  );
}

export function ContactSection() {
  const whatsAppLink = generateGeneralInquiryLink();

  return (
    <div className="mx-auto max-w-7xl">
      <motion.header
        {...fadeInUp}
        className="mx-auto max-w-3xl text-center"
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <p className="text-[0.72rem] uppercase tracking-[0.36em] text-stone-500 sm:text-xs">
          Get in touch
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.08] text-stone-900 sm:text-5xl lg:text-6xl">
          Every great gift starts
          <span className="block text-[var(--color-rose-clay)]">
            with a conversation.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
          Whether it&apos;s a custom frame, a hamper for a hundred guests, or an
          idea you can&apos;t quite put into words yet — we&apos;d love to hear
          it.
        </p>
      </motion.header>

      <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8">
        <ContactForm />

        <div className="flex flex-col gap-5">
          <motion.a
            {...fadeInUp}
            className="group relative overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(155deg,rgba(51,40,33,0.98),rgba(72,58,48,0.96))] p-6 shadow-[0_24px_70px_rgba(51,40,33,0.24)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 sm:p-7"
            href={whatsAppLink}
            rel="noopener noreferrer"
            target="_blank"
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[rgba(37,211,102,0.16)] blur-3xl transition-transform duration-500 group-hover:scale-125"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,164,106,0.86)] to-transparent"
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-transform duration-300 group-hover:scale-105">
                  <WhatsAppIcon />
                </span>
                <h2 className="mt-5 text-2xl leading-tight text-[var(--color-porcelain)] sm:text-3xl">
                  Chat on WhatsApp
                </h2>
                <p className="mt-2.5 max-w-sm text-sm leading-7 text-stone-300">
                  The fastest way to reach us — the same chat where every order,
                  customization, and hamper is planned.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-champagne)]">
                  Start a conversation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </span>
              </div>
            </div>
          </motion.a>

          <div className="grid gap-5 sm:grid-cols-2">
            {instagramProfiles.map((profile, index) => (
              <motion.a
                key={profile.handle}
                {...fadeInUp}
                className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,253,252,0.82)] p-6 shadow-[0_18px_60px_rgba(51,40,33,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(51,40,33,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40 focus-visible:ring-offset-2"
                href={profile.href}
                rel="noopener noreferrer"
                target="_blank"
                transition={{ duration: 0.6, delay: 0.14 + index * 0.08, ease: "easeOut" }}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-8 top-6 h-24 w-24 rounded-full bg-[rgba(185,131,116,0.2)] blur-2xl transition-transform duration-500 group-hover:scale-125"
                />

                <div className="relative">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f9ce34,#ee2a7b_50%,#6228d7)] text-white shadow-[0_10px_26px_rgba(238,42,123,0.28)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <InstagramIcon />
                  </span>
                  <h3 className="mt-4 text-xl leading-tight text-stone-900">
                    {profile.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium tracking-[0.06em] text-[var(--color-rose-clay)]">
                    @{profile.handle}
                  </p>
                  <p className="mt-2.5 text-sm leading-6 text-stone-600">
                    {profile.note}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-stone-700">
                    Follow along
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            {...fadeInUp}
            className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,253,252,0.82)] p-6 shadow-[0_18px_60px_rgba(51,40,33,0.08)] backdrop-blur sm:p-7"
            transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent"
            />

            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(122,130,114,0.14)] text-[var(--color-sage-ash)]">
                <MapPinIcon />
              </span>
              <div>
                <h3 className="text-xl leading-tight text-stone-900">
                  Our studio
                </h3>
                <address className="mt-1.5 text-sm not-italic leading-7 text-stone-600">
                  Pithoragarh, Uttarakhand, 262501
                </address>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Nestled in the Kumaon hills — every piece ships from our home
                  studio, wrapped by hand.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.p
        {...fadeInUp}
        className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2.5 text-center text-sm leading-7 text-stone-600 sm:mt-12"
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <span aria-hidden="true" className="text-[var(--color-champagne)]">
          <GiftIcon />
        </span>
        We&apos;re happy to discuss custom hampers, bulk orders, and personalized
        gifts of every size.
      </motion.p>
    </div>
  );
}
