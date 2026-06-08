<!--
/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Candidate and running-mate source notes for the Nigeria 2027 simulation app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added simulation ticket caveats, running-mate source links, and Supabase update guidance.
*********************************************************/
-->

# Candidate Data Notes

<!-- ========================================================
     Simulation ticket caveat
     ======================================================== -->

This app is a public preference simulation. Candidate and running-mate entries are editable seed data and should not be presented as INEC-certified final 2027 ballot data unless INEC or the relevant party publishes final official records.

<!-- ========================================================
     Current source notes
     ======================================================== -->

- Bola Ahmed Tinubu / Kashim Shettima: simulation continuation of the existing Tinubu-Shettima pairing while 2027 running-mate reporting remains fluid.
- Atiku Abubakar / Ifeanyi Okowa: prior known Atiku running-mate pairing used as simulation seed data until a 2027 ADC running mate is officially confirmed.
- Peter Obi / Rabiu Musa Kwankwaso: added because recent 2027 reporting says Obi named Kwankwaso as running mate, while this app still labels the ticket as simulation data.
- Donald Duke / Shehu Musa Gabam: prior Donald Duke ticket association used as simulation seed data.
- Prince Adewole Adebayo / Yusuf Buhari: prior SDP presidential ticket pairing used as simulation seed data.
- Omoyele Sowore / Haruna Garba Magashi: prior AAC presidential ticket pairing used as simulation seed data.
- Sandy Onor / Emana Duke Ambrose-Amawhe: prior Cross River PDP governorship ticket pairing used because Sandy Onor appears in the project planning list.

<!-- ========================================================
     Useful public references
     ======================================================== -->

- Tinubu and Shettima 2027 uncertainty: https://www.vanguardngr.com/2026/05/2027-anxiety-as-shettima-awaits-tinubus-decision-on-running-mate/
- APC dismissal of Shettima replacement reports: https://www.channelstv.com/2026/01/26/mischievous-apc-dismisses-reports-of-shettimas-replacement-as-tinubus-2027-running-mate/
- Atiku and ADC 2027 running-mate reporting: https://www.vanguardngr.com/2026/06/2027-pick-amaechi-as-running-mate-adc-chieftain-urges-atiku/
- Obi and Kwankwaso 2027 reporting: https://punchng.com/peter-obi-names-kwankwaso-as-running-mate/
- Donald Duke and Shehu Musa Gabam: https://punchng.com/breaking-sdp-scribe-gabam-becomes-dukes-presidential-running-mate/
- Adewole Adebayo and Yusuf Buhari: https://www.zikoko.com/citizen/what-we-learned-from-day-one-of-the-candidates/
- Omoyele Sowore and Haruna Garba Magashi: https://www.thecable.ng/sowore-announces-haruna-magashi-lawyer-as-running-mate/
- Sandy Onor and Emana Duke Ambrose-Amawhe: https://crossriverwatch.com/2022/07/cross-river-2023-pdp-governorship-candidate-sandy-onor-explains-his-choice-of-emana-duke/

<!-- ========================================================
     Supabase update reminder
     ======================================================== -->

After changing `supabase/seed.sql`, run the candidate `insert ... on conflict` block in Supabase SQL Editor so the live database receives the same candidate and running-mate updates as local demo mode.
