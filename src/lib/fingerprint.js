/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Participant identity, duplicate-vote markers, and lightweight fingerprint helpers.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added local participant storage, poll vote tracking, IP lookup, and browser fingerprinting.
*********************************************************/

// ========================================================
// Stored participant lookup
// ========================================================
export function getStoredParticipant() {
  const nickname = localStorage.getItem('n27_nickname');
  const fingerprint = localStorage.getItem('n27_fingerprint');
  const hasVoted = localStorage.getItem('n27_presidential_vote') === 'true';

  if (!nickname || !fingerprint) return null;
  return { nickname, fingerprint, hasVoted };
}

// ========================================================
// Participant creation and browser fingerprint persistence
// ========================================================
export function saveParticipant(nickname) {
  const trimmedNickname = nickname.trim();
  let fingerprint = localStorage.getItem('n27_fingerprint');

  if (!fingerprint) {
    fingerprint = createDeviceFingerprint();
    localStorage.setItem('n27_fingerprint', fingerprint);
  }

  localStorage.setItem('n27_nickname', trimmedNickname);
  return { nickname: trimmedNickname, fingerprint, hasVoted: false };
}

// ========================================================
// Presidential and poll duplicate-vote markers
// ========================================================
export function markPresidentialVote(candidateId) {
  localStorage.setItem('n27_presidential_vote', 'true');
  localStorage.setItem('n27_presidential_candidate', candidateId);
}

export function hasVotedInPoll(optionGroupId) {
  return localStorage.getItem(`n27_poll_${optionGroupId}`) === 'true';
}

export function markPollVote(optionGroupId) {
  localStorage.setItem(`n27_poll_${optionGroupId}`, 'true');
}

// ========================================================
// Public IP lookup for Supabase vote metadata
// ========================================================
export async function getPublicIp() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal
    });
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  } finally {
    window.clearTimeout(timeout);
  }
}

// ========================================================
// Lightweight browser fingerprint generation
// ========================================================
function createDeviceFingerprint() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.textBaseline = 'top';
    context.font = '14px Arial';
    context.fillText('nigeria-2027-virtual-vote', 2, 2);
  }

  const parts = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas.toDataURL()
  ];

  return btoa(unescape(encodeURIComponent(parts.join('|')))).slice(0, 160);
}
