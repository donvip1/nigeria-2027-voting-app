/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Development seed data for candidates and public polls.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added launch-ready candidate descriptions, real candidate image paths, party logo paths, and running-mate ticket data for development fallback mode.
*********************************************************/

// ========================================================
// Development presidential candidate data
// ========================================================
export const localCandidates = [
  {
    id: 'apc-tinubu',
    name: 'Bola Ahmed Tinubu',
    party_name: 'All Progressives Congress',
    party_code: 'APC',
    running_mate: 'Kashim Shettima',
    background_text: 'Tinubu and Shettima are listed together for this independent Nigeria 2027 public preference poll.',
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
    background_text: 'Atiku and Okowa are listed together for this independent Nigeria 2027 public preference poll.',
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
    background_text: 'Obi and Kwankwaso are listed together for this independent Nigeria 2027 public preference poll.',
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
    background_text: 'Duke and Gabam are listed together for this independent Nigeria 2027 public preference poll.',
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
    background_text: 'Adebayo and Buhari are listed together for this independent Nigeria 2027 public preference poll.',
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
    background_text: 'Sowore and Magashi are listed together for this independent Nigeria 2027 public preference poll.',
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
    background_text: 'Onor and Ambrose-Amawhe are listed together for this independent Nigeria 2027 public preference poll.',
    color: '#0b8f3a',
    logo_url: '/assets/party-badges/pdp.jpg',
    photo_url: '/assets/candidates/pdp-onor.png'
  }
];

// ========================================================
// Development public issue poll data
// ========================================================
export const localPolls = [
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
    title: 'Should all candidates join a public debate?',
    type: 'yes_no',
    poll_options: [
      { id: 'debate-yes', option_text: 'Yes', vote_count: 68 },
      { id: 'debate-no', option_text: 'No', vote_count: 9 }
    ]
  }
];
