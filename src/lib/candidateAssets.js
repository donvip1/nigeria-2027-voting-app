/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Candidate portrait and party badge asset mapping for the virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added real candidate image paths and INEC party logo fallback assets.
*********************************************************/

// ========================================================
// Candidate portrait and party badge fallback maps
// ========================================================
const candidatePortraits = {
  'apc-tinubu': '/assets/candidates/apc-tinubu.png',
  'adc-atiku': '/assets/candidates/adc-atiku.png',
  'ndc-obi': '/assets/candidates/ndc-obi.png',
  'prp-duke': '/assets/candidates/prp-duke.png',
  'sdp-adebayo': '/assets/candidates/sdp-adebayo.png',
  'aac-sowore': '/assets/candidates/aac-sowore.jpg',
  'pdp-onor': '/assets/candidates/pdp-onor.png'
};

const partyBadges = {
  APC: '/assets/party-badges/apc.jpg',
  ADC: '/assets/party-badges/adc.jpg',
  NDC: '/assets/party-badges/ndc.jpeg',
  PRP: '/assets/party-badges/prp.png',
  SDP: '/assets/party-badges/sdp.png',
  AAC: '/assets/party-badges/aac.jpg',
  PDP: '/assets/party-badges/pdp.jpg'
};

// ========================================================
// Candidate asset resolver helpers
// ========================================================
export function getCandidatePortrait(candidate) {
  if (candidate?.photo_url && !candidate.photo_url.endsWith('.svg')) {
    return candidate.photo_url;
  }

  return candidatePortraits[candidate?.slug] || '';
}

export function getPartyBadge(candidate) {
  if (candidate?.logo_url && !candidate.logo_url.endsWith('.svg')) {
    return candidate.logo_url;
  }

  return partyBadges[candidate?.party_code] || '';
}
