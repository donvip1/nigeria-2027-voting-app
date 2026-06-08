/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase maintenance script for clearing test votes before public launch.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added controlled reset for presidential votes, poll votes, participant test records, and poll option vote counts.
*********************************************************/

-- ========================================================
-- Test vote reset warning
-- ========================================================

-- Run this only when you intentionally want to remove test voting data.
-- This keeps candidates, candidate photos, party logos, polls, and poll options.
-- This removes submitted presidential votes, submitted poll votes, and participant test records.

-- ========================================================
-- Preview current vote totals before reset
-- ========================================================

select 'presidential_votes_before_reset' as table_name, count(*) as record_count
from public.presidential_votes;

select 'poll_votes_before_reset' as table_name, count(*) as record_count
from public.poll_votes;

select 'participants_before_reset' as table_name, count(*) as record_count
from public.participants;

-- ========================================================
-- Clear submitted test data
-- ========================================================

begin;

delete from public.presidential_votes;
delete from public.poll_votes;
delete from public.participants;

update public.poll_options
set vote_count = 0;

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

select 'poll_option_vote_count_after_reset' as table_name, coalesce(sum(vote_count), 0) as record_count
from public.poll_options;
