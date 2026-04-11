-- Run in Supabase → SQL Editor. Then create Storage bucket "portfolio" (public).

create table if not exists public.portfolio_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.portfolio_albums(id) on delete cascade,
  title text not null default '',
  storage_path text not null,
  public_url text not null,
  width int not null default 1600,
  height int not null default 1200,
  sort_order int not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_photos_album_id on public.portfolio_photos(album_id);
create index if not exists portfolio_photos_featured on public.portfolio_photos(featured);

alter table public.portfolio_albums enable row level security;
alter table public.portfolio_photos enable row level security;

create policy "public_read_albums" on public.portfolio_albums for select using (true);
create policy "public_read_photos" on public.portfolio_photos for select using (true);

-- ── Storage bucket (required for admin uploads) ─────────────────────────────
-- If you skipped this before, run the block below in SQL Editor (safe to re-run).

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = excluded.public;

-- Allow anyone to read files (needed for <Image src={publicUrl} /> on the site)
drop policy if exists "Public read portfolio objects" on storage.objects;
create policy "Public read portfolio objects"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio');

-- Uploads use SUPABASE_SERVICE_ROLE_KEY on the server (bypasses RLS for writes).
