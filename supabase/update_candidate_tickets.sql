/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase patch for updating simulation candidate ticket data.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added safe candidate-only upsert for running mates, descriptions, portraits, party logos, and active status.
*********************************************************/

-- ========================================================
-- Candidate-only ticket update records
-- ========================================================

insert into public.candidates (slug, name, party_name, party_code, running_mate, background_text, color, logo_url, photo_url)
values
  ('apc-tinubu', 'Bola Ahmed Tinubu', 'All Progressives Congress', 'APC', 'Kashim Shettima', 'Simulation entry using the Tinubu-Shettima pairing until a final 2027 running-mate decision is confirmed.', '#008751', '/assets/party-badges/apc.jpg', '/assets/candidates/apc-tinubu.png'),
  ('adc-atiku', 'Atiku Abubakar', 'African Democratic Congress', 'ADC', 'Ifeanyi Okowa', 'Simulation entry using a prior known Atiku running-mate pairing until a final 2027 ticket is confirmed.', '#1357a6', '/assets/party-badges/adc.jpg', '/assets/candidates/adc-atiku.png'),
  ('ndc-obi', 'Peter Obi', 'Nigeria Democratic Congress', 'NDC', 'Rabiu Musa Kwankwaso', 'Simulation entry reflecting the planned Obi-Kwankwaso ticket discussed for the 2027 preference poll.', '#d71920', '/assets/party-badges/ndc.jpeg', '/assets/candidates/ndc-obi.png'),
  ('prp-duke', 'Donald Duke', 'Peoples Redemption Party', 'PRP', 'Shehu Musa Gabam', 'Simulation entry using a prior Donald Duke ticket association until a final 2027 running mate is confirmed.', '#b3261e', '/assets/party-badges/prp.png', '/assets/candidates/prp-duke.png'),
  ('sdp-adebayo', 'Prince Adewole Adebayo', 'Social Democratic Party', 'SDP', 'Yusuf Buhari', 'Simulation entry using the SDP ticket pairing known from the last presidential cycle.', '#0062a3', '/assets/party-badges/sdp.png', '/assets/candidates/sdp-adebayo.png'),
  ('aac-sowore', 'Omoyele Sowore', 'African Action Congress', 'AAC', 'Haruna Garba Magashi', 'Simulation entry using the AAC ticket pairing known from the last presidential cycle.', '#f59f00', '/assets/party-badges/aac.jpg', '/assets/candidates/aac-sowore.jpg'),
  ('pdp-onor', 'Sandy Onor', 'Peoples Democratic Party', 'PDP', 'Emana Duke Ambrose-Amawhe', 'Simulation entry using Sandy Onor''s prior Cross River ticket pairing for the preference poll.', '#0b8f3a', '/assets/party-badges/pdp.jpg', '/assets/candidates/pdp-onor.png')
on conflict (slug) do update set
  name = excluded.name,
  party_name = excluded.party_name,
  party_code = excluded.party_code,
  running_mate = excluded.running_mate,
  background_text = excluded.background_text,
  color = excluded.color,
  logo_url = excluded.logo_url,
  photo_url = excluded.photo_url,
  is_active = true;
