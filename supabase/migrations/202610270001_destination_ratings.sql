create table if not exists public.destination_ratings (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id text not null check (char_length(destination_id) between 1 and 120),
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

create index if not exists destination_ratings_destination_idx
  on public.destination_ratings(destination_id);

drop trigger if exists destination_ratings_set_updated_at on public.destination_ratings;
create trigger destination_ratings_set_updated_at
  before update on public.destination_ratings
  for each row execute function public.set_updated_at();

alter table public.destination_ratings enable row level security;

revoke all on table public.destination_ratings from anon, authenticated;
grant select, insert, update on table public.destination_ratings to authenticated;

create policy "Users read their own destination ratings"
  on public.destination_ratings for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users create their own destination ratings"
  on public.destination_ratings for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update their own destination ratings"
  on public.destination_ratings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.get_destination_rating_summary(p_destination_id text)
returns table (average_rating numeric, rating_count bigint)
language sql
security definer
stable
set search_path = ''
as $$
  select
    coalesce(round(avg(r.rating)::numeric, 1), 0::numeric) as average_rating,
    count(*)::bigint as rating_count
  from public.destination_ratings r
  where r.destination_id = p_destination_id;
$$;

revoke all on function public.get_destination_rating_summary(text) from public;
grant execute on function public.get_destination_rating_summary(text) to anon, authenticated;
