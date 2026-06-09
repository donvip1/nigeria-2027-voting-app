/*
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase setup patch for 48-hour public result comments and reactions.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added moderated result comments, emoji-style reactions, nickname mentions, vote-gated posting, and 48-hour cleanup.
*********************************************************/
*/

-- ========================================================
-- Result discussion tables
-- ========================================================

create table if not exists public.result_comments (
  id uuid primary key default gen_random_uuid(),
  nickname varchar(40) not null,
  device_fingerprint text not null,
  body varchar(280) not null,
  mentions text[] not null default '{}',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '48 hours')
);

create table if not exists public.result_comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.result_comments(id) on delete cascade,
  device_fingerprint text not null,
  reaction varchar(16) not null check (reaction in ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at timestamptz not null default now(),
  unique (comment_id, device_fingerprint)
);

-- ========================================================
-- Public result discussion view
-- ========================================================

create or replace view public.result_comments_public as
select
  c.id,
  c.nickname,
  c.body,
  c.mentions,
  c.created_at,
  c.expires_at,
  jsonb_build_object(
    'like', count(r.id) filter (where r.reaction = 'like'),
    'love', count(r.id) filter (where r.reaction = 'love'),
    'laugh', count(r.id) filter (where r.reaction = 'laugh'),
    'wow', count(r.id) filter (where r.reaction = 'wow'),
    'sad', count(r.id) filter (where r.reaction = 'sad'),
    'angry', count(r.id) filter (where r.reaction = 'angry')
  ) as reactions
from public.result_comments c
left join public.result_comment_reactions r on r.comment_id = c.id
where c.expires_at > now()
group by c.id;

-- ========================================================
-- Row level security and read permissions
-- ========================================================

alter table public.result_comments enable row level security;
alter table public.result_comment_reactions enable row level security;

drop policy if exists "Read unexpired result comments" on public.result_comments;
create policy "Read unexpired result comments"
on public.result_comments for select
using (expires_at > now());

grant select on public.result_comments_public to anon;
grant select on public.result_comments_public to authenticated;

-- ========================================================
-- Result discussion cleanup and moderation RPCs
-- ========================================================

create or replace function public.cleanup_expired_result_comments()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count int;
begin
  delete from result_comments
  where expires_at <= now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create or replace function public.submit_result_comment(
  voter_nickname text,
  voter_fingerprint text,
  comment_body text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_body text;
  mention_list text[];
  inserted_id uuid;
begin
  perform cleanup_expired_result_comments();

  cleaned_body := regexp_replace(trim(coalesce(comment_body, '')), '\s+', ' ', 'g');

  if length(trim(voter_nickname)) < 3 or length(trim(voter_nickname)) > 40 then
    raise exception 'nickname required';
  end if;

  if voter_fingerprint is null or length(voter_fingerprint) < 20 then
    raise exception 'valid participant required';
  end if;

  if not exists (
    select 1 from presidential_votes
    where device_fingerprint = voter_fingerprint
  ) then
    raise exception 'vote required';
  end if;

  if length(cleaned_body) < 2 or length(cleaned_body) > 280 then
    raise exception 'comment length invalid';
  end if;

  if cleaned_body ~* '(https?://|www\.|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})' then
    raise exception 'personal info not allowed';
  end if;

  if regexp_replace(cleaned_body, '\D', '', 'g') ~ '\d{9,}' then
    raise exception 'personal info not allowed';
  end if;

  if lower(cleaned_body) ~ '(fuck|shit|bitch|bastard|asshole|cunt|dick|pussy|whore|slut|nigger|nigga|motherfucker|kill yourself)' then
    raise exception 'comment language not allowed';
  end if;

  select coalesce(array_agg(distinct mention.match[1]), '{}')
  into mention_list
  from regexp_matches(cleaned_body, '@([A-Za-z0-9_]{3,40})', 'g') as mention(match);

  insert into result_comments (nickname, device_fingerprint, body, mentions)
  values (trim(voter_nickname), voter_fingerprint, cleaned_body, mention_list)
  returning id into inserted_id;

  return jsonb_build_object('ok', true, 'id', inserted_id);
end;
$$;

create or replace function public.react_result_comment(
  comment_uuid uuid,
  voter_fingerprint text,
  reaction_value text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform cleanup_expired_result_comments();

  if voter_fingerprint is null or length(voter_fingerprint) < 20 then
    raise exception 'valid participant required';
  end if;

  if reaction_value not in ('like', 'love', 'laugh', 'wow', 'sad', 'angry') then
    raise exception 'invalid reaction';
  end if;

  if not exists (
    select 1 from presidential_votes
    where device_fingerprint = voter_fingerprint
  ) then
    raise exception 'vote required';
  end if;

  if not exists (
    select 1 from result_comments
    where id = comment_uuid
    and expires_at > now()
  ) then
    raise exception 'comment expired';
  end if;

  insert into result_comment_reactions (comment_id, device_fingerprint, reaction)
  values (comment_uuid, voter_fingerprint, reaction_value)
  on conflict (comment_id, device_fingerprint)
  do update set
    reaction = excluded.reaction,
    created_at = now();

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.cleanup_expired_result_comments() to anon;
grant execute on function public.cleanup_expired_result_comments() to authenticated;
grant execute on function public.submit_result_comment(text, text, text) to anon;
grant execute on function public.submit_result_comment(text, text, text) to authenticated;
grant execute on function public.react_result_comment(uuid, text, text) to anon;
grant execute on function public.react_result_comment(uuid, text, text) to authenticated;
