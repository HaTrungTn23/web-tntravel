create table if not exists public.content_translations (
  entity_type text not null check (entity_type in ('destination', 'site_content')),
  entity_id text not null,
  locale text not null check (locale in ('en', 'ru')),
  payload jsonb not null,
  source_hash text not null,
  is_published boolean not null default false,
  translated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (entity_type, entity_id, locale)
);

create index if not exists content_translations_lookup_idx
  on public.content_translations(entity_type, entity_id, locale, is_published);

alter table public.content_translations enable row level security;
revoke all on table public.content_translations from anon, authenticated;
grant select on table public.content_translations to anon, authenticated;
grant insert, update, delete on table public.content_translations to authenticated;

drop policy if exists "Public reads published translations" on public.content_translations;
create policy "Public reads published translations" on public.content_translations
for select to anon, authenticated using (is_published);

drop policy if exists "Admins read all translations" on public.content_translations;
create policy "Admins read all translations" on public.content_translations
for select to authenticated using (public.is_content_admin());

drop policy if exists "Admins insert translations" on public.content_translations;
create policy "Admins insert translations" on public.content_translations
for insert to authenticated with check (public.is_content_admin());

drop policy if exists "Admins update translations" on public.content_translations;
create policy "Admins update translations" on public.content_translations
for update to authenticated using (public.is_content_admin()) with check (public.is_content_admin());

drop policy if exists "Admins delete translations" on public.content_translations;
create policy "Admins delete translations" on public.content_translations
for delete to authenticated using (public.is_content_admin());

notify pgrst, 'reload schema';
