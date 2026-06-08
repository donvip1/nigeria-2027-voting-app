<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Beginner CMS guide for candidate and poll content editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added CMS setup, deployed redirect configuration, login, candidate editing, poll editing, and admin email management steps.
*********************************************************/
-->

# CMS Guide

<!-- ========================================================
     CMS purpose
     ======================================================== -->

The CMS page lets an approved admin edit candidate and poll content without changing code. It is for candidate names, party names, party codes, running mates, descriptions, colors, image URLs, logo URLs, poll titles, poll types, poll options, and active/inactive status.

<!-- ========================================================
     CMS setup
     ======================================================== -->

## Set Up The CMS

1. Open Supabase.
2. Open your project.
3. Click `SQL Editor`.
4. Click `New query`.
5. Run this file:

```text
supabase/cms_admin_setup.sql
```

If you already ran this file before poll editing was added, run it again. It is safe to rerun because the script uses `create table if not exists`, replaces policies, and keeps the admin email from duplicating.

The first admin email is:

```text
veezee4us@gmail.com
```

<!-- ========================================================
     CMS login
     ======================================================== -->

## Open The CMS

Before testing the email link, set the live redirect URL:

1. Open Supabase.
2. Open your project.
3. Go to `Authentication`.
4. Open `URL Configuration`.
5. Set `Site URL` to:

```text
https://nigeria-2027-voting-app.vercel.app
```

6. Add this to `Redirect URLs`:

```text
https://nigeria-2027-voting-app.vercel.app/**
```

7. Save.

Open the deployed app and go to:

```text
https://nigeria-2027-voting-app.vercel.app/cms
```

Then:

1. Enter the approved admin email.
2. Click `Send code`.
3. Check the email inbox.
4. If the email contains a numeric code, enter the code and click `Verify`.
5. If the email contains only a `Sign in` link, click it after the Supabase `Site URL` and `Redirect URLs` above are set to the deployed Vercel site.

If the email link opens `localhost` and shows `localhost refused to connect`, Supabase is still configured with the local development URL. Repeat the `URL Configuration` steps above.

<!-- ========================================================
     Candidate editing
     ======================================================== -->

## Edit Candidates

1. Click the `Candidates` tab.
2. Change the candidate fields you want.
3. Click `Save candidate` on that candidate card.
4. Open the `Vote` or `Results` page to confirm the content changed.

<!-- ========================================================
     Poll editing
     ======================================================== -->

## Edit Polls

1. Click the `Polls` tab.
2. Change the poll title, poll type, or active status.
3. Click `Save poll`.
4. Change any poll option text or order number.
5. Click `Save option` beside that option.
6. Open the `Polls` page to confirm the content changed.

Poll vote totals are visible in the CMS, but they are not editable from the CMS. Use the reset SQL script only when you intentionally want to clear test votes.

<!-- ========================================================
     Troubleshooting
     ======================================================== -->

## Troubleshooting

If candidate or poll saves fail:

1. Confirm the email exists in the `cms_admins` table.
2. Confirm `supabase/cms_admin_setup.sql` was run successfully after the latest code update.
3. Confirm you logged into the CMS with the same approved email.

If the CMS email link opens `localhost`, repeat the Supabase `URL Configuration` steps above.
