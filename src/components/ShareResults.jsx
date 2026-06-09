/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Social sharing controls for public poll result links.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added native share, copy link, X, Facebook, WhatsApp, Telegram, Instagram, and TikTok sharing guidance.
*********************************************************/

// ========================================================
// Imports and share target setup
// ========================================================
import { Copy, Facebook, Instagram, MessageCircle, Send, Share2 } from 'lucide-react';
import { useState } from 'react';

const shareText = 'See the latest Nigeria 2027 public opinion poll results';

// ========================================================
// Share results component
// ========================================================
export default function ShareResults() {
  const [copyStatus, setCopyStatus] = useState('');
  const resultsUrl = `${window.location.origin}/results`;
  const encodedUrl = encodeURIComponent(resultsUrl);
  const encodedText = encodeURIComponent(shareText);
  const shareLinks = [
    {
      label: 'X',
      icon: MessageCircle,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
    },
    {
      label: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    }
  ];

  async function handleNativeShare() {
    if (!navigator.share) {
      await handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: 'Nigeria 2027 Virtual Vote Results',
        text: shareText,
        url: resultsUrl
      });
    } catch {
      // Native share can be cancelled by the visitor.
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(resultsUrl);
      setCopyStatus('Link copied.');
    } catch {
      setCopyStatus('Copy failed. Use your browser share menu.');
    }
  }

  return (
    <section className="share-panel" aria-labelledby="share-results-title">
      <div>
        <p className="eyebrow">Share results</p>
        <h3 id="share-results-title">Invite others to view the public poll</h3>
      </div>
      <div className="share-actions">
        <button type="button" className="button-secondary button-secondary--icon" onClick={handleNativeShare}>
          <Share2 aria-hidden="true" size={17} />
          <span>Share</span>
        </button>
        <button type="button" className="button-secondary button-secondary--icon" onClick={handleCopyLink}>
          <Copy aria-hidden="true" size={17} />
          <span>Copy link</span>
        </button>
        {shareLinks.map(({ label, icon: Icon, href }) => (
          <a key={label} className="share-link" href={href} target="_blank" rel="noreferrer">
            <Icon aria-hidden="true" size={16} />
            <span>{label}</span>
          </a>
        ))}
        <span className="share-link share-link--muted" title="Instagram does not support direct web link prefill. Copy the link and paste it into your story, bio, or message.">
          <Instagram aria-hidden="true" size={16} />
          <span>Instagram</span>
        </span>
        <span className="share-link share-link--muted" title="TikTok does not support direct web link prefill. Copy the link and paste it into your TikTok post, bio, or message.">
          <Share2 aria-hidden="true" size={16} />
          <span>TikTok</span>
        </span>
      </div>
      {copyStatus && <p className="auth-hint auth-hint--inline">{copyStatus}</p>}
    </section>
  );
}
