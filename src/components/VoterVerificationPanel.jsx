/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Passkey and OTP verification panel for participant setup and vote confirmation.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added required passkey verification with email OTP fallback controls and specific Supabase error display.
*********************************************************/

// ========================================================
// Imports and verification helpers
// ========================================================
import { useState } from 'react';
import { Fingerprint, Mail, Phone, ShieldCheck } from 'lucide-react';
import { requestOtpCode, verifyOtpCode } from '../lib/otpAuth';

const phoneOtpEnabled = import.meta.env.VITE_ENABLE_PHONE_OTP === 'true';

// ========================================================
// Voter verification panel component
// ========================================================
export default function VoterVerificationPanel({
  title = 'Verify before continuing',
  description,
  passkeyLabel = 'Use fingerprint/passkey',
  otpLabel = 'Send code',
  isPasskeyBusy = false,
  onPasskeyVerify,
  onOtpVerified,
  disabled = false
}) {
  const safeId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const [contactType, setContactType] = useState('email');
  const [contact, setContact] = useState('');
  const [token, setToken] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [sentContact, setSentContact] = useState('');

  // ========================================================
  // OTP request handler
  // ========================================================
  async function handleSendOtp() {
    setIsSendingOtp(true);
    setOtpStatus('');
    setOtpError('');

    try {
      const response = await requestOtpCode({ contactType, contact });
      setSentContact(response.contact);
      setOtpStatus(`Code sent to ${response.contact}.`);
    } catch (error) {
      setOtpError(readableOtpError(error));
    } finally {
      setIsSendingOtp(false);
    }
  }

  // ========================================================
  // OTP verification handler
  // ========================================================
  async function handleVerifyOtp() {
    setIsVerifyingOtp(true);
    setOtpStatus('');
    setOtpError('');

    try {
      const verification = await verifyOtpCode({
        contactType,
        contact: sentContact || contact,
        token
      });
      setOtpStatus('OTP verified.');
      onOtpVerified?.(verification);
    } catch (error) {
      setOtpError(readableOtpError(error));
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  // ========================================================
  // Verification panel layout
  // ========================================================
  return (
    <section className="verification-panel">
      <div className="verification-panel__header">
        <div className="participant-panel__icon">
          <ShieldCheck aria-hidden="true" size={24} />
        </div>
        <div>
          <p className="eyebrow">Verification required</p>
          <h3>{title}</h3>
          {description && <p className="muted">{description}</p>}
        </div>
      </div>

      <button type="button" className="auth-primary verification-primary" onClick={onPasskeyVerify} disabled={disabled || isPasskeyBusy}>
        <Fingerprint aria-hidden="true" size={18} />
        <span>{isPasskeyBusy ? 'Waiting for device...' : passkeyLabel}</span>
      </button>

      <div className="verification-divider">
        <span>Or use OTP</span>
      </div>

      <div className="otp-grid">
        {phoneOtpEnabled && (
          <div className="otp-toggle" role="group" aria-label="OTP contact type">
            <button
              type="button"
              className={contactType === 'email' ? 'otp-toggle__button otp-toggle__button--active' : 'otp-toggle__button'}
              onClick={() => setContactType('email')}
              disabled={disabled}
            >
              <Mail aria-hidden="true" size={16} />
              <span>Email</span>
            </button>
            <button
              type="button"
              className={contactType === 'phone' ? 'otp-toggle__button otp-toggle__button--active' : 'otp-toggle__button'}
              onClick={() => setContactType('phone')}
              disabled={disabled}
            >
              <Phone aria-hidden="true" size={16} />
              <span>Phone</span>
            </button>
          </div>
        )}

        {!phoneOtpEnabled && (
          <div className="otp-toggle otp-toggle--single" aria-label="OTP contact type">
            <button
              type="button"
              className="otp-toggle__button otp-toggle__button--active"
              onClick={() => setContactType('email')}
              disabled={disabled}
            >
              <Mail aria-hidden="true" size={16} />
              <span>Email</span>
            </button>
          </div>
        )}

        <label htmlFor={`${safeId}-otp-contact`}>{contactType === 'phone' ? 'Phone number' : 'Email address'}</label>
        <div className="inline-form">
          <input
            id={`${safeId}-otp-contact`}
            type={contactType === 'phone' ? 'tel' : 'email'}
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder={contactType === 'phone' ? '+2348012345678' : 'name@example.com'}
            autoComplete={contactType === 'phone' ? 'tel' : 'email'}
            disabled={disabled}
          />
          <button type="button" className="button-secondary" onClick={handleSendOtp} disabled={disabled || isSendingOtp || !contact.trim()}>
            {isSendingOtp ? 'Sending...' : otpLabel}
          </button>
        </div>

        <label htmlFor={`${safeId}-otp-token`}>Verification code</label>
        <div className="inline-form">
          <input
            id={`${safeId}-otp-token`}
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Enter code"
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={disabled}
          />
          <button type="button" onClick={handleVerifyOtp} disabled={disabled || isVerifyingOtp || !token.trim()}>
            {isVerifyingOtp ? 'Checking...' : 'Verify code'}
          </button>
        </div>
      </div>

      {otpStatus && <p className="auth-hint auth-hint--ok">{otpStatus}</p>}
      {otpError && <p className="form-error">{otpError}</p>}
    </section>
  );
}

// ========================================================
// OTP error formatting
// ========================================================
function readableOtpError(error) {
  const message = error?.message || 'OTP verification failed.';

  if (message.toLowerCase().includes('phone')) {
    return 'Phone OTP requires Supabase phone authentication and an SMS provider to be enabled.';
  }

  return message;
}
