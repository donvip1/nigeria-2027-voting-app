/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Main app shell, page navigation, candidate loading, and global layout.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added privacy, contact, CMS page routing, clean URL and hash navigation, footer navigation, and public compliance links.
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
import CmsPage from './pages/CmsPage';
import { fetchCandidates } from './lib/api';
import { getStoredParticipant } from './lib/fingerprint';
import { isSupabaseConfigured } from './lib/supabase';

const routablePages = ['vote', 'results', 'polls', 'info', 'privacy', 'contact', 'cms'];

// ========================================================
// Main application component and shared state
// ========================================================
export default function App() {
  const [currentPage, setCurrentPage] = useState(getRoutePage());
  const [candidates, setCandidates] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    setParticipant(getStoredParticipant());
    refreshCandidates();

    function handleRouteChange() {
      setCurrentPage(getRoutePage());
    }

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // ========================================================
  // App navigation helper
  // ========================================================
  function handleNavigate(page) {
    setCurrentPage(page);
    const nextPath = page === 'vote' ? '/' : `/${page}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
  }

  function handleFooterNavigate(event, page) {
    event.preventDefault();
    handleNavigate(page);
  }

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
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

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

      {currentPage === 'info' && <InfoPage onNavigate={handleNavigate} />}

      {currentPage === 'privacy' && <PrivacyPage />}

      {currentPage === 'contact' && <ContactPage />}

      {currentPage === 'cms' && <CmsPage />}

      <footer className="site-footer">
        <Disclaimer compact />
        <nav className="footer-links" aria-label="Footer navigation">
          <a
            href="/privacy"
            className="text-link"
            onClick={(event) => handleFooterNavigate(event, 'privacy')}
          >
            Privacy Policy
          </a>
          <a
            href="/contact"
            className="text-link"
            onClick={(event) => handleFooterNavigate(event, 'contact')}
          >
            Contact
          </a>
          <a
            href="/cms"
            className="text-link"
            onClick={(event) => handleFooterNavigate(event, 'cms')}
          >
            CMS
          </a>
        </nav>
        <p>
          Nigeria 2027 Virtual Vote is built as a public simulation and educational product. Verify
          official election information with INEC and trusted primary sources.
        </p>
      </footer>
    </div>
  );
}

// ========================================================
// Path and hash route resolver
// ========================================================
function getRoutePage() {
  const pathPage = window.location.pathname.replace('/', '');
  if (routablePages.includes(pathPage)) return pathPage;

  const hashPage = window.location.hash.replace('#', '');
  return routablePages.includes(hashPage) ? hashPage : 'vote';
}
