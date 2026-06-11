/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase database schema for the Nigeria 2027 public opinion polling app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added participants, candidates, votes, polls, reset app state, 48-hour result comments, reactions, CMS admins, RLS policies, read views, authenticated vote RPC permissions, and extension-free vote hashing.
*********************************************************/

-- ========================================================
-- Extensions and setup
-- ========================================================

create extension if not exists pgcrypto;

-- ========================================================
-- Participant and candidate tables
-- ========================================================

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  nickname varchar(40) not null,
  device_fingerprint text not null unique,
  first_ip inet,
  created_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name varchar(120) not null,
  party_name varchar(140) not null,
  party_code varchar(20) not null,
  running_mate varchar(120),
  background_text text,
  color varchar(20) default '#008751',
  logo_url text,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.app_state (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.app_state (key, value)
values ('vote_reset_version', 'initial')
on conflict (key) do nothing;

-- ========================================================
-- Presidential vote table
-- ========================================================

create table if not exists public.presidential_votes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete restrict,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  ip_address inet,
  device_fingerprint text not null,
  vote_hash text not null unique,
  voted_at timestamptz not null default now(),
  unique (participant_id),
  unique (device_fingerprint)
);

-- ========================================================
-- Poll tables
-- ========================================================

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  title varchar(220) not null,
  type varchar(40) not null check (type in ('yes_no', 'multiple_choice')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_text varchar(220) not null,
  vote_count int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete restrict,
  poll_id uuid not null references public.polls(id) on delete restrict,
  poll_option_id uuid not null references public.poll_options(id) on delete restrict,
  ip_address inet,
  device_fingerprint text not null,
  voted_at timestamptz not null default now(),
  unique (poll_id, participant_id),
  unique (poll_id, device_fingerprint)
);

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
-- Public candidate results view
-- ========================================================

create or replace view public.candidate_results as
select
  c.id,
  c.slug,
  c.name,
  c.party_name,
  c.party_code,
  c.running_mate,
  c.background_text,
  c.color,
  c.logo_url,
  c.photo_url,
  c.is_active,
  count(v.id)::int as vote_count
from public.candidates c
left join public.presidential_votes v on v.candidate_id = c.id
group by c.id;

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
-- Row level security setup
-- ========================================================

alter table public.participants enable row level security;
alter table public.candidates enable row level security;
alter table public.cms_admins enable row level security;
alter table public.app_state enable row level security;
alter table public.presidential_votes enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.result_comments enable row level security;
alter table public.result_comment_reactions enable row level security;

-- ========================================================
-- Public read policies for active content
-- ========================================================

drop policy if exists "Read active candidates" on public.candidates;
create policy "Read active candidates"
on public.candidates for select
using (is_active = true);

drop policy if exists "Read active polls" on public.polls;
create policy "Read active polls"
on public.polls for select
using (is_active = true);

drop policy if exists "Read active poll options" on public.poll_options;
create policy "Read active poll options"
on public.poll_options for select
using (
  exists (
    select 1 from public.polls
    where polls.id = poll_options.poll_id
    and polls.is_active = true
  )
);

drop policy if exists "Read public app state" on public.app_state;
create policy "Read public app state"
on public.app_state for select
using (true);

drop policy if exists "Read unexpired result comments" on public.result_comments;
create policy "Read unexpired result comments"
on public.result_comments for select
using (expires_at > now());

drop policy if exists "CMS admins can read own allow-list row" on public.cms_admins;
create policy "CMS admins can read own allow-list row"
on public.cms_admins for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "CMS admins can read all candidates" on public.candidates;
create policy "CMS admins can read all candidates"
on public.candidates for select
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can update candidates" on public.candidates;
create policy "CMS admins can update candidates"
on public.candidates for update
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can read all polls" on public.polls;
create policy "CMS admins can read all polls"
on public.polls for select
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can update polls" on public.polls;
create policy "CMS admins can update polls"
on public.polls for update
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can read all poll options" on public.poll_options;
create policy "CMS admins can read all poll options"
on public.poll_options for select
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can update poll options" on public.poll_options;
create policy "CMS admins can update poll options"
on public.poll_options for update
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

grant usage on schema public to anon;
grant select on public.candidate_results to anon;
grant select on public.candidates to anon;
grant select on public.polls to anon;
grant select on public.poll_options to anon;
grant select on public.result_comments_public to anon;
grant select on public.app_state to anon;
grant select on public.cms_admins to authenticated;
grant select on public.candidates to authenticated;
grant update on public.candidates to authenticated;
grant select on public.polls to authenticated;
grant update on public.polls to authenticated;
grant select on public.poll_options to authenticated;
grant update on public.poll_options to authenticated;
grant select on public.result_comments_public to authenticated;
grant select on public.app_state to authenticated;

