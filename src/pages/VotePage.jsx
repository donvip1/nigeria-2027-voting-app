/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Presidential virtual voting page and vote submission flow.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added candidate image carousel, verification flow, local test reset, and policy-safe in-content ad placement.
*********************************************************/

// ========================================================
// Imports, components, and API helpers
// ========================================================
import { useState } from 'react';
import { Fingerprint, RotateCcw } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import CandidateCard from '../components/CandidateCard';
import Disclaimer from '../components/Disclaimer';
import ParticipantForm from '../components/ParticipantForm';
import VoterVerificationPanel from '../components/VoterVerificationPanel';
import VoteConfirmation from '../components/VoteConfirmation';
import { submitPresidentialVote } from '../lib/api';
import { getCandidatePortrait, getPartyBadge } from '../lib/candidateAssets';
import { clearLocalVoteMarkers, registerParticipantPasskey, saveParticipant, verifyStoredPasskey } from '../lib/fingerprint';

// ========================================================
// Vote page component and local vote state
// ========================================================
export default function VotePage({ candidates, participant, setParticipant, onRefresh, loading }) {
  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.vote_count || 0), 0);
  const hasLocalOnlyVoteMarker = Boolean(participant?.hasVoted && totalVotes === 0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [finalVerification, setFinalVerification] = useState(null);
  const [isSettingUpPasskey, setIsSettingUpPasskey] = useState(false);
  const [isVerifyingPasskey, setIsVerifyingPasskey] = useState(false);
  const [isFinalPasskeyBusy, setIsFinalPasskeyBusy] = useState(false);

  // ========================================================
  // Existing participant passkey setup handler
  // ========================================================
  async function handleSetupPasskey() {
    if (!participant?.nickname) return;

    setIsSettingUpPasskey(true);
    setVerificationMessage('Waiting for your device fingerprint/passkey setup prompt...');

    try {
      const passkeyData = await registerParticipantPasskey(participant.nickname);
      const upgradedParticipant = saveParticipant(participant.nickname, passkeyData);
      setParticipant(upgradedParticipant);
      setVerificationMessage('Fingerprint/passkey sign-in is now saved for this device.');
    } catch (passkeyError) {
      setVerificationMessage(readablePasskeyError(passkeyError));
    } finally {
      setIsSettingUpPasskey(false);
    }
  }

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
  // Final vote verification handlers
  // ========================================================
  async function handleFinalPasskeyVerify() {
    if (!participant?.hasPasskey) {
      setError('Set up fingerprint/passkey first or use OTP verification.');
      return;
    }

    setIsFinalPasskeyBusy(true);
    setError('');

    try {
      const verification = await verifyStoredPasskey();
      setFinalVerification({
        method: 'passkey',
        verifiedAt: verification.verifiedAt
      });
      setParticipant({
        ...participant,
        passkeyVerifiedAt: verification.verifiedAt
      });
    } catch (passkeyError) {
      setError(readablePasskeyError(passkeyError));
    } finally {
      setIsFinalPasskeyBusy(false);
    }
  }

  function handleFinalOtpVerified(verification) {
    setFinalVerification({
      method: 'otp',
      contactType: verification.contactType,
      contact: verification.contact,
      verifiedAt: verification.verifiedAt
    });
    setParticipant({
      ...participant,
      otpVerification: verification
    });
    setError('');
  }

  function handleCandidateSelect(candidate) {
    setSelectedCandidate(candidate);
    setFinalVerification(null);
    setError('');
  }

  function handleClearLocalVoteMarkers() {
    clearLocalVoteMarkers();
    setParticipant({
      ...participant,
      hasVoted: false
    });
    setVerificationMessage('Local test vote marker cleared on this browser.');
  }

  // ========================================================
  // Confirm and submit selected presidential candidate
  // ========================================================
  async function handleConfirmVote() {
    if (!selectedCandidate || !participant) return;

    if (!finalVerification) {
      setError('Complete fingerprint/passkey or OTP verification before submitting your vote.');
      return;
    }

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
  const carouselCandidates = candidates.length > 0 ? [...candidates, ...candidates] : [];
  const canShowContentAd = !loading && candidates.length > 0 && !hasLocalOnlyVoteMarker;

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Nigeria 2027 preference poll</p>
          <h2>Choose a presidential ticket in the public simulation.</h2>
          <p>
            Review each candidate, running mate, and party badge before submitting one virtual
            preference vote. This is public sentiment software, not an official election platform.
          </p>
        </div>
        <div className="hero__visual" aria-label={`${candidates.length} simulation candidates loaded`}>
          <div className="hero-carousel">
            <div className="hero-carousel__track">
              {carouselCandidates.map((candidate, index) => (
                <div className="hero-portrait" key={`${candidate.id || candidate.slug}-${index}`}>
                  <img src={getCandidatePortrait(candidate)} alt="" aria-hidden="true" />
                  {getPartyBadge(candidate) && <img src={getPartyBadge(candidate)} alt="" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </div>
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
                : participant.otpVerification
                  ? `OTP verified by ${participant.otpVerification.contactType}: ${participant.otpVerification.contact}.`
                  : 'Verification required before vote submission. Use fingerprint/passkey or OTP at the final step.'}
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
            {hasLocalOnlyVoteMarker && (
              <button
                type="button"
                className="button-secondary button-secondary--icon"
                onClick={handleClearLocalVoteMarkers}
              >
                <RotateCcw aria-hidden="true" size={17} />
                <span>Clear local test vote</span>
              </button>
            )}
            {!participant.hasPasskey && (
              <button
                type="button"
                className="button-secondary button-secondary--icon"
                onClick={handleSetupPasskey}
                disabled={isSettingUpPasskey}
              >
                <Fingerprint aria-hidden="true" size={17} />
                <span>{isSettingUpPasskey ? 'Waiting for device...' : 'Set up fingerprint/passkey'}</span>
              </button>
            )}
          </div>
        </section>
      )}

      <section className="section-heading">
        <div>
          <p className="eyebrow">Ballot simulation</p>
          <h2>Select your preferred ticket</h2>
        </div>
        <p>Candidate data is editable simulation content and should be updated when final official lists exist.</p>
      </section>

      {loading ? (
        <div className="empty-state">Loading candidates...</div>
      ) : hasLocalOnlyVoteMarker ? (
        <div className="notice notice--warning">
          Supabase vote totals are reset, but this browser still has an old local test vote marker.
          Click `Clear local test vote` above to vote again on this browser.
        </div>
      ) : (
        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              disabled={!participant || participant.hasVoted}
              disabledReason={!participant ? 'Sign in first' : 'Already voted'}
              onSelect={handleCandidateSelect}
            />
          ))}
        </div>
      )}

      {canShowContentAd && <AdSlot label="Advertisement space" variant="wide" />}

      <VoteConfirmation
        candidate={selectedCandidate}
        isSubmitting={isSubmitting}
        error={error}
        verificationComplete={Boolean(finalVerification)}
        verificationPanel={
          selectedCandidate ? (
            <VoterVerificationPanel
              title="Confirm vote submission"
              description="Complete fingerprint/passkey confirmation or OTP verification before the vote can be submitted."
              passkeyLabel="Confirm with fingerprint/passkey"
              otpLabel="Send vote code"
              isPasskeyBusy={isFinalPasskeyBusy}
              onPasskeyVerify={handleFinalPasskeyVerify}
              onOtpVerified={handleFinalOtpVerified}
              disabled={isSubmitting}
            />
          ) : null
        }
        onCancel={() => {
          setSelectedCandidate(null);
          setFinalVerification(null);
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

  if (message.includes('function digest')) {
    return 'Database setup needs the latest Supabase vote-function patch. Run supabase/fix_vote_hash_function.sql in Supabase SQL Editor, then submit again.';
  }

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
