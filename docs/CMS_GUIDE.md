<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Beginner CMS guide for candidate and poll content editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added CMS setup, deployed redirect configuration, email code login, password fallback login, candidate editing, image upload, poll editing, and admin email management steps.
*********************************************************/
-->

# CMS Guide

<!-- ========================================================
     CMS purpose
     ======================================================== -->

The CMS page lets an approved admin edit candidate and poll content without changing code. It is for candidate names, party names, party codes, running mates, descriptions, uploaded images, image URLs, poll titles, poll types, poll options, and active/inactive status.

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

If you already ran this file before poll editing or image upload was added, run it again. It is safe to rerun because the script uses `create table if not exists`, replaces policies, creates the `candidate-assets` storage bucket if needed, and keeps the admin email from duplicating.

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

Then use the email code method:

1. Enter the approved admin email.
2. Click `Send code`.
3. Check the email inbox.
4. If the email contains a numeric code, enter the code and click `Verify`.
5. If the email contains only a `Sign in` link, click it after the Supabase `Site URL` and `Redirect URLs` above are set to the deployed Vercel site.

If the email link opens `localhost` and shows `localhost refused to connect`, Supabase is still configured with the local development URL. Repeat the `URL Configuration` steps above.

<!-- ========================================================
     Password fallback login
     ======================================================== -->

## Set Up Password Login

Use this if Supabase accepts the email code request but the email does not arrive.

1. Open Supabase.
2. Open your project.
3. Go to `Authentication`.
4. Click `Users`.
5. Find this user:

```text
veezee4us@gmail.com
```

6. If the user does not exist, click `Add user`.
7. Enter the same email address.
8. Set a strong password.
9. Make sure the user is confirmed.
10. Save.

Then open:

```text
https://nigeria-2027-voting-app.vercel.app/cms
```

Use the same email in `Admin email`, enter the password in `Admin password`, and click `Login`.

The password login still checks the `cms_admins` table. A user can only access the CMS if the email is approved there.

<!-- ========================================================
     Candidate editing
     ======================================================== -->

## Edit Candidates

1. Click the `Candidates` tab.
2. Change the candidate fields you want.
3. To upload a candidate photo or party logo, click `Upload image` beside that image field.
4. Choose a JPG, PNG, or WebP image that is 2 MB or smaller.
5. Wait for the upload message.
6. Click `Save candidate` on that candidate card.
7. Open the `Vote` or `Results` page to confirm the content changed.

The image upload places the new public image URL into the field first. The candidate is not fully updated until you click `Save candidate`.

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
