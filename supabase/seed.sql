/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase seed data for starter candidates and public issue polls.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added simulation candidate records, real candidate image paths, INEC party logo paths, and starter poll options.
*********************************************************/

-- ========================================================
-- Simulation candidate seed records
-- ========================================================

insert into public.candidates (slug, name, party_name, party_code, running_mate, background_text, color, logo_url, photo_url)
values
  ('apc-tinubu', 'Bola Ahmed Tinubu', 'All Progressives Congress', 'APC', 'Kashim Shettima', 'Simulation entry based on the project planning list. Current president and former Lagos State governor.', '#008751', '/assets/party-badges/apc.jpg', '/assets/candidates/apc-tinubu.png'),
  ('adc-atiku', 'Atiku Abubakar', 'African Democratic Congress', 'ADC', 'TBA', 'Simulation entry based on the project planning list. Former vice president and long-running presidential contender.', '#1357a6', '/assets/party-badges/adc.jpg', '/assets/candidates/adc-atiku.png'),
  ('ndc-obi', 'Peter Obi', 'Nigeria Democratic Congress', 'NDC', 'TBA', 'Simulation entry based on the project planning list. Former Anambra State governor and 2023 presidential candidate.', '#d71920', '/assets/party-badges/ndc.jpeg', '/assets/candidates/ndc-obi.png'),
  ('prp-duke', 'Donald Duke', 'Peoples Redemption Party', 'PRP', 'TBA', 'Simulation entry based on the project planning list. Former Cross River State governor.', '#b3261e', '/assets/party-badges/prp.png', '/assets/candidates/prp-duke.png'),
  ('sdp-adebayo', 'Prince Adewole Adebayo', 'Social Democratic Party', 'SDP', 'TBA', 'Simulation entry based on the project planning list. Social Democratic Party presidential figure.', '#0062a3', '/assets/party-badges/sdp.png', '/assets/candidates/sdp-adebayo.png'),
  ('aac-sowore', 'Omoyele Sowore', 'African Action Congress', 'AAC', 'TBA', 'Simulation entry based on the project planning list. Activist, publisher, and African Action Congress figure.', '#f59f00', '/assets/party-badges/aac.jpg', '/assets/candidates/aac-sowore.jpg'),
  ('pdp-onor', 'Sandy Onor', 'Peoples Democratic Party', 'PDP', 'TBA', 'Simulation entry based on the project planning list. Former senator and Cross River political figure.', '#0b8f3a', '/assets/party-badges/pdp.jpg', '/assets/candidates/pdp-onor.png')
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

-- ========================================================
-- Multiple-choice public issue poll seed
-- ========================================================

with inserted_poll as (
  insert into public.polls (title, type)
  values ('Which issue should the next president prioritize first?', 'multiple_choice')
  returning id
)
insert into public.poll_options (poll_id, option_text, sort_order)
select inserted_poll.id, option_text, sort_order
from inserted_poll,
(values
  ('Economy and jobs', 1),
  ('Security', 2),
  ('Electricity and infrastructure', 3),
  ('Education', 4)
) as options(option_text, sort_order);

-- ========================================================
-- Yes/no public debate poll seed
-- ========================================================

with inserted_poll as (
  insert into public.polls (title, type)
  values ('Should all simulation candidates join a public debate?', 'yes_no')
  returning id
)
insert into public.poll_options (poll_id, option_text, sort_order)
select inserted_poll.id, option_text, sort_order
from inserted_poll,
(values
  ('Yes', 1),
  ('No', 2)
) as options(option_text, sort_order);
