/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Header navigation for the Nigeria 2027 virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added launch-ready brand copy, Nigeria-themed brand logo, and clean URL tab navigation.
*********************************************************/

// ========================================================
// Imports and navigation tab setup
// ========================================================
import { BarChart3, CheckSquare, Info, Vote } from 'lucide-react';

const tabs = [
  { id: 'vote', label: 'Vote', icon: Vote },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'polls', label: 'Polls', icon: CheckSquare },
  { id: 'info', label: 'Info', icon: Info }
];

// ========================================================
// Header component
// ========================================================
export default function Header({ currentPage, onNavigate }) {
  function handleTabClick(event, id) {
    event.preventDefault();
    onNavigate(id);
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand-lockup">
          <img
            className="brand-logo"
            src="/assets/brand/nigeria-2027-logo.svg"
            alt="Nigeria 2027 Virtual Vote logo"
          />
          <div>
            <p className="eyebrow">Independent public opinion poll</p>
            <h1>Nigeria 2027 Virtual Vote</h1>
          </div>
        </div>

        <nav className="tabs" aria-label="Main navigation">
          {tabs.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={id === 'vote' ? '/' : `/${id}`}
              className={currentPage === id ? 'tab tab--active' : 'tab'}
              onClick={(event) => handleTabClick(event, id)}
            >
              <Icon aria-hidden="true" size={17} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
