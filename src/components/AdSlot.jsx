/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Advertisement slot component for AdSense-ready display and fallbacks.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added AdSense client support, slot rendering, and approval-aware fallback placeholders.
*********************************************************/

// ========================================================
// Imports and AdSense setup
// ========================================================
import { useEffect } from 'react';
import { Megaphone } from 'lucide-react';

const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-1294576989935252';
const defaultAdSlots = {
  banner: import.meta.env.VITE_ADSENSE_BANNER_SLOT || '',
  wide: import.meta.env.VITE_ADSENSE_WIDE_SLOT || '',
  rectangle: import.meta.env.VITE_ADSENSE_RECTANGLE_SLOT || ''
};

// ========================================================
// Advertisement slot component
// ========================================================
export default function AdSlot({ label = 'Advertisement', variant = 'banner', slot = '' }) {
  const adSlot = slot || defaultAdSlots[variant] || '';
  const canRenderAd = Boolean(adSlot && adsenseClient);

  useEffect(() => {
    if (!canRenderAd || !window.adsbygoogle) return;

    try {
      window.adsbygoogle.push({});
    } catch {
      // AdSense can throw while Google is still reviewing the site or if a blocker is active.
    }
  }, [adSlot, canRenderAd]);

  if (canRenderAd) {
    return (
      <aside className={`ad-slot ad-slot--${variant} ad-slot--live`} aria-label={label}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClient}
          data-ad-slot={adSlot}
          data-ad-format={variant === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  return (
    <aside className={`ad-slot ad-slot--${variant}`} aria-label={label}>
      <Megaphone aria-hidden="true" size={18} />
      <span>{label} reserved</span>
    </aside>
  );
}
