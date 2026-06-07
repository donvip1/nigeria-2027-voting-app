/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Placeholder advertisement slot component for future AdSense integration.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added reusable banner, wide, and rectangle ad placeholder support.
*********************************************************/

// ========================================================
// Imports
// ========================================================
import { Megaphone } from 'lucide-react';

// ========================================================
// Advertisement placeholder component
// ========================================================
export default function AdSlot({ label = 'Advertisement', variant = 'banner' }) {
  return (
    <aside className={`ad-slot ad-slot--${variant}`} aria-label={label}>
      <Megaphone aria-hidden="true" size={18} />
      <span>{label}</span>
    </aside>
  );
}
