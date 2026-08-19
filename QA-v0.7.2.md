# Atlas Learning v0.7.2 — Assessment Reset QA

## Why this release exists
The old placement assessment reused the exact Round 1 question whenever a learner missed the item. It also treated multiple choice as one correct answer versus three throwaway wrong answers. That undermined placement quality.

## New assessment model
- 45 questions are still asked, but the bank now contains 60 unique multiple-choice items:
  - 15 Round 1 diagnostic items
  - 15 easier/prerequisite follow-ups
  - 15 harder/stretch follow-ups
  - 15 broad Round 3 items
- Round 2 never repeats the Round 1 prompt.
- A Round 1 response showing misconception/emerging understanding gets a different foundation/prerequisite question.
- A Round 1 response showing solid/nuanced understanding gets a different stretch question.
- Each answer option carries diagnostic depth:
  - misconception = 0
  - emerging = 1
  - solid = 2
  - nuanced = 3
  - I don't know = separate unknown signal
- Options are deterministically shuffled per learner/attempt so the strongest answer is not always in the same position.
- `selected_answer` stores stable option IDs, so review/resume preserves the same meaning even after shuffling.
- Checkpoints no longer display “matched the answer key.”
- Placement estimation uses partial-credit depth plus item difficulty rather than binary correct/incorrect alone.
- Legacy in-progress responses still work; old correct answers map to depth 3 and old wrong answers to depth 0 if diagnostic fields are absent.

## Database
Live Supabase migration added:
- `diagnostic_score`
- `diagnostic_level`
- `max_diagnostic_score`

## Product rule
The assessment learns from every response. It never waits for a learner to finally answer a question correctly.

## QA
- app.js syntax PASS
- atlas-client.js syntax PASS
- core-lessons.js syntax PASS
- source-registry.js syntax PASS
- duplicate HTML IDs: 0
- 60 bank items have unique keys
- 60 bank items have unique normalized prompts
- every item has at least one depth-3 option
- every item has at least one lower-depth option
- Round 1 and both Round 2 branches have different keys/prompts for every subject
- auto-update system retained
- Focus Mode retained
