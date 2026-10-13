"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { hamperPieces, hamperGroups, hamperOccasions, type HamperPieceId } from "@/data/hamper-pieces";
import { changeHamperPiece, createHamperWhatsAppLink, hamperDetailsErrors, hasHamperSelection, selectedHamperPieces, type HamperDraft } from "@/lib/hamper-builder";
import { createHamperDraftStore, getServerHamperDraft, subscribeToHydration, clientReady, serverReady } from "@/lib/hamper-draft-store";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/icons";
import { HamperBasketArt, HamperPieceArt } from "./hamper-art";
import styles from "./hamper-builder.module.css";

const stepNames = ["Pick your pieces", "Make it personal", "Review & share"];
const localDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
};

function SelectedPieces({ draft, remove }: { draft: HamperDraft; remove: (id: HamperPieceId) => void }) {
  return <ul className={styles.selectedList}>
    {selectedHamperPieces(draft).map(piece => <li key={piece.id}>
      <span><strong>{piece.quantity} ×</strong> {piece.name}</span>
      <button type="button" onClick={() => remove(piece.id)} aria-label={`Remove ${piece.name} from hamper`}>×</button>
    </li>)}
    {draft.extra.trim() && <li className={styles.requestRow}><span>+ Your other-item request</span><span>To confirm</span></li>}
  </ul>;
}

