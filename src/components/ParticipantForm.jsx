/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Participant nickname form and local participant setup.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added nickname validation and browser fingerprint registration flow.
*********************************************************/

// ========================================================
// Imports and local state dependencies
// ========================================================
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { saveParticipant } from '../lib/fingerprint';

// ========================================================
// Participant form component
// ========================================================
export default function ParticipantForm({ onParticipantReady }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  // ========================================================
  // Nickname validation and participant save handler
  // ========================================================
  function handleSubmit(event) {
    event.preventDefault();
    const cleaned = nickname.trim();

    if (cleaned.length < 3) {
      setError('Use at least 3 characters.');
      return;
    }

    if (cleaned.length > 40) {
      setError('Use 40 characters or fewer.');
      return;
    }

    setError('');
    onParticipantReady(saveParticipant(cleaned));
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
        <h2 id="participant-title">Enter a nickname to participate</h2>
        <p className="muted">
          The MVP uses nickname, browser fingerprint, and IP metadata to reduce duplicate
          submissions. This is suitable for a simulation, not a legally binding election.
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
          <button type="submit">Continue</button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}
