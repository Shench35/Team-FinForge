# CertVerify — Complete Frontend Coordination Plan
**Squad Hackathon 3.0 | Challenge 01 — Proof of Life (Education Domain)**
*Full reference for FE1 and FE2 (Team Lead / FE2)*

---

## SECTION 0 — Design System Quick Reference

> Both engineers read this once and never deviate from it.

### Colors (from DESIGN.md — use as Tailwind CSS vars)
| Token | Hex | Use Case |
|---|---|---|
| `primary` | `#00183F` | Deep Navy — buttons, headings, borders |
| `secondary` | `#006C4E` | Teal — success states, CTA, "Verify" actions |
| `error` | `#ba1a1a` | Red — High Risk verdict, danger buttons |
| `surface` | `#f7f9fb` | Page background |
| `surface-container-low` | `#f2f4f6` | Sidebar, cards |
| `surface-container-lowest` | `#ffffff` | Modal, form backgrounds |
| `outline-variant` | `#c4c6d0` | Borders everywhere |
| `on-surface` | `#191c1e` | Primary body text |
| `on-surface-variant` | `#44474f` | Secondary text, labels |

### Typography
| Token | Font | Size | Weight | Use |
|---|---|---|---|---|
| `h1` | Hanken Grotesk | 48px / 32px mobile | 700 | Page titles |
| `h2` | Hanken Grotesk | 30px | 700 | Section headers |
| `h3` | Hanken Grotesk | 24px | 600 | Card headers |
| `body-lg` | Inter | 18px | 400 | Hero paragraphs |
| `body-md` | Inter | 16px | 400 | Default body |
| `label-caps` | Inter | 12px | 600 | ALL CAPS labels, table headers |
| `code` | JetBrains Mono | 14px | 400 | Transaction refs, hash signatures |

### Spacing & Layout
- 8pt spacing unit (4px base, multiples of 8)
- Desktop: 12-col grid, 24px gutters, 64px margins, max-width 1280px
- Mobile: 4-col grid, 16px gutters, 20px margins
- Section vertical padding: 80px–120px

### Elevation Rules (no heavy shadows)
- Level 0: `bg-white` — page base
- Level 1: Cards/Inputs — `border border-outline-variant` (1px, no shadow)
- Level 2: Modals/Dropdowns — 1px border + `shadow-[0px_4px_12px_rgba(15,45,94,0.08)]`
- Hover: border shifts to Navy or Teal — **no elevation increase**

### Border Radius
- Base: `rounded` = 4px
- Large: `rounded-xl` = 12px (cards, panels)
- Full: `rounded-full` = pills/badges

---

## SECTION 1 — Complete Screen Inventory (19 Design Files)

| # | Screen Folder | Type | Variants |
|---|---|---|---|
| 1 | `certverify_landing_desktop` | Page | Desktop |
| 2 | `certverify_landing_mobile` | Page | Mobile |
| 3 | `certverify_login_desktop` | Page | Desktop |
| 4 | `certverify_login_mobile` | Page | Mobile |
| 5 | `certverify_auth_flow_1` | Page variant | Auth wrapper |
| 6 | `certverify_auth_flow_2` | Page variant | Auth wrapper |
| 7 | `certverify_register_desktop` | Page | Desktop |
| 8 | `certverify_register_mobile` | Page | Mobile |
| 9 | `certverify_plan_selection_desktop` | Page | Desktop |
| 10 | `certverify_plan_selection_mobile` | Page | Mobile |
| 11 | `certverify_dashboard_desktop` | Page | Desktop |
| 12 | `certverify_dashboard_mobile` | Page | Mobile |
| 13 | `certverify_verification_flow_desktop` | Page | Desktop |
| 14 | `certverify_verification_flow_mobile` | Page | Mobile |
| 15 | `certverify_results_likely_authentic` | Page state | Desktop |
| 16 | `certverify_results_suspicious` | Page state | Desktop |
| 17 | `certverify_results_high_risk` | Page state | Desktop |
| 18 | `certverify_results_mobile` | Page state | Mobile |
| 19 | `certverify_pricing_page` | Page | Desktop |
| 20 | `certverify_component_style_sheet` | System | Reference only |
| 21 | `certverify_design_system/DESIGN.md` | System | Reference only |
| 22 | `certverify_logo/screen.png` | Asset | Logo PNG |

---

## SECTION 2 — Complete Component List (Every Component to Build)

**Total: 34 components across 4 layers**

---

### LAYER 1 — UI Primitives (8 components)
*Smallest reusable atoms. Built first on Day 1. Both engineers split 4/4.*

| # | Component | File | Owner | Key Props | Design Notes |
|---|---|---|---|---|---|
| 1 | `Button` | `ui/Button.jsx` | **FE1** | `variant`, `size`, `disabled`, `loading`, `onClick` | 4 variants: `primary` (Teal fill, white text), `secondary` (Navy fill, white text), `outlined` (Navy border + text), `danger` (Red). No gradients. 4px radius. Loading state shows `Spinner` inside button |
| 2 | `Input` | `ui/Input.jsx` | **FE1** | `label`, `type`, `error`, `success`, `placeholder`, `value`, `onChange` | Label always above field in `label-caps` style. States: default (gray border), focus (Navy border + 2px teal outer glow), error (red border + error message text below), success (green border + check icon right) |
| 3 | `Card` | `ui/Card.jsx` | **FE1** | `children`, `className`, `elevated` | 1px `outline-variant` border, `rounded-xl`, white bg. `elevated` prop adds Level 2 shadow. All result panels and feature cards use this |
| 4 | `Badge` | `ui/Badge.jsx` | **FE1** | `color`, `label`, `size` | Base badge — light bg tint of color + high-contrast bold text in `label-caps`. All specific badges (PlanBadge, VerdictBadge, StatusBadge, SeverityBadge) extend this component |
| 5 | `Spinner` | `ui/Spinner.jsx` | **FE2** | `size`, `color` | CSS-only rotating ring. Used inside Button loading state and ProcessingView animated steps |
| 6 | `Alert` | `ui/Alert.jsx` | **FE2** | `type` (`success`\|`warning`\|`error`\|`info`), `message`, `onClose` | Inline alert bar with left icon + message text. Not a modal. Used in forms (wrong password), system notices (maintenance warning), and Verify step errors |
| 7 | `Modal` | `ui/Modal.jsx` | **FE2** | `open`, `onClose`, `title`, `children`, `actions` | Backdrop + centered panel. Level 2 elevation. Used for upgrade prompts, confirmation dialogs, and plan change confirmations |
| 8 | `Tooltip` | `ui/Tooltip.jsx` | **FE2** | `text`, `children`, `position` | Hover info label. Used on dimension score bars and anomaly severity icons to explain what each means |

---

### LAYER 2 — Badge & Status Components (6 components)
*Data-driven display atoms. All extend the base `Badge`.*