-- ========================================================
-- Candidate asset storage bucket and policies
-- ========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'candidate-assets',
  'candidate-assets',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read candidate assets" on storage.objects;
create policy "Public can read candidate assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'candidate-assets');

drop policy if exists "CMS admins can upload candidate assets" on storage.objects;
create policy "CMS admins can upload candidate assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'candidate-assets'
  and exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

-- ========================================================
-- Secure presidential vote submission RPC
-- ========================================================

create or replace function public.submit_presidential_vote(
  candidate_uuid uuid,
  voter_nickname text,
  voter_fingerprint text,
  voter_ip text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  participant_uuid uuid;
  ip_value inet;
begin
  if length(trim(voter_nickname)) < 3 or length(trim(voter_nickname)) > 40 then
    raise exception 'invalid nickname';
  end if;

  if voter_fingerprint is null or length(voter_fingerprint) < 20 then
    raise exception 'invalid device fingerprint';
  end if;

  if not exists (select 1 from candidates where id = candidate_uuid and is_active = true) then
    raise exception 'invalid candidate';
  end if;

  begin
    ip_value := nullif(voter_ip, 'unknown')::inet;
  exception when others then
    ip_value := null;
  end;

  insert into participants (nickname, device_fingerprint, first_ip)
  values (trim(voter_nickname), voter_fingerprint, ip_value)
  on conflict (device_fingerprint) do update set nickname = participants.nickname
  returning id into participant_uuid;

  insert into presidential_votes (
    participant_id,
    candidate_id,
    ip_address,
    device_fingerprint,
    vote_hash
  )
  values (
    participant_uuid,
    candidate_uuid,
    ip_value,
    voter_fingerprint,
    md5(participant_uuid::text || candidate_uuid::text || voter_fingerprint || clock_timestamp()::text)
  );

  return jsonb_build_object('ok', true);
exception
  when unique_violation then
    raise exception 'duplicate presidential vote';
end;
$$;

-- ========================================================
-- Secure public poll vote submission RPC
-- ========================================================

create or replace function public.submit_poll_vote(
  poll_uuid uuid,
  option_uuid uuid,
  voter_nickname text,
  voter_fingerprint text,
  voter_ip text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  participant_uuid uuid;
  ip_value inet;
begin
  if length(trim(voter_nickname)) < 3 or length(trim(voter_nickname)) > 40 then
    raise exception 'invalid nickname';
  end if;

  if not exists (
    select 1
    from polls p
    join poll_options po on po.poll_id = p.id
    where p.id = poll_uuid
    and po.id = option_uuid
    and p.is_active = true
  ) then
    raise exception 'invalid poll option';
  end if;

  begin
    ip_value := nullif(voter_ip, 'unknown')::inet;
  exception when others then
    ip_value := null;
  end;

  insert into participants (nickname, device_fingerprint, first_ip)
  values (trim(voter_nickname), voter_fingerprint, ip_value)
  on conflict (device_fingerprint) do update set nickname = participants.nickname
  returning id into participant_uuid;

  insert into poll_votes (
    participant_id,
    poll_id,
    poll_option_id,
    ip_address,
    device_fingerprint
  )
  values (
    participant_uuid,
    poll_uuid,
    option_uuid,
    ip_value,
    voter_fingerprint
  );

  update poll_options
  set vote_count = vote_count + 1
  where id = option_uuid;

  return jsonb_build_object('ok', true);
exception
  when unique_violation then
    raise exception 'duplicate poll vote';
end;
$$;

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

-- ========================================================
-- Public RPC permissions
-- ========================================================

grant execute on function public.submit_presidential_vote(uuid, text, text, text) to anon;
grant execute on function public.submit_poll_vote(uuid, uuid, text, text, text) to anon;
grant execute on function public.submit_presidential_vote(uuid, text, text, text) to authenticated;
grant execute on function public.submit_poll_vote(uuid, uuid, text, text, text) to authenticated;
grant execute on function public.cleanup_expired_result_comments() to anon;
grant execute on function public.cleanup_expired_result_comments() to authenticated;
grant execute on function public.submit_result_comment(text, text, text) to anon;
grant execute on function public.submit_result_comment(text, text, text) to authenticated;
grant execute on function public.react_result_comment(uuid, text, text) to anon;
grant execute on function public.react_result_comment(uuid, text, text) to authenticated;
