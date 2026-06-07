/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Candidate display card for the presidential virtual ballot.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added candidate illustration, party badge, vote count, running mate, and selection button.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { CheckCircle2 } from 'lucide-react';
import { getCandidatePortrait, getPartyBadge } from '../lib/candidateAssets';

// ========================================================
// Candidate card component
// ========================================================
export default function CandidateCard({ candidate, disabled, onSelect }) {
  const portrait = getCandidatePortrait(candidate);
  const partyBadge = getPartyBadge(candidate);

  return (
    <article className="candidate-card">
      <div className="candidate-portrait-wrap">
        <img className="candidate-portrait" src={portrait} alt={`${candidate.name} stylized simulation portrait`} />
        {partyBadge && (
          <img className="candidate-party-badge" src={partyBadge} alt={`${candidate.party_code} simulation party badge`} />
        )}
      </div>

      <div className="candidate-card__top">
        <div>
          <span className="party-code party-code--with-badge">
            {partyBadge && <img src={partyBadge} alt="" aria-hidden="true" />}
            {candidate.party_code}
          </span>
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
