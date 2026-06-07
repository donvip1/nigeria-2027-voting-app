<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Advertising and compliance notes for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added AdSense-safe placement rules, readiness checklist, revenue caveats, publisher client ID, and implementation notes.
*********************************************************/
-->

# AdSense And Compliance Notes

<!-- ========================================================
     AdSense-safe advertising direction
     ======================================================== -->

## AdSense-Safe Direction

The app uses normal ad placements only:

- top page banner;
- in-content result slot;
- lower page banner;
- optional AdSense Auto Ads after approval.

Do not add forced countdowns, popups that block voting for ad views, fake close buttons, click prompts, or messages asking users to support the site by clicking ads.

<!-- ========================================================
     Site readiness before AdSense application
     ======================================================== -->

## Required Site Readiness Before Applying

Prepare these before applying to AdSense:

- live HTTPS domain;
- original useful content beyond a thin voting form;
- privacy policy;
- contact page or contact email;
- clear disclaimer that the app is a simulation;
- no misleading official-election claims;
- no artificial traffic, bots, paid click farms, or incentivized ad viewing.

<!-- ========================================================
     Revenue expectation notes
     ======================================================== -->

## Revenue Reality

AdSense revenue depends on approval, traffic quality, region, page RPM, content quality, and policy compliance. The app can be designed for impressions, but no revenue level is guaranteed.

<!-- ========================================================
     Future AdSense implementation note
     ======================================================== -->

## Implementation Note

The AdSense loader script is installed with this publisher client ID:

```text
ca-pub-1294576989935252
```

Keep `AdSlot` placeholders until approval or until specific ad-unit slot IDs are available. After approval, replace those placeholders with AdSense components using your publisher client ID and slot IDs.
