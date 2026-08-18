# Atlas v0.6.5 — Teaching Overhaul QA

## Release purpose

v0.6.5 addresses the real-device failure in which Atlas asked repeated questions and displayed generic teaching placeholders without transferring knowledge.

## Root cause confirmed from live data

The v0.6.4 learning objects shown on the device were stored with provider `atlas_fallback` and the note `AI provider unavailable; fallback content cannot create verified mastery.` That exact fallback generated the generic Fiscal Policy and Gene Expression cards. Cached fallback objects were removed from the live database after Edge Function v4 was deployed.

## Required teaching behavior

- Daily learning blocks teach before checking understanding.
- Retrieval is only scheduled for concepts Atlas previously taught with non-fallback content.
- The first learning sessions cannot be dominated by review/placement probes.
- A completed daily session remains complete for that local day.
- Generic `atlas_fallback` content is never presented as a lesson.
- Content without a validated quiz is exposure only, not verified quiz mastery.
- Connections name the shared mechanism, explain it, state its limit, and say why it helps.
- A failed lesson provider must produce an honest unavailable state, not an assessment disguised as learning.

## Bundled curriculum verification

- 17 authored lesson objects are bundled in `core-lessons.js`.
- All 12 routable Economics concepts are represented.
- Additional authored lessons cover Accounting Equation, Balance Sheet, Gene Expression, Claims & Evidence, and Correlation vs Causation.
- Every bundled lesson has key terms, substantive explanatory content, a worked example, a connection, common mistakes, a takeaway, guided practice, and a four-option concept-specific check.

## Static checks completed

- `node --check app.js`: PASS.
- `node --check core-lessons.js`: PASS.
- 129 HTML IDs checked; duplicate IDs: 0.
- `core-lessons.js` loads before `app.js`: PASS.
- All 12 Economics lesson keys present: PASS.
- v0.6.5 finite-session completion flag present: PASS.
- Old “clear progress and immediately choose another plan” completion path absent: PASS.
- Daily progress restore is actually called during app load: PASS.
- Review routing is gated by `atlasTaughtConcept`: PASS.
- Fallback lesson UI is blocked with `LESSON NOT AVAILABLE`: PASS.
- First-session review/bridge conversion to learning: PASS.

## Live backend checks completed

- `atlas-ai-content` Edge Function version 4 deployed ACTIVE with `verify_jwt=true`.
- Live v0.6.4 fallback learning objects were queried and confirmed before cleanup.
- All `provider='atlas_fallback'` learning objects were deleted; follow-up count returned 0.

## What is not claimed yet

- The v0.6.5 frontend has not yet been exercised through GitHub Pages with a real signed-in device session.
- The personalized AI provider is not currently confirmed active. The v0.6.4 records demonstrate that the function took its no-provider fallback path. The bundled curriculum and open-resource fallback allow teaching to continue, but full dynamic personalized coverage across the entire graph requires the provider secret to be configured.
- Open-resource fallback is factual background, not equivalent to a fully authored Atlas lesson.

## Final deployment test

After uploading this exact build to GitHub Pages:

1. Sign in with a tester account.
2. Open Fiscal Policy via Frontier → Teach me.
3. Confirm the lesson contains actual explanation, key terms, worked example, precise inflation/unemployment connection, common mistakes, takeaway, guided practice, and then a hidden quick check.
4. Complete a fresh 30-minute Today session and confirm it stops after its planned blocks.
5. Reload and confirm the session state persists.