export function HamperBuilder() {
  const [store] = useState(() => createHamperDraftStore());
  const draft = useSyncExternalStore(store.subscribe,store.getSnapshot,getServerHamperDraft);
  const ready = useSyncExternalStore(subscribeToHydration,clientReady,serverReady);
  const setDraft = store.update;
  const [step, setStep] = useState(0);
  const [group, setGroup] = useState<typeof hamperGroups[number]>("All pieces");
  const [announcement, setAnnouncement] = useState("");
  const [choiceError, setChoiceError] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof hamperDetailsErrors>>({});
  const [pulse, setPulse] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const animations = useRef(new Set<Animation>());
  const picks = selectedHamperPieces(draft);
  const total = picks.reduce((sum,piece) => sum + piece.quantity,0);

  useEffect(() => {
    const running = animations.current;
    return () => { running.forEach(animation => animation.cancel()); running.clear(); };
  }, []);

  function flyToBasket(id: HamperPieceId, button: HTMLButtonElement) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !basketRef.current || !Element.prototype.animate) return;
    const source = button.closest("[data-piece]")?.querySelector("svg");
    if (!source) return;
    const from = source.getBoundingClientRect();
    const to = basketRef.current.getBoundingClientRect();
    const x = from.left + from.width/2 - 27, y = from.top + from.height/2 - 27;
    const endX = to.left + to.width/2 - 27, endY = to.top + to.height*.5 - 27;
    const ghost = document.createElement("div");
    ghost.className = styles.flight;
    ghost.setAttribute("aria-hidden","true");
    ghost.dataset.flyingPiece = id;
    ghost.append(source.cloneNode(true));
    document.body.append(ghost);
    const animation = ghost.animate([
      { transform: `translate(${x}px,${y}px) scale(.85) rotate(-12deg)`, opacity: 1 },
      { transform: `translate(${(x+endX)/2}px,${Math.min(y,endY)-65}px) scale(1.04) rotate(9deg)`, opacity: 1, offset: .5 },
      { transform: `translate(${endX}px,${endY}px) scale(.35) rotate(16deg)`, opacity: 0 },
    ], { duration: 620, easing: "cubic-bezier(.22,.61,.36,1)" });
    animations.current.add(animation);
    animation.finished.then(() => setPulse(value => value+1)).catch(() => {}).finally(() => { ghost.remove(); animations.current.delete(animation); });
  }

  function addPiece(id: HamperPieceId, button: HTMLButtonElement) {
    setDraft(previous => changeHamperPiece(previous,id,1));
    setChoiceError("");
    const piece = hamperPieces.find(item => item.id === id)!;
    setAnnouncement(`${piece.name} added. ${(draft.pieces[id] || 0)+1} selected.`);
    flyToBasket(id,button);
  }
  function removePiece(id: HamperPieceId, all = false) {
    setDraft(previous => changeHamperPiece(previous,id,all ? -(previous.pieces[id] || 0) : -1));
    setAnnouncement(`${hamperPieces.find(item => item.id === id)!.name} removed from your hamper.`);
  }
  function update(field: keyof Omit<HamperDraft,"pieces">, value: string) {
    setDraft(previous => previous[field] === value ? previous : ({ ...previous, [field]: value,
      ...(field === "giftNote" && value.trim() ? { pieces: { ...previous.pieces, note: previous.pieces.note || 1 } } : {}),
    }));
    if (field === "extra" && value.trim()) setChoiceError("");
    if (field === "hampers" || field === "pincode" || field === "date") setErrors(previous => ({ ...previous, [field]: undefined }));
  }
  function visit(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      const heading = headingRef.current;
      if (!heading) return;
      heading.focus({preventScroll:true});
      const panel = basketRef.current?.closest("aside");
      const offset = window.innerWidth < 1000 && panel
        ? Number.parseFloat(getComputedStyle(panel).top) + panel.offsetHeight + 40
        : 125;
      window.scrollTo({top: window.scrollY + heading.getBoundingClientRect().top - offset,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    });
  }
  function continueToDetails() {
    if (!hasHamperSelection(draft)) { setChoiceError("Choose a piece, or tell us which other item you would like."); headingRef.current?.focus(); return; }
    visit(1);
  }
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = hamperDetailsErrors(draft,localDate());
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) { document.getElementById(`hamper-${first}`)?.focus(); return; }
    visit(2);
  }

  return <div className={styles.builder} data-hamper-builder>
    <ol className={styles.steps} aria-label="Build your hamper steps">
      {stepNames.map((name,index) => <li key={name}><button type="button" disabled={index>step} aria-current={step===index ? "step" : undefined} onClick={() => visit(index)}><span>{String(index+1).padStart(2,"0")}</span>{name}</button></li>)}
    </ol>
    <div className={styles.layout}>
      <aside className={styles.basketPanel} aria-labelledby="your-hamper-heading">
        <div className={styles.basketHeading}><div><p className="craft-eyebrow">A little basket of thought</p><h2 id="your-hamper-heading">Your hamper</h2></div><span className={styles.count}>{total} {total===1 ? "piece" : "pieces"}</span></div>
        <div ref={basketRef} className={styles.basketCanvas} data-basket-target><HamperBasketArt pieces={picks} pulse={pulse} />{!picks.length && <p>{draft.extra.trim() ? "A special request, just for them." : "Let’s put a little thought inside."}</p>}</div>
        <div className={styles.desktopSelection}><SelectedPieces draft={draft} remove={id => removePiece(id,true)} /></div>
        {hasHamperSelection(draft) && <details className={styles.mobileSelection}><summary>See your choices <span aria-hidden="true">↓</span></summary><SelectedPieces draft={draft} remove={id => removePiece(id,true)} /></details>}
        <p className={styles.quoteNote}>Your choices become a wishlist. Sneha confirms the designs, packaging and price with you.</p>
      </aside>

      <section className={styles.workbench} aria-labelledby="hamper-step-heading">
        <header className={styles.stepHeading}><p className="craft-eyebrow">{step===0 ? "A few of their favourite things" : step===1 ? "The little details matter" : "Made by you, for them"}</p><h2 id="hamper-step-heading" ref={headingRef} tabIndex={-1}>{step===0 ? "What shall we tuck inside?" : step===1 ? "Make it theirs." : "Your hamper, all together."}</h2><p>{step===0 ? "Choose item types below. Exact designs and availability are confirmed with Sneha." : step===1 ? "Add a name, a few words, or the date you have in mind." : "Check your wishlist, then share it with Sneha for a quote."}</p></header>

        {step===0 && <>
          {choiceError && <p className={styles.error} role="alert">{choiceError}</p>}
          <div className={styles.filters} role="group" aria-label="Filter hamper pieces">{hamperGroups.map(item => <button type="button" key={item} aria-pressed={group===item} onClick={() => setGroup(item)}>{item}</button>)}</div>
          <div className={styles.pieceGrid}>
            {hamperPieces.filter(piece => group==="All pieces" || piece.group===group).map(piece => {
              const quantity = draft.pieces[piece.id] || 0;
              return <article className={styles.piece} data-piece={piece.id} data-selected={quantity>0 || undefined} key={piece.id}>
                <div className={styles.artWell}><HamperPieceArt id={piece.id} />{quantity>0 && <span className={styles.added}>In your hamper</span>}</div>
                <h3>{piece.name}</h3><p>{piece.note}</p>
                <div className={styles.pieceControls} data-empty={quantity===0 || undefined}>
                  <button type="button" className={styles.decrease} aria-label={`Remove one ${piece.name}`} disabled={!quantity} onClick={() => removePiece(piece.id)}>−</button>
                  <span className={styles.quantity}>{quantity}</span>
                  <button type="button" className={styles.add} disabled={!ready || quantity>=20} aria-label={`Add ${piece.name}`} onClick={event => addPiece(piece.id,event.currentTarget)}>{quantity ? "+" : <>Add to hamper <span aria-hidden="true">+</span></>}</button>
                </div>
              </article>;
            })}
          </div>
          <div className={styles.otherRequest}><span className={styles.otherMark} aria-hidden="true">✦</span><label htmlFor="hamper-extra">Something else in mind?</label><p>Tell us the item, shade or design you’d love. Sneha will check whether it can be included.</p><textarea id="hamper-extra" rows={3} maxLength={400} placeholder="For example: a photo keepsake, a particular chocolate, or a different accessory…" value={draft.extra} onChange={event => update("extra",event.target.value)} /></div>
          <div className={styles.actions}><p>{total ? `${total} ${total===1 ? "piece" : "pieces"} chosen` : draft.extra.trim() ? "Your special request is ready" : "Start with something they’ll love"}</p><button type="button" className={styles.primary} onClick={continueToDetails} disabled={!ready}>Add personal details <ArrowRightIcon /></button></div>
        </>}

        {step===1 && <form onSubmit={review} noValidate className={styles.detailsForm}>
          <div className={styles.fields}>
            <label>Who is it for? <span>Optional</span><input maxLength={80} autoComplete="off" placeholder="Their name, or someone special…" value={draft.recipient} onChange={event => update("recipient",event.target.value)} /></label>
            <label>What’s the occasion? <span>Optional</span><select value={draft.occasion} onChange={event => update("occasion",event.target.value)}><option value="">Choose an occasion</option>{hamperOccasions.map(item => <option key={item}>{item}</option>)}</select></label>
            <label htmlFor="hamper-hampers">Number of hampers<input id="hamper-hampers" type="number" inputMode="numeric" min={1} max={99} required value={draft.hampers} aria-invalid={!!errors.hampers} aria-describedby={errors.hampers ? "hamper-hampers-error" : "hamper-quantity-help"} onChange={event => update("hampers",event.target.value)} />{errors.hampers && <span className={styles.error} id="hamper-hampers-error">{errors.hampers}</span>}<small id="hamper-quantity-help">Your chosen pieces are for each hamper.</small></label>
            <label htmlFor="hamper-date">Occasion date <span>Optional</span><input id="hamper-date" type="date" min={localDate()} value={draft.date} aria-invalid={!!errors.date} aria-describedby={errors.date ? "hamper-date-error" : undefined} onInput={event => update("date",event.currentTarget.value)} onChange={event => update("date",event.target.value)} />{errors.date && <span className={styles.error} id="hamper-date-error">{errors.date}</span>}</label>
            <label htmlFor="hamper-pincode">Delivery PIN code <span>Optional</span><input id="hamper-pincode" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6-digit PIN code" value={draft.pincode} aria-invalid={!!errors.pincode} aria-describedby={errors.pincode ? "hamper-pincode-error" : undefined} onChange={event => update("pincode",event.target.value.replace(/\D/g,""))} />{errors.pincode && <span className={styles.error} id="hamper-pincode-error">{errors.pincode}</span>}</label>
          </div>
          <label className={styles.noteField}>A note to tuck inside <span>Optional</span><textarea rows={4} maxLength={250} placeholder="The words that will make them smile…" value={draft.giftNote} onChange={event => update("giftNote",event.target.value)} /><small>Writing a message adds a personal note to your hamper.</small></label>
          <p className={styles.help}>Sneha will confirm preparation and delivery timing for your date. Your draft stays in this tab while you put it together.</p>
          <div className={styles.actions}><button type="button" className={styles.back} onClick={() => visit(0)}>← Back to pieces</button><button className={styles.primary} type="submit">Review my hamper <ArrowRightIcon /></button></div>
        </form>}

        {step===2 && <div className={styles.review}>
          <div className={styles.reviewCard}><div className={styles.reviewTitle}><p className="craft-eyebrow">Your chosen pieces</p><button type="button" onClick={() => visit(0)}>Edit pieces</button></div><ul>{picks.map(piece => <li key={piece.id}><HamperPieceArt id={piece.id} /><span>{piece.name}</span><strong>× {piece.quantity}</strong></li>)}</ul>{draft.extra.trim() && <div className={styles.requestReview}><p>Other-item / design request</p><p>{draft.extra}</p><small>Availability to be checked by Sneha.</small></div>}</div>
          <div className={styles.reviewCard}><div className={styles.reviewTitle}><p className="craft-eyebrow">The personal details</p><button type="button" onClick={() => visit(1)}>Edit details</button></div><dl><div><dt>Hampers</dt><dd>{draft.hampers}</dd></div>{draft.recipient.trim() && <div><dt>For</dt><dd>{draft.recipient}</dd></div>}{draft.occasion && <div><dt>Occasion</dt><dd>{draft.occasion}</dd></div>}{draft.pincode && <div><dt>Delivery PIN</dt><dd>{draft.pincode}</dd></div>}{draft.date && <div><dt>Occasion date</dt><dd>{draft.date}</dd></div>}</dl>{draft.giftNote.trim() && <blockquote>{draft.giftNote}</blockquote>}</div>
          <div className={styles.sendCard}><span aria-hidden="true">✦</span><h3>Over to Sneha, with love.</h3><p>She’ll check your choices and any special requests, then confirm packaging, availability, price and delivery with you.</p>{hasHamperSelection(draft) ? <a className={styles.primary} href={createHamperWhatsAppLink(draft)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Share my hamper on WhatsApp</a> : <button className={styles.primary} type="button" onClick={() => visit(0)}>Choose a piece or add a request</button>}<small>Opens a prepared message. Send it in WhatsApp to request your quote; your order is confirmed with Sneha.</small></div>
        </div>}
      </section>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
