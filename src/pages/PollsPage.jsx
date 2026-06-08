/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Public issue polls page and poll vote submission flow.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added poll loading, participant checks, vote submission, poll result display, and policy-safe in-content ad placement.
*********************************************************/

// ========================================================
// Imports, components, and poll helpers
// ========================================================
import { useEffect, useState } from 'react';
import AdSlot from '../components/AdSlot';
import ParticipantForm from '../components/ParticipantForm';
import { fetchPolls, submitPollVote } from '../lib/api';
import { hasVotedInPoll } from '../lib/fingerprint';

// ========================================================
// Polls page component and local poll state
// ========================================================
export default function PollsPage({ participant, setParticipant }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingOption, setSubmittingOption] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    refreshPolls();
  }, []);

  // ========================================================
  // Poll loading from Supabase or local demo storage
  // ========================================================
  async function refreshPolls() {
    setLoading(true);
    try {
      setPolls(await fetchPolls());
    } catch (error) {
      setMessage(error.message || 'Could not load polls.');
    } finally {
      setLoading(false);
    }
  }

  // ========================================================
  // Poll vote validation and submission
  // ========================================================
  async function handleVote(poll, option) {
    if (!participant) {
      setMessage('Enter a nickname before voting in polls.');
      return;
    }

    if (hasVotedInPoll(poll.id)) {
      setMessage('This device has already voted in that poll.');
      return;
    }

    setSubmittingOption(option.id);
    setMessage('');

    try {
      await submitPollVote({
        pollId: poll.id,
        optionId: option.id,
        nickname: participant.nickname,
        fingerprint: participant.fingerprint
      });
      setMessage('Poll vote submitted.');
      await refreshPolls();
    } catch (error) {
      setMessage(error.message || 'Poll vote failed.');
    } finally {
      setSubmittingOption('');
    }
  }

  // ========================================================
  // Polls page layout
  // ========================================================
  const canShowContentAd = !loading && polls.length > 0;

  return (
    <main className="page-shell page-shell--narrow">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Additional categories</p>
          <h2>Public issue polls</h2>
        </div>
        <p>Use these for yes/no questions, policy preferences, or local opinion polls.</p>
      </section>

      {!participant && <ParticipantForm onParticipantReady={setParticipant} />}

      {message && <p className="notice">{message}</p>}

      {loading ? (
        <div className="empty-state">Loading polls...</div>
      ) : polls.length === 0 ? (
        <div className="empty-state">No active polls yet.</div>
      ) : (
        <div className="poll-list">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              disabled={!participant || hasVotedInPoll(poll.id)}
              submittingOption={submittingOption}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      {canShowContentAd && <AdSlot label="Advertisement space" variant="wide" />}
    </main>
  );
}

// ========================================================
// Individual poll card and option result display
// ========================================================
function PollCard({ poll, disabled, submittingOption, onVote }) {
  const totalVotes = poll.poll_options.reduce((sum, option) => sum + Number(option.vote_count || 0), 0);

  return (
    <article className="poll-card">
      <div className="poll-card__header">
        <div>
          <span className="party-code">{poll.type.replace('_', ' ')}</span>
          <h3>{poll.title}</h3>
        </div>
        <strong>{totalVotes.toLocaleString()} votes</strong>
      </div>

      <div className="poll-options">
        {poll.poll_options.map((option) => {
          const percentage = totalVotes ? ((Number(option.vote_count || 0) / totalVotes) * 100).toFixed(1) : 0;
          return (
            <button
              key={option.id}
              type="button"
              className="poll-option"
              disabled={disabled || submittingOption === option.id}
              onClick={() => onVote(poll, option)}
            >
              <span>
                <strong>{option.option_text}</strong>
                <small>{Number(option.vote_count || 0).toLocaleString()} votes</small>
              </span>
              <span>{percentage}%</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
