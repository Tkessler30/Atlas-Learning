# Atlas Learning v0.6.10 — Automatic Update / Cache QA

## Purpose
Keep the permanent public URL clean while preventing Safari and other browsers from remaining on stale Atlas builds after GitHub Pages deployments.

## Behavior
- The canonical URL remains `https://tkessler30.github.io/Atlas-Learning/`.
- Runtime assets are versioned in `index.html`:
  - `styles.css?v=0.6.10`
  - `atlas-client.js?v=0.6.10`
  - `core-lessons.js?v=0.6.10`
  - `app.js?v=0.6.10`
- `version.json` is fetched with a unique query string and `cache: no-store`.
- Atlas checks for a newer deployed version:
  - before login/app boot,
  - whenever the tab/app returns to the foreground,
  - every 5 minutes while open.
- If a newer build is detected, Atlas navigates once to a unique cache-busting URL.
- After the fresh build loads, Atlas removes the temporary `v` and `atlas_refresh` query parameters with `history.replaceState`, leaving the clean URL in the address bar.
- A failed update check never blocks normal Atlas use.

## Important rollout note
v0.6.10 is the first build containing the automatic update detector. Once a device has loaded v0.6.10 at least once, future Atlas deployments can self-refresh from the clean canonical URL.

## Validation
- JavaScript syntax checks pass.
- HTML has no duplicate IDs.
- Static build badge/footer are v0.6.10.
- All four runtime asset URLs are versioned.
- `version.json` exists and reports v0.6.10.
- Update check executes before auth boot.
- Foreground and 5-minute update checks are present.
- Temporary refresh parameters are cleaned without an additional reload.
