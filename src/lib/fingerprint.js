/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Participant identity, duplicate-vote markers, and lightweight fingerprint helpers.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added passkey-backed fingerprint verification, local participant storage, poll vote tracking, IP lookup, and browser fingerprinting.
*********************************************************/

// ========================================================
// Stored participant lookup
// ========================================================
export function getStoredParticipant() {
  const nickname = localStorage.getItem('n27_nickname');
  const fingerprint = localStorage.getItem('n27_fingerprint');
  const hasVoted = localStorage.getItem('n27_presidential_vote') === 'true';
  const passkeyCredentialId = localStorage.getItem('n27_passkey_credential_id');
  const passkeyVerifiedAt = localStorage.getItem('n27_passkey_verified_at');

  if (!nickname || !fingerprint) return null;
  return {
    nickname,
    fingerprint,
    hasVoted,
    hasPasskey: Boolean(passkeyCredentialId),
    passkeyCredentialId,
    passkeyVerifiedAt
  };
}

// ========================================================
// Participant creation and browser fingerprint persistence
// ========================================================
export function saveParticipant(nickname, passkeyData = null) {
  const trimmedNickname = nickname.trim();
  let fingerprint = localStorage.getItem('n27_fingerprint');

  if (!fingerprint) {
    fingerprint = createDeviceFingerprint();
    localStorage.setItem('n27_fingerprint', fingerprint);
  }

  localStorage.setItem('n27_nickname', trimmedNickname);

  if (passkeyData?.credentialId) {
    localStorage.setItem('n27_passkey_credential_id', passkeyData.credentialId);
    localStorage.setItem('n27_passkey_verified_at', passkeyData.verifiedAt);
  }

  return {
    nickname: trimmedNickname,
    fingerprint,
    hasVoted: false,
    hasPasskey: Boolean(passkeyData?.credentialId || localStorage.getItem('n27_passkey_credential_id')),
    passkeyCredentialId: passkeyData?.credentialId || localStorage.getItem('n27_passkey_credential_id'),
    passkeyVerifiedAt: passkeyData?.verifiedAt || localStorage.getItem('n27_passkey_verified_at')
  };
}

// ========================================================
// Device passkey and biometric availability checks
// ========================================================
export async function getPasskeyAvailability() {
  if (!window.isSecureContext) {
    return {
      available: false,
      reason: 'Fingerprint/passkey sign-in requires HTTPS or localhost.'
    };
  }

  if (!window.PublicKeyCredential || !navigator.credentials?.create) {
    return {
      available: false,
      reason: 'This browser does not support fingerprint/passkey sign-in.'
    };
  }

  if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    return {
      available: true,
      reason: 'This browser supports passkeys, but device availability could not be pre-checked.'
    };
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return {
      available,
      reason: available
        ? 'Fingerprint/passkey sign-in is available on this device.'
        : 'No built-in fingerprint/passkey authenticator was found on this device.'
    };
  } catch {
    return {
      available: false,
      reason: 'Fingerprint/passkey availability could not be checked.'
    };
  }
}

// ========================================================
// Passkey registration and local verification helpers
// ========================================================
export async function registerParticipantPasskey(nickname) {
  const publicKeyCredential = await navigator.credentials.create({
    publicKey: {
      challenge: createRandomBytes(),
      rp: {
        name: 'Nigeria 2027 Virtual Vote'
      },
      user: {
        id: createRandomBytes(),
        name: nickname,
        displayName: nickname
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 }
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'preferred',
        userVerification: 'required'
      },
      timeout: 60000,
      attestation: 'none'
    }
  });

  if (!publicKeyCredential?.rawId) {
    throw new Error('Fingerprint/passkey registration did not complete.');
  }

  return {
    credentialId: toBase64Url(publicKeyCredential.rawId),
    verifiedAt: new Date().toISOString()
  };
}

export async function verifyStoredPasskey() {
  const credentialId = localStorage.getItem('n27_passkey_credential_id');

  if (!credentialId) {
    throw new Error('No fingerprint/passkey credential is saved on this device.');
  }

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: createRandomBytes(),
      allowCredentials: [
        {
          id: fromBase64Url(credentialId),
          type: 'public-key'
        }
      ],
      userVerification: 'required',
      timeout: 60000
    }
  });

  if (!assertion) {
    throw new Error('Fingerprint/passkey verification did not complete.');
  }

  const verifiedAt = new Date().toISOString();
  localStorage.setItem('n27_passkey_verified_at', verifiedAt);
  return { credentialId, verifiedAt };
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

function createRandomBytes(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}
