<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Product and technical plan for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Updated completed scope, remaining build checklist, technical architecture, and future enhancement list.
*********************************************************/
-->

# Project Plan

<!-- ========================================================
     Product summary
     ======================================================== -->

## Summary

Build and launch a free-tier MVP for a Nigeria 2027 virtual voting simulation. The first release focuses on a web app with voting, live results, basic polls, compliant ad slots, Supabase persistence, and clear public disclaimers.

<!-- ========================================================
     MVP product requirements
     ======================================================== -->

## Product Requirements

- Present the product as a virtual opinion simulation, not official voting.
- Let a visitor enter a nickname and cast one presidential simulation vote.
- Show candidate cards with party, running mate, short background, and current vote count.
- Show live-style results with totals, rankings, percentages, and progress bars.
- Support extra polls for yes/no and multiple-choice public questions.
- Include non-intrusive ad areas that can later be connected to AdSense.
- Include public information, privacy policy, contact page, and simulation disclaimers.
- Require passkey or email OTP verification before presidential vote submission.
- Provide a protected starter CMS for candidate, image, and poll content updates.
- Include SEO metadata, sitemap, and crawler guidance.
- Work well on mobile and desktop.

<!-- ========================================================
     Technical architecture
     ======================================================== -->

## Technical Architecture

- Frontend: React, Vite, CSS, lucide-react icons.
- Database: Supabase Postgres.
- Security model: public reads for active content, vote submission through `security definer` RPC functions, no direct frontend vote table writes.
- Auth: local passkey/WebAuthn support plus Supabase email OTP fallback.
- CMS: Supabase Auth email OTP with password fallback, `cms_admins` allow-list, RLS-protected candidate and poll updates, plus Supabase Storage for uploaded candidate assets.
- Deployment: Vercel frontend, Supabase backend.
- Fallback: demo mode using local storage when Supabase env vars are missing.

<!-- ========================================================
     MVP build checklist
     ======================================================== -->

## MVP Build Steps

1. Build React app shell and navigation. Done.
2. Add participant nickname/fingerprint flow. Done.
3. Add required passkey/email OTP vote verification. Done.
4. Add candidate voting flow with final confirmation. Done.
5. Add results and poll pages. Done.
6. Add Supabase schema, RPC functions, seed data, and reset scripts. Done.
7. Add candidate photos, party logos, and candidate carousel. Done.
8. Add public privacy/contact/info pages. Done.
9. Add protected starter CMS for candidate, image, and poll edits. Done.
10. Add SEO metadata, robots, sitemap, and Search Console guide. Done.
11. Verify with local production build. Ongoing before each push.
12. Deploy to Vercel from GitHub. Done, then repeated after pushes.

<!-- ========================================================
     Remaining build checklist
     ======================================================== -->

## Remaining Build Work

- Configure Supabase Auth redirect URLs for the deployed Vercel domain.
- Configure Supabase email OTP delivery with built-in email or free SMTP.
- Test the full passkey vote flow on HTTPS after each Vercel deployment.
- Test the full email OTP vote flow after Supabase Auth email settings are confirmed.
- Test the CMS email-code login, password fallback login, candidate save, poll save, and image upload flow after `cms_admin_setup.sql` is run.
- Add real AdSense slot IDs after AdSense approval.
- Enable AdSense Auto Ads/vignette ads from the Google AdSense dashboard.
- Submit the sitemap in Google Search Console.
- Add analytics after choosing a privacy-safe analytics provider.

<!-- ========================================================
     Future feature backlog
     ======================================================== -->

## Future Enhancements

- Full admin dashboard for creating/deleting polls, editing ads settings, and updating homepage content.
- Real-time Supabase subscriptions.
- State-level heat map.
- PWA install support and Android packaging.
- Multilingual interface.
- Dedicated public candidate profile pages for stronger SEO.
- Server-side rendering or static prerendering if search performance becomes a priority.
