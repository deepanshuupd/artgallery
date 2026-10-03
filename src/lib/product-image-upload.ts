// Byte targets guide compression; input size and resolution are not restricted.
export const PRODUCT_IMAGE_VARIANTS = {
  detail: { maxDimension: 1920, targetBytes: 550 * 1024 },
  card: { maxDimension: 960, targetBytes: 160 * 1024 },
} as const;

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

type EncodedImage = { file: File; width: number; height: number };

export type PreparedProductImages = {
  detail: File;
  card: File;
  width: number;
  height: number;
  cardWidth: number;
  cardHeight: number;
};

async function decodeImage(file: File): Promise<DecodedImage> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  } catch {
    // Safari can decode formats through <img> that createImageBitmap cannot.
    const url = URL.createObjectURL(file);
    const image = new Image();
    try {
      image.src = url;
      await image.decode();
      return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(url) };
    } catch {
      URL.revokeObjectURL(url);
    }
  }

  // Load the iPhone decoder only when native decoding fails. Read the actual
  // container as well as the extension: iOS sometimes supplies an empty MIME.
  const header = new TextDecoder("ascii").decode(await file.slice(0, 64).arrayBuffer());
  const maybeHeic = /\.(heic|heif|hif)$/i.test(file.name) || /heic|heif/i.test(file.type) ||
    (header.slice(4, 8) === "ftyp" && /heic|heix|hevc|hevx|heim|heis|mif1|msf1/.test(header));
  if (maybeHeic) {
    try {
      const { heicTo } = await import("heic-to/csp");
      const bitmap = await heicTo({ blob: file, type: "bitmap" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      throw new Error(`Could not read ${file.name}. The iPhone photo may be damaged or this device may not have enough memory. Please retry.`);
    }
  }
  throw new Error(`Could not read ${file.name}. This image format is not supported by this browser or the file is damaged.`);
}

async function compress(image: DecodedImage, name: string, maxDimension: number, targetBytes: number): Promise<EncodedImage> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The browser could not prepare this image.");
  // Keep quality at 86% or higher. Byte budgets are soft so detailed artwork
  // can remain sharp instead of being forced into a tiny file.
  let best: { blob: Blob; width: number; height: number } | undefined;
  try {
    for (const dimension of [maxDimension, Math.round(maxDimension * 0.85)]) {
      const scale = Math.min(1, dimension / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.92, 0.89, 0.86]) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(result => result ? resolve(result) : reject(new Error("Image compression failed. Please retry.")), "image/webp", quality);
        });
        if (blob.type !== "image/webp") throw new Error("This browser cannot save WebP photos. Please use an updated browser.");
        const candidate = { blob, width: canvas.width, height: canvas.height };
        if (!best || blob.size < best.blob.size) best = candidate;
        if (blob.size <= targetBytes) {
          return { file: new File([blob], name, { type: "image/webp" }), width: candidate.width, height: candidate.height };
        }
      }
    }
    if (!best) throw new Error("Image compression failed. Please retry.");
    return { file: new File([best.blob], name, { type: "image/webp" }), width: best.width, height: best.height };
  } finally {
    canvas.width = canvas.height = 1;
  }
}

/** Process once in the admin's browser; preserve orientation, aspect and transparency. */
export async function prepareProductImages(file: File): Promise<PreparedProductImages> {
  const image = await decodeImage(file);
  try {
    if (!image.width || !image.height) throw new Error(`Could not read the dimensions of ${file.name}.`);
    const name = file.name.replace(/\.[^.]+$/, "");
    const detail = await compress(image, `${name}.webp`, PRODUCT_IMAGE_VARIANTS.detail.maxDimension, PRODUCT_IMAGE_VARIANTS.detail.targetBytes);
    const card = await compress(image, `${name}-card.webp`, PRODUCT_IMAGE_VARIANTS.card.maxDimension, PRODUCT_IMAGE_VARIANTS.card.targetBytes);
    return { detail: detail.file, card: card.file, width: detail.width, height: detail.height, cardWidth: card.width, cardHeight: card.height };
  } finally {
    image.close();
  }
}
