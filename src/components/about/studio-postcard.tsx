"use client";

import { useEffect, useRef, useState } from "react";

import { CraftOrnament } from "@/components/home/craft-ornament";
import { CloseIcon, InstagramIcon } from "@/components/icons";
import { createWhatsAppLink } from "@/lib/whatsapp";

import styles from "./studio-postcard.module.css";

const offerInquiry = createWhatsAppLink(
  "Hi Sneha! I'd like to order and claim the 10% follower offer from your studio note. Please help me confirm my Instagram and Pinterest follows and apply the discount to my order."
);

/** Native dialog supplies focus trapping and Escape; CSS handles the paper motion. */
export function StudioPostcard() {
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const savedOverflow = useRef<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen && restoreFocus.current) {
      trigger.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    const updateVisibility = () => {
      if (rail.current) rail.current.dataset.paused = String(document.hidden);
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      if (savedOverflow.current !== null) document.body.style.overflow = savedOverflow.current;
    };
  }, []);

  useEffect(() => {
    const customerNotes = document.getElementById("customer-notes");
    const originStory = document.querySelector('section[aria-labelledby="heritage-title"], [data-story-map-section]');
    const postcard = rail.current;
    const sections = [customerNotes, originStory].filter((section): section is Element => section !== null);
    if (!sections.length || !postcard || !("IntersectionObserver" in window)) return;
    // Preserve the offer elsewhere without placing it over the origin map.
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      postcard.dataset.reading = String(customerNotes !== null && visible.has(customerNotes));
      postcard.dataset.originReading = String(originStory !== null && visible.has(originStory));
    }, { rootMargin: "-74px 0px 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
    return () => {
      observer.disconnect();
      delete postcard.dataset.reading;
      delete postcard.dataset.originReading;
    };
  }, []);

  const openNote = () => {
    if (!dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    savedOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  };

  const finishClose = () => {
    if (savedOverflow.current !== null) document.body.style.overflow = savedOverflow.current;
    savedOverflow.current = null;
    restoreFocus.current = true;
    setIsOpen(false);
  };

  return (
    <>
      <div ref={rail} className={styles.rail} data-open={isOpen}>
        <button ref={trigger} className={styles.peek} type="button" onClick={openNote}
          aria-label="Open Sneha’s studio note" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="studio-note">
          <span className={styles.noteTab} aria-hidden="true">For you</span>
          <span className={styles.miniEnvelope} aria-hidden="true">
            <span className={styles.miniFold} />
            <span className={styles.miniAddress}>From<br />Kumaon</span>
            <span className={styles.miniStamp}><CraftOrnament /></span>
          </span>
          <span className={styles.hint} aria-hidden="true">A little note from the hills</span>
        </button>
      </div>
      <dialog ref={dialog} id="studio-note" className={styles.dialog} aria-labelledby="studio-note-title"
        onClose={finishClose}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            event.currentTarget.close();
          }
        }}>
        <div className={styles.stage}>
          <div className={styles.envelopeBack} aria-hidden="true" />
          <div className={styles.flap} aria-hidden="true" />
          <div className={styles.letter}>
            <button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close studio note" autoFocus><CloseIcon /></button>
            <div className={styles.cover}>
              <span className={styles.address}>Pithoragarh → wherever you call home</span>
              <h2 id="studio-note-title" className={styles.title}>A little note from the hills.</h2>
              <span className={styles.stamp} aria-hidden="true"><CraftOrnament /><span>KUMAON</span></span>
              <span className={styles.postmark} aria-hidden="true"><span /><span /><span /></span>
            </div>
            <div className={styles.messageBody}>
              <div className={styles.offer}>
                <p className={styles.offerLabel}>For our Instagram &amp; Pinterest family</p>
                <p className={styles.offerValue}><strong>10%</strong><span>off every order</span></p>
              </div>
              <p className={styles.message}>
                Follow us on Instagram and Pinterest, then share your usernames
                with Sneha on WhatsApp. She’ll confirm your follows and apply your discount.
              </p>
              <div className={styles.followLinks}>
              <a
                className={styles.instagram}
                href="https://www.instagram.com/art_gallery_05s/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow KumaonRang on Instagram (opens in a new tab)"
              >
                <InstagramIcon />
                <span>Follow on Instagram<span className={styles.handle}>@art_gallery_05s</span></span>
                <span className={styles.linkArrow} aria-hidden="true">↗</span>
              </a>
              <a className={styles.instagram} href="https://www.pinterest.com/snehaupadhyay168/"
                target="_blank" rel="noopener noreferrer" aria-label="Follow Sneha on Pinterest (opens in a new tab)">
                <span className={styles.pinterestMark} aria-hidden="true">P</span>
                <span>Follow on Pinterest<span className={styles.handle}>@snehaupadhyay168</span></span>
                <span className={styles.linkArrow} aria-hidden="true">↗</span>
              </a>
              </div>
              <a className={styles.claim} href={offerInquiry} target="_blank" rel="noopener noreferrer"
                aria-label="Ask Sneha to claim the follower offer on WhatsApp (opens in a new tab)">Claim with Sneha on WhatsApp</a>
              <div className={styles.signoff}>
                <span className={styles.signature}>With love, Sneha</span>
                <span className={styles.origin}>From Pithoragarh, Uttarakhand</span>
              </div>
            </div>
          </div>
          <div className={styles.envelopeFront} aria-hidden="true"><span lang="hi">पहाड़ों से, प्यार के साथ</span></div>
        </div>
      </dialog>
    </>
  );
}
