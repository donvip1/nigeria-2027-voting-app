/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Candidate display card for the presidential virtual ballot.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added candidate identity, vote count, running mate, and selection button.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { CheckCircle2, UserRound } from 'lucide-react';

// ========================================================
// Candidate card component
// ========================================================
export default function CandidateCard({ candidate, disabled, onSelect }) {
  return (
    <article className="candidate-card">
      <div className="candidate-card__top">
        <div className="candidate-avatar" style={{ '--candidate-color': candidate.color || '#008751' }}>
          <UserRound aria-hidden="true" size={30} />
        </div>
        <div>
          <span className="party-code">{candidate.party_code}</span>
          <h3>{candidate.name}</h3>
          <p>{candidate.party_name}</p>
        </div>
      </div>

      <p className="candidate-card__body">{candidate.background_text}</p>

      <div className="candidate-card__meta">
        <span>Running mate: {candidate.running_mate || 'TBA'}</span>
        <strong>{Number(candidate.vote_count || 0).toLocaleString()} votes</strong>
      </div>

      <button
        type="button"
        className="candidate-card__button"
        onClick={() => onSelect(candidate)}
        disabled={disabled}
      >
        <CheckCircle2 aria-hidden="true" size={17} />
        <span>{disabled ? 'Already voted' : 'Select candidate'}</span>
      </button>
    </article>
  );
}
