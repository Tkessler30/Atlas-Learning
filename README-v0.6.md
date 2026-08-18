# Atlas Learning v0.6.4 — Flow QA

Major learner-intelligence release built on the 388-concept graph.

Highlights: persistent misconception model, modality-performance adaptation, dynamic session allocation, adaptive retention, richer concept map, post-assessment learner snapshot, Teach Atlas, real-world transfer, Search Your Knowledge, Ask Atlas, Curiosity Queue, visual learning objects, curated media support, connection history, milestones/streaks, weekly/monthly knowledge statements, content-linked feedback, AI-quality telemetry, current-world mode, caching/prefetch, and admin-gated tester analytics.

See `ROADMAP-v0.6.md` for the full 40-item acceptance checklist.

## Final synthetic QA

The final routing engine was exercised against 10 synthetic learner archetypes from early-high-school through high-performing adult polymath profiles for 400 thirty-minute sessions each (200 equivalent hours).

After the final pacing tune, over-challenge rates were kept below the 12% release threshold for every profile tested, under-challenge remained below 1.2%, and no learner spent more than ~30% of simulated activity in one subject. The two largest pre-release issues — Medicine over-concentration for the health specialist and excessive stretch for the software-engineer profile — were corrected with recent-subject saturation balancing and recent-performance Frontier backoff.

This is synthetic code-path QA, not evidence of real educational outcomes. Modality weights, streak feel, session fragmentation, content quality, and mobile ergonomics still require real tester data.

## Release notes

- Supabase migrations `atlas_v06_learner_intelligence` and `atlas_v06_retention_media_analytics` are live.
- `atlas-ai-content` Edge Function v3 is ACTIVE with JWT verification.
- Curated-media infrastructure is live with a starter catalog; it is not yet a comprehensive media library.
- Tester analytics are admin-gated; an Atlas admin must be explicitly enrolled before cross-user analytics are visible.


## v0.6.4 flow audit

This build includes the consolidated flow/reliability fixes found during the final product audit:

- Exact assessment checkpoint/back/resume state and open-response draft autosave.
- Immediate answer-selection feedback with double-submit protection.
- “I don’t know” throughout assessment and adaptive checks.
- Learning-first flow before non-diagnostic checks.
- Frontier button wiring and visible loading/error states.
- Discovery renderer, purpose, finite behavior, no-mastery integrity, lesson handoff, and curiosity save.
- Account page, recovery email, password change, and schedule editing.
- Duplicate Weekly/Forecast DOM ID fixed.
- Live Supabase permissions corrected for v0.6 learner-history tables.
- Concept mastery scale corrected to 0–100 and `evidence` source allowed.
- Idempotent mastery evidence saves and safer retry behavior.
- Core mastery saves are required before a task counts complete; background telemetry no longer blocks the UI.
- Prefetch deduplication and bounded history loads.
- Search/Teach Atlas common-language concept aliases.
- Time-adaptive session shape: 10 min=2 blocks, 15=3, 30=4, 45–60=5, 90–120=6.
- Today summary now describes the actual allocation.
- RLS hot-path cleanup and assessment/evidence indexes.

### Automated UI smoke results

Authenticated mocked-browser flow passed: Today, Weekly, Portfolio, Knowledge Map, Frontier, Discovery, Explore, Insights, Forecast, Account, Feedback, Frontier content, IDK, Ask Atlas, Teach Atlas, real-world challenge, recovery, learning-before-check, and mobile-width rendering. Zero page/console errors in the success path.

Assessment mocked-browser flow passed: assessment/calculator/lookup guidance, IDK, immediate answer feedback with an artificial 700 ms network delay, Back, saved-answer editing, checkpoint review, exact checkpoint resume, and Round 2 transition. Zero page/console errors.

Failure-mode test passed: a forced mastery-save failure kept the modal open and the session at 0/4; a successful retry then advanced it to 1/4.