| # | Component | File | Owner | Variants / Logic |
|---|---|---|---|---|
| 9 | `PlanBadge` | `components/badges/PlanBadge.jsx` | **FE1** | `PRO` = blue, `PRO_MAX` = purple, `ENTERPRISE` = green. Shows in Navbar, Dashboard header, Verify page header, and result pages |
| 10 | `VerdictBadge` | `components/badges/VerdictBadge.jsx` | **FE2** | `LIKELY_AUTHENTIC` = Teal, `SUSPICIOUS` = Amber, `HIGH_RISK` = Red. Used on Result page and Dashboard history table rows |
| 11 | `StatusBadge` | `components/badges/StatusBadge.jsx` | **FE1** | `PENDING_PAYMENT` = gray, `PAYMENT_CONFIRMED` = blue, `PROCESSING` = amber (animated pulse), `COMPLETED` = green, `FAILED` = red. Dashboard table column |
| 12 | `SeverityBadge` | `components/badges/SeverityBadge.jsx` | **FE2** | `LOW` = amber, `MEDIUM` = orange, `HIGH` = red. Shown inside each `AnomalyItem` on the Result page |
| 13 | `TrustScoreRing` | `components/badges/TrustScoreRing.jsx` | **FE2** | Recharts `RadialBarChart`. Animates to score value on component mount. Color threshold: green ≥80, amber 50–79, red <50. Displays score large in center with `/ 100` label below. Verdict badge below the ring |
| 14 | `DimensionBar` | `components/badges/DimensionBar.jsx` | **FE2** | Single animated horizontal progress bar row. Props: `label`, `value` (0–100). Label left-aligned, percentage right-aligned, filled bar grows on mount. Used ×4 inside `DimensionBreakdown` |

---

### LAYER 3 — Feature Components (14 components)
*CertVerify-specific. Each maps directly to a screen section.*

| # | Component | File | Owner | What It Does | Screen(s) |
|---|---|---|---|---|---|
| 15 | `FileUpload` | `components/verification/FileUpload.jsx` | **FE2** | Plan-aware upload zone. `PRO`: single file input only. `PRO_MAX` + `ENTERPRISE`: multi-file drag-and-drop area. Shows live counter "2 / 5 documents". File list rows: file-type icon, filename, file size, delete (trash) button. Blocks submit if count exceeds plan limit. Shows plan limit warning inline: *"Your Pro plan allows a maximum of 3 documents. Upgrade for more."* Accepted: PDF, PNG, JPG, max 10MB | Verify desktop + mobile |
| 16 | `OrderSummary` | `components/verification/OrderSummary.jsx` | **FE2** | Sidebar panel on Verify desktop. Shows: "Order Summary" heading, Selected Plan row, Documents count row, Total Fee row (₦), divider, "Pay with Squad" CTA button (primary teal), "Secured by Squad" trust line with shield icon below | Verify desktop |
| 17 | `PaymentGate` | `components/verification/PaymentGate.jsx` | **FE2** | Squad payment prompt component. Receives `paymentUrl` from API response. Shows payment summary: plan name, doc count, total fee. "Pay with Squad" button opens `paymentUrl`. Handles the redirect back from Squad. Shows "Secured by Squad. CertVerify does not store your card details." trust message | Verify mobile step 2 |
| 18 | `ProcessingView` | `components/verification/ProcessingView.jsx` | **FE2** | Animated pipeline steps list. Title: *"Analyzing Documents"* + subtext *"Our institutional verification engine is processing your request."* Steps rendered from `PROCESSING_STEPS` constant. Completed steps: `check_circle` icon (Teal). Current step: `Spinner`. Pending steps: `pending` icon (gray). Uses `usePollStatus` hook. Shows *"This usually takes under 2 minutes. Please don't close this tab."* When done: *"Analysis complete — Redirecting to results..."* | Verify desktop + mobile step 3 |
| 19 | `StepIndicator` | `components/verification/StepIndicator.jsx` | **FE1** | Mobile-only step progress. "Step N of 4" heading + percentage progress bar (25% / 50% / 75% / 100%). Step names: Upload → Payment → Processing → Complete. Active step highlighted | Verify mobile only |
| 20 | `DimensionBreakdown` | `components/results/DimensionBreakdown.jsx` | **FE2** | Section containing 4× `DimensionBar`. Labels: Visual Authenticity, Text Integrity, Structural Pattern, Metadata Consistency. Section heading in `label-caps`: "DIMENSION BREAKDOWN" or "Technical Integrity Dimensions". Each bar animates in on mount | Result (all 3 verdict states) |
| 21 | `AnomalyItem` | `components/results/AnomalyItem.jsx` | **FE2** | Single anomaly row card. Shows: left icon (field-specific Material icon), anomaly field name as heading (h3), `SeverityBadge`, description paragraph, confidence % if available (e.g. "Confidence: 99.4%"), anomaly ID if present (e.g. "Conflict ID: #MT-884") | Result page |
| 22 | `AnomalyList` | `components/results/AnomalyList.jsx` | **FE2** | Container section for anomaly items. Section heading: "Anomaly Detection Log" or "IDENTIFIED ANOMALIES". If `anomalies` array is empty: shows `check_circle` icon + *"No anomalies detected"* message + reassurance text. If populated: renders list of `AnomalyItem` components | Result (all states) |
| 23 | `AuditTrail` | `components/results/AuditTrail.jsx` | **FE2** | Timestamped event log section. Section heading: "AUDIT TRAIL". Each row: timestamp in JetBrains Mono, icon, event label. Standard events: Verification initiated → OCR Extraction completed → AI Analysis complete → Report generated. Bottom: System Identifier + Transaction Ref (both in monospace) + Compliance tags (GDPR, SOC2) if High Risk | Result (all states) |
| 24 | `AIResultSummary` | `components/results/AIResultSummary.jsx` | **FE2** | Hero section at top of Result page. 4px top-border color changes by verdict: Teal = LIKELY_AUTHENTIC, Amber = SUSPICIOUS, Red = HIGH_RISK. Contains: `TrustScoreRing` large, verdict heading (e.g. *"Trust Validation Success"*), `VerdictBadge`, "AI Summary:" label + one-sentence finding from API, filename being verified | Result (all states) |
| 25 | `ResultActions` | `components/results/ResultActions.jsx` | **FE2** | Action buttons row below results. Renders different buttons per verdict: LIKELY_AUTHENTIC: "Download PDF Report" + "Verify Another Certificate". SUSPICIOUS: "Export Report" + "Manual Override" + "Request Re-verification". HIGH_RISK: "Generate Fraud Report" + "Flag for Manual Review" + "Download Original". Download calls `api/report.js` | Result (all states) |
| 26 | `VerificationRow` | `components/dashboard/VerificationRow.jsx` | **FE1** | One row in dashboard history table. Columns: PDF icon + filename (truncated), date formatted, `PlanBadge`, `StatusBadge`, trust score as "98/100" (hidden when PROCESSING), `VerdictBadge` (hidden when PROCESSING), "View Report" button (navigates to `/result/:id`). Handles PROCESSING state gracefully with "-" placeholders | Dashboard |
| 27 | `QuickStats` | `components/dashboard/QuickStats.jsx` | **FE1** | Row of 3 stat cards: (1) Total Verifications with count + "TOTAL VERIFICATIONS" label + trend "+12% vs last month", (2) Likely Authentic count + "85.8% Rate" sub-label, (3) Suspicious count + High Risk count in same card. Each card has Material icon and color-coded accent. Desktop layout: 3 columns. Mobile: 2-column grid | Dashboard desktop + mobile |
| 28 | `PlanCard` | `components/dashboard/PlanCard.jsx` | **FE1** | Full plan display card. Props: `plan` (`PRO`\|`PRO_MAX`\|`ENTERPRISE`), `selected`, `onSelect`, `showPopularRibbon`. Shows: plan tier label, price (₦500/₦750/₦1,200 per session), feature list from `PLAN_DOC_FEATURES` constant with `check_circle` icons, "Select Plan" CTA button. `PRO_MAX` card shows "Most Popular" ribbon at top-right corner | PlanSelect, Landing (preview), Pricing |

