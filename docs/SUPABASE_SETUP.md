<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase setup instructions for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added project creation, SQL setup, vote hash patch instructions, test vote reset instructions, environment variables, tables, and public API notes.
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
     Fix deployed vote hash function error
     ======================================================== -->

## Fix Vote Submission Error

If voting shows this error:

```text
function digest(text, unknown) does not exist
```

run this patch in Supabase SQL Editor:

```text
supabase/fix_vote_hash_function.sql
```

This replaces the presidential vote hash expression with built-in PostgreSQL `md5(...)`, so the live database no longer depends on the `pgcrypto` `digest(...)` function.

<!-- ========================================================
     Update live candidate ticket data
     ======================================================== -->

## Update Candidate Tickets

If the app is already live and you only want to update candidate names, running mates, descriptions, photos, and party logos, run:

```text
supabase/update_candidate_tickets.sql
```

Do this instead of rerunning the full `supabase/seed.sql`, because the full seed file also creates starter poll questions.

<!-- ========================================================
     Clear test votes before public launch
     ======================================================== -->

## Clear Test Votes

When development/testing is finished and you want a clean public launch, run:

```text
supabase/reset_test_votes.sql
```

This clears:

- presidential vote submissions;
- poll vote submissions;
- participant test records;
- poll option vote counts.

This keeps:

- candidates;
- candidate photos;
- party logos;
- polls;
- poll options;
- database tables and functions.

After resetting Supabase, also clear your browser test data if your own browser still says you already voted:

1. Open the deployed app in your browser.
2. Open browser settings for the site.
3. Clear site data or local storage for the app domain.
4. Reload the app and test with a fresh nickname.

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
