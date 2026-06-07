/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Public disclaimer component for simulation and compliance messaging.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added reusable compact and full disclaimer display.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { AlertTriangle } from 'lucide-react';

// ========================================================
// Disclaimer component
// ========================================================
export default function Disclaimer({ compact = false }) {
  return (
    <section className={compact ? 'disclaimer disclaimer--compact' : 'disclaimer'}>
      <AlertTriangle aria-hidden="true" size={18} />
      <p>
        This is a virtual public opinion simulation. It is not affiliated with INEC, any political
        party, or any official election body, and it does not count as an official vote.
      </p>
    </section>
  );
}
