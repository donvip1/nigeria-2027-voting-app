/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Passkey verification panel for final vote confirmation.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Removed OTP controls and added centered passkey-only confirmation button for automatic vote submission.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { Fingerprint, ShieldCheck } from 'lucide-react';

// ========================================================
// Voter verification panel component
// ========================================================
export default function VoterVerificationPanel({
  title = 'Verify before continuing',
  description,
  passkeyLabel = 'Use fingerprint/passkey',
  isPasskeyBusy = false,
  onPasskeyVerify,
  disabled = false
}) {
  // ========================================================
  // Verification panel layout
  // ========================================================
  return (
    <section className="verification-panel">
      <div className="verification-panel__header">
        <div className="participant-panel__icon">
          <ShieldCheck aria-hidden="true" size={24} />
        </div>
        <div>
          <p className="eyebrow">Verification required</p>
          <h3>{title}</h3>
          {description && <p className="muted">{description}</p>}
        </div>
      </div>

      <button
        type="button"
        className="auth-primary verification-primary verification-primary--large"
        onClick={onPasskeyVerify}
        disabled={disabled || isPasskeyBusy}
      >
        <Fingerprint aria-hidden="true" size={48} strokeWidth={1.8} />
        <span>{isPasskeyBusy ? 'Confirming...' : passkeyLabel}</span>
      </button>
    </section>
  );
}
