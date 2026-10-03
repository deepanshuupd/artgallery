# Product image delivery

Vercel image optimization is disabled globally (`images.unoptimized: true`).
Photos are served from Supabase public storage URLs, without a Vercel image proxy
or Supabase image transformation endpoint. Visitors do not trigger resizing.

## New uploads

Upload through the product admin form. JPEG, PNG, WebP, AVIF and other formats
your browser can decode are accepted. iPhone HEIC/HEIF photos have an automatic
browser decoder fallback. There are no application limits on source file size or
resolution. Very large photos remain subject to device memory and browser limits. Keep original photos separately if you need them
for printing: only compressed versions are uploaded.

The admin browser creates two WebP files before upload:

| Version | Maximum longest side | Target file size | Where used |
| --- | --- | --- | --- |
| Card | 960 px | 160 KiB | Homepage, product cards, admin previews, thumbnails |
| Detail | 1920 px | 550 KiB | Product gallery |

New uploads start at quality 92%, then try 89% and 86%. If necessary, dimensions
are reduced once by 15%. File size targets are soft: detailed artwork may use
more bytes to preserve image quality rather than rejecting an upload. Photos are never enlarged.
Orientation, aspect ratio and transparency are retained.

Both files have unique URLs and a one-year cache lifetime. Replacing a photo
creates a new URL; do not overwrite a file at an existing URL. Both variants must
upload successfully before the form adds the detail URL. Save the product after
uploading. Photos removed from an unsaved form can remain in storage; inspect
references before deleting unused files. Store only the detail URL in the product
record; the storefront derives the paired card URL for `optimized/v2/` files.
Older URLs continue to work without requiring a database schema change.

Both uploads must send `headers: { "x-robots-tag": "all" }`. Supabase Storage
otherwise returns `X-Robots-Tag: none`, which means `noindex, nofollow` to Google.
A public HTTP 200 photo is not necessarily indexable. This header does not grant
storage-write permissions or enable image transformation; it allows discovery of
already-public product photographs. The admin form shares these options through
`PRODUCT_IMAGE_UPLOAD_OPTIONS` in `src/lib/product-image.ts`.

Enter the real product name before uploading. New filenames use a short product
name and a unique identifier, not keyword lists. Each photo can have its own plain
text description and optional caption. Encoded dimensions are recorded
automatically. `products.image_metadata` is keyed by the detail URL so descriptions
stay with the correct photograph when the gallery is reordered. The first photo
is the primary/share image. Blank descriptions fall back to the actual product
name; review them against the photograph before adding specific view/material
claims. Future saved galleries automatically participate in the image sitemap.

## Existing photos

The local migration requires the existing Supabase service-role environment
variable and `sharp` (available in the Next.js installation). Never put the
service-role key in browser code.

1. Run `node scripts/optimize-product-images.mjs --prepare` locally.
2. Review the printed manifest, byte counts, skipped files and sample images.
3. Run `node scripts/optimize-product-images.mjs --apply /absolute/path/manifest.json`.
4. Retain the manifest. To restore product references, run the same script with
   `--rollback /absolute/path/manifest.json`.

Preparation only reads the catalog and writes local files. Apply uploads new
files, checks they are publicly accessible, then updates product references.
Original storage objects are retained. Products edited since preparation cause
the script to stop rather than overwrite those edits. The public catalog cache
expires after 60 seconds. Deploy the storefront changes to use card images.

## Fixing an existing indexing header

`node scripts/audit-product-image-seo.mjs` is read-only by default and checks both
variants, encoded dimensions and restrictive image-response headers. HTTP or
indexing failures produce a nonzero exit code.

For existing v2 WebP pairs blocked by Storage's header, use
`scripts/fix-product-image-indexing.mjs`:

1. Run `node scripts/fix-product-image-indexing.mjs --prepare`.
2. Review the manifest, scoped product list and additional storage required.
3. Run `node scripts/fix-product-image-indexing.mjs --apply /absolute/path/manifest.json`.
4. Retain the manifest. `--rollback /absolute/path/manifest.json` restores the
   original URL/metadata references, unless an editor has since changed them.

This is a necessary indexability migration, not a filename-only SEO rename. It
copies the existing bytes without resizing or recompression, uses new immutable
URLs with the supported indexing upload header, and verifies public headers and
SHA-256 byte equality before updating product references. Every original is
retained. Metadata follows the migrated photo URL. Compare-and-swap guards
protect concurrent product edits. No bucket permissions are widened, no storage
SQL is used and no visitor-triggered proxy is introduced. Rollback does not delete
either set of images; it restores the original indexing limitation too.

## Free resource monitoring

Disabling optimization does not erase historical Vercel usage. Old deployments,
other projects, or old open browser tabs can still request optimized images.
Check project-specific usage after deployment and inspect a product photo URL:
it should be a Supabase `/storage/v1/object/public/` URL, not `/_next/image` or
`/storage/v1/render/image/`.

Check Supabase storage and egress as well as Vercel usage. Compression and caching
reduce usage, but traffic and catalog growth can still exhaust free allowances.
Keep bucket uploads restricted to authenticated administrators. The migration
report records an earlier conversion policy (800/1600 px and quality up to 82%);
that migration has already been applied. The quality policy above is for new uploads.