---

### LAYER 4 — Layout & Navigation (6 components)

| # | Component | File | Owner | What It Does | Used On |
|---|---|---|---|---|---|
| 29 | `Navbar` | `components/layout/Navbar.jsx` | **FE1** | Authenticated top header bar. Height: h-16. Sticky top-0. Left: logo + "CertVerify" wordmark. Right: "New Verification" button (outlined) + `PlanBadge` + "Upgrade Plan" button (ghost). On mobile: logo only + hamburger if needed | Dashboard, Verify, Result |
| 30 | `PublicNavbar` | `components/layout/PublicNavbar.jsx` | **FE1** | Public pages top nav. Left: logo + wordmark. Right desktop: nav links (hidden) + "Login" (outlined) + "Get Started" (primary). Mobile: logo + hamburger icon. Sticky top-0, `border-b border-outline-variant` | Landing, Pricing, PlanSelect (pre-login) |
| 31 | `Sidebar` | `components/layout/Sidebar.jsx` | **FE1** | Desktop left sidebar. Width: w-64. Fixed position. `bg-surface-container-low`. `border-r border-outline-variant`. Top: logo. Nav links (with Material icons): Dashboard, New Verification, History, Analytics, Settings. Bottom section: Support, Documentation, Logout. Hidden on mobile (`hidden md:flex`) | Dashboard, Result desktop |
| 32 | `MobileBottomNav` | `components/layout/MobileBottomNav.jsx` | **FE2** | Fixed bottom nav. Height: h-16. `md:hidden`. `bg-surface border-t border-outline-variant`. 5 tabs: Home (`home`), Verify (`add_circle`), History (`list_alt`), Settings (`settings`), Profile (`account_circle`). Active tab highlighted in primary Navy | Dashboard mobile, Result mobile |
| 33 | `AuthLayout` | `components/layout/AuthLayout.jsx` | **FE1** | Centered full-page wrapper for Login + Register. Logo/wordmark at top. Content centered at max-width 440px. Footer: "© 2024 CertVerify. Security through Clarity." at bottom. Full-height flex column |  Login, Register |
| 34 | `PageLayout` | `components/layout/PageLayout.jsx` | **FE1** | Authenticated app shell wrapper. Renders `Sidebar` (desktop only) + `Navbar` (top) + `MobileBottomNav` (mobile only) + `<main>` slot for page content. `md:ml-64` margin offset to account for sidebar. Max-width container centered | Dashboard, Verify, Result |

---

## SECTION 3 — Pages (9 React Pages)

### FE1 Owns — 7 Pages

---

#### `pages/Landing.jsx`
**Route:** `/` (public)
**Sections (top to bottom):**
1. `PublicNavbar`
2. **Hero** — H1: *"One upload. One payment. One clear answer."* (desktop) / *"The Gold Standard for Credential Integrity"* (mobile). Subtext paragraph. Two CTA buttons: "Get Started" (primary teal) + "View Demo" (outlined Navy)
3. **How It Works** — H2: *"Three steps to total certainty"*. 3 step cards in a row: Upload Certificate → Pay via Squad → Get Trust Score. Each has icon, step number, title, 1-line description
4. **Pricing Preview** — H2: *"Scalable verification plans"*. 3× `PlanCard` in a row. "Register" CTA link below
5. **CTA Banner** — Dark Navy (`bg-primary`) full-width section. H2: *"Ready to secure your credentials?"*. "Get Started Free" button (Teal on dark bg)
6. **Footer** — Logo, nav links row, copyright

**Responsive:** Mobile stacks all sections vertically. Hamburger menu in `PublicNavbar` for mobile.

---

#### `pages/Login.jsx`
**Route:** `/login` (public)
**Layout:** `AuthLayout`
**Fields:** Email Address (`Input`), Password (`Input` with show/hide toggle icon)
**Buttons:** "Log In" (primary teal, full-width)
**Links:** "Don't have an account? Register" below button
**Logic:** POST `/api/auth/login` → store JWT via `AuthContext.login()` → redirect to `/dashboard`
**Errors:** `Alert` component (type=`error`) rendered above form for wrong credentials
**Note from design:** Both `certverify_auth_flow_1` and `auth_flow_2` show the same Login form — they are the same page component. No difference in implementation.

---

#### `pages/Register.jsx`
**Route:** `/register` (public)
**Layout:** `AuthLayout`
**Fields:** Full Name, Email Address, Password, Organisation (optional — labeled with `?`)
**Buttons:** "Create Account" (primary teal, full-width) — mobile shows arrow icon instead of text
**Links:** "Already have an account? Login"
**Logic:** POST `/api/auth/register` → store JWT → redirect to `/select-plan`
**Default plan:** Backend defaults to `PRO` if none specified — plan selection happens on next screen

---

