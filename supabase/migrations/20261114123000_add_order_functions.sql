-- How the website places and pays for orders without a service-role key.
--
-- The orders table stays closed to the public. These security-definer
-- functions are the only way in, and they trust nothing from the browser:
-- prices come from public.products, only published in-stock products are
-- accepted, delivery is calculated here, and repeat submissions are limited.
-- The website also checks minimum quantities before calling place_order.
--
-- Keep the delivery rule in step with shopDelivery in src/data/shop-ordering.ts:
-- ₹100 below a ₹1,799 product total, free from ₹1,799.

create or replace function public.place_order(p_items jsonb, p_customer jsonb)
returns table (id uuid, number bigint, total numeric)
language plpgsql
security definer
set search_path = ''
as $$
declare
  line jsonb;
  product record;
  quantity integer;
  request text;
  priced jsonb := '[]'::jsonb;
  seen uuid[] := '{}';
  product_id uuid;
  subtotal numeric(10, 2) := 0;
  delivery numeric(10, 2);
  occasion date;
  buyer_phone text := p_customer ->> 'phone';
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'Add products to your cart before checking out.' using errcode = 'P0001';
  end if;
  if buyer_phone is null or buyer_phone !~ '^[6-9][0-9]{9}$' then
    raise exception 'Enter a 10-digit Indian mobile number.' using errcode = 'P0001';
  end if;
  -- At most 5 orders an hour from one number, and 40 an hour in all.
  if (select count(*) from public.orders o where o.phone = buyer_phone and o.created_at > pg_catalog.now() - interval '1 hour') >= 5
     or (select count(*) from public.orders o where o.created_at > pg_catalog.now() - interval '1 hour') >= 40 then
    raise exception 'Too many orders were placed just now. Please wait a little, or message Sneha on WhatsApp.' using errcode = 'P0001';
  end if;

  for line in select * from jsonb_array_elements(p_items) loop
    begin
      product_id := (line ->> 'productId')::uuid;
      quantity := (line ->> 'quantity')::integer;
    exception when others then
      raise exception 'An item in your cart is invalid. Update your cart and try again.' using errcode = 'P0001';
    end;
    if product_id = any(seen) or quantity is null or quantity not between 1 and 999 then
      raise exception 'An item quantity is invalid. Update your cart and try again.' using errcode = 'P0001';
    end if;
    seen := seen || product_id;
    request := left(coalesce(line ->> 'request', ''), 250);

    select p.id, p.name, p.price, p.is_available into product
    from public.products p where p.id = product_id and p.is_published;
    if not found then
      raise exception 'A product is no longer available. Refresh your cart and try again.' using errcode = 'P0001';
    end if;
    if product.is_available is false then
      raise exception '% is out of stock.', product.name using errcode = 'P0001';
    end if;

    subtotal := subtotal + product.price * quantity;
    priced := priced || jsonb_build_array(jsonb_build_object(
      'productId', product.id, 'name', product.name, 'price', product.price, 'quantity', quantity, 'request', request));
  end loop;

  delivery := case when subtotal >= 1799 then 0 else 100 end;

  begin
    occasion := nullif(p_customer ->> 'occasionDate', '')::date;
  exception when others then
    raise exception 'Choose a valid occasion date, or leave it empty.' using errcode = 'P0001';
  end;

  return query
  insert into public.orders as o (customer_name, phone, email, address, city, state, pincode, occasion_date, notes, items, subtotal, delivery, total)
  values (
    p_customer ->> 'name', buyer_phone, nullif(p_customer ->> 'email', ''), p_customer ->> 'address', p_customer ->> 'city',
    p_customer ->> 'state', p_customer ->> 'pincode', occasion, nullif(p_customer ->> 'notes', ''),
    priced, subtotal, delivery, subtotal + delivery)
  returning o.id, o.number, o.total;
end;
$$;

-- What the customer's order page shows. The order id is an unguessable UUID;
-- phone, email and street address are never returned.
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
         o.items, o.subtotal, o.delivery, o.total, o.upi_reference is not null
  from public.orders o where o.id = p_id;
$$;

-- The customer reports their UPI reference once; Sneha checks it in her UPI app.
create or replace function public.submit_order_payment(p_id uuid, p_reference text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  result text;
begin
  if p_reference !~ '^[A-Za-z0-9]{6,35}$' then
    raise exception 'Enter the UPI reference number exactly as your payment app shows it.' using errcode = 'P0001';
  end if;
  update public.orders o
  set upi_reference = p_reference, payment_submitted_at = pg_catalog.now(), status = 'payment_submitted'
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

revoke all on function public.place_order(jsonb, jsonb) from public;
revoke all on function public.get_order(uuid) from public;
revoke all on function public.submit_order_payment(uuid, text) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;
grant execute on function public.get_order(uuid) to anon, authenticated;
grant execute on function public.submit_order_payment(uuid, text) to anon, authenticated;
