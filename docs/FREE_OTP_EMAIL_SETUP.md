<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Free email OTP setup guide for Supabase Auth.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added Brevo SMTP setup, Supabase email provider setup, redirect setup, troubleshooting, phone OTP limitations, and environment toggle notes.
*********************************************************/
-->

# Free OTP Email Setup

<!-- ========================================================
     Recommended free path
     ======================================================== -->

Use email OTP first. It is the best free option for this project.

SMS OTP is not realistically free for public users because mobile carriers charge providers for delivery. Free SMS trials are usually for testing only and often send only to verified phone numbers.

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
     Email OTP provider setup
     ======================================================== -->

## Enable Email OTP

1. In Supabase, open `Authentication`.
2. Click `Providers`.
3. Open `Email`.
4. Enable email provider.
5. Enable OTP or magic link email sign-in.
6. Save.

The app already calls Supabase Auth for email OTP. Once Supabase email auth and SMTP are configured, the final vote confirmation step can send email codes.

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

If the email contains only a sign-in link and no numeric code, update the Supabase email template to include the token variable or use the sign-in link after the deployed redirect URL is configured.

<!-- ========================================================
     Phone OTP disabled by default
     ======================================================== -->

## Phone OTP

Phone OTP is currently disabled in the public UI by default:

```bash
VITE_ENABLE_PHONE_OTP=false
```

Only change it to `true` after you configure a real SMS provider in Supabase.

To enable later:

1. Configure Supabase phone auth.
2. Add an SMS provider such as Twilio.
3. Add this in Vercel:

```bash
VITE_ENABLE_PHONE_OTP=true
```

4. Redeploy.

<!-- ========================================================
     Free SMS warning
     ======================================================== -->

## About Free SMS

Twilio trials can help you test, but they usually do not work for unrestricted public voting because trial accounts have delivery restrictions. For a live public app, use email OTP until there is budget for SMS.
