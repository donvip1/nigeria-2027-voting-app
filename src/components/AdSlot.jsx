/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Advertisement slot component for policy-safe AdSense display slots.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added dynamic AdSense loading so Google ads only request on approved content-rich placements and launch-ready fallback copy.
*********************************************************/

// ========================================================
// Imports and AdSense setup
// ========================================================
import { useEffect } from 'react';
import { Megaphone } from 'lucide-react';

const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-1294576989935252';
const defaultNaijaVoteSlot = '6116650504';
const defaultAdSlots = {
  banner: import.meta.env.VITE_ADSENSE_BANNER_SLOT || defaultNaijaVoteSlot,
  wide: import.meta.env.VITE_ADSENSE_WIDE_SLOT || defaultNaijaVoteSlot,
  rectangle: import.meta.env.VITE_ADSENSE_RECTANGLE_SLOT || defaultNaijaVoteSlot
};
const adsenseScriptId = 'google-adsense-script';
let adsenseScriptPromise = null;

// ========================================================
// AdSense script loader
// ========================================================
function loadAdSenseScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve();
  }

  if (window.adsbygoogle) {
    return Promise.resolve();
  }

  if (adsenseScriptPromise) {
    return adsenseScriptPromise;
  }

  adsenseScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(adsenseScriptId);

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = adsenseScriptId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return adsenseScriptPromise;
}

// ========================================================
// Advertisement slot component
// ========================================================
export default function AdSlot({ label = 'Advertisement', variant = 'banner', slot = '' }) {
  const adSlot = slot || defaultAdSlots[variant] || '';
  const canRenderAd = Boolean(adSlot && adsenseClient);

  useEffect(() => {
    if (!canRenderAd) return undefined;

    let isMounted = true;

    loadAdSenseScript()
      .then(() => {
        if (!isMounted || !window.adsbygoogle) return;

        try {
          window.adsbygoogle.push({});
        } catch {
          // AdSense can throw while Google is still reviewing the site or if a blocker is active.
        }
      })
      .catch(() => {
        // Browser ad blockers or network policy can prevent the script from loading.
      });

    return () => {
      isMounted = false;
    };
  }, [adSlot, canRenderAd]);

  if (canRenderAd) {
    return (
      <aside className={`ad-slot ad-slot--${variant} ad-slot--live`} aria-label={label}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  return (
    <aside className={`ad-slot ad-slot--${variant}`} aria-label={label}>
      <Megaphone aria-hidden="true" size={18} />
      <span>{label}</span>
    </aside>
  );
}
