# Testing checklist

Automated: `npm test` (age calculation incl. month-end and leap years, age-band mapping 0–72, demo bank covers all 8 bands × 5 domains, scoring counts, official cut-off mode, PDF file naming / character safety, QR URL validation).

Manual / end-to-end (verified in a mobile browser emulation before delivery):

| Check | How | Expected |
|---|---|---|
| Parent can complete the questionnaire | Start → fill profile → answer all → See Results | Results page opens |
| Validation | Continue with empty profile; Next without answering | Error messages shown |
| Age calculation | DOB 10 Mar 2023, screening 26 Nov 2026 | 3 years 8 months 16 days (44 months), group 36–47 months |
| Sensory & learning sections | Leave both ticked on the profile page (child 44 months) | 15 + 16 + 12 = 43 questions; Sensory and Learning tabs; sections on results page and in PDF |
| All five domains | Look at the domain tabs and results | 5 domains, 3 items each |
| Results correct | Compare answers with summary table | Counts match answers |
| Progress saved | Refresh the page mid-questionnaire | Returns to the same point with answers kept |
| PDF downloads | Tap the DOWNLOAD … (PDF) button | `Development_Check_<ID>_<date>.pdf` downloads; contains profile, table, chart, observations, recommendations, professional page, item appendix, page numbers |
| Language switch | Toggle BM/EN on any screen and download the PDF in each | All text and PDF switch language |
| Mobile | Open on a phone (or browser dev tools, iPhone size) | No horizontal scrolling, buttons easy to tap |
| Data stays local | Browser dev tools → Network while using the app | No requests except loading the app itself |
| Admin | Admin → stats, CSV, Delete All Data | Counts correct, CSV opens in Excel, data removed |
| QR code | Generate with the deployed https URL, scan with a phone | Phone opens the deployed app |
