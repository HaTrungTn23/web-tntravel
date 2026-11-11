create extension if not exists vector with schema extensions;

create table if not exists public.chatbot_documents (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_type text not null check (source_type in ('destination','journey','product','region','station')),
  source_id text not null,
  title text not null,
  content text not null,
  href text not null,
  language text not null default 'vi',
  source_note text,
  source_updated_at timestamptz,
  content_hash text not null,
  embedding extensions.vector(768) not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chatbot_documents_embedding_hnsw
  on public.chatbot_documents using hnsw (embedding extensions.vector_cosine_ops)
  with (m = 16, ef_construction = 64);
create index if not exists chatbot_documents_source_idx on public.chatbot_documents(source_type, source_id);

alter table public.chatbot_documents enable row level security;

drop policy if exists "Published chatbot documents are public" on public.chatbot_documents;
create policy "Published chatbot documents are public" on public.chatbot_documents for select using (is_published = true);

drop policy if exists "Admins manage chatbot documents" on public.chatbot_documents;
create policy "Admins manage chatbot documents" on public.chatbot_documents
  for all using (public.is_content_admin())
  with check (public.is_content_admin());

create or replace function public.match_chatbot_documents(
  query_embedding extensions.vector(768), match_count integer default 7,
  similarity_threshold double precision default 0.42
)
returns table (
  id uuid, source_type text, source_id text, title text, content text, href text,
  language text, source_note text, updated_at timestamptz, similarity double precision
)
language sql stable security invoker set search_path = '' as $$
  select d.id, d.source_type, d.source_id, d.title, d.content, d.href, d.language,
    d.source_note, d.updated_at, (1 - (d.embedding operator(extensions.<=>) query_embedding))::double precision as similarity
  from public.chatbot_documents d
  where d.is_published = true and (1 - (d.embedding operator(extensions.<=>) query_embedding)) >= similarity_threshold
  order by d.embedding operator(extensions.<=>) query_embedding
  limit least(greatest(match_count, 1), 12)
$$;

grant select on public.chatbot_documents to anon, authenticated;
grant execute on function public.match_chatbot_documents(extensions.vector, integer, double precision) to anon, authenticated;

