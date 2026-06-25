# Deep Link Redirect Pages

Use this folder as a tiny static site for email-safe links that open your mobile app.

## Why this exists

Many email clients (especially Gmail) block direct custom scheme links like
`expensetracker://create`.

Instead, email should contain an HTTPS URL. That page then redirects to your app deep link.

## Included routes

- `https://<your-domain>/open/create` -> opens `expensetracker://create`
- `https://<your-domain>/open/reset-password?token=...` -> opens `expensetracker://reset-password?token=...`

## Configure values

Update these values in both HTML files:

- App deep link scheme: `expensetracker://...`
- Play Store fallback URL:
  `https://play.google.com/store/apps/details?id=com.expense_tracker`

## Deploy quickly

You can deploy this folder as a static site on Netlify or Vercel.

- Netlify:
  - Drag and drop the `deeplink-redirect` folder in Netlify dashboard
  - Or deploy from repo and set publish directory to `deeplink-redirect`

- Vercel:
  - Import the repo
  - Set Root Directory to `deeplink-redirect`
  - Framework preset: `Other`

## Email examples

- Create screen:
  `https://<your-domain>/open/create`
- Reset password:
  `https://<your-domain>/open/reset-password?token=<reset_token>`
