<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Project README for the Nigeria 2027 public opinion polling app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added launch-ready setup summary, deployment notes, public poll disclaimer, AdSense status, and development fallback notes.
*********************************************************/
-->

# Nigeria 2027 Virtual Vote

An independent public opinion polling app for Nigeria 2027 presidential preference voting, live-style results, and issue polls. This is not an official election system.

<!-- ========================================================
     Current implementation status
     ======================================================== -->

## Current Status

- React/Vite frontend.
- Supabase database and RPC voting functions.
- Production deployment requires Supabase environment variables.
- Local development can use browser storage only when Supabase credentials are missing during `npm run dev`.
- Candidate, party, image, and poll content can be updated from the CMS.
- AdSense manual slots are limited to policy-safe in-content placements.

<!-- ========================================================
     Beginner guide entry point
     ======================================================== -->

## Beginner Guide

Start here if you are setting up the app for the first time:

```text
docs/BEGINNER_LAUNCH_GUIDE.md
```

<!-- ========================================================
     Local development setup
     ======================================================== -->

## Local Setup

```bash
cd /Users/macbook/nigeria-2027-voting-app
npm install
npm run dev
```

Open the local URL shown by Vite.

<!-- ========================================================
     Environment variable setup
     ======================================================== -->

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
VITE_ADSENSE_CLIENT=ca-pub-your-id-after-approval
```

Without Supabase values, production shows a service-unavailable message. Local development can still use browser storage while setting up the backend.

<!-- ========================================================
     Supabase backend setup summary
     ======================================================== -->

## Supabase Setup

1. Create a free Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.
5. Add your Supabase project URL and anon key to `.env`.
6. Restart `npm run dev`.

<!-- ========================================================
     Vercel deployment summary
     ======================================================== -->

## Deployment

1. Push the folder to GitHub.
2. Import it on Vercel.
3. Set the same environment variables in Vercel project settings.
4. Deploy.

<!-- ========================================================
     Public poll disclaimer
     ======================================================== -->

## Important Disclaimer

This project is not affiliated with INEC, any election body, or any political party. It does not collect official votes and should always be described as an independent public opinion poll.
