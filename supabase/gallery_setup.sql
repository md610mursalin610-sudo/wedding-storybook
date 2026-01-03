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

-- bucket: gallery (private)
do $$
begin
  if not exists (select 1 from storage.buckets where name = 'gallery') then
    insert into storage.buckets (id, name, public) values ('gallery', 'gallery', false);
  end if;
end $$;

alter table storage.objects enable row level security;

drop policy if exists "gallery_select_authenticated" on storage.objects;
drop policy if exists "gallery_insert_authenticated" on storage.objects;
drop policy if exists "gallery_update_owner" on storage.objects;
drop policy if exists "gallery_delete_owner" on storage.objects;

create policy "gallery_select_authenticated" on storage.objects
for select to authenticated
using (bucket_id = 'gallery');

create policy "gallery_insert_authenticated" on storage.objects
for insert to authenticated
with check (bucket_id = 'gallery');

create policy "gallery_update_owner" on storage.objects
for update to authenticated
using (bucket_id = 'gallery' and owner = auth.uid());

create policy "gallery_delete_owner" on storage.objects
for delete to authenticated
using (bucket_id = 'gallery' and owner = auth.uid());

commit;
