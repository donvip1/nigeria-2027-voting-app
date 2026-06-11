/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           CMS data access helpers for authenticated candidate editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added Supabase admin email-code and password login with deployed redirect, allow-list checks, candidate and poll loading, content updates, image uploads, and logout helpers.
*********************************************************/

// ========================================================
// Imports and Supabase dependency
// ========================================================
import { supabase, isSupabaseConfigured } from './supabase';

const candidateAssetsBucket = 'candidate-assets';
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxImageBytes = 2 * 1024 * 1024;

// ========================================================
// CMS authentication helpers
// ========================================================
export async function sendCmsLoginCode(email) {
  ensureCmsReady();

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${window.location.origin}/cms`
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

export async function signInCmsWithPassword(email, password) {
  ensureCmsReady();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
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

export async function fetchCmsPolls() {
  ensureCmsReady();

  const { data, error } = await supabase
    .from('polls')
    .select('id, title, type, is_active, created_at, poll_options(id, option_text, vote_count, sort_order)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((poll) => ({
    ...poll,
    poll_options: [...(poll.poll_options || [])].sort(
      (firstOption, secondOption) => Number(firstOption.sort_order || 0) - Number(secondOption.sort_order || 0)
    )
  }));
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

export async function uploadCmsCandidateAsset({ candidate, assetType, file }) {
  ensureCmsReady();

  if (!file) {
    throw new Error('Choose an image file before uploading.');
  }

  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Upload a JPG, PNG, or WebP image.');
  }

  if (file.size > maxImageBytes) {
    throw new Error('Image must be 2 MB or smaller.');
  }

  const folder = slugifyPath(candidate.slug || candidate.id || 'candidate');
  const extension = getFileExtension(file);
  const fileName = `${assetType}-${Date.now()}-${Math.round(Math.random() * 100000)}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(candidateAssetsBucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage.from(candidateAssetsBucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function updateCmsPoll(pollId, updates) {
  ensureCmsReady();

  const { data, error } = await supabase
    .from('polls')
    .update({
      title: updates.title,
      type: updates.type,
      is_active: updates.is_active
    })
    .eq('id', pollId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCmsPollOption(optionId, updates) {
  ensureCmsReady();

  const { data, error } = await supabase
    .from('poll_options')
    .update({
      option_text: updates.option_text,
      sort_order: Number(updates.sort_order) || 0
    })
    .eq('id', optionId)
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

function getFileExtension(file) {
  const extensionByType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

  return extensionByType[file.type] || 'png';
}

function slugifyPath(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'candidate';
}
