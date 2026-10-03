-- Additive only: existing gallery URLs, product data and RLS policies stay intact.
alter table public.products
  add column if not exists image_metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_image_metadata_object'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products add constraint products_image_metadata_object
      check (jsonb_typeof(image_metadata) = 'object');
  end if;
end $$;

comment on column public.products.image_metadata is
  'Public photo metadata keyed by exact detail image URL: optional alt, caption, width, height, cardWidth, cardHeight. No private or unconfirmed rights data.';
