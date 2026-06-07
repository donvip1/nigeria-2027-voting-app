/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase seed data for starter candidates and public issue polls.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added simulation candidate records and starter poll options for the MVP launch.
*********************************************************/

-- ========================================================
-- Simulation candidate seed records
-- ========================================================

insert into public.candidates (slug, name, party_name, party_code, running_mate, background_text, color)
values
  ('apc-tinubu', 'Bola Ahmed Tinubu', 'All Progressives Congress', 'APC', 'Kashim Shettima', 'Simulation entry based on the project planning list. Current president and former Lagos State governor.', '#008751'),
  ('adc-atiku', 'Atiku Abubakar', 'African Democratic Congress', 'ADC', 'TBA', 'Simulation entry based on the project planning list. Former vice president and long-running presidential contender.', '#1357a6'),
  ('ndc-obi', 'Peter Obi', 'Nigeria Democratic Congress', 'NDC', 'TBA', 'Simulation entry based on the project planning list. Former Anambra State governor and 2023 presidential candidate.', '#d71920'),
  ('prp-duke', 'Donald Duke', 'Peoples Redemption Party', 'PRP', 'TBA', 'Simulation entry based on the project planning list. Former Cross River State governor.', '#b3261e'),
  ('sdp-adebayo', 'Prince Adewole Adebayo', 'Social Democratic Party', 'SDP', 'TBA', 'Simulation entry based on the project planning list. Social Democratic Party presidential figure.', '#0062a3'),
  ('aac-sowore', 'Omoyele Sowore', 'African Action Congress', 'AAC', 'TBA', 'Simulation entry based on the project planning list. Activist, publisher, and African Action Congress figure.', '#f59f00'),
  ('pdp-onor', 'Sandy Onor', 'Peoples Democratic Party', 'PDP', 'TBA', 'Simulation entry based on the project planning list. Former senator and Cross River political figure.', '#0b8f3a')
on conflict (slug) do update set
  name = excluded.name,
  party_name = excluded.party_name,
  party_code = excluded.party_code,
  running_mate = excluded.running_mate,
  background_text = excluded.background_text,
  color = excluded.color,
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
