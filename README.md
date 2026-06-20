# DSA Pattern Tracker

A fast React + Express study dashboard for tracking 150 curated DSA problems, notes, streaks, and 1/7/14-day spaced-repetition reviews.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The tracker, notes, custom patterns, filters, and review schedule work without any credentials. Progress is stored in the browser.

## Google Calendar and Gmail

Create a Google OAuth **Web application** client and enable the Calendar API and Gmail API. Add these scopes to the consent screen:

- `calendar`
- `gmail.send`
- `userinfo.profile`
- `userinfo.email`

Add both your local origin (`http://localhost:3000`) and deployed HTTPS origin to **Authorized JavaScript origins**, then set:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
DEFAULT_REMINDER_EMAIL=you@example.com
```

No Google client secret is needed or accepted by this browser OAuth flow.

## Production

```bash
npm run lint
npm run build
set NODE_ENV=production&& npm start
```

The app includes a health endpoint at `/api/health`, immutable caching for fingerprinted assets, a multi-stage `Dockerfile`, and a `render.yaml` blueprint. On Render, connect the repository, apply the blueprint, and enter the two optional Google environment variables.

Settings and integration logs are currently held in server memory and reset when a deployment restarts. Per-user progress, notes, patterns, and streaks remain in that browser's local storage.
# Prepify
