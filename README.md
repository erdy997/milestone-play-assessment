# Let'z Play Development Check

*Understand Your Child. Discover Their Potential.*
A bilingual (Bahasa Melayu / English), mobile-first developmental screening questionnaire for children aged 0–72 months, built for **Let'z Play Therapy** exhibitions and community screening events.

> **Important:** the questions shipped in this version are **demonstration items** written in plain language for this app. They are not a validated screening instrument and produce **descriptive response summaries only**, never normative scores or classifications. Replace them with items you are licensed to use before any clinical use (see "Replacing the question bank").

## Features
- Welcome page with branding, explanation and BM / EN language choice (language switch also in the header, on every screen).
- Child profile with validation, automatic screening date and automatic age (years / months / days and completed months).
- Age-appropriate questions picked automatically from 8 age groups (0–5, 6–11, 12–17, 18–23, 24–35, 36–47, 48–59, 60–72 months) across 5 domains.
- One question per card, 5 answer options, progress bar, Previous / Next, per-domain completion tabs, progress saved for the current browser session (survives a page refresh).
- Parent concerns step.
- **Supplementary parent questionnaires** (optional, chosen on the profile page; demonstration items, frequency scale Always / Often / Sometimes / Rarely / Never / Not sure):
  - *Sensory Processing* (from 6 months): Seeking, Avoiding, Sensitivity, Low Registration.
  - *Learning Preferences* (from 12 months): Visual, Auditory, Tactile, Kinesthetic.
  Results show counts and the behaviours reported often/always, plus ideas to try. No scores, quadrant labels or "learning style" labels.
- Results dashboard: profile, domain chart (Recharts), summary table, domain cards, strengths, areas for further observation, items needing clarification, items for professional review, parent concerns, recommendations, home activities, optional professional comments.
- **Real client-side PDF** (jsPDF + AutoTable), A4, page numbers, BM or EN, file name `Development_Check_[ChildID]_[Date].pdf`:
  1. Child profile · 2. Developmental summary (table + chart) · Sensory & learning profile (when included) · 3. Observations & recommendations · 4. Professional review (comments, referral tick-boxes, name/signature) · Appendix: every item and its response.
- Admin dashboard (optional PIN): totals, completed count, latest date, age distribution, domain statistics, sessions list, CSV export, **Delete All Data**, QR code generator, question-bank import/export.
- Privacy: everything is stored in the browser's `localStorage` / `sessionStorage`. No server, no analytics, no external fonts or CDNs, no network requests after the page loads.

## Tech
Navy-blue theme with the Let'z Play Therapy logo (`src/assets/`; replace the PNGs to update it everywhere, including the PDF).

React 18 · TypeScript · Vite · Tailwind CSS · lucide-react · Recharts · jsPDF + jspdf-autotable · qrcode. All free and open source.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (age calculation, scoring, question bank, PDF helpers, QR URL checks)
npm run build      # production build in dist/
npm run preview    # serve dist/ at http://localhost:4173
npm run build:single  # one self-contained HTML file in dist-single/ (offline kiosk use)
```

## Project structure
```
src/
  App.tsx                 navigation, state, header/footer
  i18n.ts                 all BM/EN text, disclaimer, labels
  types.ts                data model (question bank, scoring rules, sessions)
  data/demoQuestionBank.ts  age bands + DEMONSTRATION items (replaceable)
  data/demoModules.ts     sensory processing + learning preference DEMONSTRATION modules
  lib/modules.ts          descriptive frequency summaries for the modules
  assets/                 Let'z Play logo (badge + full)
  data/activities.ts      home activity suggestions
  lib/age.ts              age calculation
  lib/scoring.ts          scoring engine (descriptive / official cut-offs)
  lib/pdf.ts              PDF report
  lib/csv.ts              CSV export
  lib/bank.ts             question-bank validation and loading
  lib/storage.ts          local storage helpers
  components/             Welcome, Profile, Questionnaire, Results, Admin, charts, UI
tests/core.test.ts
```

## Replacing the question bank
Two ways:
1. **No code:** Admin → Question bank → *Download template JSON*, edit it, then *Import approved question bank (JSON)*. It is validated and saved on that device only (do it on each exhibition device), and you can restore the demo items at any time.
2. **In code:** edit `src/data/demoQuestionBank.ts` (or create a new file with the same `QuestionBank` shape) and rebuild. This deploys the bank to every device.

Supplementary modules live in the same JSON under `"modules"` (see `src/data/demoModules.ts`): each has `id` (`sensory` or `learning`), `name`, `intro`, `note`, `isDemonstration`, `attribution`, `categories` (`id`, `label`, `description`, `ideas`) and `items` (`id`, `category`, `text`, `minMonths`, `maxMonths`). Remove the `modules` array to switch them off. Do not load items from the Sensory Profile 2, SPM or similar instruments without the publisher's permission.

Each item: `{ "id", "domain": grossMotor|fineMotor|communication|cognitive|socialEmotional, "band": "0-5"|…|"60-72", "text": { "en", "ms" }, "hint"?: { "en", "ms" } }`.
Set `isDemonstration: false` and fill `attribution` and `licence` with the real source and permission.

**Scoring.** Keep `"scoring": { "mode": "descriptive" }` unless the instrument has official scoring rules. Only then use:
```json
"scoring": {
  "mode": "points-cutoff",
  "points": { "achieved": 10, "sometimes": 5, "notYet": 0, "notSure": null, "notObserved": null },
  "cutoffs": { "24-35": { "grossMotor": [ { "minScore": 25, "label": { "en": "…", "ms": "…" } } ] } },
  "source": { "en": "Official scoring manual, edition…", "ms": "…" }
}
```
Values and labels must come from the instrument's official manual. The app never invents thresholds. Do not load ASQ-3, SWYC, TOY8 or other proprietary items without the publisher's permission.

## Clinical safety
The disclaimer (BM/EN) is shown on the welcome page, results, footer and PDF. The app never labels a child as normal, delayed, autistic, etc. Recommendations only depend on whether "Not yet", "Not sure / Not observed" answers or parent concerns are present.

See **DEPLOYMENT.md** (free hosting and QR code) and **TESTING.md** (test checklist).
