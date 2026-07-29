# Supabase Setup Guide

## 1. Create a Supabase project
Go to https://supabase.com → New Project

## 2. Run this SQL in the Supabase SQL Editor

```sql
-- Products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  description text not null,
  story text,
  whatsapp_message text,
  image_url text,
  image_urls text[] default '{}',
  is_featured boolean default false,
  is_available boolean default true,
  details text[] default '{}',
  created_at timestamptz default now()
);

-- Allow public read
alter table public.products enable row level security;

create policy "Public can read available products"
  on public.products for select
  using (is_available = true);

create policy "Authenticated users can do everything"
  on public.products for all
  using (auth.role() = 'authenticated');
```

## 3. Create the image storage bucket

In Supabase Dashboard → Storage → New Bucket:
- Name: `product-images`
- Public bucket: YES (toggle on)

Then add a storage policy — in Storage → Policies → product-images:
```sql
-- Allow public to view images
create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated to upload
create policy "Authenticated can upload images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Allow authenticated to delete
create policy "Authenticated can delete images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
```

## 4. Create the admin user

In Supabase Dashboard → Authentication → Users → Add User:
- Email: sneha@yourdomain.com
- Password: (choose a strong password)

## 5. Get your API keys

In Supabase Dashboard → Project Settings → API:
- Copy `Project URL` → NEXT_PUBLIC_SUPABASE_URL
- Copy `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY
- Copy `service_role` key → SUPABASE_SERVICE_ROLE_KEY

Paste them into `.env.local`

## 6. (Optional) Seed initial products

You can either:
- Add products manually via the admin panel at /admin/products
- Or use Supabase Table Editor to copy in the existing products.json data

## 7. Update existing products for galleries

If you already have the table created, add the new column instead of recreating the table:

```sql
alter table public.products
add column if not exists image_urls text[] default '{}';
```

## 8. Enable discount pricing (original price / MRP)

To show a struck-through original price and a "% off" badge, add an `original_price`
column. Leave it null for products that aren't on sale; set it above `price` for a
discounted product.

```sql
alter table public.products
add column if not exists original_price numeric;
```





