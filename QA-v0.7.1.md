# Atlas Learning v0.7.1 — Focus Mode QA

## Goal
Reduce cognitive and visual clutter during learning.

## Changes
- Mobile lessons now use a full-screen focus workspace; the Today page and navigation do not visually compete behind the lesson.
- Removed the prominent content-provider banner from the lesson.
- Removed "GUIDED LESSON · ~N MIN" from inside the lesson.
- Removed the repeated "each step is roughly 1 minute" line.
- Removed numbered stage eyebrow labels.
- Stage names are short human language: Start here, Learn the idea, Build on it, See an example, Try it, Use it, Quick check.
- Progress is reduced to a thin line and compact `1/7` indicator.
- Sources are no longer a forced lesson stage. They live behind a quiet Sources button.
- This also eliminates the old inaccessible Step 8 source-screen bug.
- Nested bordered cards are flattened inside the lesson.
- The real-life scenario is presented as simple reading rather than a large callout card.
- Navigation is a simple sticky Back / Continue footer.
- Exposure language is simplified and internal evidence terminology is removed from the learner-facing screen.

## Important
This release is a visual/cognitive clutter reduction. It does not yet implement the full Human Tutor Reset discussed for adaptive prerequisite branching and tutor-evaluated free responses.

## Validation
- app.js syntax PASS
- atlas-client.js syntax PASS
- core-lessons.js syntax PASS
- source-registry.js syntax PASS
- duplicate HTML IDs: 0
- version manifest: v0.7.1
- mobile full-screen focus CSS present
- Sources panel accessible from header
- old Step 8 source stage removed
