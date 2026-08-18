# Atlas Learning v0.6.9 — Deep Dive Alignment QA

## Product decision
- "Frontier" remains an internal learner-model concept.
- "Deep Dive" is the user-facing feature for intentionally going deeper.
- There is no separate hidden "deep dive daily mode" competing with the Deep Dive tab.

## Changes
- Main navigation label changed from Frontier → Deep Dive.
- Deep Dive explains that it operates at the learner's adaptive frontier.
- Learners can choose a subject from a dropdown.
- Atlas selects the best next concept within that selected subject.
- Teach this / Push harder / Apply it in the real world all use that subject/context.
- Today's optional depth button opens the same Deep Dive tab.
- Knowledge Map "next move" lessons route into Deep Dive.
- Discovery "turn this into a lesson" routes into Deep Dive.
- Balanced Today remains the default breadth path.
- Deep Dive is optional depth and does not silently create a second daily planner.

## Validation
- app.js syntax checked
- atlas-client.js syntax checked
- core-lessons.js syntax checked
- HTML duplicate IDs checked
- Deep Dive subject selector present
- Today → Deep Dive route present
- Map → Deep Dive route present
- Discovery → Deep Dive route present
