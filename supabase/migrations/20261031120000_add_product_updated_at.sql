-- Record when each product last changed, so the sitemap's lastmod is accurate.
-- Existing rows start from their creation time; every later edit bumps it.

alter table public.products
  add column if not exists updated_at timestamptz not null default now();

update public.products set updated_at = created_at where created_at is not null;

create or replace function public.touch_product_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_product_updated_at();
