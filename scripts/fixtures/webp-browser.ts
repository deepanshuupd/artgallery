import { prepareProductImages } from "../../src/lib/product-image-upload";

// Isolated localhost diagnostic. No Supabase client, credentials or writes.
const root = document.querySelector<HTMLDivElement>("#app")!;
root.innerHTML = `<h1>Admin WebP upload checks</h1><p>Runs the real image-preparation code, with no cloud uploads.</p><p id="engine"></p><label><input id="fallback" type="checkbox"> Emulate missing native WebP encoding</label><p><button id="run">Run built-in checks</button> <button id="ping">Check UI response</button> <span id="pings"></span></p><label>Or choose test photos <input id="photos" type="file" accept="image/*,.heic,.heif" multiple></label><p id="status" role="status"></p><pre id="results"></pre><div id="previews"></div>`;
const output = root.querySelector<HTMLPreElement>("#results")!;
const status = root.querySelector<HTMLParagraphElement>("#status")!;
const force = root.querySelector<HTMLInputElement>("#fallback")!;
const originalToBlob = HTMLCanvasElement.prototype.toBlob;
HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
  return originalToBlob.call(this, callback, force.checked && type === "image/webp" ? "image/png" : type, quality);
};
const probe = document.createElement("canvas");
probe.width = probe.height = 1;
originalToBlob.call(probe, blob => {
  root.querySelector("#engine")!.textContent = `Native WebP result: ${blob?.type || "null"}. ${navigator.userAgent}`;
}, "image/webp", .9);
let pings = 0;
root.querySelector("#ping")!.addEventListener("click", () => { root.querySelector("#pings")!.textContent = `${++pings} UI responses`; });
let busy = false;
async function run(files: File[]) {
  if (busy) return;
  busy = true;
  output.textContent = "";
  root.querySelector("#previews")!.replaceChildren();
  const results = [];
  let previousTick = performance.now(), maxUiGap = 0;
  const timer = setInterval(() => { const now = performance.now(); maxUiGap = Math.max(maxUiGap, now - previousTick); previousTick = now; }, 25);
  try {
    for (const file of files.slice(0, 5)) {
      status.textContent = `Preparing ${file.name}…`;
      const start = performance.now();
      const prepared = await prepareProductImages(file);
      for (const kind of ["detail", "card"] as const) {
        const blob = prepared[kind];
        const width = kind === "detail" ? prepared.width : prepared.cardWidth;
        const height = kind === "detail" ? prepared.height : prepared.cardHeight;
        const response = await fetch(`/result?name=${encodeURIComponent(`${file.name}-${kind}.webp`)}`, { method: "POST", body: blob });
        if (!response.ok) throw new Error("Local result verification failed.");
        const verified = await response.json();
        results.push({ source: file.name, kind, type: blob.type, bytes: blob.size, width, height, verified });
        const image = document.createElement("img");
        image.src = URL.createObjectURL(blob); image.alt = `${file.name} ${kind} WebP result`;
        image.style.cssText = "max-width:160px;max-height:180px;margin:10px;background:#ddd";
        root.querySelector("#previews")!.append(image);
      }
      output.textContent = JSON.stringify({ results, lastPhotoMs: Math.round(performance.now() - start), maxUiGapMs: Math.round(maxUiGap) }, null, 2);
    }
    status.textContent = `PASS: ${files.slice(0, 5).length} source photos converted; every output decoded as genuine WebP.`;
  } catch (error) { status.textContent = `FAIL: ${error instanceof Error ? error.message : error}`; }
  finally { clearInterval(timer); busy = false; }
}
root.querySelector<HTMLInputElement>("#photos")!.addEventListener("change", event => { void run(Array.from((event.currentTarget as HTMLInputElement).files || [])); });
root.querySelector("#run")!.addEventListener("click", async () => {
  const names: string[] = await (await fetch("/fixtures")).json();
  const files: File[] = [];
  for (const name of names) { const blob = await (await fetch(`/fixture/${name}`)).blob(); files.push(new File([blob], name, { type: blob.type })); }
  await run(files);
});
