<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Beginner CMS guide for candidate content editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added CMS setup, deployed redirect configuration, login, candidate editing, and admin email management steps.
*********************************************************/
-->

# CMS Guide

<!-- ========================================================
     CMS purpose
     ======================================================== -->

The CMS page lets an approved admin edit candidate content without changing code. It is for candidate names, party names, party codes, running mates, descriptions, colors, image URLs, logo URLs, and active/inactive status.

<!-- ========================================================
     CMS setup
     ======================================================== -->

## Set Up The CMS

1. Open Supabase.
2. Open your project.
3. Click `SQL Editor`.
4. Click `New query`.
5. Run:

```text
supabase/cms_admin_setup.sql
```

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
https://nigeria-2027-voting-app.vercel.app/#cms
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

1. Change the candidate fields you want.
2. Click `Save candidate` on that candidate card.
3. Open the `Vote` or `Results` page to confirm the content changed.

If an update fails, confirm the email exists in the `cms_admins` table and that `supabase/cms_admin_setup.sql` was run successfully.
