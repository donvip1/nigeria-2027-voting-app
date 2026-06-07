/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Header navigation for the Nigeria 2027 virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added tab navigation for vote, results, polls, and info pages.
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
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div>
          <p className="eyebrow">Public opinion simulation</p>
          <h1>Nigeria 2027 Virtual Vote</h1>
        </div>

        <nav className="tabs" aria-label="Main navigation">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={currentPage === id ? 'tab tab--active' : 'tab'}
              onClick={() => onNavigate(id)}
            >
              <Icon aria-hidden="true" size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
