LIFERADAR — INSTALLATION GUIDE (THAI)

This is a static website. No Node server, database, or API key is required.

FILES
- index.html          app structure
- style.css           responsive visual style
- script.js           app behavior and local calculations
- manifest.webmanifest and sw.js  optional installable/offline shell support
- icon.svg            app icon

EASIEST DEPLOYMENT USING GITHUB + VERCEL
1. Create a NEW GitHub repository called liferadar-app. Do not replace the existing stocklens-app repository.
2. Upload the CONTENTS of this folder to the root of the new repository (not a nested LifeRadar-v1 folder).
3. In Vercel, Add New -> Project, import the liferadar-app GitHub repository.
4. Framework Preset: Other. Build command: leave empty. Output directory: leave empty or use the project root, per Vercel's screen. No environment variables are needed.
5. Deploy. On future updates, upload/commit changed files in GitHub and Vercel will redeploy automatically.

FIRST VISIT
The site starts with sample data so the dashboard is not empty. A banner identifies the data as sample data. Use "เริ่มใช้จริง" to clear the sample records and start with your own data. All buttons and forms are interactive.

FEATURES
- Log expenses and income; edit and delete entries.
- Record recurring subscriptions with amount, billing cycle, next charge date, and frequency of use.
- Calculate monthly equivalent and yearly cost for subscriptions.
- Estimate potential savings from items marked rarely used or unused. This is an estimate, not a recommendation to cancel automatically.
- Upcoming renewal list, spending category breakdown, budget pace estimate, daily check-in streak, JSON export/import, budget setting.
- Responsive desktop and mobile UI; installable PWA shell on supported HTTPS hosting.

PRIVACY & LIMITATIONS
- This version stores data in localStorage on the current browser/device. It does not sync across devices and does not connect to a bank.
- Export a JSON backup from Settings before clearing browser storage or moving devices.
- The monthly spending pace is a straight-line estimate based on logged transactions so far; it is not a forecast of actual future spending.
- Subscriptions marked rarely/never generate an opportunity estimate. Review terms, cancellation policies, and data access before cancelling anything.
- Since this static build does not use an AI API, it does not send private records to a third party.
