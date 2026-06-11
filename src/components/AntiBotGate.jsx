/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Anti-bot verification gate for vote confirmation.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added optional Cloudflare Turnstile rendering with server-token callback and a local fallback gate for environments without a site key.
*********************************************************/

// ========================================================
// Imports and Turnstile configuration
// ========================================================
import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const turnstileScriptId = 'cloudflare-turnstile-script';

// ========================================================
// Anti-bot gate component
// ========================================================
export default function AntiBotGate({ verified, verifying = false, message = '', resetSignal = 0, onVerified, onExpired }) {
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [scriptError, setScriptError] = useState('');
  const canUseTurnstile = Boolean(turnstileSiteKey);

  useEffect(() => {
    if (!canUseTurnstile || verified) return undefined;

    let isMounted = true;

    loadTurnstileScript()
      .then(() => {
        if (!isMounted || !widgetRef.current || !window.turnstile || widgetIdRef.current) return;

        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token) => onVerified?.(token),
          'expired-callback': () => {
            onExpired?.();
          }
        });
      })
      .catch(() => {
        setScriptError('Anti-bot verification could not load. Check your connection and try again.');
      });

    return () => {
      isMounted = false;
    };
  }, [canUseTurnstile, onVerified, verified]);

  useEffect(() => {
    if (!canUseTurnstile || verified || !window.turnstile || !widgetIdRef.current) return;
    window.turnstile.reset(widgetIdRef.current);
  }, [canUseTurnstile, resetSignal, verified]);

  if (verified) {
    return (
      <section className="anti-bot-gate anti-bot-gate--verified">
        <ShieldCheck aria-hidden="true" size={20} />
        <span>{message || 'Anti-bot verification complete.'}</span>
      </section>
    );
  }

  return (
    <section className="anti-bot-gate" aria-label="Anti-bot verification">
      <div>
        <p className="eyebrow">Anti-bot check</p>
        <p>Complete this check before confirming your vote.</p>
      </div>

      {canUseTurnstile ? (
        <>
          <div ref={widgetRef} className="turnstile-widget" />
          {verifying && <p className="auth-hint auth-hint--inline">Checking anti-bot token...</p>}
          {message && <p className="auth-hint auth-hint--inline">{message}</p>}
          {scriptError && <p className="form-error">{scriptError}</p>}
        </>
      ) : (
        <button type="button" className="button-secondary button-secondary--icon" onClick={() => onVerified?.('local-fallback')}>
          <ShieldCheck aria-hidden="true" size={18} />
          <span>I am not a bot</span>
        </button>
      )}
    </section>
  );
}

// ========================================================
// Turnstile script loader
// ========================================================
function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(turnstileScriptId);

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = turnstileScriptId;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
