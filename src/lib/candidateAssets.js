/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Candidate portrait and party badge asset mapping for the virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added local fallback assets for Supabase and demo-mode candidate records.
*********************************************************/

// ========================================================
// Candidate portrait and party badge fallback maps
// ========================================================
const candidatePortraits = {
  'apc-tinubu': '/assets/candidates/apc-tinubu.svg',
  'adc-atiku': '/assets/candidates/adc-atiku.svg',
  'ndc-obi': '/assets/candidates/ndc-obi.svg',
  'prp-duke': '/assets/candidates/prp-duke.svg',
  'sdp-adebayo': '/assets/candidates/sdp-adebayo.svg',
  'aac-sowore': '/assets/candidates/aac-sowore.svg',
  'pdp-onor': '/assets/candidates/pdp-onor.svg'
};

const partyBadges = {
  APC: '/assets/party-badges/apc.svg',
  ADC: '/assets/party-badges/adc.svg',
  NDC: '/assets/party-badges/ndc.svg',
  PRP: '/assets/party-badges/prp.svg',
  SDP: '/assets/party-badges/sdp.svg',
  AAC: '/assets/party-badges/aac.svg',
  PDP: '/assets/party-badges/pdp.svg'
};

// ========================================================
// Candidate asset resolver helpers
// ========================================================
export function getCandidatePortrait(candidate) {
  return candidate?.photo_url || candidatePortraits[candidate?.slug] || '';
}

export function getPartyBadge(candidate) {
  return candidate?.logo_url || partyBadges[candidate?.party_code] || '';
}