#### `pages/PlanSelect.jsx`
**Route:** `/select-plan` (authenticated — shown once post-registration)
**Header:** `PublicNavbar` (not full app nav — user hasn't entered the app yet)
**Content:**
- H1: *"Choose your verification plan"*
- 3× `PlanCard` in a 3-column grid (desktop) / stacked (mobile)
- Footer trust line: *"Trusted by 50+ Institutions"*
**Logic:** On plan card select → PATCH `/api/auth/plan` with `{ plan: 'PRO_MAX' }` → update `AuthContext` → redirect to `/dashboard`
**Mobile:** Cards stack vertically with full-width "Select Plan" button on each

---

#### `pages/Dashboard.jsx`
**Route:** `/dashboard` (authenticated)
**Layout:** `PageLayout`
**Sections:**
1. Welcome header: *"Welcome, Administrator"* / *"Hello, [user.name]"* with current date
2. `QuickStats` row
3. *"New Verification"* CTA button top-right (navigates to `/verify`)
4. `PlanBadge` showing active plan + "Upgrade Plan" button
5. Recent Verification History section:
   - H4: "RECENT VERIFICATION HISTORY" in `label-caps`
   - Filter icon button + Export/Download icon button (right-aligned)
   - Full-width data table with columns: FILE NAME, DATE, PLAN USED, STATUS, TRUST SCORE, VERDICT, ACTION
   - Each row = `VerificationRow`
   - Pagination: "Showing 4 of 1,284 Verifications" + PREVIOUS / NEXT buttons
6. Automated Security Audits panel (bottom): *"Request Forensic Audit"* button

**Mobile layout:** Simplified:
- Greeting + "New Verification" button
- 2-column quick stats grid (2 stat cards)
- "Recent Verifications" — card-style rows (not full table) each showing filename, date, VerdictBadge
- `MobileBottomNav` fixed at bottom

---

#### `pages/Pricing.jsx`
**Route:** `/pricing` (public)
**Layout:** `PublicNavbar` + full page + Footer
**Sections:**
1. Hero — H1: *"Simple, transparent pricing"*, subtext: *"Pay per verification session. No subscriptions. No hidden fees."*
2. 3× `PlanCard` in row — Pro (₦500/session, "Standard" label), Pro Max (₦750/session, "Most Popular" ribbon, "Recommended" tag), Enterprise (₦1,200/session, "Scale" label, "Contact Sales" CTA)
3. Feature comparison table — H2: *"Compare detailed plans"*. Table columns: Features | Pro | Pro Max | Enterprise. Rows: Document Limit, Processing Speed, Report Type, Batch Support. Boolean features use check (`check`) / close (`close`) icons
4. FAQ accordion — H2: *"Frequently Asked Questions"*. 3 questions with `expand_more` toggle. Q1: "How long does verification take?" Q2: "What file formats are accepted?" Q3: "Is my data secure?"
5. CTA banner — H2: *"Ready to verify your first certificate?"* + *"Join 500+ institutions using CertVerify for secure validation."* + "Get Started Free" button
6. Footer

---

#### `pages/NotFound.jsx`
**Route:** `*` (catch-all)
Simple centered page: logo, "404 — Page not found" message, "Back to Dashboard" button.

---

### FE2 Owns — 2 Pages (Most Complex)

---

#### `pages/Verify.jsx`
**Route:** `/verify` (authenticated)
**Layout:** `PageLayout`
**This is a multi-step flow managed on one page using `useState` for current step.**

**Step flow:**

| Step | Number | Mobile Header | What Renders | Key Logic |
|---|---|---|---|---|
| Upload | 1 of 4 (25%) | "UPLOAD DOCUMENTS" | `StepIndicator` + `FileUpload` | Validate file count vs `PLAN_LIMITS[user.plan]`. Enable "Continue" only when ≥1 file selected |
| Payment | 2 of 4 (50%) | "PAYMENT SUMMARY" | `OrderSummary` + `PaymentGate` | POST `/api/verification/pay` → get `paymentUrl` → redirect to Squad checkout |
| Processing | 3 of 4 (75%) | "ANALYZING…" | `ProcessingView` | Start `usePollStatus(verificationId)` polling every 3s |
| Complete | 4 of 4 (100%) | "Verification Successful" | Success icon + redirect message | Auto-redirect to `/result/:id` when status = `COMPLETED` |

**Desktop layout:** 2-column grid. Left col (7/12): upload zone + file list. Right col (5/12): `OrderSummary` panel (sticky). Step nav tabs above: Upload → Payment → Processing → Complete (underline-style active indicator).

**Mobile layout:** Single column. `StepIndicator` at top. Content below. Fixed CTA button at bottom of screen ("Continue" / "Pay Now" / "View Results").

**Key logic notes:**
- Plan limit warning shown as inline `Alert` if user tries to add more files than plan allows
- After Squad payment redirect back: extract `verificationId` from URL params, start polling
- If status = `FAILED`: show `Alert` (type=`error`) with "Verification failed. Try again." + retry button
- Squad redirect URL should include `?verificationId=xxx` for polling to pick up

---

#### `pages/Result.jsx`
**Route:** `/result/:id` (authenticated)
**Layout:** `PageLayout`
**Data source:** GET `/api/verification/:id` on page load. Derives verdict from `trustScore`.

**This single page renders 3 visual states based on `verdict` field from API:**

---

**State A — LIKELY_AUTHENTIC (score 80–100):**
- `AIResultSummary` with Teal 4px top-border
  - Title: *"Trust Validation Success"*
  - `VerdictBadge`: LIKELY AUTHENTIC (Teal)
  - `TrustScoreRing` animated to score (e.g. 97)
  - AI Summary text: findings sentence
- `DimensionBreakdown` — all scores high (Visual 99%, Text 98%, Structural 95%, Metadata 100%)
- `AnomalyList` — empty state: `check_circle` icon + *"No anomalies detected"* + reassurance text
- `ResultActions` — "Download PDF Report" (primary) + "Verify Another Certificate" (outlined)
- `AuditTrail` — Transaction Ref: `SQD-8829-XKJ-44` (monospace) + timestamp
- Footer line: *"SECURED BY CERTVIFY CRYPTOGRAPHIC HASHING"*

---

**State B — SUSPICIOUS (score 50–79):**
- `AIResultSummary` with Amber 4px top-border
  - Title: *"Verification Result"*
  - `VerdictBadge`: SUSPICIOUS (Amber) + `warning` icon
  - `TrustScoreRing` in amber
  - AI Summary: *"Minor anomalies detected in seal placement. Recommend secondary review."*
  - Filename shown: e.g. `Diploma_Engineering_YabaTech.pdf`
- `DimensionBreakdown` — mixed scores (Visual 62%, Structural 68%, Metadata 94%, Institutional 89%)
- `AnomalyList` with 1–2 `AnomalyItem` entries:
  - Seal Placement — MEDIUM — *"Alignment differs from standard institutional template by 4mm. Coordinate mismatch detected in Y-axis."*
  - "NO OTHER MAJOR ANOMALIES DETECTED" footer line
- `ResultActions` — "Export Report" + "Manual Override" + "Request Re-verification"
- `AuditTrail` — timestamped events (Verification initiated → OCR completed → Structural Anomaly Flagged [Code: V-404])
- System Identifier: `CV-88291-XX-9022` (monospace)

---

**State C — HIGH_RISK (score 0–49):**
- `AIResultSummary` with Red 4px top-border
  - Title: *"Verification Terminated"*
  - `VerdictBadge`: HIGH RISK (Red) + `bolt` icon
  - `TrustScoreRing` in red (very low score)
  - AI Logic Summary text
  - Filename: e.g. `Master_Business_Admin_UI.pdf`
- `DimensionBreakdown` — all very low (Metadata 4%, Structural 9%, Texture 32%, Cryptographic Seal 0%)
- `AnomalyList` — multiple `AnomalyItem` entries:
  - Font Mismatch — HIGH — *"System identified 'Helvetica-Oblique' in a region where standard 'Times New Roman' is cryptographically expected."* — Confidence 99.4%
  - Metadata Conflict — HIGH — *"Document creation date in metadata (2023-11-12) precedes the official template revision date (2024-01-05)."* — Conflict ID: #MT-884
  - Texture Anomaly — MEDIUM — *"Micro-jitter detected in background grain patterns, suggesting non-linear layer flattening or manual retouching."*
- `ResultActions` — "Generate Fraud Report" (danger) + "Flag for Manual Review" + "Download Original"
- `AuditTrail` + Analysis Date + Node ID: `VERIFY-NODE-ALPHA-9` + Hash: `sha256:8f9e...a2b1` (all monospace)
- Compliance tags: GDPR, SOC2 (as small `Badge` components)

---

**Mobile Result (all states):**
- Simplified single-column layout
- Score ring + confidence % at top
- "DIMENSION ANALYSIS" section with `DimensionBar`s
- `AnomalyList` or "No anomalies detected" empty state
- "AUDIT TRAIL" section
- 3 action buttons stacked: GENERATE CERTIFICATE REPORT, VIEW ON BLOCKCHAIN, DOWNLOAD JSON DATA
- Share icon button in top-right of header

---

## SECTION 4 — API Layer

```
src/api/
  auth.js            ← FE1 OWNS
  verification.js    ← FE2 OWNS
  report.js          ← FE2 OWNS

src/hooks/
  useAuth.js         ← FE1 OWNS
  useVerification.js ← FE2 OWNS
  usePollStatus.js   ← FE2 OWNS

src/context/
  AuthContext.jsx    ← FE1 OWNS
```

### `src/api/auth.js` — FE1
```js
export const register = (data) => post('/auth/register', data);
export const login    = (data) => post('/auth/login', data);
export const getMe    = ()     => get('/auth/me');
export const updatePlan = (plan) => patch('/auth/plan', { plan });
```

### `src/api/verification.js` — FE2
```js
export const uploadFiles      = (formData) => post('/verification/upload', formData, true); // multipart
export const initiatePayment  = (id)       => post('/verification/pay', { verificationId: id });
export const getVerification  = (id)       => get(`/verification/${id}`);
export const getHistory       = ()         => get('/verification/history');
```

### `src/api/report.js` — FE2
```js
export const downloadReport = (id) => get(`/report/${id}/download`);
```

### `src/hooks/usePollStatus.js` — FE2
```js
// Polls GET /verification/:id every 3 seconds
// Stops automatically when status === 'COMPLETED' or 'FAILED'
// Returns { data, done, error }
import { useEffect, useState } from 'react';
import { getVerification } from '../api/verification';

export function usePollStatus(verificationId) {
  const [data, setData]   = useState(null);
  const [done, setDone]   = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!verificationId || done) return;
    const interval = setInterval(async () => {
      try {
        const result = await getVerification(verificationId);
        setData(result);
        if (result.status === 'COMPLETED' || result.status === 'FAILED') {
          setDone(true);
          clearInterval(interval);
        }
      } catch (err) {
        setError(err.message);
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [verificationId, done]);

  return { data, done, error };
}
```

### `src/context/AuthContext.jsx` — FE1
**Stores:** `user` (id, name, email, plan, organisation), `token` (JWT), `loading`
**Exposes:** `login(credentials)`, `logout()`, `updatePlan(newPlan)`, `isAuthenticated`
**CRITICAL:** `user.plan` must be accessible from any component via `useAuth()`. `FileUpload`, `PlanBadge`, `OrderSummary`, `Navbar`, `PageLayout` all read it.

---

## SECTION 5 — Shared Utilities

### `src/utils/constants.js` — FE1 creates Day 1
```js
export const PLAN_LIMITS = { PRO: 3, PRO_MAX: 5, ENTERPRISE: 7 };

export const PLAN_LABELS = { PRO: 'Pro', PRO_MAX: 'Pro Max', ENTERPRISE: 'Enterprise' };

export const PLAN_PRICES = { PRO: '₦500', PRO_MAX: '₦750', ENTERPRISE: '₦1,200' };

export const PLAN_COLORS = { PRO: 'blue', PRO_MAX: 'purple', ENTERPRISE: 'green' };

export const PLAN_DOC_FEATURES = {
  PRO: [
    '3 documents per session',
    'Single upload interface',
    'Standard processing',
    'Basic PDF report',
  ],
  PRO_MAX: [
    '5 documents per session',
    'Multi-file drag-and-drop',
    'Real-time API access',
    'Institutional branding',
    'Detailed analytics report',
  ],
  ENTERPRISE: [
    '7 documents per session',
    'Priority queue processing',
    'Bulk verification tools',
    'Dedicated account manager',
    'Full forensic audit report',
  ],
};

export const VERDICT_CONFIG = {
  LIKELY_AUTHENTIC: { label: 'Likely Authentic', color: '#006c4e', borderClass: 'border-t-4 border-secondary', minScore: 80 },
  SUSPICIOUS:       { label: 'Suspicious',        color: '#f59e0b', borderClass: 'border-t-4 border-amber-500', minScore: 50 },
  HIGH_RISK:        { label: 'High Risk',          color: '#ba1a1a', borderClass: 'border-t-4 border-error',    minScore: 0  },
};

export const SEVERITY_CONFIG = {
  LOW:    { label: 'Low',    color: '#f59e0b' },
  MEDIUM: { label: 'Medium', color: '#f97316' },
  HIGH:   { label: 'High',   color: '#ba1a1a' },
};

export const VERIFICATION_STATUS_CONFIG = {
  PENDING_PAYMENT:   { label: 'Pending Payment',   color: 'gray'  },
  PAYMENT_CONFIRMED: { label: 'Payment Confirmed', color: 'blue'  },
  PROCESSING:        { label: 'Processing',        color: 'amber', pulse: true },
  COMPLETED:         { label: 'Completed',         color: 'green' },
  FAILED:            { label: 'Failed',            color: 'red'   },
};

export const PROCESSING_STEPS = [
  { id: 1, label: 'Payment confirmed',           icon: 'check_circle' },
  { id: 2, label: 'Uploading documents',         icon: 'upload'       },
  { id: 3, label: 'Running OCR extraction',      icon: 'text_fields'  },
  { id: 4, label: 'Analysing with GPT-4 Vision', icon: 'psychology'   },
  { id: 5, label: 'Calculating trust score',     icon: 'analytics'    },
  { id: 6, label: 'Generating report',           icon: 'description'  },
];
```

### `src/utils/formatters.js` — FE1 creates Day 1
```js
export const scoreToColor = (score) =>
  score >= 80 ? '#006c4e' : score >= 50 ? '#f59e0b' : '#ba1a1a';

export const scoreToVerdict = (score) =>
  score >= 80 ? 'LIKELY_AUTHENTIC' : score >= 50 ? 'SUSPICIOUS' : 'HIGH_RISK';

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const truncateFilename = (name, max = 30) =>
  name.length > max ? name.slice(0, max - 3) + '...' : name;
```

### `src/utils/api.js` — FE1 creates Day 1 (base HTTP client)
```js
const BASE = import.meta.env.VITE_API_BASE_URL;

const request = async (method, path, body, isMultipart = false) => {
  const token = localStorage.getItem('cv_token');
  const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
  if (!isMultipart) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data.data;
};

export const get   = (path)               => request('GET',   path);
export const post  = (path, body, mp)     => request('POST',  path, body, mp);
export const patch = (path, body)         => request('PATCH', path, body);
```

---

## SECTION 6 — Complete Folder Structure

```
certverify/
└── frontend/
    ├── public/
    │   └── logo.png                              ← from certverify_logo/screen.png
    │
    ├── src/
    │   │
    │   ├── ui/                                   ← LAYER 1: Primitives (split 4/4 Day 1)
    │   │   ├── Button.jsx                        ← FE1
    │   │   ├── Input.jsx                         ← FE1
    │   │   ├── Card.jsx                          ← FE1
    │   │   ├── Badge.jsx                         ← FE1 (base — all other badges extend)
    │   │   ├── Spinner.jsx                       ← FE2
    │   │   ├── Alert.jsx                         ← FE2
    │   │   ├── Modal.jsx                         ← FE2
    │   │   └── Tooltip.jsx                       ← FE2
    │   │
    │   ├── components/
    │   │   │
    │   │   ├── layout/                           ← LAYER 4: Layout & Navigation
    │   │   │   ├── Navbar.jsx                    ← FE1 (authenticated top bar)
    │   │   │   ├── PublicNavbar.jsx              ← FE1 (public top bar)
    │   │   │   ├── Sidebar.jsx                   ← FE1 (desktop sidebar, hidden mobile)
    │   │   │   ├── MobileBottomNav.jsx           ← FE2 (mobile tab bar, hidden desktop)
    │   │   │   ├── AuthLayout.jsx                ← FE1 (login/register centered wrapper)
    │   │   │   └── PageLayout.jsx                ← FE1 (full app shell)
    │   │   │
    │   │   ├── badges/                           ← LAYER 2: Badge & Status
    │   │   │   ├── PlanBadge.jsx                 ← FE1
    │   │   │   ├── StatusBadge.jsx               ← FE1
    │   │   │   ├── VerdictBadge.jsx              ← FE2
    │   │   │   ├── SeverityBadge.jsx             ← FE2
    │   │   │   ├── TrustScoreRing.jsx            ← FE2 (Recharts RadialBarChart)
    │   │   │   └── DimensionBar.jsx              ← FE2 (animated progress bar row)
    │   │   │
    │   │   ├── verification/                     ← LAYER 3: Verify Flow
    │   │   │   ├── FileUpload.jsx                ← FE2
    │   │   │   ├── OrderSummary.jsx              ← FE2
    │   │   │   ├── PaymentGate.jsx               ← FE2
    │   │   │   ├── ProcessingView.jsx            ← FE2 (uses usePollStatus)
    │   │   │   └── StepIndicator.jsx             ← FE1 (mobile step progress)
    │   │   │
    │   │   ├── results/                          ← LAYER 3: Result Display
    │   │   │   ├── AIResultSummary.jsx           ← FE2 (hero card with verdict)
    │   │   │   ├── DimensionBreakdown.jsx        ← FE2 (4× DimensionBar)
    │   │   │   ├── AnomalyItem.jsx               ← FE2 (single anomaly card)
    │   │   │   ├── AnomalyList.jsx               ← FE2 (list + empty state)
    │   │   │   ├── AuditTrail.jsx                ← FE2 (timestamped log)
    │   │   │   └── ResultActions.jsx             ← FE2 (verdict-conditional buttons)
    │   │   │
    │   │   └── dashboard/                        ← LAYER 3: Dashboard
    │   │       ├── PlanCard.jsx                  ← FE1 (plan selection card)
    │   │       ├── VerificationRow.jsx           ← FE1 (table row)
    │   │       └── QuickStats.jsx                ← FE1 (stat cards row)
    │   │
    │   ├── pages/
    │   │   ├── Landing.jsx                       ← FE1
    │   │   ├── Login.jsx                         ← FE1
    │   │   ├── Register.jsx                      ← FE1
    │   │   ├── PlanSelect.jsx                    ← FE1
    │   │   ├── Dashboard.jsx                     ← FE1
    │   │   ├── Pricing.jsx                       ← FE1
    │   │   ├── NotFound.jsx                      ← FE1
    │   │   ├── Verify.jsx                        ← FE2 (multi-step upload → pay → process)
    │   │   └── Result.jsx                        ← FE2 (3 verdict states)
    │   │
    │   ├── api/
    │   │   ├── auth.js                           ← FE1
    │   │   ├── verification.js                   ← FE2
    │   │   └── report.js                         ← FE2
    │   │
    │   ├── hooks/
    │   │   ├── useAuth.js                        ← FE1
    │   │   ├── useVerification.js                ← FE2
    │   │   └── usePollStatus.js                  ← FE2
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx                   ← FE1
    │   │
    │   ├── utils/
    │   │   ├── api.js                            ← FE1 (base fetch client)
    │   │   ├── constants.js                      ← FE1 (all enums & config)
    │   │   └── formatters.js                     ← FE1 (date, score, filesize helpers)
    │   │
    │   ├── App.jsx                               ← FE1 (all routes defined here)
    │   ├── main.jsx                              ← FE1 (React root + AuthProvider wrap)
    │   └── index.css                             ← FE1 (Tailwind + Google Fonts import)
    │
    ├── tailwind.config.js                        ← FE1 (design tokens wired in Day 1)
    ├── vite.config.js                            ← FE1
    ├── .env                                      ← gitignored
    ├── .env.example                              ← FE1 (committed, no secrets)
    ├── .gitignore
    ├── package.json
    └── README.md
```

---

## SECTION 7 — Routes (`App.jsx` — FE1 owns)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"            element={<Landing />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/pricing"     element={<Pricing />} />

        {/* Onboarding — authenticated, shown once */}
        <Route path="/select-plan" element={<ProtectedRoute><PlanSelect /></ProtectedRoute>} />

        {/* App */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/verify"      element={<ProtectedRoute><Verify /></ProtectedRoute>} />
        <Route path="/result/:id"  element={<ProtectedRoute><Result /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## SECTION 8 — `tailwind.config.js` (FE1 creates Day 1)

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:                  '#00183F',
        'primary-container':      '#0f2d5e',
        secondary:                '#006C4E',
        'secondary-container':    '#83f5c6',
        error:                    '#ba1a1a',
        surface:                  '#f7f9fb',
        'surface-dim':            '#d8dadc',
        'surface-container-low':  '#f2f4f6',
        'surface-container':      '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-lowest': '#ffffff',
        'on-surface':             '#191c1e',
        'on-surface-variant':     '#44474f',
        'outline-variant':        '#c4c6d0',
        outline:                  '#747780',
        'inverse-surface':        '#2d3133',
      },
      fontFamily: {
        display: ['Hanken Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'container-max': '1280px',
      },
      spacing: {
        'gutter':          '24px',
        'margin-desktop':  '64px',
        'margin-mobile':   '20px',
      },
    },
  },
  plugins: [],
};
```

**Google Fonts import — add to `index.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## SECTION 9 — Full Component Ownership Table

