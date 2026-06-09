/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Main app shell, page navigation, candidate loading, and global layout.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added launch-ready public layout, live-style result refresh, results discussion state, clean URL navigation, footer compliance links, and removed public admin/demo notices.
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
import { isSupabaseConfigured, supabase } from './lib/supabase';

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

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      refreshCandidates();
    }, 15000);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;

    const resultRefreshChannel = supabase
      .channel('public-result-refresh')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presidential_votes' }, refreshCandidates)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options' }, refreshCandidates)
      .subscribe();

    return () => {
      supabase.removeChannel(resultRefreshChannel);
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
  // Candidate loading from the configured data service
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
        <ResultsPage candidates={candidates} participant={participant} loading={loadingCandidates} />
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
        </nav>
        <p>
          Nigeria 2027 Virtual Vote is an independent public opinion platform. Verify official
          election information with INEC and trusted primary sources.
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
