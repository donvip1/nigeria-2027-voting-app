<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Product and technical plan for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added MVP requirements, architecture summary, build steps, and future enhancement list.
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
- Include public information, privacy summary, and contact placeholder content.
- Work well on mobile and desktop.

<!-- ========================================================
     Technical architecture
     ======================================================== -->

## Technical Architecture

- Frontend: React, Vite, CSS, lucide-react icons.
- Database: Supabase Postgres.
- Security model: public reads for active content, vote submission through `security definer` RPC functions, no direct frontend vote table writes.
- Deployment: Vercel frontend, Supabase backend.
- Fallback: demo mode using local storage when Supabase env vars are missing.

<!-- ========================================================
     MVP build checklist
     ======================================================== -->

## MVP Build Steps

1. Build React app shell and navigation.
2. Add participant nickname/fingerprint flow.
3. Add candidate voting flow with final confirmation.
4. Add results and poll pages.
5. Add Supabase schema, RPC functions, and seed data.
6. Add documentation and compliance guidance.
7. Verify with local build.
8. Deploy to Vercel after user provides Supabase credentials and GitHub/Vercel access.

<!-- ========================================================
     Future feature backlog
     ======================================================== -->

## Future Enhancements

- Admin dashboard for editing candidates and polls.
- Candidate photos and party logos.
- Privacy policy and contact page.
- Real-time Supabase subscriptions.
- State-level heat map.
- PWA install support and Android packaging.
- Multilingual interface.
