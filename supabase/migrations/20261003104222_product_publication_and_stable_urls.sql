-- Stock and publication are independent. Preserve all existing public URLs,
-- resolving same-category name collisions in the storefront's current order.
alter table public.products
  add column if not exists slug text,
  add column if not exists url_category text,
  add column if not exists is_published boolean not null default true;

-- Match catalog.ts: NFKD, ASCII lower-case and hyphen-separated words.
do $$
declare
  item record;
  base_slug text;
  candidate text;
begin
  for item in select id, name, category from public.products
    where slug is null or url_category is null
    order by created_at desc, id desc
  loop
    base_slug := coalesce(nullif(trim(both '-' from regexp_replace(
      lower(normalize(item.name, NFKD)), '[^a-z0-9]+', '-', 'g')), ''), 'handmade-gift');
    candidate := base_slug;
    if exists(select 1 from public.products where url_category = item.category and slug = candidate) then
      candidate := base_slug || '-' || left(item.id::text, 8);
    end if;
    if exists(select 1 from public.products where url_category = item.category and slug = candidate) then
      candidate := base_slug || '-' || item.id::text;
    end if;
    update public.products set slug = candidate, url_category = item.category where id = item.id;
  end loop;
end $$;

alter table public.products
  alter column slug set not null,
  alter column url_category set not null,
  add constraint products_public_url_unique unique (url_category, slug),
  add constraint products_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  add constraint products_url_category_valid check (url_category in
    ('Keychains','Frames','Fridge Magnets','Personalized Gifts','Curated Hampers'));

-- Generate a URL once, at insert. Merchandising and spelling edits must not
-- change it. Invoker privileges and an empty search_path avoid elevated access.
create or replace function public.preserve_product_url()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare base_slug text;
begin
  if tg_op = 'UPDATE' then
    if new.slug is distinct from old.slug or new.url_category is distinct from old.url_category then
      raise exception 'Product URLs are permanent. Edit the name or display category instead.';
    end if;
    return new;
  end if;

  new.url_category := new.category;
  base_slug := coalesce(nullif(trim(both '-' from pg_catalog.regexp_replace(
    pg_catalog.lower(pg_catalog.normalize(new.name, 'NFKD')), '[^a-z0-9]+', '-', 'g')), ''), 'handmade-gift');
  new.slug := base_slug;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.url_category || '/' || base_slug, 0));
  if exists(select 1 from public.products where url_category = new.url_category and slug = new.slug) then
    new.slug := base_slug || '-' || pg_catalog.left(new.id::text, 8);
  end if;
  if exists(select 1 from public.products where url_category = new.url_category and slug = new.slug) then
    new.slug := base_slug || '-' || new.id::text;
  end if;
  return new;
end $$;
revoke all on function public.preserve_product_url() from public;
grant execute on function public.preserve_product_url() to authenticated, service_role;
create trigger products_preserve_public_url
  before insert or update on public.products
  for each row execute function public.preserve_product_url();

alter table public.products enable row level security;
-- The existing authenticated management policy is retained. Public readers can
-- see published products whether in stock or not, but cannot see drafts.
alter policy "Public can read available products" on public.products
  using (is_published = true);

comment on column public.products.slug is 'Immutable public URL slug, generated once on insert.';
comment on column public.products.url_category is 'Immutable original URL category; display category may change.';
comment on column public.products.is_available is 'Current stock availability. False does not unpublish the product.';
comment on column public.products.is_published is 'Public visibility independent of stock. False removes the public listing.';
