# Atlas v0.6.4 QA Acceptance Notes

- JavaScript syntax: PASS (`app.js`, `atlas-client.js`)
- Duplicate HTML IDs: PASS (none)
- Main-tab browser smoke: PASS (11/11)
- Frontier actions: PASS
- Discovery flow: PASS
- Explore / Ask / Teach / Real-world: PASS
- Account + recovery UI: PASS
- Assessment Back/IDK/checkpoint/resume: PASS
- Artificial 700 ms assessment save: selected state visible before save completes (~90 ms observation in headless test)
- Forced core evidence-save failure: PASS (not counted; retry required)
- Time-adaptive block count: PASS (10→2, 15→3, 30→4, 60→5, 90→6)
- Live Supabase Edge Function: v3 ACTIVE
- Live runtime table grants: corrected
- Concept mastery constraint: corrected to 0–100
- `record_learning_evidence`: authenticated-only, idempotent source key
- Direct `recompute_concept_mastery`: not executable by client roles

Remaining deployment QA: after uploading v0.6.4 to GitHub Pages, perform one real-account smoke to validate browser + live Supabase together.
