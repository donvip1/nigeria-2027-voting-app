/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Vote-gated public result discussion with comments, mentions, and reactions.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added 48-hour comments, nickname display, silent background refresh, mention rendering, profanity/contact moderation, and emoji-style reactions.
*********************************************************/

// ========================================================
// Imports, reaction options, and moderation constants
// ========================================================
import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchResultComments, reactToResultComment, submitResultComment } from '../lib/api';

const maxCommentLength = 280;
const reactionOptions = [
  { id: 'like', label: '👍' },
  { id: 'love', label: '❤️' },
  { id: 'laugh', label: '😂' },
  { id: 'wow', label: '😮' },
  { id: 'sad', label: '😢' },
  { id: 'angry', label: '😡' }
];

// ========================================================
// Result discussion component
// ========================================================
export default function ResultDiscussion({ participant }) {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reactingId, setReactingId] = useState('');
  const canComment = Boolean(participant?.nickname && participant?.fingerprint && participant?.hasVoted);

  useEffect(() => {
    loadComments({ showLoading: true });

    const refreshTimer = window.setInterval(() => {
      loadComments();
    }, 20000);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, []);

  // ========================================================
  // Comment loading and submission handlers
  // ========================================================
  async function loadComments({ showLoading = false } = {}) {
    if (showLoading) {
      setLoading(true);
    }

    try {
      setComments(await fetchResultComments());
      setError('');
    } catch (loadError) {
      setError(readableDiscussionError(loadError));
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  async function handleSubmitComment(event) {
    event.preventDefault();

    if (!canComment) {
      setError('Vote first with your nickname before joining the discussion.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await submitResultComment({
        nickname: participant.nickname,
        fingerprint: participant.fingerprint,
        body: commentBody
      });
      setCommentBody('');
      setMessage('Comment posted. It will automatically expire after 48 hours.');
      await loadComments();
    } catch (submitError) {
      setError(readableDiscussionError(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReaction(commentId, reaction) {
    if (!canComment) {
      setError('Vote first before reacting to comments.');
      return;
    }

    setReactingId(`${commentId}-${reaction}`);
    setError('');

    try {
      await reactToResultComment({
        commentId,
        fingerprint: participant.fingerprint,
        reaction
      });
      await loadComments();
    } catch (reactionError) {
      setError(readableDiscussionError(reactionError));
    } finally {
      setReactingId('');
    }
  }

  // ========================================================
  // Discussion layout
  // ========================================================
  return (
    <section className="discussion-panel" aria-labelledby="discussion-title">
      <div className="discussion-panel__header">
        <div>
          <p className="eyebrow">Public discussion</p>
          <h3 id="discussion-title">Talk about the results</h3>
        </div>
        <span className="status-pill">48-hour comments</span>
      </div>

      {!canComment && (
        <p className="notice">
          Use a nickname and submit your presidential preference vote before commenting or reacting.
        </p>
      )}

      <form className="discussion-form" onSubmit={handleSubmitComment}>
        <label htmlFor="result-comment">Comment as {participant?.nickname || 'your nickname'}</label>
        <textarea
          id="result-comment"
          value={commentBody}
          onChange={(event) => setCommentBody(event.target.value)}
          placeholder="Share your view. Use @Nickname to mention someone."
          maxLength={maxCommentLength}
          disabled={!canComment || submitting}
        />
        <div className="discussion-form__footer">
          <small>{commentBody.length}/{maxCommentLength}</small>
          <button type="submit" className="button-secondary button-secondary--icon" disabled={!canComment || submitting || commentBody.trim().length < 2}>
            <Send aria-hidden="true" size={17} />
            <span>{submitting ? 'Posting...' : 'Post comment'}</span>
          </button>
        </div>
      </form>

      <p className="discussion-rules">
        Text and basic emojis only. No links, phone numbers, email addresses, files, or abusive language.
      </p>

      {message && <p className="auth-hint auth-hint--ok">{message}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="discussion-list">
        {loading ? (
          <div className="empty-state">Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div className="empty-state">No comments yet.</div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="discussion-comment">
              <div className="discussion-comment__header">
                <strong>@{comment.nickname}</strong>
                <span>{formatRelativeTime(comment.created_at)}</span>
              </div>
              <p>{renderCommentBody(comment.body)}</p>
              <div className="reaction-row" aria-label={`Reactions for ${comment.nickname}`}>
                {reactionOptions.map((reaction) => {
                  const count = Number(comment.reactions?.[reaction.id] || 0);
                  return (
                    <button
                      key={reaction.id}
                      type="button"
                      className="reaction-button"
                      onClick={() => handleReaction(comment.id, reaction.id)}
                      disabled={!canComment || reactingId === `${comment.id}-${reaction.id}`}
                      aria-label={`${reaction.id} reaction, ${count}`}
                    >
                      <span>{reaction.label}</span>
                      <small>{count}</small>
                    </button>
                  );
                })}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

// ========================================================
// Comment display helpers
// ========================================================
function renderCommentBody(body) {
  const parts = body.split(/(@[A-Za-z0-9_]{3,40})/g);

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={`${part}-${index}`} className="mention">
          {part}
        </span>
      );
    }

    return part;
  });
}

function formatRelativeTime(value) {
  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));

  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return '1d ago';
}

function readableDiscussionError(error) {
  const message = error?.message || 'Discussion action failed.';
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('vote required')) {
    return 'Submit your presidential preference vote before joining the discussion.';
  }

  if (lowerMessage.includes('personal info')) {
    return 'Do not share links, phone numbers, email addresses, or personal contact details.';
  }

  if (lowerMessage.includes('language')) {
    return 'Please keep comments respectful.';
  }

  if (lowerMessage.includes('length')) {
    return 'Use 2 to 280 characters.';
  }

  return message;
}
