LIFERADAR — PERSONAL FINANCE DASHBOARD
LifeRadar 2.1 — quick capture, arrival nudges and refined interactions

OVERVIEW
LifeRadar is a clean, responsive personal-finance dashboard for tracking cash flow, transactions, recurring payments, category budgets and saving goals. The interface uses a consistent icon system rather than context-free emoji. It is designed to feel calm, legible and practical on desktop and mobile.

FILES
- index.html              App structure and forms
- style.css               Responsive design system
- script.js               Transactions, recurring items, budgets, goals, charts and local storage
- icon.svg                App icon
- manifest.webmanifest    Optional installable web app manifest
- sw.js                   Optional app-shell cache for HTTPS hosting

RUN LOCALLY
Open index.html in a modern browser for a quick preview. For reliable localStorage behavior and the installable app shell, use VS Code Live Server or deploy on HTTPS (for example, Vercel). Google Fonts require an internet connection; the interface falls back to system fonts when offline. All app features use browser localStorage and require no API key or database.

DEPLOY WITH GITHUB + VERCEL
1. Upload the CONTENTS of this folder to the repository root (do not upload the parent folder as a nested folder).
2. Import the repository into Vercel with Framework Preset set to Other.
3. No build command or environment variables are required for the static site.
4. After deploying, use Settings > Download backup to save a JSON backup before clearing browser storage or moving devices.

FEATURES
- Add, edit, search, filter and delete income and expense records.
- Quick capture is embedded directly on the home screen: choose income/expense, type an amount, tap a preset amount, and optionally choose a category or title.
- A calm once-per-day arrival notice surfaces the most useful reminder (near-term recurring bill, budget pace, or underused subscription); it is non-blocking.
- Success and warning toasts use distinct, restrained accent colors and subtle motion.
- Keyboard shortcut N focuses the home-screen quick amount field when the Overview page is active.
- Monthly cash flow, 6-month trend and category breakdown.
- Recurring payments with billing cycles, next charge dates, usage notes and a review estimate for rarely/never-used services.
- Monthly budget plus category-specific budget limits.
- Saving goals with progress tracking and contributions.
- Daily brief, upcoming-payment overview, spending-pace estimate and insights from recorded data.
- JSON backup and restore, clear-all control, responsive navigation and mobile-friendly forms.

DATA AND PRIVACY
All information is stored in localStorage in the current browser/device. This build does not connect to a bank account, send transaction records to a server, or sync data across devices. Browser storage can be cleared by the browser or device; back up important records regularly. The initial view contains sample data to demonstrate charts and features. Use “เริ่มใช้จริง” to clear the sample dataset. The redesign keeps the existing `liferadar.v1` localStorage key and normalizes the older transaction/subscription structure, so existing records in the same browser should remain available. If the app is still in its marked demo state, the first quick-entry save clears only the demo dataset before saving the real entry. Download a JSON backup before updating as a precaution.

NOTES
- Financial totals and estimates use the records you enter and may be incomplete if entries are missing.
- Potential subscription savings are estimates based on the usage level you selected, not an instruction to cancel a service.
- The spending-pace figure is a straight-line estimate from month-to-date spending, not a guaranteed forecast.
