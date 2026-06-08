/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Presidential virtual voting page and vote submission flow.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added passkey verification status, participant status, candidate selection, confirmation modal, and submission handling.
*********************************************************/

// ========================================================
// Imports, components, and API helpers
// ========================================================
import { useState } from 'react';
import AdSlot from '../components/AdSlot';
import CandidateCard from '../components/CandidateCard';
import Disclaimer from '../components/Disclaimer';
import ParticipantForm from '../components/ParticipantForm';
import VoteConfirmation from '../components/VoteConfirmation';
import { submitPresidentialVote } from '../lib/api';
import { verifyStoredPasskey } from '../lib/fingerprint';

// ========================================================
// Vote page component and local vote state
// ========================================================
export default function VotePage({ candidates, participant, setParticipant, onRefresh, loading }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isVerifyingPasskey, setIsVerifyingPasskey] = useState(false);

  // ========================================================
  // Stored passkey re-verification handler
  // ========================================================
  async function handleVerifyPasskey() {
    if (!participant?.hasPasskey) return;

    setIsVerifyingPasskey(true);
    setVerificationMessage('Waiting for your device fingerprint/passkey confirmation...');

    try {
      const verification = await verifyStoredPasskey();
      setParticipant({
        ...participant,
        passkeyVerifiedAt: verification.verifiedAt
      });
      setVerificationMessage('Fingerprint/passkey verified for this session.');
    } catch (passkeyError) {
      setVerificationMessage(readablePasskeyError(passkeyError));
    } finally {
      setIsVerifyingPasskey(false);
    }
  }

  // ========================================================
  // Confirm and submit selected presidential candidate
  // ========================================================
  async function handleConfirmVote() {
    if (!selectedCandidate || !participant) return;

    setIsSubmitting(true);
    setError('');

    try {
      await submitPresidentialVote({
        candidateId: selectedCandidate.id,
        nickname: participant.nickname,
        fingerprint: participant.fingerprint
      });

      setParticipant({ ...participant, hasVoted: true });
      setSelectedCandidate(null);
      await onRefresh();
    } catch (voteError) {
      setError(readableVoteError(voteError));
    } finally {
      setIsSubmitting(false);
    }
  }

  // ========================================================
  // Vote page layout
  // ========================================================
  return (
    <main className="page-shell">
      <AdSlot />

      <section className="hero">
        <div>
          <p className="eyebrow">Nigeria 2027 preference poll</p>
          <h2>Cast one virtual vote and watch public results update.</h2>
          <p>
            A lightweight simulation for measuring visitor sentiment. The app protects against
            casual duplicate voting, but it is not an official election platform.
          </p>
        </div>
        <div className="hero-stat">
          <span>{candidates.length}</span>
          <p>simulation candidates loaded</p>
        </div>
      </section>

      <Disclaimer compact />

      {!participant && <ParticipantForm onParticipantReady={setParticipant} />}

      {participant && (
        <section className="voter-status">
          <div>
            <p className="eyebrow">Participant</p>
            <h2>{participant.nickname}</h2>
            <p className="muted">
              {participant.hasPasskey
                ? `Fingerprint/passkey enabled${
                    participant.passkeyVerifiedAt ? ` - last verified ${formatVerifiedAt(participant.passkeyVerifiedAt)}` : ''
                  }.`
                : 'Nickname-only mode. Fingerprint/passkey was not saved for this participant.'}
            </p>
            {verificationMessage && <p className="auth-hint auth-hint--inline">{verificationMessage}</p>}
          </div>
          <div className="voter-status__actions">
            <span className={participant.hasVoted ? 'status-pill status-pill--done' : 'status-pill'}>
              {participant.hasVoted ? 'Presidential vote submitted' : 'Ready to vote'}
            </span>
            {participant.hasPasskey && (
              <button type="button" className="button-secondary" onClick={handleVerifyPasskey} disabled={isVerifyingPasskey}>
                {isVerifyingPasskey ? 'Verifying...' : 'Verify fingerprint'}
              </button>
            )}
          </div>
        </section>
      )}

      <section className="section-heading">
        <div>
          <p className="eyebrow">Ballot simulation</p>
          <h2>Select your preferred candidate</h2>
        </div>
        <p>Candidate data is editable seed content and should be updated when official lists exist.</p>
      </section>

      {loading ? (
        <div className="empty-state">Loading candidates...</div>
      ) : (
        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              disabled={!participant || participant.hasVoted}
              onSelect={setSelectedCandidate}
            />
          ))}
        </div>
      )}

      <AdSlot label="Advertisement space" variant="wide" />

      <VoteConfirmation
        candidate={selectedCandidate}
        isSubmitting={isSubmitting}
        error={error}
        onCancel={() => {
          setSelectedCandidate(null);
          setError('');
        }}
        onConfirm={handleConfirmVote}
      />
    </main>
  );
}

// ========================================================
// Supabase and demo-mode error message formatting
// ========================================================
function readableVoteError(error) {
  const message = error?.message || 'Vote submission failed.';

  if (message.includes('duplicate')) {
    return 'This device or nickname has already submitted a presidential virtual vote.';
  }

  return message;
}

function readablePasskeyError(error) {
  if (error?.name === 'NotAllowedError') {
    return 'Fingerprint/passkey verification was cancelled or timed out.';
  }

  return error?.message || 'Fingerprint/passkey verification failed.';
}

function formatVerifiedAt(value) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return 'recently';
  }
}
