<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Cloudflare Turnstile setup guide for the public voting anti-bot gate.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added beginner-friendly site key setup, Vercel environment configuration, private secret-key setup, redeploy steps, and server-side verification notes.
*********************************************************/
-->

# Cloudflare Turnstile Setup

<!-- ========================================================
     What Turnstile does
     ======================================================== -->

Turnstile adds an anti-bot check before the final device confirmation step. The app uses the public site key in the browser and verifies the token through `/api/verify-turnstile` when `TURNSTILE_SECRET_KEY` is configured in Vercel.

<!-- ========================================================
     Create a Turnstile widget
     ======================================================== -->

## Create The Site Key

1. Go to:

```text
https://dash.cloudflare.com/
```

2. Create or sign in to your Cloudflare account.
3. In the left menu, open `Turnstile`.
4. Click `Add site`.
5. Enter a site name:

```text
Nigeria 2027 Virtual Vote
```

6. Add this domain:

```text
nigeria-2027-voting-app.vercel.app
```

7. Choose `Managed` widget mode.
8. Click `Create`.
9. Copy the `Site Key`.
10. Copy the `Secret Key`.

Keep the `Secret Key` private. Do not put it in GitHub, screenshots, public docs, or chat.

<!-- ========================================================
     Add the site key to Vercel
     ======================================================== -->

## Add The Key To Vercel

1. Open Vercel.
2. Open the `nigeria-2027-voting-app` project.
3. Click `Settings`.
4. Click `Environment Variables`.
5. Add:

```bash
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
```

6. Add:

```bash
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
```

7. Select the environments you want, usually `Production`, `Preview`, and `Development`.
8. Save.
9. Redeploy the Vercel project.

<!-- ========================================================
     Local development
     ======================================================== -->

## Add The Key Locally

In your local `.env`, add:

```bash
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
```

Then restart:

```bash
npm run dev
```

<!-- ========================================================
     Production hardening
     ======================================================== -->

## Stronger Verification Later

The serverless endpoint verifies the browser token before the passkey button is enabled. For maximum protection, move final vote submission itself behind a server endpoint or Supabase Edge Function so bots cannot call the public database RPC directly.

The strongest version is:

1. Send the Turnstile token and vote request to a server endpoint.
2. Verify the token with Cloudflare Siteverify using the private secret key.
3. Submit the vote from the server only after Siteverify returns success.
4. Restrict direct public database vote RPC access.

Never expose the Turnstile secret key in the React frontend.
