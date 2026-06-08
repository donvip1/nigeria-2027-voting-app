/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase OTP helper functions for vote verification fallback.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added email and phone OTP request, verification, normalization, and availability helpers.
*********************************************************/

// ========================================================
// Imports and storage keys
// ========================================================
import { supabase, isSupabaseConfigured } from './supabase';

const otpContactKey = 'n27_otp_contact';
const otpContactTypeKey = 'n27_otp_contact_type';
const otpVerifiedAtKey = 'n27_otp_verified_at';

// ========================================================
// Stored OTP verification lookup and persistence
// ========================================================
export function getStoredOtpVerification() {
  const contact = localStorage.getItem(otpContactKey);
  const contactType = localStorage.getItem(otpContactTypeKey);
  const verifiedAt = localStorage.getItem(otpVerifiedAtKey);

  if (!contact || !contactType || !verifiedAt) return null;

  return {
    contact,
    contactType,
    verifiedAt
  };
}

export function saveOtpVerification({ contact, contactType, verifiedAt }) {
  localStorage.setItem(otpContactKey, contact);
  localStorage.setItem(otpContactTypeKey, contactType);
  localStorage.setItem(otpVerifiedAtKey, verifiedAt);

  return {
    contact,
    contactType,
    verifiedAt
  };
}

// ========================================================
// OTP request and verification helpers
// ========================================================
export async function requestOtpCode({ contactType, contact }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('OTP verification requires Supabase to be configured.');
  }

  const normalizedContact = normalizeOtpContact(contactType, contact);
  const payload =
    contactType === 'phone'
      ? { phone: normalizedContact }
      : { email: normalizedContact };

  const { error } = await supabase.auth.signInWithOtp(payload);
  if (error) throw error;

  return {
    contact: normalizedContact,
    contactType
  };
}

export async function verifyOtpCode({ contactType, contact, token }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('OTP verification requires Supabase to be configured.');
  }

  const normalizedContact = normalizeOtpContact(contactType, contact);
  const payload =
    contactType === 'phone'
      ? { phone: normalizedContact, token: token.trim(), type: 'sms' }
      : { email: normalizedContact, token: token.trim(), type: 'email' };

  const { error } = await supabase.auth.verifyOtp(payload);
  if (error) throw error;

  return saveOtpVerification({
    contact: normalizedContact,
    contactType,
    verifiedAt: new Date().toISOString()
  });
}

// ========================================================
// OTP input normalization
// ========================================================
export function normalizeOtpContact(contactType, contact) {
  const cleaned = contact.trim();

  if (contactType === 'email') {
    return cleaned.toLowerCase();
  }

  return cleaned.replace(/\s+/g, '');
}
