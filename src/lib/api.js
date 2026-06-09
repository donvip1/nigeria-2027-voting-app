/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Data access layer for candidates, polls, votes, sharing, comments, and reactions.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added Supabase RPC calls, public result comments, reactions, production-ready unavailable-state errors, and development-only local persistence fallback.
*********************************************************/

// ========================================================
// Imports, Supabase client, seed data, and local helpers
// ========================================================
import { supabase, isSupabaseConfigured, isLocalFallbackEnabled } from './supabase';
import { localCandidates, localPolls } from '../data/seedData';
import { getPublicIp, markPollVote, markPresidentialVote } from './fingerprint';

const localVoteKey = 'n27_local_votes';
const localPollVoteKey = 'n27_local_poll_votes';
const localCommentKey = 'n27_local_result_comments';

// ========================================================
// Candidate loading
// ========================================================
export async function fetchCandidates() {
  if (isLocalFallbackEnabled) {
    return mergeLocalVotes(localCandidates);
  }

  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('candidate_results')
    .select('*')
    .eq('is_active', true)
    .order('vote_count', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================================================
// Poll loading
// ========================================================
export async function fetchPolls() {
  if (isLocalFallbackEnabled) {
    return mergeLocalPollVotes(localPolls);
  }

  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('polls')
    .select('id, title, type, is_active, poll_options(id, option_text, vote_count)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ========================================================
// Presidential vote submission
// ========================================================
export async function submitPresidentialVote({ candidateId, nickname, fingerprint }) {
  if (isLocalFallbackEnabled) {
    incrementLocalVote(candidateId);
    markPresidentialVote(candidateId);
    return { mode: 'local' };
  }

  assertSupabaseConfigured();

  const ipAddress = await getPublicIp();
  const { data, error } = await supabase.rpc('submit_presidential_vote', {
    candidate_uuid: candidateId,
    voter_nickname: nickname,
    voter_fingerprint: fingerprint,
    voter_ip: ipAddress
  });

  if (error) throw error;
  markPresidentialVote(candidateId);
  return data;
}

// ========================================================
// Poll vote submission
// ========================================================
export async function submitPollVote({ pollId, optionId, nickname, fingerprint }) {
  if (isLocalFallbackEnabled) {
    incrementLocalPollVote(optionId);
    markPollVote(pollId);
    return { mode: 'local' };
  }

  assertSupabaseConfigured();

  const ipAddress = await getPublicIp();
  const { data, error } = await supabase.rpc('submit_poll_vote', {
    poll_uuid: pollId,
    option_uuid: optionId,
    voter_nickname: nickname,
    voter_fingerprint: fingerprint,
    voter_ip: ipAddress
  });

  if (error) throw error;
  markPollVote(pollId);
  return data;
}

// ========================================================
// Result discussion loading and submission
// ========================================================
export async function fetchResultComments() {
  if (isLocalFallbackEnabled) {
    return readLocalComments();
  }

  assertSupabaseConfigured();

  await supabase.rpc('cleanup_expired_result_comments');

  const { data, error } = await supabase
    .from('result_comments_public')
    .select('id, nickname, body, mentions, created_at, expires_at, reactions')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

export async function submitResultComment({ nickname, fingerprint, body }) {
  if (isLocalFallbackEnabled) {
    const comment = createLocalComment({ nickname, fingerprint, body });
    return { mode: 'local', comment };
  }

  assertSupabaseConfigured();

  const { data, error } = await supabase.rpc('submit_result_comment', {
    voter_nickname: nickname,
    voter_fingerprint: fingerprint,
    comment_body: body
  });

  if (error) throw error;
  return data;
}

export async function reactToResultComment({ commentId, fingerprint, reaction }) {
  if (isLocalFallbackEnabled) {
    reactToLocalComment({ commentId, fingerprint, reaction });
    return { mode: 'local' };
  }

  assertSupabaseConfigured();

  const { data, error } = await supabase.rpc('react_result_comment', {
    comment_uuid: commentId,
    voter_fingerprint: fingerprint,
    reaction_value: reaction
  });

  if (error) throw error;
  return data;
}

// ========================================================
// Local development candidate vote helpers
// ========================================================
function mergeLocalVotes(candidates) {
  const votes = readLocalObject(localVoteKey);
  return candidates
    .map((candidate, index) => ({
      ...candidate,
      vote_count: (votes[candidate.id] || 0) + [76, 64, 89, 19, 27, 41, 16][index],
      is_active: true
    }))
    .sort((a, b) => b.vote_count - a.vote_count);
}

function incrementLocalVote(candidateId) {
  const votes = readLocalObject(localVoteKey);
  votes[candidateId] = (votes[candidateId] || 0) + 1;
  localStorage.setItem(localVoteKey, JSON.stringify(votes));
}

// ========================================================
// Local development poll vote helpers
// ========================================================
function mergeLocalPollVotes(polls) {
  const votes = readLocalObject(localPollVoteKey);
  return polls.map((poll) => ({
    ...poll,
    poll_options: poll.poll_options.map((option) => ({
      ...option,
      vote_count: option.vote_count + (votes[option.id] || 0)
    }))
  }));
}

function incrementLocalPollVote(optionId) {
  const votes = readLocalObject(localPollVoteKey);
  votes[optionId] = (votes[optionId] || 0) + 1;
  localStorage.setItem(localPollVoteKey, JSON.stringify(votes));
}

// ========================================================
// Local development discussion helpers
// ========================================================
function readLocalComments() {
  const comments = readLocalObject(localCommentKey).items || [];
  const now = Date.now();
  return comments
    .filter((comment) => new Date(comment.expires_at).getTime() > now)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50);
}

function createLocalComment({ nickname, fingerprint, body }) {
  const comments = readLocalComments();
  const cleanedBody = validateLocalComment(body);
  const now = new Date();
  const comment = {
    id: window.crypto?.randomUUID?.() || `local-${Date.now()}`,
    nickname,
    body: cleanedBody,
    mentions: extractMentions(cleanedBody),
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
    reactions: {
      like: 0,
      love: 0,
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: 0
    },
    reactionDevices: {},
    device_fingerprint: fingerprint
  };

  localStorage.setItem(localCommentKey, JSON.stringify({ items: [comment, ...comments].slice(0, 50) }));
  return comment;
}

function reactToLocalComment({ commentId, fingerprint, reaction }) {
  const comments = readLocalComments().map((comment) => {
    if (comment.id !== commentId) return comment;

    const previousReaction = comment.reactionDevices?.[fingerprint];
    const reactions = { ...comment.reactions };

    if (previousReaction && reactions[previousReaction] > 0) {
      reactions[previousReaction] -= 1;
    }

    reactions[reaction] = (reactions[reaction] || 0) + 1;

    return {
      ...comment,
      reactions,
      reactionDevices: {
        ...comment.reactionDevices,
        [fingerprint]: reaction
      }
    };
  });

  localStorage.setItem(localCommentKey, JSON.stringify({ items: comments }));
}

function validateLocalComment(body) {
  const cleanedBody = body.trim().replace(/\s+/g, ' ');

  if (cleanedBody.length < 2 || cleanedBody.length > 280) {
    throw new Error('Use 2 to 280 characters.');
  }

  if (/(https?:\/\/|www\.|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i.test(cleanedBody)) {
    throw new Error('Links and personal contact details are not allowed.');
  }

  if (cleanedBody.replace(/\D/g, '').match(/\d{9,}/)) {
    throw new Error('Phone numbers and personal contact details are not allowed.');
  }

  if (/(fuck|shit|bitch|bastard|asshole|cunt|dick|pussy|whore|slut|nigger|nigga|motherfucker|kill yourself)/i.test(cleanedBody)) {
    throw new Error('Please keep comments respectful.');
  }

  return cleanedBody;
}

function extractMentions(body) {
  return [...body.matchAll(/@([A-Za-z0-9_]{3,40})/g)].map((match) => match[1]);
}

// ========================================================
// Safe local storage JSON reader
// ========================================================
function readLocalObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

// ========================================================
// Production configuration guard
// ========================================================
function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Voting service is temporarily unavailable. Please try again later.');
  }
}
