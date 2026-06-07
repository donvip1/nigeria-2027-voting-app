/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Main app shell, page navigation, candidate loading, and global layout.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added privacy and contact pages, footer navigation, and public compliance links.
*********************************************************/

// ========================================================
// Imports, pages, components, and shared helpers
// ========================================================
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import PollsPage from './pages/PollsPage';
import InfoPage from './pages/InfoPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import { fetchCandidates } from './lib/api';
import { getStoredParticipant } from './lib/fingerprint';
import { isSupabaseConfigured } from './lib/supabase';

// ========================================================
// Main application component and shared state
// ========================================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('vote');
  const [candidates, setCandidates] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    setParticipant(getStoredParticipant());
    refreshCandidates();
  }, []);

  // ========================================================
  // Candidate loading from Supabase or local demo storage
  // ========================================================
  async function refreshCandidates() {
    setLoadingCandidates(true);
    setLoadError('');
    try {
      setCandidates(await fetchCandidates());
    } catch (error) {
      setLoadError(error.message || 'Could not load candidates.');
    } finally {
      setLoadingCandidates(false);
    }
  }

  // ========================================================
  // App layout and page routing
  // ========================================================
  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {!isSupabaseConfigured && (
        <div className="demo-ribbon">
          Demo mode: add Supabase environment variables to persist real submissions.
        </div>
      )}

      {loadError && <p className="notice notice--error">{loadError}</p>}

      {currentPage === 'vote' && (
        <VotePage
          candidates={candidates}
          participant={participant}
          setParticipant={setParticipant}
          onRefresh={refreshCandidates}
          loading={loadingCandidates}
        />
      )}

      {currentPage === 'results' && (
        <ResultsPage candidates={candidates} loading={loadingCandidates} />
      )}

      {currentPage === 'polls' && (
        <PollsPage participant={participant} setParticipant={setParticipant} />
      )}

      {currentPage === 'info' && <InfoPage onNavigate={setCurrentPage} />}

      {currentPage === 'privacy' && <PrivacyPage />}

      {currentPage === 'contact' && <ContactPage />}

      <footer className="site-footer">
        <Disclaimer compact />
        <nav className="footer-links" aria-label="Footer navigation">
          <button type="button" className="text-link" onClick={() => setCurrentPage('privacy')}>
            Privacy Policy
          </button>
          <button type="button" className="text-link" onClick={() => setCurrentPage('contact')}>
            Contact
          </button>
        </nav>
        <p>
          Nigeria 2027 Virtual Vote is built as a public simulation and educational product. Verify
          official election information with INEC and trusted primary sources.
        </p>
      </footer>
    </div>
  );
}
