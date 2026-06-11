/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Vercel serverless endpoint for Cloudflare Turnstile token verification.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added POST-only Siteverify request using the private Turnstile secret key.
*********************************************************/

// ========================================================
// Turnstile verification endpoint
// ========================================================
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ success: false, error: 'method_not_allowed' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return response.status(503).json({ success: false, error: 'turnstile_secret_not_configured' });
  }

  try {
    const { token } = parseRequestBody(request.body);

    if (!token || typeof token !== 'string') {
      return response.status(400).json({ success: false, error: 'missing_token' });
    }

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', getClientIp(request));

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      return response.status(403).json({
        success: false,
        error: 'turnstile_verification_failed',
        codes: verifyResult['error-codes'] || []
      });
    }

    return response.status(200).json({ success: true });
  } catch {
    return response.status(500).json({ success: false, error: 'turnstile_verification_error' });
  }
}

// ========================================================
// Client IP helper
// ========================================================
function getClientIp(request) {
  const forwardedFor = request.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.socket?.remoteAddress || '';
}

function parseRequestBody(body) {
  if (!body) return {};

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}
