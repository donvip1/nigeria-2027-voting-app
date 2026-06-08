<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Advertising and compliance notes for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-09
 Modification Notes:    Added policy-violation response, AdSense-safe placement rules, Auto Ads/vignette guidance, ads.txt setup, publisher client ID, Naija Vote slot ID, and implementation notes.
*********************************************************/
-->

# AdSense And Compliance Notes

<!-- ========================================================
     AdSense-safe advertising direction
     ======================================================== -->

## AdSense-Safe Direction

The app uses in-content ad placements only:

- lower page ad after the presidential candidate list has loaded;
- lower page ad after public polls have loaded;
- in-content result ad after result rows have loaded;
- optional AdSense Auto Ads after approval.

Do not add forced countdowns, popups that block voting for ad views, fake close buttons, click prompts, or messages asking users to support the site by clicking ads.

<!-- ========================================================
     Current policy violation response
     ======================================================== -->

## Current Policy Violation Response

Google flagged the site for ads on screens without publisher content. The app now follows these rules:

- no ads at the top of pages before useful content;
- no ads on CMS, login, admin, contact, privacy, empty, loading, warning-only, or error-only screens;
- no ad requests from global HTML on every route;
- ad requests load only from `AdSlot` after approved public content exists on the page.

Keep this restriction in place during AdSense review. Add more ad placements only after the site has enough original public content around each placement.

<!-- ========================================================
     Page-transition ads
     ======================================================== -->

## Page-Transition Ads

Do not build custom pop-up AdSense modals in React. For page-change ads, use Google AdSense Auto Ads and enable vignette ads inside the AdSense dashboard.

The app navigation uses normal anchor links such as `#results`, which is friendlier to Auto Ads than pure button-only navigation. Google still controls whether vignette ads appear, how often they appear, and for which visitors.

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

`AdSlot` dynamically loads the AdSense script only when a policy-safe ad placement is rendered. It uses this publisher client ID:

```text
ca-pub-1294576989935252
```

The active `naija vote` ad unit slot ID is:

```text
6116650504
```

The required `ads.txt` file is available at:

```text
https://your-domain.com/ads.txt
```

For this project, it contains:

```text
google.com, pub-1294576989935252, DIRECT, f08c47fec0942fa0
```

The app currently uses `6116650504` as the default display ad slot for approved in-content placements. If you create separate ad units later, add the slot IDs to Vercel:

```bash
VITE_ADSENSE_BANNER_SLOT=
VITE_ADSENSE_WIDE_SLOT=
VITE_ADSENSE_RECTANGLE_SLOT=
```

To make ads start showing:

1. Confirm the site is approved inside Google AdSense.
2. Confirm `https://nigeria-2027-voting-app.vercel.app/ads.txt` is accessible.
3. Turn on Auto Ads in AdSense if you want Google-managed placements.
4. Turn on vignette ads in Auto Ads if you want page-transition ads.
5. Create display ad units if you want manual in-page slots.
6. Add the slot IDs to Vercel environment variables and redeploy.
