-- Keep the admin list and check out of the API-exposed public schema, so
-- is_admin() is no longer callable at /rest/v1/rpc/is_admin. Policies still
-- evaluate it as the signed-in role, which needs schema usage and execute.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter table public.admin_users set schema private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

drop policy "Admin can manage products" on public.products;
create policy "Admin can manage products"
  on public.products for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy "Admin can upload product images" on storage.objects;
drop policy "Admin can read product images" on storage.objects;
drop policy "Admin can delete product images" on storage.objects;

create policy "Admin can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and (select private.is_admin()));

create policy "Admin can read product images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images' and (select private.is_admin()));

create policy "Admin can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and (select private.is_admin()));

drop function public.is_admin();
