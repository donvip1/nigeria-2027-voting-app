/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Participant nickname form and local participant setup.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added nickname validation, passkey/fingerprint registration, and browser fingerprint fallback flow.
*********************************************************/

// ========================================================
// Imports and local state dependencies
// ========================================================
import { useEffect, useState } from 'react';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { getPasskeyAvailability, registerParticipantPasskey, saveParticipant } from '../lib/fingerprint';

// ========================================================
// Participant form component
// ========================================================
export default function ParticipantForm({ onParticipantReady }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [passkeyReason, setPasskeyReason] = useState('Checking fingerprint/passkey support...');
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkPasskeySupport() {
      const availability = await getPasskeyAvailability();
      if (!isMounted) return;

      setPasskeyAvailable(availability.available);
      setPasskeyReason(availability.reason);
    }

    checkPasskeySupport();

    return () => {
      isMounted = false;
    };
  }, []);

  // ========================================================
  // Nickname validation and participant save handler
  // ========================================================
  function validateNickname() {
    const cleaned = nickname.trim();

    if (cleaned.length < 3) {
      setError('Use at least 3 characters.');
      return;
    }

    if (cleaned.length > 40) {
      setError('Use 40 characters or fewer.');
      return;
    }

    return cleaned;
  }

  // ========================================================
  // Nickname-only participant save handler
  // ========================================================
  function handleSubmit(event) {
    event.preventDefault();
    const cleaned = validateNickname();

    if (!cleaned) return;

    setError('');
    setStatusMessage('Nickname saved. You can participate on this device.');
    onParticipantReady(saveParticipant(cleaned));
  }

  // ========================================================
  // Passkey-backed participant registration handler
  // ========================================================
  async function handlePasskeyRegister() {
    const cleaned = validateNickname();

    if (!cleaned) return;

    setIsRegisteringPasskey(true);
    setError('');
    setStatusMessage('Waiting for your device fingerprint/passkey confirmation...');

    try {
      const passkeyData = await registerParticipantPasskey(cleaned);
      setStatusMessage('Fingerprint/passkey sign-in saved for this device.');
      onParticipantReady(saveParticipant(cleaned, passkeyData));
    } catch (passkeyError) {
      setError(readablePasskeyError(passkeyError));
      setStatusMessage('');
    } finally {
      setIsRegisteringPasskey(false);
    }
  }

  // ========================================================
  // Participant form layout
  // ========================================================
  return (
    <section className="participant-panel" aria-labelledby="participant-title">
      <div className="participant-panel__icon">
        <ShieldCheck aria-hidden="true" size={28} />
      </div>
      <div>
        <p className="eyebrow">Start here</p>
        <h2 id="participant-title">Sign in with fingerprint or nickname</h2>
        <p className="muted">
          Use a device passkey such as fingerprint, Face ID, Touch ID, or Windows Hello when
          available. Nickname-only fallback is still allowed for this public simulation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="participant-form">
        <label htmlFor="nickname">Nickname</label>
        <div className="inline-form">
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="e.g. LagosVoter2027"
            autoComplete="nickname"
          />
        </div>
        <div className="auth-actions">
          <button
            type="button"
            className="auth-primary"
            onClick={handlePasskeyRegister}
            disabled={!passkeyAvailable || isRegisteringPasskey}
          >
            <Fingerprint aria-hidden="true" size={18} />
            <span>{isRegisteringPasskey ? 'Waiting for device...' : 'Use fingerprint/passkey'}</span>
          </button>
          <button type="submit" className="button-secondary">
            Continue with nickname
          </button>
        </div>
        <p className={passkeyAvailable ? 'auth-hint auth-hint--ok' : 'auth-hint'}>{passkeyReason}</p>
        {statusMessage && <p className="auth-hint auth-hint--ok">{statusMessage}</p>}
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}

function readablePasskeyError(error) {
  const message = error?.message || 'Fingerprint/passkey setup failed.';

  if (error?.name === 'NotAllowedError') {
    return 'Fingerprint/passkey setup was cancelled or timed out.';
  }

  if (error?.name === 'NotSupportedError') {
    return 'This browser or device does not support fingerprint/passkey setup.';
  }

  if (error?.name === 'SecurityError') {
    return 'Fingerprint/passkey setup requires HTTPS or localhost.';
  }

  return message;
}
