import type { WebpEncodeRequest, WebpEncodeResponse } from "./product-webp-worker";

/** MIME and extension alone do not establish that a file is WebP. */
export async function isWebp(blob: Blob): Promise<boolean> {
  if (blob.type !== "image/webp" || blob.size < 12) return false;
  const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  return String.fromCharCode(...header.slice(0, 4)) === "RIFF" && String.fromCharCode(...header.slice(8, 12)) === "WEBP";
}

export type ProductWebpEncoder = ReturnType<typeof createProductWebpEncoder>;

export function createProductWebpEncoder() {
  let fallback = false;
  let worker: Worker | undefined;
  let nextId = 0;
  let pending: { id: number; resolve: (blob: Blob) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> } | undefined;
  function dispose() {
    worker?.terminate();
    worker = undefined;
    if (pending) {
      clearTimeout(pending.timer);
      pending.reject(new Error("Photo preparation was interrupted. Please retry this photo."));
      pending = undefined;
    }
  }
  function fail(message: string) {
    const request = pending;
    pending = undefined;
    if (request) { clearTimeout(request.timer); request.reject(new Error(message)); }
    worker?.terminate();
    worker = undefined;
  }
  return {
    async encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
      if (!fallback) {
        const native = await new Promise<Blob | null>(resolve => {
          try { canvas.toBlob(resolve, "image/webp", quality); } catch { resolve(null); }
        });
        if (native && await isWebp(native)) return native;
        // Safari may silently return PNG even when it was asked for WebP.
        // Do not upload/relabel those bytes, or repeat the PNG attempt.
        fallback = true;
      }
      if (!worker) {
        try {
          worker = new Worker(new URL("./product-webp-worker.ts", import.meta.url), { type: "module" });
          worker.onmessage = ({ data }: MessageEvent<WebpEncodeResponse>) => {
            if (!pending || data.id !== pending.id) return;
            if (data.error || !data.bytes) { fail(data.error || "Photo conversion returned no image. Please retry."); return; }
            const request = pending;
            pending = undefined;
            clearTimeout(request.timer);
            request.resolve(new Blob([data.bytes], { type: "image/webp" }));
          };
          worker.onerror = event => { event.preventDefault(); fail("The photo converter could not load. Check your connection and retry the photo."); };
          worker.onmessageerror = () => fail("Photo conversion was interrupted. Please retry this photo.");
        } catch {
          throw new Error("The photo converter could not start. Reload this page and try the photo again.");
        }
      }
      if (pending) throw new Error("Another photo is still being prepared. Please wait.");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("The browser could not read this photo. Please retry.");
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const id = ++nextId;
      const blob = await new Promise<Blob>((resolve, reject) => {
        const timer = setTimeout(() => fail("This photo took too long to convert. Please retry, or choose a smaller copy."), 60000);
        pending = { id, resolve, reject, timer };
        const request: WebpEncodeRequest = { id, pixels: pixels.data.buffer as ArrayBuffer, width: pixels.width, height: pixels.height, quality };
        try { worker!.postMessage(request, [request.pixels]); } catch { fail("The photo could not be sent to the converter. Please retry."); }
      });
      if (!await isWebp(blob)) throw new Error("The converter returned an invalid photo. Nothing was uploaded; please retry.");
      return blob;
    },
    close: dispose,
  };
}
