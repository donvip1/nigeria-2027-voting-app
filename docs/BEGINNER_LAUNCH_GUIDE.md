<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Beginner launch guide for local review, Supabase setup, GitHub push, and Vercel deployment.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added step-by-step instructions for collecting credentials, configuring the app, and deploying the MVP.
*********************************************************/
-->

# Beginner Launch Guide

This guide starts from the current project folder:

```bash
/Users/macbook/nigeria-2027-voting-app
```

Use this rule: never share private passwords or secret keys in chat. It is safe to share the Supabase project URL and public client key if needed, but do not share database passwords, service role keys, or secret keys.

<!-- ========================================================
     Step 1: Open and review the local app
     ======================================================== -->

## 1. Open And Review The App

### What You Need

- A browser such as Chrome, Safari, Edge, or Firefox.
- The local development server running.

### How To Open It

1. Open your browser.
2. Click the address bar at the top.
3. Type:

```text
http://localhost:5173/
```

4. Press Enter.

### What To Check

1. The page should show `Nigeria 2027 Virtual Vote`.
2. The yellow demo-mode banner should appear if Supabase is not connected yet.
3. Click `Vote`.
4. Enter a nickname with at least 3 characters.
5. Select a candidate.
6. Confirm the vote.
7. Click `Results` and check that the vote count changed.
8. Click `Polls`, vote in a poll, and check that the poll count changed.
9. Click `Info` and read the disclaimer and launch requirements.

### If The Page Does Not Open

Run this in Terminal:

```bash
cd /Users/macbook/nigeria-2027-voting-app
npm run dev
```

Then open the local URL shown by Vite. It is usually:

```text
http://localhost:5173/
```

<!-- ========================================================
     Step 2: Create Supabase and get app credentials
     ======================================================== -->

## 2. Add Supabase Credentials In `.env`

Supabase is the online database. Right now, the app works in demo mode using your browser storage. Supabase makes votes and polls persist online.

### What You Need To Provide

You need these two values:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

For newer Supabase projects, the public client key may be called a publishable key. Use the public or publishable client-side key, not the secret key.

### Where To Get The Values

1. Go to:

```text
https://supabase.com
```

2. Sign in or create an account.
3. Click `New project`.
4. Choose an organization.
5. Enter a project name, for example:

```text
nigeria-2027-voting-app
```

6. Create a strong database password and save it somewhere private.
7. Choose the region closest to your audience.
8. Click `Create new project`.
9. Wait until Supabase finishes creating the project.
10. Open the project dashboard.
11. Open the project `Connect` dialog or go to `Project Settings` then `API Keys`.
12. Copy the project URL.
13. Copy the public client key:

- New Supabase projects: use the `Publishable key`.
- Legacy Supabase projects: use the `anon` public key.

Do not copy the `service_role`, `secret`, or database password into the frontend app.

### How To Create `.env`

1. In VS Code, open the project folder.
2. In the file explorer, find `.env.example`.
3. Create a new file beside it named:

```text
.env
```

4. Add your values like this:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-or-anon-key
VITE_ADSENSE_CLIENT=
```

5. Save the file.

### How To Create Supabase Tables

1. In Supabase, open your project.
2. Click `SQL Editor`.
3. Click `New query`.
4. Open this local file:

```text
supabase/schema.sql
```

5. Copy all of its content.
6. Paste it into Supabase SQL Editor.
7. Click `Run`.
8. Click `New query` again.
9. Open this local file:

```text
supabase/seed.sql
```

10. Copy all of its content.
11. Paste it into Supabase SQL Editor.
12. Click `Run`.

### How To Restart The App

After editing `.env`, stop the dev server and start it again:

1. Click the Terminal window where `npm run dev` is running.
2. Press `Control + C`.
3. Run:

```bash
npm run dev
```

4. Open:

```text
http://localhost:5173/
```

If Supabase is connected correctly, the yellow demo-mode banner should disappear.

<!-- ========================================================
     Step 3: Initialize Git and push to GitHub
     ======================================================== -->

## 3. Initialize Git And Push To GitHub

Git tracks your code history. GitHub stores your code online so Vercel can deploy it.

### What You Need

- A GitHub account.
- Git installed on your computer.
- A repository name. Recommended:

```text
nigeria-2027-voting-app
```

### Create The GitHub Repository

1. Go to:

```text
https://github.com
```

2. Sign in.
3. Click the `+` icon in the top-right corner.
4. Click `New repository`.
5. Repository name:

```text
nigeria-2027-voting-app
```

6. Choose `Public` or `Private`.
7. Do not add README, `.gitignore`, or license on GitHub because this project already has local files.
8. Click `Create repository`.
9. GitHub will show commands for pushing an existing repository. Keep that page open.

### Initialize Git Locally

Run these commands in Terminal:

```bash
cd /Users/macbook/nigeria-2027-voting-app
git init
git branch -M main
git add .
git commit -m "Initial Nigeria 2027 voting app MVP"
```

### Connect Local Git To GitHub

On the GitHub repository page, copy your repository URL. It will look like:

```text
https://github.com/YOUR_USERNAME/nigeria-2027-voting-app.git
```

Then run this command, replacing the URL:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nigeria-2027-voting-app.git
git push -u origin main
```

### Important Safety Check

Before pushing, make sure `.env` is not included. This project already has `.env` in `.gitignore`.

You can check with:

```bash
git status
```

If `.env` appears under files to be committed, stop and fix `.gitignore` before pushing.

<!-- ========================================================
     Step 4: Deploy to Vercel
     ======================================================== -->

## 4. Deploy To Vercel

Vercel hosts the frontend website and automatically deploys new versions when you push to GitHub.

### What You Need To Provide

You need:

- A Vercel account.
- The GitHub repository connected to Vercel.
- The same public Supabase environment variables.

### Create The Vercel Project

1. Go to:

```text
https://vercel.com
```

2. Sign in with GitHub.
3. Click `Add New`.
4. Click `Project`.
5. Find:

```text
nigeria-2027-voting-app
```

6. Click `Import`.
7. Framework preset should be `Vite`.
8. Build command should be:

```bash
npm run build
```

9. Output directory should be:

```text
dist
```

### Add Environment Variables In Vercel

In the Vercel import screen, find `Environment Variables`.

Add:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-or-anon-key
VITE_ADSENSE_CLIENT=
```

Select Production, Preview, and Development if Vercel gives you environment choices.

### Deploy

1. Click `Deploy`.
2. Wait for the build to finish.
3. Vercel will give you a live URL.
4. Open the live URL.
5. Test voting, results, polls, and info pages again.

### If Deployment Fails

Check these first:

1. Did GitHub receive the latest code?
2. Did Vercel detect `Vite`?
3. Is the build command `npm run build`?
4. Is the output directory `dist`?
5. Did you add the Supabase environment variables exactly?
6. Did you avoid spaces around the environment variable names?

<!-- ========================================================
     Official reference links
     ======================================================== -->

## Official References

- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
- GitHub repository creation: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- GitHub CLI repository creation: https://cli.github.com/manual/gh_repo_create
- Vercel Git deployments: https://vercel.com/docs/deployments/git
- Vercel environment variables: https://vercel.com/docs/environment-variables
