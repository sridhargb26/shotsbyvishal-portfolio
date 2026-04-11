-- 002_storage_portfolio_public_read.sql
-- Run if the `portfolio` bucket or public read policy is missing (safe to re-run).

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read portfolio objects" on storage.objects;
create policy "Public read portfolio objects"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio');