| # | Component | File | FE1 | FE2 |
|---|---|---|---|---|
| 1 | Button | `ui/Button.jsx` | ✅ | |
| 2 | Input | `ui/Input.jsx` | ✅ | |
| 3 | Card | `ui/Card.jsx` | ✅ | |
| 4 | Badge | `ui/Badge.jsx` | ✅ | |
| 5 | Spinner | `ui/Spinner.jsx` | | ✅ |
| 6 | Alert | `ui/Alert.jsx` | | ✅ |
| 7 | Modal | `ui/Modal.jsx` | | ✅ |
| 8 | Tooltip | `ui/Tooltip.jsx` | | ✅ |
| 9 | PlanBadge | `components/badges/PlanBadge.jsx` | ✅ | |
| 10 | StatusBadge | `components/badges/StatusBadge.jsx` | ✅ | |
| 11 | VerdictBadge | `components/badges/VerdictBadge.jsx` | | ✅ |
| 12 | SeverityBadge | `components/badges/SeverityBadge.jsx` | | ✅ |
| 13 | TrustScoreRing | `components/badges/TrustScoreRing.jsx` | | ✅ |
| 14 | DimensionBar | `components/badges/DimensionBar.jsx` | | ✅ |
| 15 | FileUpload | `components/verification/FileUpload.jsx` | | ✅ |
| 16 | OrderSummary | `components/verification/OrderSummary.jsx` | | ✅ |
| 17 | PaymentGate | `components/verification/PaymentGate.jsx` | | ✅ |
| 18 | ProcessingView | `components/verification/ProcessingView.jsx` | | ✅ |
| 19 | StepIndicator | `components/verification/StepIndicator.jsx` | ✅ | |
| 20 | AIResultSummary | `components/results/AIResultSummary.jsx` | | ✅ |
| 21 | DimensionBreakdown | `components/results/DimensionBreakdown.jsx` | | ✅ |
| 22 | AnomalyItem | `components/results/AnomalyItem.jsx` | | ✅ |
| 23 | AnomalyList | `components/results/AnomalyList.jsx` | | ✅ |
| 24 | AuditTrail | `components/results/AuditTrail.jsx` | | ✅ |
| 25 | ResultActions | `components/results/ResultActions.jsx` | | ✅ |
| 26 | VerificationRow | `components/dashboard/VerificationRow.jsx` | ✅ | |
| 27 | QuickStats | `components/dashboard/QuickStats.jsx` | ✅ | |
| 28 | PlanCard | `components/dashboard/PlanCard.jsx` | ✅ | |
| 29 | Navbar | `components/layout/Navbar.jsx` | ✅ | |
| 30 | PublicNavbar | `components/layout/PublicNavbar.jsx` | ✅ | |
| 31 | Sidebar | `components/layout/Sidebar.jsx` | ✅ | |
| 32 | MobileBottomNav | `components/layout/MobileBottomNav.jsx` | | ✅ |
| 33 | AuthLayout | `components/layout/AuthLayout.jsx` | ✅ | |
| 34 | PageLayout | `components/layout/PageLayout.jsx` | ✅ | |
| | **Pages** | | | |
| 35 | Landing | `pages/Landing.jsx` | ✅ | |
| 36 | Login | `pages/Login.jsx` | ✅ | |
| 37 | Register | `pages/Register.jsx` | ✅ | |
| 38 | PlanSelect | `pages/PlanSelect.jsx` | ✅ | |
| 39 | Dashboard | `pages/Dashboard.jsx` | ✅ | |
| 40 | Pricing | `pages/Pricing.jsx` | ✅ | |
| 41 | NotFound | `pages/NotFound.jsx` | ✅ | |
| 42 | Verify | `pages/Verify.jsx` | | ✅ |
| 43 | Result | `pages/Result.jsx` | | ✅ |
| | **API / Hooks / Utils** | | | |
| 44 | api/auth.js | `api/auth.js` | ✅ | |
| 45 | api/verification.js | `api/verification.js` | | ✅ |
| 46 | api/report.js | `api/report.js` | | ✅ |
| 47 | useAuth.js | `hooks/useAuth.js` | ✅ | |
| 48 | useVerification.js | `hooks/useVerification.js` | | ✅ |
| 49 | usePollStatus.js | `hooks/usePollStatus.js` | | ✅ |
| 50 | AuthContext.jsx | `context/AuthContext.jsx` | ✅ | |
| 51 | utils/api.js | `utils/api.js` | ✅ | |
| 52 | utils/constants.js | `utils/constants.js` | ✅ | |
| 53 | utils/formatters.js | `utils/formatters.js` | ✅ | |
| | **Config** | | | |
| 54 | App.jsx + routes | `App.jsx` | ✅ | |
| 55 | tailwind.config.js | `tailwind.config.js` | ✅ | |
| 56 | index.css | `index.css` | ✅ | |

