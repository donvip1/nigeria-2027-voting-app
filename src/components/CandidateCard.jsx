/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Candidate display card for the presidential virtual ballot.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added launch-ready candidate portrait, party badge, ticket display, vote count, running mate, and clearer vote button states.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { CheckCircle2 } from 'lucide-react';
import { getCandidatePortrait, getPartyBadge } from '../lib/candidateAssets';

// ========================================================
// Candidate card component
// ========================================================
export default function CandidateCard({ candidate, disabled, disabledReason = 'Unavailable', onSelect }) {
  const portrait = getCandidatePortrait(candidate);
  const partyBadge = getPartyBadge(candidate);

  return (
    <article className="candidate-card">
      <div className="candidate-portrait-wrap">
        <img className="candidate-portrait" src={portrait} alt={`${candidate.name} portrait`} />
        {partyBadge && (
          <img className="candidate-party-badge" src={partyBadge} alt={`${candidate.party_code} party badge`} />
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

      <div className="ticket-pair">
        <span>Presidential ticket</span>
        <strong>{candidate.name}</strong>
        <small>{candidate.running_mate || 'Running mate to be announced'}</small>
      </div>

      <div className="candidate-card__meta">
        <span>Running mate: {candidate.running_mate || 'To be announced'}</span>
        <strong>{Number(candidate.vote_count || 0).toLocaleString()} votes</strong>
      </div>

      <button
        type="button"
        className="candidate-card__button"
        onClick={() => onSelect(candidate)}
        disabled={disabled}
      >
        <CheckCircle2 aria-hidden="true" size={17} />
        <span>{disabled ? disabledReason : 'Vote for this ticket'}</span>
      </button>
    </article>
  );
}
