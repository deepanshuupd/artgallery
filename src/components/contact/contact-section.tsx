"use client";

import { motion } from "motion/react";

import { ContactForm } from "@/components/contact/contact-form";
import {
  ArrowUpRightIcon,
  GiftIcon,
  InstagramIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { fadeInUp } from "@/lib/motion";
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
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-whatsapp)] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-transform duration-300 group-hover:scale-105">
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
                    <ArrowUpRightIcon className="h-4 w-4" />
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
                      <ArrowUpRightIcon className="h-4 w-4" />
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
          <GiftIcon className="h-4 w-4" />
        </span>
        We&apos;re happy to discuss custom hampers, bulk orders, and personalized
        gifts of every size.
      </motion.p>
    </div>
  );
}
