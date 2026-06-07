/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Project information page for simulation, privacy, and launch requirements.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added information cards, launch checklist, and Supabase connection status.
*********************************************************/

// ========================================================
// Imports, components, and configuration status
// ========================================================
import { ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import Disclaimer from '../components/Disclaimer';
import { isSupabaseConfigured } from '../lib/supabase';

// ========================================================
// Information page component
// ========================================================
export default function InfoPage() {
  return (
    <main className="page-shell page-shell--narrow">
      <AdSlot />

      <section className="info-hero">
        <p className="eyebrow">Project information</p>
        <h2>About this virtual voting simulation</h2>
        <p>
          Nigeria 2027 Virtual Vote is a public opinion product built to measure visitor sentiment
          around a simulated presidential preference poll and related policy questions.
        </p>
      </section>

      <Disclaimer />

      <div className="info-grid">
        <InfoCard title="What this app is" icon={<ShieldCheck aria-hidden="true" size={22} />}>
          <p>
            A free web-based opinion simulation with nickname participation, duplicate-vote
            reduction, public results, and extra public polls.
          </p>
        </InfoCard>

        <InfoCard title="What this app is not" icon={<ExternalLink aria-hidden="true" size={22} />}>
          <p>
            It is not an INEC platform, official ballot, party primary, scientific poll, or legally
            binding voting system.
          </p>
        </InfoCard>

        <InfoCard title="Privacy summary" icon={<ShieldCheck aria-hidden="true" size={22} />}>
          <p>
            The app stores nickname, device fingerprint, vote metadata, and IP metadata to reduce
            duplicate submissions. Do not enter sensitive personal information as a nickname.
          </p>
        </InfoCard>

        <InfoCard title="Contact placeholder" icon={<Mail aria-hidden="true" size={22} />}>
          <p>
            Replace this with your real contact email before applying for AdSense or inviting public
            traffic.
          </p>
        </InfoCard>
      </div>

      <section className="requirements-panel">
        <p className="eyebrow">Needed from you</p>
        <h3>Launch requirements</h3>
        <ul>
          <li>Supabase project URL and anon public key.</li>
          <li>GitHub and Vercel accounts for deployment.</li>
          <li>Real contact email and privacy wording for the public site.</li>
          <li>Candidate photos and party logos if you want real visuals in v1.</li>
          <li>AdSense publisher ID after Google approves the site.</li>
        </ul>
        <p>
          Current data mode: <strong>{isSupabaseConfigured ? 'Supabase connected' : 'local demo mode'}</strong>.
        </p>
      </section>
    </main>
  );
}

// ========================================================
// Reusable information card component
// ========================================================
function InfoCard({ title, icon, children }) {
  return (
    <article className="info-card">
      <div className="info-card__icon">{icon}</div>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
