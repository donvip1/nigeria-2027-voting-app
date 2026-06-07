<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase setup instructions for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added project creation, SQL setup, environment variables, tables, and public API notes.
*********************************************************/
-->

# Supabase Setup

<!-- ========================================================
     Create the hosted Supabase project
     ======================================================== -->

## Create Project

1. Go to Supabase and create a free project.
2. Save your project URL and anon public key.
3. Use a strong database password and keep it private.

<!-- ========================================================
     Run database SQL files
     ======================================================== -->

## Run SQL

In the Supabase SQL editor:

1. Run `supabase/schema.sql`.
2. Run `supabase/seed.sql`.

<!-- ========================================================
     Configure frontend environment variables
     ======================================================== -->

## Configure App

Create `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after editing `.env`.

<!-- ========================================================
     Database table overview
     ======================================================== -->

## Tables

- `participants`: nickname, fingerprint, and first IP metadata.
- `candidates`: editable simulation candidates.
- `presidential_votes`: append-only presidential simulation votes.
- `polls`: active yes/no or multiple-choice polls.
- `poll_options`: options for each poll.
- `poll_votes`: append-only poll votes.

<!-- ========================================================
     Public frontend read and write interface
     ======================================================== -->

## Public Interface

Frontend reads:

- `candidate_results` view;
- active `polls`;
- active `poll_options`.

Frontend writes only by RPC:

- `submit_presidential_vote`;
- `submit_poll_vote`.
