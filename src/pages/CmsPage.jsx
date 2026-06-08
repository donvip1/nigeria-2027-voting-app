/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Lightweight CMS page for authenticated candidate content editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added email OTP admin login, admin allow-list verification, candidate editor forms, and save/logout controls.
*********************************************************/

// ========================================================
// Imports and CMS helpers
// ========================================================
import { useEffect, useState } from 'react';
import { Lock, LogOut, Save } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import {
  fetchCmsCandidates,
  getCmsSession,
  logoutCms,
  sendCmsLoginCode,
  updateCmsCandidate,
  verifyCmsAdmin,
  verifyCmsLoginCode
} from '../lib/cmsApi';

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
  const [savingId, setSavingId] = useState('');
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
  // Admin authorization and candidate loading
  // ========================================================
  async function loadAdminState(adminEmail) {
    try {
      const allowed = await verifyCmsAdmin(adminEmail);
      setIsAdmin(allowed);

      if (!allowed) {
        setError('This email is not authorized for CMS access.');
        return;
      }

      setCandidates(await fetchCmsCandidates());
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

  async function handleLogout() {
    await logoutCms();
    setSession(null);
    setIsAdmin(false);
    setCandidates([]);
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
          <h2>Candidate content manager</h2>
          <p>Use the approved admin email to update candidate and ticket content.</p>
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
                  <CmsField candidateId={candidate.id} label="Candidate name" value={candidate.name} onChange={(value) => updateLocalCandidate(candidate.id, 'name', value)} />
                  <CmsField candidateId={candidate.id} label="Party name" value={candidate.party_name} onChange={(value) => updateLocalCandidate(candidate.id, 'party_name', value)} />
                  <CmsField candidateId={candidate.id} label="Party code" value={candidate.party_code} onChange={(value) => updateLocalCandidate(candidate.id, 'party_code', value)} />
                  <CmsField candidateId={candidate.id} label="Running mate" value={candidate.running_mate || ''} onChange={(value) => updateLocalCandidate(candidate.id, 'running_mate', value)} />
                  <CmsField candidateId={candidate.id} label="Color" type="color" value={candidate.color || '#008751'} onChange={(value) => updateLocalCandidate(candidate.id, 'color', value)} />
                  <CmsField candidateId={candidate.id} label="Photo URL" value={candidate.photo_url || ''} onChange={(value) => updateLocalCandidate(candidate.id, 'photo_url', value)} />
                  <CmsField candidateId={candidate.id} label="Logo URL" value={candidate.logo_url || ''} onChange={(value) => updateLocalCandidate(candidate.id, 'logo_url', value)} />
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
function CmsField({ candidateId, label, value, onChange, type = 'text' }) {
  const fieldId = `cms-${candidateId}-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
