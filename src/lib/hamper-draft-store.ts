import { emptyHamperDraft, hamperDraftKey, restoreHamperDraft, type HamperDraft } from "@/lib/hamper-builder";

type DraftStorage = Pick<Storage,"getItem" | "setItem">;

/** One store per builder instance: never share mutable state between server requests. */
export function createHamperDraftStore(storage?: DraftStorage) {
  let draft: HamperDraft = { ...emptyHamperDraft, pieces: {} };
  const listeners = new Set<() => void>();
  try {
    storage ??= typeof window !== "undefined" ? window.sessionStorage : undefined;
    const saved = storage?.getItem(hamperDraftKey);
    if (saved) draft = restoreHamperDraft(JSON.parse(saved));
  } catch { /* Blocked or malformed storage must not prevent building a hamper. */ }
  return {
    getSnapshot: () => draft,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    update: (next: (previous: HamperDraft) => HamperDraft) => {
      const updated = next(draft);
      if (updated === draft) return;
      draft = updated;
      try { storage?.setItem(hamperDraftKey,JSON.stringify(draft)); } catch { /* Keep the in-memory draft usable. */ }
      listeners.forEach(listener => listener());
    },
  };
}

export const getServerHamperDraft = () => emptyHamperDraft;
export const subscribeToHydration = () => () => {};
export const clientReady = () => true;
export const serverReady = () => false;
