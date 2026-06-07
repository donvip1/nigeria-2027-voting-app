/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Local seed data for demo-mode candidates and public polls.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added candidate portrait and party badge paths for browser-only demo mode.
*********************************************************/

// ========================================================
// Demo-mode presidential candidate data
// ========================================================
export const simulationCandidates = [
  {
    id: 'apc-tinubu',
    name: 'Bola Ahmed Tinubu',
    party_name: 'All Progressives Congress',
    party_code: 'APC',
    running_mate: 'Kashim Shettima',
    background_text: 'Simulation entry based on your planning list. Current president and former Lagos State governor.',
    color: '#008751',
    logo_url: '/assets/party-badges/apc.svg',
    photo_url: '/assets/candidates/apc-tinubu.svg'
  },
  {
    id: 'adc-atiku',
    name: 'Atiku Abubakar',
    party_name: 'African Democratic Congress',
    party_code: 'ADC',
    running_mate: 'TBA',
    background_text: 'Simulation entry based on your planning list. Former vice president and long-running presidential contender.',
    color: '#1357a6',
    logo_url: '/assets/party-badges/adc.svg',
    photo_url: '/assets/candidates/adc-atiku.svg'
  },
  {
    id: 'ndc-obi',
    name: 'Peter Obi',
    party_name: 'Nigeria Democratic Congress',
    party_code: 'NDC',
    running_mate: 'TBA',
    background_text: 'Simulation entry based on your planning list. Former Anambra State governor and 2023 presidential candidate.',
    color: '#d71920',
    logo_url: '/assets/party-badges/ndc.svg',
    photo_url: '/assets/candidates/ndc-obi.svg'
  },
  {
    id: 'prp-duke',
    name: 'Donald Duke',
    party_name: 'Peoples Redemption Party',
    party_code: 'PRP',
    running_mate: 'TBA',
    background_text: 'Simulation entry based on your planning list. Former Cross River State governor.',
    color: '#b3261e',
    logo_url: '/assets/party-badges/prp.svg',
    photo_url: '/assets/candidates/prp-duke.svg'
  },
  {
    id: 'sdp-adebayo',
    name: 'Prince Adewole Adebayo',
    party_name: 'Social Democratic Party',
    party_code: 'SDP',
    running_mate: 'TBA',
    background_text: 'Simulation entry based on your planning list. Social Democratic Party presidential figure.',
    color: '#0062a3',
    logo_url: '/assets/party-badges/sdp.svg',
    photo_url: '/assets/candidates/sdp-adebayo.svg'
  },
  {
    id: 'aac-sowore',
    name: 'Omoyele Sowore',
    party_name: 'African Action Congress',
    party_code: 'AAC',
    running_mate: 'TBA',
    background_text: 'Simulation entry based on your planning list. Activist, publisher, and African Action Congress figure.',
    color: '#f59f00',
    logo_url: '/assets/party-badges/aac.svg',
    photo_url: '/assets/candidates/aac-sowore.svg'
  },
  {
    id: 'pdp-onor',
    name: 'Sandy Onor',
    party_name: 'Peoples Democratic Party',
    party_code: 'PDP',
    running_mate: 'TBA',
    background_text: 'Simulation entry based on your planning list. Former senator and Cross River political figure.',
    color: '#0b8f3a',
    logo_url: '/assets/party-badges/pdp.svg',
    photo_url: '/assets/candidates/pdp-onor.svg'
  }
];

// ========================================================
// Demo-mode public issue poll data
// ========================================================
export const demoPolls = [
  {
    id: 'poll-economy',
    title: 'Which issue should the next president prioritize first?',
    type: 'multiple_choice',
    poll_options: [
      { id: 'economy', option_text: 'Economy and jobs', vote_count: 42 },
      { id: 'security', option_text: 'Security', vote_count: 35 },
      { id: 'power', option_text: 'Electricity and infrastructure', vote_count: 28 },
      { id: 'education', option_text: 'Education', vote_count: 17 }
    ]
  },
  {
    id: 'poll-debate',
    title: 'Should all simulation candidates join a public debate?',
    type: 'yes_no',
    poll_options: [
      { id: 'debate-yes', option_text: 'Yes', vote_count: 68 },
      { id: 'debate-no', option_text: 'No', vote_count: 9 }
    ]
  }
];
