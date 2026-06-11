<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Free email setup guide for Supabase CMS authentication.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-11
 Modification Notes:    Added Brevo SMTP setup, Supabase email provider setup, deployed redirect setup, and CMS email-login troubleshooting.
*********************************************************/
-->

# CMS Email Setup

<!-- ========================================================
     What this guide is for
     ======================================================== -->

Use this for CMS admin login emails only. Public vote submission uses anti-bot verification plus passkey/device confirmation, not email or phone OTP.

<!-- ========================================================
     Brevo free SMTP setup
     ======================================================== -->

## Option 1: Brevo Free SMTP

Brevo has a free email tier that is useful while building.

1. Go to:

```text
https://www.brevo.com/
```

2. Create a free account.
3. Verify your email/account.
4. Open `SMTP & API`.
5. Open `SMTP`.
6. Copy these values:

```text
SMTP server
Port
Login
SMTP key/password
```

Brevo commonly uses:

```text
SMTP host: smtp-relay.brevo.com
Port: 587
Username: your Brevo SMTP login
Password: your Brevo SMTP key
```

Do not put the SMTP password inside the React app or Vercel frontend environment variables. Add it only inside Supabase Auth SMTP settings.

<!-- ========================================================
     Supabase SMTP setup
     ======================================================== -->

## Add SMTP To Supabase

1. Go to Supabase.
2. Open your project.
3. Click `Authentication`.
4. Click `Emails`.
5. Find `SMTP Settings` or custom SMTP settings.
6. Enable custom SMTP.
7. Add the Brevo SMTP host, port, username, and password.
8. Save.
9. Send a test email if Supabase shows a test button.

<!-- ========================================================
     Email provider setup
     ======================================================== -->

## Enable Email Login

1. In Supabase, open `Authentication`.
2. Click `Providers`.
3. Open `Email`.
4. Enable the email provider.
5. Enable magic link or email-code sign-in.
6. Save.

The CMS page calls Supabase Auth for admin login. Once Supabase email auth and SMTP are configured, the `/cms` page can send login emails to approved admins.

<!-- ========================================================
     Redirect setup
     ======================================================== -->

## Set The Supabase Redirect URL

1. In Supabase, open `Authentication`.
2. Open `URL Configuration`.
3. Set `Site URL` to:

```text
https://nigeria-2027-voting-app.vercel.app
```

4. Add this redirect URL:

```text
https://nigeria-2027-voting-app.vercel.app/**
```

5. Save.

<!-- ========================================================
     Troubleshooting
     ======================================================== -->

## Troubleshooting

If the app says `Email provider is disabled`, email authentication is still disabled in Supabase Auth providers.

If the email link opens `localhost`, Supabase `Site URL` or `Redirect URLs` still point to local development.

If no email arrives, check Supabase Auth logs and confirm custom SMTP is saved correctly.

If the email contains only a sign-in link and no numeric code, use the sign-in link after the deployed redirect URL is configured, or update the Supabase email template to include the code token.
