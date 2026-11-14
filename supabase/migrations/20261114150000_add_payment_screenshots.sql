-- Customers can show they've paid with a screenshot instead of (or as well as)
-- typing the UPI reference number.
--
-- Screenshots go to a private bucket, in a folder named after the order id:
-- payment-proofs/<order id>/<file>. Anyone holding an order's id (an
-- unguessable UUID, shown only to that customer) may upload up to three images
-- while the order is waiting for payment and less than a week old. Nobody but
-- the shop admin can read, list or replace them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.orders add column payment_proof text;

create or replace function public.order_accepts_payment_proof(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.orders o
    where o.id::text = split_part(p_name, '/', 1)
      and o.status = 'awaiting_payment'
      and o.created_at > pg_catalog.now() - interval '7 days'
  )
  and (
    select count(*) from storage.objects s
    where s.bucket_id = 'payment-proofs' and s.name like split_part(p_name, '/', 1) || '/%'
  ) < 3;
$$;

revoke all on function public.order_accepts_payment_proof(text) from public;
grant execute on function public.order_accepts_payment_proof(text) to anon, authenticated;

create policy "Customers can upload payment screenshots"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'payment-proofs' and public.order_accepts_payment_proof(name));

create policy "Admin can read payment screenshots"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'payment-proofs' and (select private.is_admin()));

create policy "Admin can delete payment screenshots"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'payment-proofs' and (select private.is_admin()));

-- Paying now takes a UPI reference, a screenshot, or both.
drop function public.submit_order_payment(uuid, text);

create function public.submit_order_payment(p_id uuid, p_reference text default null, p_proof text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  result text;
  reference text := nullif(p_reference, '');
  proof text := nullif(p_proof, '');
begin
  if reference is null and proof is null then
    raise exception 'Upload a payment screenshot or enter the UPI reference number.' using errcode = 'P0001';
  end if;
  if reference is not null and reference !~ '^[A-Za-z0-9]{6,35}$' then
    raise exception 'Enter the UPI reference number exactly as your payment app shows it.' using errcode = 'P0001';
  end if;
  if proof is not null and (
    split_part(proof, '/', 1) <> p_id::text
    or not exists (select 1 from storage.objects s where s.bucket_id = 'payment-proofs' and s.name = proof)
  ) then
    raise exception 'Your screenshot did not finish uploading. Please choose it again.' using errcode = 'P0001';
  end if;

  update public.orders o
  set upi_reference = coalesce(reference, o.upi_reference),
      payment_proof = coalesce(proof, o.payment_proof),
      payment_submitted_at = pg_catalog.now(),
      status = 'payment_submitted'
  where o.id = p_id and o.status = 'awaiting_payment'
  returning o.status into result;
  if result is null then
    select o.status into result from public.orders o where o.id = p_id;
    if result is null then
      raise exception 'This order could not be found.' using errcode = 'P0001';
    end if;
  end if;
  return result;
end;
$$;

revoke all on function public.submit_order_payment(uuid, text, text) from public;
grant execute on function public.submit_order_payment(uuid, text, text) to anon, authenticated;

create or replace function public.get_order(p_id uuid)
returns table (
  number bigint, status text, created_at timestamptz, customer_name text, city text, pincode text,
  items jsonb, subtotal numeric, delivery numeric, total numeric, payment_submitted boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select o.number, o.status, o.created_at, o.customer_name, o.city, o.pincode,
         o.items, o.subtotal, o.delivery, o.total, (o.upi_reference is not null or o.payment_proof is not null)
  from public.orders o where o.id = p_id;
$$;
