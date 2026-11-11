alter table public.content_translations
  drop constraint if exists content_translations_entity_type_check;

alter table public.content_translations
  add constraint content_translations_entity_type_check
  check (entity_type in ('destination', 'site_content', 'journey', 'region', 'product', 'station'));
