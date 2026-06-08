/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase database schema for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added participants, candidates, votes, polls, RLS policies, read views, secure RPC vote submission functions, and extension-free vote hashing.
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
-- Row level security setup
-- ========================================================

alter table public.participants enable row level security;
alter table public.candidates enable row level security;
alter table public.presidential_votes enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

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

grant usage on schema public to anon;
grant select on public.candidate_results to anon;
grant select on public.candidates to anon;
grant select on public.polls to anon;
grant select on public.poll_options to anon;

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
-- Public RPC permissions
-- ========================================================

grant execute on function public.submit_presidential_vote(uuid, text, text, text) to anon;
grant execute on function public.submit_poll_vote(uuid, uuid, text, text, text) to anon;
