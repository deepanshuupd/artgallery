-- Orders placed through the website checkout, paid by UPI with no gateway.
--
-- Customers never touch this table directly: the shop's server validates each
-- order against the live catalogue and writes it with the service role. Only
-- the shop admin can read or update orders, through the admin pages.

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  -- Shown to customers as KR-1001 and put in the UPI payment note.
  number bigint generated always as identity (start with 1001) unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment', 'payment_submitted', 'confirmed', 'dispatched', 'delivered', 'cancelled')),

  customer_name text not null check (char_length(customer_name) between 2 and 80),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email text check (email is null or char_length(email) <= 120),
  address text not null check (char_length(address) between 8 and 300),
  city text not null check (char_length(city) between 2 and 60),
  state text not null check (char_length(state) between 2 and 60),
  pincode text not null check (pincode ~ '^[1-9][0-9]{5}$'),
  occasion_date date,
  notes text check (notes is null or char_length(notes) <= 600),

  -- A snapshot of what was bought, at the price charged.
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 50),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery numeric(10, 2) not null check (delivery >= 0),
  total numeric(10, 2) not null check (total = subtotal + delivery),

  upi_reference text check (upi_reference is null or upi_reference ~ '^[A-Za-z0-9]{6,35}$'),
  payment_submitted_at timestamptz,
  admin_note text check (admin_note is null or char_length(admin_note) <= 1000)
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_phone_created_at_idx on public.orders (phone, created_at desc);

alter table public.orders enable row level security;
revoke all on public.orders from anon;

create policy "Admin can read orders"
  on public.orders for select
  to authenticated
  using ((select private.is_admin()));

create policy "Admin can update orders"
  on public.orders for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create or replace function public.touch_orders_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_orders_updated_at();
