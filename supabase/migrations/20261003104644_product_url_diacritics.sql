-- Strip combining accents before punctuation, matching the JavaScript fallback.
-- Existing persisted URLs stay untouched.
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
    pg_catalog.lower(pg_catalog.regexp_replace(pg_catalog.normalize(new.name, 'NFKD'), U&'[\0300-\036f]', '', 'g')), '[^a-z0-9]+', '-', 'g')), ''), 'handmade-gift');
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
