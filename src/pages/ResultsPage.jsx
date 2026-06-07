/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Results page for live-style virtual vote totals and rankings.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added vote totals, leader summary, ranked rows, and progress bars.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import AdSlot from '../components/AdSlot';
import Disclaimer from '../components/Disclaimer';

// ========================================================
// Results page component
// ========================================================
export default function ResultsPage({ candidates, loading }) {
  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.vote_count || 0), 0);
  const leader = candidates[0];

  return (
    <main className="page-shell page-shell--narrow">
      <AdSlot />
      <Disclaimer compact />

      <section className="results-summary">
        <div>
          <p className="eyebrow">Live simulation results</p>
          <h2>{totalVotes.toLocaleString()} total virtual votes</h2>
          <p>
            {leader
              ? `${leader.name} currently leads this simulation with ${getPercentage(leader.vote_count, totalVotes)}%.`
              : 'Results will appear after candidates load.'}
          </p>
        </div>
      </section>

      <section className="results-panel">
        {loading ? (
          <div className="empty-state">Loading results...</div>
        ) : (
          candidates.map((candidate, index) => {
            const percentage = getPercentage(candidate.vote_count, totalVotes);
            return (
              <article key={candidate.id} className="result-row">
                <div className="result-row__header">
                  <div>
                    <span className="rank">#{index + 1}</span>
                    <strong>{candidate.name}</strong>
                    <span className="party-code">{candidate.party_code}</span>
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

      <AdSlot label="In-content advertisement" variant="rectangle" />
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