**FE1 total: 34 deliverables**
**FE2 total: 22 deliverables**
**Grand total: 56**

---

## SECTION 10 — Build Order & Merge Cadence

### PHASE 1 — Foundation (Day 1) — Both work in parallel

| Task | Owner | Branch | Merge to `dev` when |
|---|---|---|---|
| Create Vite + React + Tailwind project, push base folder structure | **FE1** | `main` → push `dev` immediately | Day 1 morning — first thing |
| `tailwind.config.js` with all design tokens + `index.css` fonts import | **FE1** | `feature/fe1-design-tokens` | Day 1 noon |
| `utils/api.js` + `utils/constants.js` + `utils/formatters.js` | **FE1** | same branch | Day 1 noon |
| `context/AuthContext.jsx` + `hooks/useAuth.js` | **FE1** | `feature/fe1-auth-context` | Day 1 afternoon |
| `ui/Button.jsx` + `ui/Input.jsx` + `ui/Card.jsx` + `ui/Badge.jsx` | **FE1** | `feature/fe1-ui-primitives` | Day 1 EOD |
| `ui/Spinner.jsx` + `ui/Alert.jsx` + `ui/Modal.jsx` + `ui/Tooltip.jsx` | **FE2** | `feature/fe2-ui-primitives` | Day 1 EOD |

