import { hamperPieces, hamperOccasions, type HamperPieceId } from "@/data/hamper-pieces";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { getSiteUrl } from "@/lib/site";

export const hamperDraftKey = "kumaonrang-hamper-v1";
export type HamperDraft = {
  pieces: Partial<Record<HamperPieceId, number>>;
  extra: string; recipient: string; occasion: string; giftNote: string;
  pincode: string; date: string; hampers: string;
};
export const emptyHamperDraft: HamperDraft = {
  pieces: {}, extra: "", recipient: "", occasion: "", giftNote: "", pincode: "", date: "", hampers: "1",
};
const text = (value: unknown, limit: number) => typeof value === "string" ? value.slice(0, limit) : "";
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
}

/** Session drafts are untrusted; only known item IDs and bounded quantities survive. */
export function restoreHamperDraft(value: unknown): HamperDraft {
  if (!value || typeof value !== "object") return { ...emptyHamperDraft, pieces: {} };
  const raw = value as Record<string, unknown>;
  const quantities = raw.pieces && typeof raw.pieces === "object" ? raw.pieces as Record<string, unknown> : {};
  const pieces = Object.fromEntries(hamperPieces.flatMap(piece => {
    const count = quantities[piece.id];
    return typeof count === "number" && Number.isInteger(count) && count > 0 && count <= 20 ? [[piece.id, count]] : [];
  }));
  const occasion = text(raw.occasion, 80);
  const date = text(raw.date, 11), hampers = text(raw.hampers, 3);
  return { pieces, extra: text(raw.extra, 400), recipient: text(raw.recipient, 80),
    occasion: hamperOccasions.some(item => item === occasion) ? occasion : "",
    giftNote: text(raw.giftNote, 250), pincode: text(raw.pincode, 6).replace(/\D/g, ""),
    date: validDate(date) ? date : "",
    hampers: /^(?:[1-9]|[1-9]\d)$/.test(hampers) ? hampers : "1" };
}

export function selectedHamperPieces(draft: HamperDraft) {
  return hamperPieces.flatMap(piece => {
    const quantity = draft.pieces[piece.id] || 0;
    return quantity > 0 ? [{ ...piece, quantity }] : [];
  });
}

export function changeHamperPiece(draft: HamperDraft, id: HamperPieceId, delta: number): HamperDraft {
  const pieces = { ...draft.pieces };
  const quantity = Math.max(0, Math.min(20, (pieces[id] || 0) + delta));
  if (quantity) pieces[id] = quantity;
  else delete pieces[id];
  return { ...draft, pieces, ...(id === "note" && !quantity ? { giftNote: "" } : {}) };
}

export function hasHamperSelection(draft: HamperDraft) {
  return selectedHamperPieces(draft).length > 0 || draft.extra.trim().length > 0;
}

export function hamperDetailsErrors(draft: HamperDraft, today: string) {
  const errors: Partial<Record<"hampers" | "pincode" | "date", string>> = {};
  if (!/^(?:[1-9]|[1-9]\d)$/.test(draft.hampers)) errors.hampers = "Choose between 1 and 99 hampers. For a larger order, mention it in your special request.";
  if (draft.pincode && !/^\d{6}$/.test(draft.pincode)) errors.pincode = "Enter a 6-digit delivery PIN code, or leave it empty.";
  if (draft.date && (!validDate(draft.date) || draft.date < today)) errors.date = "Choose today or a future occasion date, or leave it empty.";
  return errors;
}

export function generateHamperMessage(draft: HamperDraft): string {
  if (!hasHamperSelection(draft)) throw new Error("Choose a piece or request an item first.");
  const lines = ["KumaonRang | Custom hamper enquiry", "", `Number of hampers: ${draft.hampers}`, "", "Pieces in EACH hamper:"];
  const selections = selectedHamperPieces(draft);
  if (selections.length) selections.forEach((piece,index) => lines.push(`${index+1}. ${piece.quantity} × ${piece.name}`));
  else lines.push("• Please help me source the item request below.");
  if (draft.extra.trim()) lines.push("", "Other item / design request (please confirm availability):", draft.extra.trim());
  if (draft.recipient.trim()) lines.push("", `Gift for: ${draft.recipient.trim()}`);
  if (draft.occasion) lines.push(`Occasion: ${draft.occasion}`);
  if (draft.giftNote.trim()) lines.push("", "Message for the personal note:", draft.giftNote.trim());
  if (draft.pincode) lines.push("", `Delivery PIN code: ${draft.pincode}`);
  if (draft.date) lines.push(`Occasion date: ${draft.date} (please confirm if delivery is possible)`);
  lines.push("", "Please confirm designs, packaging, final price, shipping and preparation time.", "", `${getSiteUrl()}/build-your-hamper`);
  return lines.join("\n");
}

export function createHamperWhatsAppLink(draft: HamperDraft) {
  return createWhatsAppLink(generateHamperMessage(draft));
}
