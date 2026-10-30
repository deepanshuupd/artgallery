-- Correct three misspelt product URLs. Product URLs are otherwise permanent:
-- preserve_product_url() rejects slug changes, so it is bypassed only for
-- these rows. The old URLs redirect via RENAMED_PRODUCT_SLUGS in
-- src/lib/catalog.ts; deploy that code before applying this migration.

alter table public.products disable trigger products_preserve_public_url;

update public.products set slug = 'wedding-brooch-collection'
  where url_category = 'Personalized Gifts' and slug = 'weeding-brooch-collection';
update public.products set slug = 'handmade-rakhi'
  where url_category = 'Personalized Gifts' and slug = 'handmade-rakhii';
update public.products set slug = 'traditional-pahadi-topi'
  where url_category = 'Personalized Gifts' and slug = 'traditional-pahadi-topii';

alter table public.products enable trigger products_preserve_public_url;
