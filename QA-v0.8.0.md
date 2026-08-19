# Atlas Learning v0.8.0 — Human Tutor Reset QA

## Human learning changes
- Removed the rigid fixed-stage lesson sequence from normal lessons.
- Lesson content is broken into small cognitive chunks; long sentences are split further.
- One screen focuses on one mental move.
- Concrete worked-example setup is used before formal abstraction when available.
- Technical terms are introduced as separate micro-beats rather than dumped in a glossary.
- Learners can say `Not yet` or `I have no idea` throughout instruction.
- Those signals trigger an actual repair branch instead of advancing.
- `atlas-tutor` Edge Function provides a simpler explanation/example when the AI provider is available.
- A second `Still not clear` signal asks for an even simpler repair.
- Free-response practice is evaluated semantically by the tutor service when available.
- If semantic evaluation is unavailable, Atlas says so and falls back to a concrete check; it does not pretend a character count proves understanding.
- A wrong lesson quick-check does not finish the lesson. Atlas repairs and retries.
- `I don't know yet` during learning triggers teaching, not a penalty.
- Transfer/free-response practice is withheld for the least-established learner band; foundations come first.
- Sources remain available but quiet.

## Data continuity changes
- v0.8 data schema = 2.
- Live Supabase migration is additive.
- New `user_state_snapshots`, `tutor_sessions`, `tutor_turns`.
- Before a learner crosses to a new app version, Atlas creates a recovery snapshot.
- App version changes never force placement retakes.
- `placement_complete` is the durable gate.
- Daily progress key no longer contains an app version.
- Legacy v0.6.6/v0.6.7 daily progress remains readable.
- Lesson draft key no longer contains an app version.
- v0.7 lesson draft remains readable.
- Active tutoring is stored in Supabase and resumes after refresh/update.
- Existing assessment, mastery, sessions, streaks, interests, misconceptions, and learning evidence are preserved.

## Backend
- `atlas-tutor` v1 deployed ACTIVE with JWT verification.
- Live snapshot/data-continuity migration applied before packaging.

## Regression checks
- JavaScript syntax PASS
- duplicate HTML IDs = 0
- v0.7.2 assessment reset retained
- v0.7.1 focus-mode mobile treatment retained
- automatic update system retained
