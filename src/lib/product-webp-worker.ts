import encode from "@jsquash/webp/encode.js";

export type WebpEncodeRequest = { id: number; pixels: ArrayBuffer; width: number; height: number; quality: number };
export type WebpEncodeResponse = { id: number; bytes?: ArrayBuffer; error?: string };

// No shared memory / cross-origin isolation required. Encoding stays off the UI
// thread, and the parent terminates this worker after each source photograph.
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<WebpEncodeRequest>) => void) | null;
  postMessage: (message: WebpEncodeResponse, transfer?: Transferable[]) => void;
};
scope.onmessage = async ({ data: { id, pixels, width, height, quality } }) => {
  try {
    const data = new Uint8ClampedArray(pixels);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 ||
      width > 1920 || height > 1920 || data.length !== width * height * 4) throw new Error("Invalid photo dimensions.");
    const bytes = await encode({ data, width, height, colorSpace: "srgb" }, {
      quality: Math.max(86, Math.min(92, quality * 100)), method: 3, thread_level: 0,
    });
    scope.postMessage({ id, bytes }, [bytes]);
  } catch {
    scope.postMessage({ id, error: "WebP conversion could not finish. Please retry this photo, or choose a smaller copy if the device is low on memory." });
  }
};
