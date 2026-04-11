-- 003_homepage_slides.sql
-- Run once in Supabase → SQL Editor.
-- Creates a dedicated table for the home page slideshow.
-- Supports both photos and short videos.

create table if not exists public.homepage_slides (
  id            uuid primary key default gen_random_uuid(),
  sort_order    integer not null default 0,
  media_type    text not null default 'photo' check (media_type in ('photo', 'video')),
  storage_path  text not null,
  public_url    text not null,
  caption       text,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- RLS: public read, service-role write
alter table public.homepage_slides enable row level security;

drop policy if exists "homepage_slides_public_read" on public.homepage_slides;
create policy "homepage_slides_public_read"
  on public.homepage_slides for select
  using (true);

-- Index for ordered fetching
create index if not exists homepage_slides_sort_order_idx
  on public.homepage_slides (sort_order asc);
