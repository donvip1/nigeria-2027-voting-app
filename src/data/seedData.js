/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Local seed data for demo-mode candidates and public polls.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added real candidate image paths, party logo paths, and full simulation running-mate ticket data for browser-only demo mode.
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
    background_text: 'Simulation entry using the Tinubu-Shettima pairing until a final 2027 running-mate decision is confirmed.',
    color: '#008751',
    logo_url: '/assets/party-badges/apc.jpg',
    photo_url: '/assets/candidates/apc-tinubu.png'
  },
  {
    id: 'adc-atiku',
    name: 'Atiku Abubakar',
    party_name: 'African Democratic Congress',
    party_code: 'ADC',
    running_mate: 'Ifeanyi Okowa',
    background_text: 'Simulation entry using a prior known Atiku running-mate pairing until a final 2027 ticket is confirmed.',
    color: '#1357a6',
    logo_url: '/assets/party-badges/adc.jpg',
    photo_url: '/assets/candidates/adc-atiku.png'
  },
  {
    id: 'ndc-obi',
    name: 'Peter Obi',
    party_name: 'Nigeria Democratic Congress',
    party_code: 'NDC',
    running_mate: 'Rabiu Musa Kwankwaso',
    background_text: 'Simulation entry reflecting the planned Obi-Kwankwaso ticket discussed for the 2027 preference poll.',
    color: '#d71920',
    logo_url: '/assets/party-badges/ndc.jpeg',
    photo_url: '/assets/candidates/ndc-obi.png'
  },
  {
    id: 'prp-duke',
    name: 'Donald Duke',
    party_name: 'Peoples Redemption Party',
    party_code: 'PRP',
    running_mate: 'Shehu Musa Gabam',
    background_text: 'Simulation entry using a prior Donald Duke ticket association until a final 2027 running mate is confirmed.',
    color: '#b3261e',
    logo_url: '/assets/party-badges/prp.png',
    photo_url: '/assets/candidates/prp-duke.png'
  },
  {
    id: 'sdp-adebayo',
    name: 'Prince Adewole Adebayo',
    party_name: 'Social Democratic Party',
    party_code: 'SDP',
    running_mate: 'Yusuf Buhari',
    background_text: 'Simulation entry using the SDP ticket pairing known from the last presidential cycle.',
    color: '#0062a3',
    logo_url: '/assets/party-badges/sdp.png',
    photo_url: '/assets/candidates/sdp-adebayo.png'
  },
  {
    id: 'aac-sowore',
    name: 'Omoyele Sowore',
    party_name: 'African Action Congress',
    party_code: 'AAC',
    running_mate: 'Haruna Garba Magashi',
    background_text: 'Simulation entry using the AAC ticket pairing known from the last presidential cycle.',
    color: '#f59f00',
    logo_url: '/assets/party-badges/aac.jpg',
    photo_url: '/assets/candidates/aac-sowore.jpg'
  },
  {
    id: 'pdp-onor',
    name: 'Sandy Onor',
    party_name: 'Peoples Democratic Party',
    party_code: 'PDP',
    running_mate: 'Emana Duke Ambrose-Amawhe',
    background_text: "Simulation entry using Sandy Onor's prior Cross River ticket pairing for the preference poll.",
    color: '#0b8f3a',
    logo_url: '/assets/party-badges/pdp.jpg',
    photo_url: '/assets/candidates/pdp-onor.png'
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
