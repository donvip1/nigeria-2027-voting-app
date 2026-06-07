/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Data access layer for candidates, polls, and vote submissions.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added Supabase RPC calls and local demo-mode persistence fallback.
*********************************************************/

// ========================================================
// Imports, Supabase client, seed data, and local helpers
// ========================================================
import { supabase, isSupabaseConfigured } from './supabase';
import { demoPolls, simulationCandidates } from '../data/seedData';
import { getPublicIp, markPollVote, markPresidentialVote } from './fingerprint';

const demoVoteKey = 'n27_demo_votes';
const demoPollVoteKey = 'n27_demo_poll_votes';

// ========================================================
// Candidate loading
// ========================================================
export async function fetchCandidates() {
  if (!isSupabaseConfigured) {
    return mergeDemoVotes(simulationCandidates);
  }

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
  if (!isSupabaseConfigured) {
    return mergeDemoPollVotes(demoPolls);
  }

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
  if (!isSupabaseConfigured) {
    incrementDemoVote(candidateId);
    markPresidentialVote(candidateId);
    return { mode: 'demo' };
  }

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
  if (!isSupabaseConfigured) {
    incrementDemoPollVote(optionId);
    markPollVote(pollId);
    return { mode: 'demo' };
  }

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
// Local demo candidate vote helpers
// ========================================================
function mergeDemoVotes(candidates) {
  const votes = readLocalObject(demoVoteKey);
  return candidates
    .map((candidate, index) => ({
      ...candidate,
      vote_count: (votes[candidate.id] || 0) + [76, 64, 89, 19, 27, 41, 16][index],
      is_active: true
    }))
    .sort((a, b) => b.vote_count - a.vote_count);
}

function incrementDemoVote(candidateId) {
  const votes = readLocalObject(demoVoteKey);
  votes[candidateId] = (votes[candidateId] || 0) + 1;
  localStorage.setItem(demoVoteKey, JSON.stringify(votes));
}

// ========================================================
// Local demo poll vote helpers
// ========================================================
function mergeDemoPollVotes(polls) {
  const votes = readLocalObject(demoPollVoteKey);
  return polls.map((poll) => ({
    ...poll,
    poll_options: poll.poll_options.map((option) => ({
      ...option,
      vote_count: option.vote_count + (votes[option.id] || 0)
    }))
  }));
}

function incrementDemoPollVote(optionId) {
  const votes = readLocalObject(demoPollVoteKey);
  votes[optionId] = (votes[optionId] || 0) + 1;
  localStorage.setItem(demoPollVoteKey, JSON.stringify(votes));
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
