/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Results page for live-style virtual vote totals and rankings.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added launch-ready public poll totals, share links, result discussion, party badges, ranked chart rows, progress bars, and policy-safe result-page ads.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import AdSlot from '../components/AdSlot';
import Disclaimer from '../components/Disclaimer';
import ResultDiscussion from '../components/ResultDiscussion';
import ShareResults from '../components/ShareResults';
import { getPartyBadge } from '../lib/candidateAssets';

// ========================================================
// Results page component
// ========================================================
export default function ResultsPage({ candidates, participant, loading }) {
  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.vote_count || 0), 0);
  const leader = candidates[0];
  const canShowContentAd = !loading && candidates.length > 0;

  return (
    <main className="page-shell page-shell--narrow">
      <Disclaimer compact />

      <section className="results-summary">
        <div>
          <p className="eyebrow">Live public poll results</p>
          <h2>{totalVotes.toLocaleString()} total preference votes</h2>
          <p>
            {leader
              ? `${leader.name} currently leads this public poll with ${getPercentage(leader.vote_count, totalVotes)}%.`
              : 'Results will appear after candidates load.'}
          </p>
        </div>
      </section>

      {!loading && candidates.length > 0 && (
        <section className="results-chart" aria-label="Candidate vote share chart">
          <div className="results-chart__lead">
            <span
              style={{
                '--chart-color': leader?.color || '#008751',
                '--chart-percent': getPercentage(leader?.vote_count, totalVotes)
              }}
            >
              {getPercentage(leader?.vote_count, totalVotes)}%
            </span>
            <div>
              <p className="eyebrow">Leading share</p>
              <h3>{leader?.name || 'No leader yet'}</h3>
            </div>
          </div>

          <div className="chart-list">
            {candidates.map((candidate) => {
              const percentage = getPercentage(candidate.vote_count, totalVotes);
              return (
                <div key={candidate.id} className="chart-item">
                  <div className="chart-item__label">
                    <strong>{candidate.party_code}</strong>
                    <span>{candidate.name}</span>
                    <b>{percentage}%</b>
                  </div>
                  <div className="chart-track">
                    <span style={{ width: `${percentage}%`, background: candidate.color || '#008751' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="results-panel">
        {loading ? (
          <div className="empty-state">Loading results...</div>
        ) : (
          candidates.map((candidate, index) => {
            const percentage = getPercentage(candidate.vote_count, totalVotes);
            const partyBadge = getPartyBadge(candidate);
            return (
              <article key={candidate.id} className="result-row">
                <div className="result-row__header">
                  <div>
                    <span className="rank">#{index + 1}</span>
                    <strong>{candidate.name}</strong>
                    <span className="party-code party-code--with-badge">
                      {partyBadge && <img src={partyBadge} alt="" aria-hidden="true" />}
                      {candidate.party_code}
                    </span>
                  </div>
                  <div>
                    <strong>{Number(candidate.vote_count || 0).toLocaleString()}</strong>
                    <span>{percentage}%</span>
                  </div>
                </div>
                <div className="progress" aria-label={`${candidate.name}: ${percentage}%`}>
                  <span style={{ width: `${percentage}%`, background: candidate.color || '#008751' }} />
                </div>
              </article>
            );
          })
        )}
      </section>

      <ShareResults />

      <ResultDiscussion participant={participant} />

      {canShowContentAd && <AdSlot label="In-content advertisement" variant="rectangle" />}
    </main>
  );
}

// ========================================================
// Result percentage helper
// ========================================================
function getPercentage(count, total) {
  if (!total) return 0;
  return Number(((Number(count || 0) / total) * 100).toFixed(1));
}
