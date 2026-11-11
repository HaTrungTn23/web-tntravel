create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.destination_content (
  destination_id text primary key,
  profile jsonb not null,
  is_published boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.destination_media (
  id text primary key,
  destination_id text not null references public.destination_content(destination_id) on delete cascade,
  type text not null check (type in ('image', 'youtube')),
  url text not null,
  thumbnail_url text,
  alt text not null default '',
  caption text,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists destination_media_destination_order_idx on public.destination_media(destination_id, sort_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists destination_content_set_updated_at on public.destination_content;
create trigger destination_content_set_updated_at before update on public.destination_content for each row execute function public.set_updated_at();

create or replace function public.is_content_admin()
returns boolean language sql security definer stable set search_path = '' as $$
  select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_content_admin() from public;
grant execute on function public.is_content_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.destination_content enable row level security;
alter table public.destination_media enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.destination_content from anon, authenticated;
revoke all on table public.destination_media from anon, authenticated;
grant select on table public.admin_users to authenticated;
grant select on table public.destination_content to anon, authenticated;
grant insert, update, delete on table public.destination_content to authenticated;
grant select on table public.destination_media to anon, authenticated;
grant insert, update, delete on table public.destination_media to authenticated;

create policy "Admin reads own membership" on public.admin_users for select to authenticated using ((select auth.uid()) = user_id);
create policy "Public reads published content" on public.destination_content for select to anon, authenticated using (is_published);
create policy "Admins read all content" on public.destination_content for select to authenticated using (public.is_content_admin());
create policy "Admins insert content" on public.destination_content for insert to authenticated with check (public.is_content_admin());
create policy "Admins update content" on public.destination_content for update to authenticated using (public.is_content_admin()) with check (public.is_content_admin());
create policy "Admins delete content" on public.destination_content for delete to authenticated using (public.is_content_admin());
create policy "Public reads published media" on public.destination_media for select to anon, authenticated using (exists(select 1 from public.destination_content where destination_id = destination_media.destination_id and is_published));
create policy "Admins read all media" on public.destination_media for select to authenticated using (public.is_content_admin());
create policy "Admins insert media" on public.destination_media for insert to authenticated with check (public.is_content_admin());
create policy "Admins update media" on public.destination_media for update to authenticated using (public.is_content_admin()) with check (public.is_content_admin());
create policy "Admins delete media" on public.destination_media for delete to authenticated using (public.is_content_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('destination-media', 'destination-media', true, 6291456, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins upload destination images" on storage.objects for insert to authenticated with check (bucket_id = 'destination-media' and public.is_content_admin());
create policy "Admins update destination images" on storage.objects for update to authenticated using (bucket_id = 'destination-media' and public.is_content_admin()) with check (bucket_id = 'destination-media' and public.is_content_admin());
create policy "Admins delete destination images" on storage.objects for delete to authenticated using (bucket_id = 'destination-media' and public.is_content_admin());

-- After creating an Auth user, grant access with:
-- insert into public.admin_users (user_id) values ('AUTH_USER_UUID');
