/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Final confirmation modal before submitting a virtual presidential vote.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added anti-bot gate, passkey-only automatic submission flow, candidate summary, modal controls, and submit error display.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { X } from 'lucide-react';

// ========================================================
// Vote confirmation modal component
// ========================================================
export default function VoteConfirmation({
  candidate,
  isSubmitting,
  error,
  antiBotPanel,
  verificationPanel,
  onCancel,
}) {
  if (!candidate) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button type="button" className="icon-button modal__close" onClick={onCancel} disabled={isSubmitting} aria-label="Close">
          <X aria-hidden="true" size={18} />
        </button>

        <p className="eyebrow">Final confirmation</p>
        <h2 id="confirm-title">Confirm your preference vote</h2>
        <p className="muted">
          You are choosing <strong>{candidate.name}</strong> of {candidate.party_name}. This
          submission cannot be changed on this device.
        </p>

        <div className="confirmation-card">
          <span className="party-code">{candidate.party_code}</span>
          <h3>{candidate.name}</h3>
          <p>{candidate.running_mate ? `Running mate: ${candidate.running_mate}` : 'Running mate: To be announced'}</p>
        </div>

        {antiBotPanel}

        {verificationPanel}

        {error && <p className="form-error">{error}</p>}

        <div className="modal__actions">
          <button type="button" className="button-secondary" onClick={onCancel} disabled={isSubmitting}>
            Review again
          </button>
          {isSubmitting && <span className="submit-status">Submitting verified vote...</span>}
        </div>
      </section>
    </div>
  );
}
