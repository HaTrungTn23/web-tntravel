alter table public.destination_content
  add column if not exists card_title text,
  add column if not exists card_description text;

create table if not exists public.site_content (
  content_key text primary key,
  payload jsonb not null,
  is_published boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;

create policy "Public reads published site content" on public.site_content
for select to anon, authenticated using (is_published);
create policy "Admins read all site content" on public.site_content
for select to authenticated using (public.is_content_admin());
create policy "Admins insert site content" on public.site_content
for insert to authenticated with check (public.is_content_admin());
create policy "Admins update site content" on public.site_content
for update to authenticated using (public.is_content_admin()) with check (public.is_content_admin());
create policy "Admins delete site content" on public.site_content
for delete to authenticated using (public.is_content_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('home-media', 'home-media', true, 6291456, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins upload home images" on storage.objects
for insert to authenticated with check (bucket_id = 'home-media' and public.is_content_admin());
create policy "Admins update home images" on storage.objects
for update to authenticated using (bucket_id = 'home-media' and public.is_content_admin()) with check (bucket_id = 'home-media' and public.is_content_admin());
create policy "Admins delete home images" on storage.objects
for delete to authenticated using (bucket_id = 'home-media' and public.is_content_admin());
