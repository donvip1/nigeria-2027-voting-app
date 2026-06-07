/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Final confirmation modal before submitting a virtual presidential vote.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added candidate summary, modal controls, and submit error display.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { X } from 'lucide-react';

// ========================================================
// Vote confirmation modal component
// ========================================================
export default function VoteConfirmation({ candidate, isSubmitting, error, onCancel, onConfirm }) {
  if (!candidate) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button type="button" className="icon-button modal__close" onClick={onCancel} aria-label="Close">
          <X aria-hidden="true" size={18} />
        </button>

        <p className="eyebrow">Final confirmation</p>
        <h2 id="confirm-title">Confirm your virtual vote</h2>
        <p className="muted">
          You are choosing <strong>{candidate.name}</strong> of {candidate.party_name}. This
          submission cannot be changed on this device.
        </p>

        <div className="confirmation-card">
          <span className="party-code">{candidate.party_code}</span>
          <h3>{candidate.name}</h3>
          <p>{candidate.running_mate ? `Running mate: ${candidate.running_mate}` : 'Running mate: TBA'}</p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal__actions">
          <button type="button" className="button-secondary" onClick={onCancel} disabled={isSubmitting}>
            Review again
          </button>
          <button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit virtual vote'}
          </button>
        </div>
      </section>
    </div>
  );
}