> ⚠️ **FE2 BLOCKER:** Do not start any feature component until `feature/fe1-design-tokens` AND `feature/fe1-ui-primitives` are merged to `dev`. Pull `dev` first thing on Day 2 before writing a single line.

---

### PHASE 2 — Features (Days 2–4) — Full parallel development

**FE1 branch order (one at a time):**
```
feature/fe1-layout        → AuthLayout, PageLayout, Navbar, PublicNavbar, Sidebar
feature/fe1-auth-pages    → Login.jsx, Register.jsx
feature/fe1-plan-pages    → PlanSelect.jsx, PlanCard.jsx, PlanBadge.jsx, StatusBadge.jsx
feature/fe1-dashboard     → Dashboard.jsx, VerificationRow.jsx, QuickStats.jsx
feature/fe1-landing       → Landing.jsx (all sections inline)
feature/fe1-pricing       → Pricing.jsx (PlanCard reuse + FAQ inline)
feature/fe1-routing       → App.jsx with all routes + ProtectedRoute + NotFound.jsx
```

**FE2 branch order (one at a time):**
```
feature/fe2-mobile-nav    → MobileBottomNav.jsx
feature/fe2-badges        → VerdictBadge, SeverityBadge, TrustScoreRing, DimensionBar
feature/fe2-file-upload   → FileUpload.jsx + StepIndicator.jsx (needs PlanBadge from FE1 — wait)
feature/fe2-payment       → OrderSummary.jsx, PaymentGate.jsx
feature/fe2-processing    → ProcessingView.jsx + hooks/usePollStatus.js + api/verification.js
feature/fe2-results       → AIResultSummary, DimensionBreakdown, AnomalyItem, AnomalyList, AuditTrail, ResultActions
feature/fe2-pages         → Verify.jsx + Result.jsx (assembles all above) + api/report.js + hooks/useVerification.js
```

