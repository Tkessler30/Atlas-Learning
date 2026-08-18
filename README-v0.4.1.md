# Atlas Learning v0.4.1 — Auth Reliability Fix

This patch removes the browser dependency on the externally hosted Supabase JavaScript library.

Files required:
- index.html
- styles.css
- atlas-client.js
- app.js

atlas-client.js is a small same-origin client used by Atlas to call Supabase Auth, PostgREST, and Edge Functions directly over HTTPS.

Why: Safari was rendering Atlas HTML/CSS but sometimes failing before app.js initialized because the external Supabase runtime did not load. v0.4.1 removes that critical CDN dependency.
