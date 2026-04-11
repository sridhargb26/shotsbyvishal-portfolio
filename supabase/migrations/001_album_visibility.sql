-- 001_album_visibility.sql
-- Run once in Supabase → SQL Editor (safe to re-run on existing DBs).
-- Adds album placement flags and renames legacy column names if present.

-- Legacy → current names (only if old column exists and new name does not)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_albums' and column_name = 'show_in_commissions'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_albums' and column_name = 'show_in_commercial'
  ) then
    alter table public.portfolio_albums rename column show_in_commissions to show_in_commercial;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_albums' and column_name = 'show_in_independent'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_albums' and column_name = 'show_in_editorial'
  ) then
    alter table public.portfolio_albums rename column show_in_independent to show_in_editorial;
  end if;
end $$;

-- Ensure columns exist (new installs or after renames)
alter table public.portfolio_albums add column if not exists show_in_gallery boolean not null default true;
alter table public.portfolio_albums add column if not exists show_in_commercial boolean not null default false;
alter table public.portfolio_albums add column if not exists show_in_editorial boolean not null default false;
