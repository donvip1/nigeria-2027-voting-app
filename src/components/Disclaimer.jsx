/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Public disclaimer component for simulation and compliance messaging.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added launch-ready reusable disclaimer for independent public opinion polling.
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
        Independent public opinion poll. Not affiliated with INEC, any political party, or any
        official election body. This does not count as an official vote.
      </p>
    </section>
  );
}
