begin;
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text not null,
  caption text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.photos enable row level security;

drop policy if exists "categories_select_auth" on public.categories;
drop policy if exists "categories_write_auth" on public.categories;

create policy "categories_select_auth" on public.categories
for select to authenticated using (true);

create policy "categories_write_auth" on public.categories
for all to authenticated using (true) with check (true);

drop policy if exists "photos_select_auth" on public.photos;
drop policy if exists "photos_write_auth" on public.photos;

create policy "photos_select_auth" on public.photos
for select to authenticated using (true);

create policy "photos_write_auth" on public.photos
for all to authenticated using (true) with check (true);

commit;
