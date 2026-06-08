/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Lightweight CMS page for authenticated candidate content editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added email OTP admin login, admin allow-list verification, candidate and poll editor forms, and save/logout controls.
*********************************************************/

// ========================================================
// Imports and CMS helpers
// ========================================================
import { useEffect, useState } from 'react';
import { ListChecks, Lock, LogOut, Save } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import {
  fetchCmsCandidates,
  fetchCmsPolls,
  getCmsSession,
  logoutCms,
  sendCmsLoginCode,
  updateCmsCandidate,
  updateCmsPoll,
  updateCmsPollOption,
  verifyCmsAdmin,
  verifyCmsLoginCode
} from '../lib/cmsApi';

const cmsSections = [
  { id: 'candidates', label: 'Candidates' },
  { id: 'polls', label: 'Polls' }
];

// ========================================================
// CMS page component
// ========================================================
export default function CmsPage() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [polls, setPolls] = useState([]);
  const [activeSection, setActiveSection] = useState('candidates');
  const [savingId, setSavingId] = useState('');
  const [savingPollId, setSavingPollId] = useState('');
  const [savingOptionId, setSavingOptionId] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  useEffect(() => {
    loadExistingSession();
  }, []);

  // ========================================================
  // Existing CMS session loader
  // ========================================================
  async function loadExistingSession() {
    const existingSession = await getCmsSession();
    if (!existingSession?.user?.email) return;

    setSession(existingSession);
    setEmail(existingSession.user.email);
    await loadAdminState(existingSession.user.email);
  }

  // ========================================================
  // Admin authorization and CMS content loading
  // ========================================================
  async function loadAdminState(adminEmail) {
    try {
      const allowed = await verifyCmsAdmin(adminEmail);
      setIsAdmin(allowed);

      if (!allowed) {
        setError('This email is not authorized for CMS access.');
        return;
      }

      const [loadedCandidates, loadedPolls] = await Promise.all([
        fetchCmsCandidates(),
        fetchCmsPolls()
      ]);

      setCandidates(loadedCandidates);
      setPolls(loadedPolls);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Could not load CMS data.');
    }
  }

  // ========================================================
  // CMS login code request and verification
  // ========================================================
  async function handleSendCode(event) {
    event.preventDefault();
    setIsSendingCode(true);
    setMessage('');
    setError('');

    try {
      await sendCmsLoginCode(email);
      setMessage('CMS login code sent to your email.');
    } catch (sendError) {
      setError(sendError.message || 'Could not send CMS login code.');
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleVerifyCode(event) {
    event.preventDefault();
    setIsVerifyingCode(true);
    setMessage('');
    setError('');

    try {
      const verifiedSession = await verifyCmsLoginCode(email, token);
      setSession(verifiedSession);
      setMessage('CMS login verified.');
      await loadAdminState(email);
    } catch (verifyError) {
      setError(verifyError.message || 'Could not verify CMS login code.');
    } finally {
      setIsVerifyingCode(false);
    }
  }

  // ========================================================
  // Candidate form state and save handlers
  // ========================================================
  function updateLocalCandidate(candidateId, field, value) {
    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              [field]: value
            }
          : candidate
      )
    );
  }

  async function handleSaveCandidate(candidate) {
    setSavingId(candidate.id);
    setMessage('');
    setError('');

    try {
      await updateCmsCandidate(candidate.id, candidate);
      setMessage(`${candidate.name} saved.`);
    } catch (saveError) {
      setError(saveError.message || 'Candidate save failed.');
    } finally {
      setSavingId('');
    }
  }

  // ========================================================
  // Poll form state and save handlers
  // ========================================================
  function updateLocalPoll(pollId, field, value) {
    setPolls((currentPolls) =>
      currentPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              [field]: value
            }
          : poll
      )
    );
  }

  function updateLocalPollOption(pollId, optionId, field, value) {
    setPolls((currentPolls) =>
      currentPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              poll_options: poll.poll_options.map((option) =>
                option.id === optionId
                  ? {
                      ...option,
                      [field]: value
                    }
                  : option
              )
            }
          : poll
      )
    );
  }

  async function handleSavePoll(poll) {
    setSavingPollId(poll.id);
    setMessage('');
    setError('');

    try {
      await updateCmsPoll(poll.id, poll);
      setMessage(`${poll.title} saved.`);
    } catch (saveError) {
      setError(saveError.message || 'Poll save failed.');
    } finally {
      setSavingPollId('');
    }
  }

  async function handleSavePollOption(poll, option) {
    setSavingOptionId(option.id);
    setMessage('');
    setError('');

    try {
      await updateCmsPollOption(option.id, option);
      setMessage(`${poll.title} option saved.`);
    } catch (saveError) {
      setError(saveError.message || 'Poll option save failed.');
    } finally {
      setSavingOptionId('');
    }
  }

  async function handleLogout() {
    await logoutCms();
    setSession(null);
    setIsAdmin(false);
    setCandidates([]);
    setPolls([]);
    setMessage('Logged out of CMS.');
  }

  // ========================================================
  // CMS page layout
  // ========================================================
  return (
    <main className="page-shell page-shell--narrow">
      <AdSlot />

      <section className="legal-hero">
        <div className="legal-hero__icon">
          <Lock aria-hidden="true" size={28} />
        </div>
        <div>
          <p className="eyebrow">CMS</p>
          <h2>Content manager</h2>
          <p>Use the approved admin email to update candidate tickets and public polls.</p>
        </div>
      </section>

      {!session && (
        <section className="cms-panel">
          <form onSubmit={handleSendCode} className="cms-login-form">
            <label htmlFor="cms-email">Admin email</label>
            <div className="inline-form">
              <input
                id="cms-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
              />
              <button type="submit" disabled={isSendingCode || !email.trim()}>
                {isSendingCode ? 'Sending...' : 'Send code'}
              </button>
            </div>
          </form>

          <form onSubmit={handleVerifyCode} className="cms-login-form">
            <label htmlFor="cms-token">Email code</label>
            <div className="inline-form">
              <input
                id="cms-token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Enter code"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <button type="submit" className="button-secondary" disabled={isVerifyingCode || !token.trim()}>
                {isVerifyingCode ? 'Checking...' : 'Verify'}
              </button>
            </div>
          </form>
        </section>
      )}

      {session && isAdmin && (
        <section className="cms-panel">
          <div className="cms-toolbar">
            <div>
              <p className="eyebrow">Signed in</p>
              <h3>{session.user.email}</h3>
            </div>
            <button type="button" className="button-secondary button-secondary--icon" onClick={handleLogout}>
              <LogOut aria-hidden="true" size={17} />
              <span>Logout</span>
            </button>
          </div>

          <div className="cms-section-tabs" role="tablist" aria-label="CMS sections">
            {cmsSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? 'cms-section-tab cms-section-tab--active' : 'cms-section-tab'}
                onClick={() => setActiveSection(section.id)}
              >
                <ListChecks aria-hidden="true" size={16} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {activeSection === 'candidates' && (
            <div className="cms-candidate-list">
              {candidates.map((candidate) => (
                <article key={candidate.id} className="cms-candidate-card">
                  <div className="cms-candidate-card__header">
                    <div>
                      <span className="party-code">{candidate.party_code}</span>
                      <h3>{candidate.name}</h3>
                    </div>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={candidate.is_active}
                        onChange={(event) => updateLocalCandidate(candidate.id, 'is_active', event.target.checked)}
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="cms-form-grid">
                    <CmsField itemId={candidate.id} label="Candidate name" value={candidate.name} onChange={(value) => updateLocalCandidate(candidate.id, 'name', value)} />
                    <CmsField itemId={candidate.id} label="Party name" value={candidate.party_name} onChange={(value) => updateLocalCandidate(candidate.id, 'party_name', value)} />
                    <CmsField itemId={candidate.id} label="Party code" value={candidate.party_code} onChange={(value) => updateLocalCandidate(candidate.id, 'party_code', value)} />
                    <CmsField itemId={candidate.id} label="Running mate" value={candidate.running_mate || ''} onChange={(value) => updateLocalCandidate(candidate.id, 'running_mate', value)} />
                    <CmsField itemId={candidate.id} label="Color" type="color" value={candidate.color || '#008751'} onChange={(value) => updateLocalCandidate(candidate.id, 'color', value)} />
                    <CmsField itemId={candidate.id} label="Photo URL" value={candidate.photo_url || ''} onChange={(value) => updateLocalCandidate(candidate.id, 'photo_url', value)} />
                    <CmsField itemId={candidate.id} label="Logo URL" value={candidate.logo_url || ''} onChange={(value) => updateLocalCandidate(candidate.id, 'logo_url', value)} />
                  </div>

                  <label className="cms-textarea-label" htmlFor={`background-${candidate.id}`}>Background text</label>
                  <textarea
                    id={`background-${candidate.id}`}
                    value={candidate.background_text || ''}
                    onChange={(event) => updateLocalCandidate(candidate.id, 'background_text', event.target.value)}
                  />

                  <button
                    type="button"
                    className="button-secondary button-secondary--icon"
                    onClick={() => handleSaveCandidate(candidate)}
                    disabled={savingId === candidate.id}
                  >
                    <Save aria-hidden="true" size={17} />
                    <span>{savingId === candidate.id ? 'Saving...' : 'Save candidate'}</span>
                  </button>
                </article>
              ))}
            </div>
          )}

          {activeSection === 'polls' && (
            <div className="cms-candidate-list">
              {polls.map((poll) => (
                <article key={poll.id} className="cms-candidate-card cms-poll-card">
                  <div className="cms-candidate-card__header">
                    <div>
                      <span className="party-code">{poll.type.replace('_', ' ')}</span>
                      <h3>{poll.title}</h3>
                    </div>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={poll.is_active}
                        onChange={(event) => updateLocalPoll(poll.id, 'is_active', event.target.checked)}
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="cms-form-grid">
                    <CmsField itemId={poll.id} label="Poll title" value={poll.title} onChange={(value) => updateLocalPoll(poll.id, 'title', value)} />
                    <CmsSelectField itemId={poll.id} label="Poll type" value={poll.type} onChange={(value) => updateLocalPoll(poll.id, 'type', value)} />
                  </div>

                  <button
                    type="button"
                    className="button-secondary button-secondary--icon"
                    onClick={() => handleSavePoll(poll)}
                    disabled={savingPollId === poll.id}
                  >
                    <Save aria-hidden="true" size={17} />
                    <span>{savingPollId === poll.id ? 'Saving...' : 'Save poll'}</span>
                  </button>

                  <div className="cms-option-list">
                    <div className="cms-option-list__header">
                      <h4>Options</h4>
                      <span>{poll.poll_options.length} options</span>
                    </div>

                    {poll.poll_options.map((option, index) => (
                      <div key={option.id} className="cms-option-row">
                        <CmsField
                          itemId={option.id}
                          label={`Option ${index + 1}`}
                          value={option.option_text}
                          onChange={(value) => updateLocalPollOption(poll.id, option.id, 'option_text', value)}
                        />
                        <CmsField
                          itemId={`${option.id}-order`}
                          label="Order"
                          type="number"
                          value={String(option.sort_order || index + 1)}
                          onChange={(value) => updateLocalPollOption(poll.id, option.id, 'sort_order', value)}
                        />
                        <div className="cms-option-votes">
                          <span>Votes</span>
                          <strong>{Number(option.vote_count || 0).toLocaleString()}</strong>
                        </div>
                        <button
                          type="button"
                          className="button-secondary button-secondary--icon"
                          onClick={() => handleSavePollOption(poll, option)}
                          disabled={savingOptionId === option.id}
                        >
                          <Save aria-hidden="true" size={17} />
                          <span>{savingOptionId === option.id ? 'Saving...' : 'Save option'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {message && <p className="notice">{message}</p>}
      {error && <p className="notice notice--error">{error}</p>}
    </main>
  );
}

// ========================================================
// CMS field component
// ========================================================
function CmsField({ itemId, label, value, onChange, type = 'text' }) {
  const fieldId = `cms-${itemId}-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function CmsSelectField({ itemId, label, value, onChange }) {
  const fieldId = `cms-${itemId}-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label htmlFor={fieldId}>
      <span>{label}</span>
      <select id={fieldId} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="multiple_choice">Multiple choice</option>
        <option value="yes_no">Yes or no</option>
      </select>
    </label>
  );
}