**Daily merge discipline:**
- Merge to `dev` at **end of each day** — not mid-task, not when you feel like it
- Before every merge: run `npm run dev` locally, confirm no red console errors, visually check your component renders correctly
- After a merge lands: the other engineer pulls `dev` at the **start of their next session** (before writing anything)
- Never force-push to `dev`
- Never push directly to `main` — `main` is demo-ready only

---

### PHASE 3 — Integration & Wiring (Day 4 evening / Day 5 morning)

| Task | Owner | Note |
|---|---|---|
| Confirm `AuthContext` exposes `user.plan` in the shape FE2 needs | **FE1** | FE2 reads `useAuth()` → `user.plan` inside FileUpload |
| Wire `usePollStatus` into `ProcessingView` | **FE2** | Polling starts after Squad redirect returns |
| Wire `api/verification.js` `initiatePayment()` into `PaymentGate` | **FE2** | Returns `paymentUrl` → redirect to Squad checkout |
| Confirm `VerificationRow` gets real data shape from history API | **FE1** | Check against Node.js `GET /verification/history` response |
| End-to-end smoke test: Register → PlanSelect → Verify → Pay → Poll → Result | **Both together** | Walk all 3 verdict states. Use seeded test data |
| Fix any broken states found in smoke test | **Both** | |
| Test on mobile viewport (375px width) in Chrome DevTools | **Both** | Verify, Result, Dashboard mobile views |
| Final merge `dev` → `main` | **FE1 (team lead)** | Only when smoke test passes cleanly |

---

### PHASE 4 — Demo Polish (Day 5 afternoon before presentation)

| Task | Owner |
|---|---|
| Seed one complete HIGH_RISK + one LIKELY_AUTHENTIC verification in DB for Dashboard table | Coordinate with FS dev |
| Rehearse full demo flow on production URL (not localhost) | Both |
| Confirm Squad sandbox payment goes through end-to-end | FE2 + FS |
| Confirm all 3 result states (Authentic, Suspicious, High Risk) can be reached | FE2 |
| Confirm `PlanBadge` updates live after plan change | FE1 |
| Confirm file count enforcement blocks correctly on Pro plan (try uploading 4 files) | FE2 |

---

## SECTION 11 — Conflict Prevention Rules

### Rule 1 — File Ownership is Absolute
If a file has your name on it from this document, only you write to it. The other person never opens it to edit — only to read.

### Rule 2 — Shared Files Need a Chat Message First
`ui/` components, `utils/constants.js`, `AuthContext.jsx`, `App.jsx` are shared. If you need to change any of these, send a message in the group chat first. Wait for acknowledgment before pushing.

### Rule 3 — Pull `dev` Every Single Morning
```bash
git checkout dev && git pull origin dev
git checkout feature/your-branch && git merge dev
```
This is non-negotiable. Skipping this is the #1 cause of merge conflicts.

### Rule 4 — No Hardcoded Colors or Strings in Components
Everything comes from `tailwind.config.js` or `utils/constants.js`. Never type `#006c4e` directly in JSX. Never hardcode `"PRO_MAX"` as a raw string in a component — import from constants.

### Rule 5 — Component Props are a Contract
If `FileUpload` reads `user.plan` via `useAuth()`, and FE1 changes what `useAuth()` returns, FE1 must notify FE2 before pushing. The prop/hook shape between engineers is a shared API.

### Rule 6 — Merge Daily, Not When "Done"
Don't wait for perfection. Merge what works every evening. Partial working code on `dev` is better than polished code that conflicts with 3 days of the other engineer's work.

### Rule 7 — Never Edit the Same File at the Same Time
If you're both working and both need to touch `App.jsx` at the same time — stop, coordinate, one person goes first and merges, the other pulls and continues.

---

## SECTION 12 — Demo Day Priority Order

If time is short, build in this exact sequence. Judges follow the happy path:

| Priority | Deliverable | Why Critical |
|---|---|---|
| 🔴 P1 — Must | Login + Register working | Cannot demo anything without auth |
| 🔴 P1 — Must | PlanSelect page → PATCH plan → Dashboard redirect | Proves Squad plan tier is wired |
| 🔴 P1 — Must | FileUpload → PaymentGate → Squad payment screen | Squad integration — disqualification risk if absent |
| 🔴 P1 — Must | ProcessingView with animated steps → polling | Shows the AI pipeline is real |
| 🔴 P1 — Must | Result page — LIKELY_AUTHENTIC state with TrustScoreRing + AnomalyList | Core product value on screen |
| 🟡 P2 — Should | Result page — HIGH_RISK state | Shows the AI detects fraud, not just approves |
| 🟡 P2 — Should | Dashboard with real verification history rows | Shows the product has a data layer |
| 🟡 P2 — Should | Mobile responsiveness on Verify + Result | Design shows both — judges notice |
| 🟡 P2 — Should | PlanBadge visible in Navbar | Reinforces Squad plan integration |
| 🟢 P3 — Nice | Landing page + Pricing page | Marketing — not demo-critical |
| 🟢 P3 — Nice | SUSPICIOUS result state | Third verdict state — nice to demo all three |
| 🟢 P3 — Nice | Report download working | Bonus polish |

---

## SECTION 13 — Final Count

| Category | FE1 | FE2 | Total |
|---|---|---|---|
| UI Primitives | 4 | 4 | 8 |
| Badge & Status | 2 | 4 | 6 |
| Verification Flow components | 1 | 4 | 5 |
| Result components | 0 | 6 | 6 |
| Dashboard components | 3 | 0 | 3 |
| Layout & Navigation | 5 | 1 | 6 |
| Pages | 7 | 2 | 9 |
| API files + hooks | 3 | 3 | 6 |
| Utils + config | 7 | 0 | 7 |
| **TOTAL** | **32** | **24** | **56** |
