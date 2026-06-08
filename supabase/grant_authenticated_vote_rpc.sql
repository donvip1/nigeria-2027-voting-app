/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase patch for allowing OTP-authenticated users to submit votes.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added authenticated role execute grants for presidential and poll vote RPC functions.
*********************************************************/

-- ========================================================
-- Authenticated vote RPC permissions
-- ========================================================

grant execute on function public.submit_presidential_vote(uuid, text, text, text) to authenticated;
grant execute on function public.submit_poll_vote(uuid, uuid, text, text, text) to authenticated;
