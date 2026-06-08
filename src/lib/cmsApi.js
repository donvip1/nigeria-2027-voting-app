/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           CMS data access helpers for authenticated candidate editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added Supabase admin OTP login with deployed redirect, allow-list checks, candidate loading, candidate updates, and logout helpers.
*********************************************************/

// ========================================================
// Imports and Supabase dependency
// ========================================================
import { supabase, isSupabaseConfigured } from './supabase';

// ========================================================
// CMS authentication helpers
// ========================================================
export async function sendCmsLoginCode(email) {
  ensureCmsReady();

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${window.location.origin}/#cms`
    }
  });

  if (error) throw error;
}

export async function verifyCmsLoginCode(email, token) {
  ensureCmsReady();

  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email'
  });

  if (error) throw error;
  return data.session;
}

export async function getCmsSession() {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function logoutCms() {
  ensureCmsReady();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ========================================================
// CMS authorization and candidate helpers
// ========================================================
export async function verifyCmsAdmin(email) {
  ensureCmsReady();

  const { data, error } = await supabase
    .from('cms_admins')
    .select('email')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return Boolean(data?.email);
}

export async function fetchCmsCandidates() {
  ensureCmsReady();

  const { data, error } = await supabase
    .from('candidates')
    .select('id, slug, name, party_name, party_code, running_mate, background_text, color, logo_url, photo_url, is_active')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateCmsCandidate(candidateId, updates) {
  ensureCmsReady();

  const { data, error } = await supabase
    .from('candidates')
    .update({
      name: updates.name,
      party_name: updates.party_name,
      party_code: updates.party_code,
      running_mate: updates.running_mate,
      background_text: updates.background_text,
      color: updates.color,
      logo_url: updates.logo_url,
      photo_url: updates.photo_url,
      is_active: updates.is_active
    })
    .eq('id', candidateId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================================================
// CMS readiness guard
// ========================================================
function ensureCmsReady() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('CMS requires Supabase environment variables.');
  }
}
