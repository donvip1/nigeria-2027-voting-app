/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Presidential virtual voting page and vote submission flow.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added passkey-only auto-submit voting, anti-bot readiness gate, full browser profile reset, and policy-safe in-content ad placement.
*********************************************************/

// ========================================================
// Imports, components, and API helpers
// ========================================================
import { useCallback, useState } from 'react';
import { Fingerprint, RotateCcw } from 'lucide-react';
import AntiBotGate, { turnstileSiteKey } from '../components/AntiBotGate';
import AdSlot from '../components/AdSlot';
import CandidateCard from '../components/CandidateCard';
import Disclaimer from '../components/Disclaimer';
import ParticipantForm from '../components/ParticipantForm';
import VoterVerificationPanel from '../components/VoterVerificationPanel';
import VoteConfirmation from '../components/VoteConfirmation';
import { submitPresidentialVote } from '../lib/api';
import { getCandidatePortrait, getPartyBadge } from '../lib/candidateAssets';
import { clearStoredParticipantProfile, registerParticipantPasskey, saveParticipant, verifyStoredPasskey } from '../lib/fingerprint';

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
  const [antiBotVerified, setAntiBotVerified] = useState(false);
  const [antiBotMessage, setAntiBotMessage] = useState('');
  const [antiBotResetSignal, setAntiBotResetSignal] = useState(0);
  const [isVerifyingAntiBot, setIsVerifyingAntiBot] = useState(false);
  const [isSettingUpPasskey, setIsSettingUpPasskey] = useState(false);
  const [isVerifyingPasskey, setIsVerifyingPasskey] = useState(false);
  const [isFinalPasskeyBusy, setIsFinalPasskeyBusy] = useState(false);

  const handleAntiBotVerified = useCallback(async (token) => {
    setIsVerifyingAntiBot(true);
    setAntiBotMessage('');
    setError('');

    try {
      if (turnstileSiteKey && !import.meta.env.DEV) {
        await verifyTurnstileToken(token);
      }

      setAntiBotVerified(true);
      setAntiBotMessage('Anti-bot verification complete.');
    } catch (verifyError) {
      setAntiBotVerified(false);
      setError(readableAntiBotError(verifyError));
      setAntiBotResetSignal((currentSignal) => currentSignal + 1);
    } finally {
      setIsVerifyingAntiBot(false);
    }
  }, []);

  const handleAntiBotExpired = useCallback(() => {
    setAntiBotVerified(false);
    setAntiBotMessage('Anti-bot verification expired. Complete it again before confirming.');
  }, []);

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
    if (!participant?.nickname) {
      setError('Set up your voting profile first.');
      return;
    }

    if (!antiBotVerified) {
      setError('Complete the anti-bot verification before confirming with your device passkey.');
      return;
    }

    setIsFinalPasskeyBusy(true);
    setError('');

    try {
      let verifiedParticipant = participant;
      let verifiedAt = '';

      if (participant.hasPasskey) {
        const verification = await verifyStoredPasskey();
        verifiedAt = verification.verifiedAt;
        verifiedParticipant = {
          ...participant,
          passkeyVerifiedAt: verifiedAt
        };
      } else {
        const passkeyData = await registerParticipantPasskey(participant.nickname);
        verifiedAt = passkeyData.verifiedAt;
        verifiedParticipant = saveParticipant(participant.nickname, passkeyData);
      }

      setParticipant(verifiedParticipant);
      await submitVerifiedVote(verifiedAt, verifiedParticipant);
    } catch (passkeyError) {
      setError(readablePasskeyError(passkeyError));
    } finally {
      setIsFinalPasskeyBusy(false);
    }
  }

  function handleCandidateSelect(candidate) {
    setSelectedCandidate(candidate);
    setAntiBotVerified(false);
    setAntiBotMessage('');
    setError('');
  }

  function handleClearLocalVoteMarkers() {
    clearStoredParticipantProfile();
    setParticipant(null);
    setSelectedCandidate(null);
    setAntiBotVerified(false);
    setAntiBotMessage('');
    setVerificationMessage('This browser profile and vote status have been reset.');
  }

  // ========================================================
  // Confirm and submit selected presidential candidate after passkey verification
  // ========================================================
  async function submitVerifiedVote(passkeyVerifiedAt, verifiedParticipant = participant) {
    if (!selectedCandidate || !verifiedParticipant) return;

    if (!antiBotVerified) {
      setError('Complete the anti-bot verification before confirming with your device passkey.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitPresidentialVote({
        candidateId: selectedCandidate.id,
        nickname: verifiedParticipant.nickname,
        fingerprint: verifiedParticipant.fingerprint
      });

      setParticipant({ ...verifiedParticipant, hasVoted: true, passkeyVerifiedAt });
      setSelectedCandidate(null);
      setAntiBotVerified(false);
      setAntiBotMessage('');
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
          <h2>Choose a presidential ticket in the public opinion poll.</h2>
          <p>
            Review each candidate, running mate, and party badge before submitting one public
            preference vote. This is independent public sentiment software, not an official election platform.
          </p>
        </div>
        <div className="hero__visual" aria-label={`${candidates.length} candidates loaded`}>
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
                : 'Device confirmation is required before vote submission. Your device may use fingerprint, face unlock, PIN, or password.'}
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
                <span>Reset browser vote status</span>
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
          <p className="eyebrow">Public preference ballot</p>
          <h2>Vote for your preferred ticket</h2>
        </div>
        <p>Candidate and running-mate information can be updated as publicly available details change.</p>
      </section>

      {loading ? (
        <div className="empty-state">Loading candidates...</div>
      ) : hasLocalOnlyVoteMarker ? (
        <div className="notice notice--warning">
          This browser still has a previous vote status saved locally. Use `Reset browser vote status`
          above only if the public vote database has been reset.
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
        verificationPanel={
          selectedCandidate ? (
            <VoterVerificationPanel
              title="Confirm vote submission"
              description="Confirm with your device passkey, fingerprint, face unlock, PIN, or device password. The vote submits automatically after confirmation."
              passkeyLabel="Confirm with fingerprint/passkey"
              isPasskeyBusy={isFinalPasskeyBusy}
              onPasskeyVerify={handleFinalPasskeyVerify}
              disabled={isSubmitting || !antiBotVerified}
            />
          ) : null
        }
        antiBotPanel={
          selectedCandidate ? (
            <AntiBotGate
              verified={antiBotVerified}
              verifying={isVerifyingAntiBot}
              message={antiBotMessage}
              resetSignal={antiBotResetSignal}
              onVerified={handleAntiBotVerified}
              onExpired={handleAntiBotExpired}
            />
          ) : null
        }
        onCancel={() => {
          setSelectedCandidate(null);
          setAntiBotVerified(false);
          setAntiBotMessage('');
          setError('');
        }}
      />
    </main>
  );
}

// ========================================================
// Public vote error message formatting
// ========================================================
function readableVoteError(error) {
  const message = error?.message || 'Vote submission failed.';

  if (message.includes('function digest')) {
    return 'Vote submission is temporarily unavailable. Please try again later or contact support if this continues.';
  }

  if (message.includes('duplicate')) {
    return 'This device or nickname has already submitted a presidential preference vote.';
  }

  return message;
}

function readablePasskeyError(error) {
  if (error?.name === 'NotAllowedError') {
    return 'Fingerprint/passkey verification was cancelled or timed out.';
  }

  return error?.message || 'Fingerprint/passkey verification failed.';
}

function readableAntiBotError(error) {
  const message = error?.message || 'Anti-bot verification failed.';

  if (message.includes('turnstile_secret_not_configured')) {
    return 'Anti-bot server verification is not configured yet. Add TURNSTILE_SECRET_KEY in Vercel, then redeploy.';
  }

  if (message.includes('missing_token')) {
    return 'Anti-bot verification did not return a token. Complete the check again.';
  }

  return 'Anti-bot verification failed. Refresh the page and try again.';
}

async function verifyTurnstileToken(token) {
  const response = await fetch('/api/verify-turnstile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'turnstile_verification_failed');
  }
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
