-- Permit Home Decor for new products while retaining permanent URLs for all
-- existing products. Display-category edits do not rewrite url_category.
alter table public.products
  drop constraint products_url_category_valid,
  add constraint products_url_category_valid check (url_category in (
    'Keychains', 'Frames', 'Home Decor', 'Fridge Magnets',
    'Personalized Gifts', 'Curated Hampers'
  ));
