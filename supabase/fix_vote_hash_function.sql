/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase patch for fixing presidential vote hash generation.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Replaced pgcrypto digest hashing with built-in md5 hashing to prevent missing digest function errors.
*********************************************************/

-- ========================================================
-- Secure presidential vote submission RPC patch
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
-- Public RPC permission refresh
-- ========================================================

grant execute on function public.submit_presidential_vote(uuid, text, text, text) to anon;
