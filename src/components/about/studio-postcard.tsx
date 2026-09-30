"use client";

import { useEffect, useRef, useState } from "react";

import { CraftOrnament } from "@/components/home/craft-ornament";
import { CloseIcon, InstagramIcon } from "@/components/icons";

import styles from "./studio-postcard.module.css";

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
              <p className={styles.salutation}>There’s a story before every keepsake.</p>
              <p className={styles.message}>
                The colours coming together. The little details. A new piece ready
                to find its person. Come a little closer to the everyday behind KumaonRang.
              </p>
              <div className={styles.signoff}>
                <span className={styles.signature}>With love, Sneha</span>
                <span className={styles.origin}>From Pithoragarh, Uttarakhand</span>
              </div>
              <a
                className={styles.instagram}
                href="https://www.instagram.com/art_gallery_05s/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Step inside KumaonRang on Instagram (opens in a new tab)"
              >
                <InstagramIcon />
                <span>Step inside our Instagram<span className={styles.handle}>@art_gallery_05s</span></span>
                <span className={styles.linkArrow} aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className={styles.envelopeFront} aria-hidden="true"><span lang="hi">पहाड़ों से, प्यार के साथ</span></div>
        </div>
      </dialog>
    </>
  );
}
