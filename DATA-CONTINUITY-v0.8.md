# Atlas v0.8 Data Continuity Contract

## Product rule
A frontend release must not make an existing learner repeat onboarding, placement, or completed learning.

## Durable source of truth
Supabase is the durable source of truth for learner state. Browser localStorage is only a fast/offline-adjacent copy for in-progress UI state.

## Upgrade behavior
On the first authenticated boot of a new app version:

1. Load the existing profile.
2. If `last_seen_app_version` differs from the running version, call `snapshot_current_user_state`.
3. Snapshot profile, placement estimates/responses, mastery, progress, study sessions, misconceptions, modality data, and interests.
4. Only after the snapshot succeeds, mark the new version as seen.
5. Never erase or recreate learner rows because an app version changed.
6. `placement_complete`, not `placement_version`, determines whether placement is required.

## Stable progress keys
Daily progress is now keyed by date, not release number:
`daily_learning_YYYY-MM-DD`

Atlas still reads legacy `v067` and `v066` progress records so active testers are migrated forward without resets.

Lesson drafts now use a version-independent key and can import the earlier v0.7 draft key.

## Tutor continuity
`tutor_sessions` stores the active concept, comprehension stage, and current tutor state.
`tutor_turns` stores the tutoring interaction history.

If Atlas refreshes during a lesson because a new website build is deployed, reopening that lesson resumes the active tutor session instead of starting at screen one.

## Database migration rule going forward
- Prefer additive schema changes.
- Never drop/rename learner-data columns in the same release that introduces their replacements.
- Backfill first, read old + new, then retire old fields only after a measured migration period.
- Snapshot before data-schema transitions.
- Keep UI/app version separate from data-schema version.
