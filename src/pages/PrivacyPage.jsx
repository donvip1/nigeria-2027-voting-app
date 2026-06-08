/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Public privacy policy page for the Nigeria 2027 virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added data collection, passkey and OTP disclosure, Supabase storage, AdSense cookie disclosure, user choices, and contact details.
*********************************************************/

// ========================================================
// Imports and page constants
// ========================================================
import { ShieldCheck } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import Disclaimer from '../components/Disclaimer';

const contactEmail = 'veezee4us@gmail.com';

// ========================================================
// Privacy policy page component
// ========================================================
export default function PrivacyPage() {
  return (
    <main className="page-shell page-shell--narrow">
      <AdSlot />

      <section className="legal-hero">
        <div className="legal-hero__icon">
          <ShieldCheck aria-hidden="true" size={28} />
        </div>
        <div>
          <p className="eyebrow">Privacy Policy</p>
          <h2>Nigeria 2027 Virtual Vote Privacy Policy</h2>
          <p>Last updated: June 8, 2026</p>
        </div>
      </section>

      <Disclaimer />

      <section className="legal-panel">
        <h3>1. What This Site Is</h3>
        <p>
          Nigeria 2027 Virtual Vote is a public opinion simulation. It is not an official election
          platform, it is not affiliated with INEC, and it does not collect official votes.
        </p>

        <h3>2. Information We Collect</h3>
        <p>When you use the site, we may collect and store:</p>
        <ul>
          <li>Nickname entered by you.</li>
          <li>Browser/device fingerprint created by the app to reduce duplicate submissions.</li>
          <li>Passkey credential ID and verification timestamp if you choose fingerprint/passkey sign-in.</li>
          <li>Email address if you choose OTP verification, and phone number only if phone OTP is enabled later.</li>
          <li>Vote or poll selection metadata.</li>
          <li>IP metadata when a vote or poll submission is sent to Supabase.</li>
          <li>Basic technical information handled by hosting, analytics, ads, or database providers.</li>
        </ul>

        <h3>3. How We Use Information</h3>
        <p>We use this information to:</p>
        <ul>
          <li>Record simulation votes and public poll choices.</li>
          <li>Reduce casual duplicate voting.</li>
          <li>Show public result totals.</li>
          <li>Maintain, troubleshoot, and improve the site.</li>
          <li>Support advertising and site monetization where allowed.</li>
        </ul>

        <h3>4. Supabase Database Storage</h3>
        <p>
          The app uses Supabase to store candidate data, poll data, participant metadata, and vote
          records. Public users can read active candidates, active polls, and public result totals.
          Vote submissions are handled through controlled database functions.
        </p>

        <h3>5. Fingerprint, Passkey, And OTP Verification</h3>
        <p>
          If you choose fingerprint/passkey sign-in, the app uses your browser and device&apos;s
          WebAuthn/passkey feature. The app does not receive your actual fingerprint, face scan, or
          biometric template. Your device handles biometric verification locally and returns a
          passkey credential result to the browser.
        </p>
        <p>
          If passkeys are not available, the app may use Supabase Auth to send a one-time code to
          your email address. Phone OTP may be added later if the project enables an SMS provider.
        </p>
        <p>
          These features are used only to improve participant continuity and reduce casual duplicate
          participation. They are not official identity verification.
        </p>

        <h3>6. Google AdSense, Cookies, And Advertising</h3>
        <p>
          This site includes Google AdSense code. Third-party vendors, including Google, may use
          cookies, web beacons, IP addresses, or other identifiers to serve ads and measure ad
          performance.
        </p>
        <p>
          Google and its partners may serve ads based on a visitor&apos;s prior visits to this site
          or other websites. Visitors can manage personalized advertising through Google Ads
          Settings at{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
            google.com/settings/ads
          </a>
          . Visitors can also learn how Google uses information from sites that use Google services
          at{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>

        <h3>7. What Not To Submit</h3>
        <p>
          Do not use sensitive personal information as your nickname. Do not submit passwords,
          identification numbers, financial details, private political membership information, or
          any official election information through this site.
        </p>

        <h3>8. Data Retention</h3>
        <p>
          Simulation data may be retained while the project is active, unless removal is required
          for maintenance, safety, legal compliance, or a valid privacy request.
        </p>

        <h3>9. Contact And Privacy Requests</h3>
        <p>
          For questions, corrections, or privacy-related requests, contact{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <h3>10. Changes To This Policy</h3>
        <p>
          This privacy policy may be updated as the site, database, advertising setup, or legal
          requirements change. The updated date above will reflect major changes.
        </p>
      </section>
    </main>
  );
}
