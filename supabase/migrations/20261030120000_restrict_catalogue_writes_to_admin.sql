-- Restrict catalogue and product-image writes to the shop admin.
--
-- Previously any authenticated user could insert, update or delete products and
-- product images. Public sign-up is open, so anyone confirming an email address
-- could edit the catalogue with the public anon key. Writes now require the
-- signed-in user to be listed in public.admin_users.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS with no policies: the table is invisible to anon and authenticated
-- clients. Only is_admin() (security definer) and the service role read it.
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Matches DEFAULT_ADMIN_EMAIL in src/lib/admin-email.ts. Add other admins with
-- an insert into public.admin_users using the service role or SQL editor.
insert into public.admin_users (user_id)
select id from auth.users
where lower(email) = 'sneha@gmail.com' and email_confirmed_at is not null
on conflict do nothing;

-- Products: the public read policy for published products is unchanged.
drop policy if exists "Authenticated users can do everything" on public.products;
create policy "Admin can manage products"
  on public.products for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Product images: the public view policy is unchanged. Uploads use
-- upsert: false, so no UPDATE policy is needed.
drop policy if exists "Authenticated can upload images 16wiy3a_0" on storage.objects;
drop policy if exists "Authenticated can delete images 16wiy3a_0" on storage.objects;
drop policy if exists "Authenticated can delete images 16wiy3a_1" on storage.objects;

create policy "Admin can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admin can read product images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admin can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));
