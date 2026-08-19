# Atlas Learning v0.8.2 — Recovery QA

This is a regression-recovery release after v0.8.1.

## Confirmed v0.8.1 regression
`renderAll()` was accidentally removed during the assessment-intelligence merge. That left the static page shells visible while Knowledge Map and Deep Dive were never populated.

## Fixes
- Restored `renderAll()`.
- Added runtime recovery checks: if subjects load but Knowledge Map or Deep Dive remain empty, Atlas shows a real error instead of silently shipping an empty screen.
- Added a teaching-provider readiness probe.
- When live personalized generation is unavailable, Today routes only to Atlas Core content instead of selecting a lesson that will dead-end.
- Deep Dive selects a teachable Core concept when live generation is unavailable.
- Failed generated lessons can fall back to another Core lesson in the same subject.
- Removed the internal provider-configuration language from the normal learner path.

## Core curriculum safety net
Atlas Core now contains at least one foundational lesson in every active subject.
This includes `trades_mechanical_construction_drawings`, so the exact lesson shown as unavailable in tester feedback now has real instructional content.

## Retained
- v0.8.1 assessment intelligence
- four diagnostic mental-model choices + IDK
- open-ended semantic reasoning analysis
- v0.8 Human Tutor
- learner snapshots/data continuity
- stable daily progress
- resumable tutor sessions
- automatic browser update

## QA gates
- `app.js` syntax PASS
- `atlas-client.js` syntax PASS
- `core-lessons.js` syntax PASS
- `source-registry.js` syntax PASS
- duplicate HTML IDs: 0
- `renderAll()` exists exactly once
- Knowledge Map is included in `renderAll()`
- Deep Dive is included in `renderAll()`
- provider readiness check occurs before `renderAll()`
- all 35 active subjects have at least one known foundational Core lesson target
- Construction Drawings Core lesson exists
- v0.8.1 assessment diagnostic storage retained
