/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase maintenance script for clearing test votes before public launch.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added controlled reset for presidential votes, poll votes, participant test records, result comments, poll option vote counts, and browser reset signaling.
*********************************************************/

-- ========================================================
-- Test vote reset warning
-- ========================================================

-- Run this only when you intentionally want to remove test voting data.
-- This keeps candidates, candidate photos, party logos, polls, and poll options.
-- This removes submitted presidential votes, submitted poll votes, participant test records,
-- result comments, and result comment reactions.

-- ========================================================
-- Reset marker setup
-- ========================================================

create table if not exists public.app_state (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "Read public app state" on public.app_state;
create policy "Read public app state"
on public.app_state for select
using (true);

grant select on public.app_state to anon;
grant select on public.app_state to authenticated;

-- ========================================================
-- Preview current vote totals before reset
-- ========================================================

select 'presidential_votes_before_reset' as table_name, count(*) as record_count
from public.presidential_votes;

select 'poll_votes_before_reset' as table_name, count(*) as record_count
from public.poll_votes;

select 'participants_before_reset' as table_name, count(*) as record_count
from public.participants;

select 'result_comments_before_reset' as table_name, count(*) as record_count
from public.result_comments;

-- ========================================================
-- Clear submitted test data
-- ========================================================

begin;

delete from public.presidential_votes;
delete from public.poll_votes;
delete from public.participants;
delete from public.result_comment_reactions;
delete from public.result_comments;

update public.poll_options
set vote_count = 0;

insert into public.app_state (key, value, updated_at)
values ('vote_reset_version', clock_timestamp()::text, now())
on conflict (key) do update set
  value = excluded.value,
  updated_at = excluded.updated_at;

commit;

-- ========================================================
-- Confirm reset result
-- ========================================================

select 'presidential_votes_after_reset' as table_name, count(*) as record_count
from public.presidential_votes;

select 'poll_votes_after_reset' as table_name, count(*) as record_count
from public.poll_votes;

select 'participants_after_reset' as table_name, count(*) as record_count
from public.participants;

select 'result_comments_after_reset' as table_name, count(*) as record_count
from public.result_comments;

select 'poll_option_vote_count_after_reset' as table_name, coalesce(sum(vote_count), 0) as record_count
from public.poll_options;

select 'vote_reset_version_after_reset' as table_name, value as record_count
from public.app_state
where key = 'vote_reset_version';
