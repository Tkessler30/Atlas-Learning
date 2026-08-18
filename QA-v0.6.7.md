# Atlas v0.6.7 — Coherent Learning Arc QA

## Purpose
Rebuild the daily session around one coherent learning arc instead of independently ranked tasks.

## Key behavior
- 30-minute default: two teaching lessons plus one integrated real-world application.
- 60-minute default: three teaching lessons, integrated application, and a related review when due.
- Cross-domain lessons are paired only when Atlas has a concrete real-world scenario connecting the fields.
- Otherwise the session stays in one subject long enough to form a pattern.
- Breadth is optimized across days/weeks rather than by random switching inside one session.
- New learners begin slightly below the estimated frontier before Atlas pushes upward.
- 30+ minute lessons require a short make-it-stick reflection before the quick check.
- Optional Deep Dive converts the daily plan into one-subject depth without changing the permanent learner goal.
- Session summaries use an idempotent session_key and automatic retry; completed teaching does not reopen just because totals failed to sync.

## Time targets
- 5 min: one compact lesson.
- 10–20 min: one lesson + application when time allows.
- 30 min: two lessons + integrated application (~25–35 active min target).
- 60 min: three lessons + application + related review if due.
- 90+ min: four lessons + application + related review if due.

## Validation
- JavaScript syntax checks must pass.
- HTML IDs must be unique.
- 30-minute session must contain exactly two lessons plus synthesis in baseline design.
- Cross-domain selection requires an explicit ARC_PAIRS template.
- Synthesis does not create fake mastery evidence.
- Failed session-summary sync still marks the daily session complete and queues an automatic retry.
