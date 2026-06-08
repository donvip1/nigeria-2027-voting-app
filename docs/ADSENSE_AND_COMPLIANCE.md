<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Advertising and compliance notes for the Nigeria 2027 virtual voting MVP.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added AdSense-safe placement rules, Auto Ads/vignette guidance, readiness checklist, ads.txt setup, revenue caveats, publisher client ID, slot variables, and implementation notes.
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

The AdSense loader script is installed with this publisher client ID:

```text
ca-pub-1294576989935252
```

The required `ads.txt` file is available at:

```text
https://your-domain.com/ads.txt
```

For this project, it contains:

```text
google.com, pub-1294576989935252, DIRECT, f08c47fec0942fa0
```

Keep `AdSlot` placeholders until approval or until specific ad-unit slot IDs are available. After approval, create display ad units in AdSense and add the slot IDs to Vercel:

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
