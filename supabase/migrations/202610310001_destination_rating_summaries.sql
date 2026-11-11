create or replace function public.get_destination_rating_summaries()
returns table (destination_id text, average_rating numeric, rating_count bigint)
language sql
security definer
stable
set search_path = ''
as $$
  select
    r.destination_id,
    round(avg(r.rating)::numeric, 1) as average_rating,
    count(*)::bigint as rating_count
  from public.destination_ratings r
  group by r.destination_id;
$$;

revoke all on function public.get_destination_rating_summaries() from public;
grant execute on function public.get_destination_rating_summaries() to anon, authenticated;
