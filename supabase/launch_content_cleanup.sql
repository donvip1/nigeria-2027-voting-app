/*
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase launch cleanup script for public-facing candidate and poll copy.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added safe content-only updates to remove demo-style wording without clearing votes.
*********************************************************/
*/

-- ========================================================
-- Candidate public copy updates
-- ========================================================

update public.candidates
set background_text = updates.background_text
from (
  values
    ('apc-tinubu', 'Tinubu and Shettima are listed together for this independent Nigeria 2027 public preference poll.'),
    ('adc-atiku', 'Atiku and Okowa are listed together for this independent Nigeria 2027 public preference poll.'),
    ('ndc-obi', 'Obi and Kwankwaso are listed together for this independent Nigeria 2027 public preference poll.'),
    ('prp-duke', 'Duke and Gabam are listed together for this independent Nigeria 2027 public preference poll.'),
    ('sdp-adebayo', 'Adebayo and Buhari are listed together for this independent Nigeria 2027 public preference poll.'),
    ('aac-sowore', 'Sowore and Magashi are listed together for this independent Nigeria 2027 public preference poll.'),
    ('pdp-onor', 'Onor and Ambrose-Amawhe are listed together for this independent Nigeria 2027 public preference poll.')
) as updates(slug, background_text)
where public.candidates.slug = updates.slug;

-- ========================================================
-- Public poll title cleanup
-- ========================================================

update public.polls
set title = 'Should all candidates join a public debate?'
where title = 'Should all simulation candidates join a public debate?';
