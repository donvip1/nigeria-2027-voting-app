/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Public contact page for the Nigeria 2027 virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added public email, request categories, response expectations, and simulation reminder.
*********************************************************/

// ========================================================
// Imports and page constants
// ========================================================
import { Mail } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import Disclaimer from '../components/Disclaimer';

const contactEmail = 'veezee4us@gmail.com';

// ========================================================
// Contact page component
// ========================================================
export default function ContactPage() {
  return (
    <main className="page-shell page-shell--narrow">
      <AdSlot />

      <section className="legal-hero">
        <div className="legal-hero__icon">
          <Mail aria-hidden="true" size={28} />
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Contact Nigeria 2027 Virtual Vote</h2>
          <p>Use this page for project feedback, corrections, privacy requests, and general inquiries.</p>
        </div>
      </section>

      <Disclaimer />

      <section className="legal-panel">
        <h3>Email</h3>
        <p>
          Send public project inquiries to{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <div className="contact-action">
          <a className="button-link" href={`mailto:${contactEmail}`}>
            Email Us
          </a>
        </div>

        <h3>What To Include</h3>
        <ul>
          <li>Your question or correction.</li>
          <li>The page or feature you are referring to.</li>
          <li>A clear explanation of the issue.</li>
          <li>For privacy requests, the nickname used on the site if relevant.</li>
        </ul>

        <h3>Do Not Send</h3>
        <p>
          Do not send passwords, bank details, government identification numbers, private voting
          information, or any official election materials.
        </p>

        <h3>Important Reminder</h3>
        <p>
          This site is a virtual public opinion simulation. It is not an official election body,
          ballot system, campaign platform, or party primary.
        </p>
      </section>
    </main>
  );
}
