# Atlas Learning v0.6.8 — Knowledge Map Insights QA

## Fixes in this patch

- Knowledge Map progress bars now represent **verified concepts / total concepts**.
- The numeric label and bar are therefore the same metric.
- Estimated frontier level remains visible as a separate placement estimate.
- Confidence is explicitly labeled as estimate confidence.
- Subject rows are real interactive buttons with mobile touch feedback.
- Tapping a subject opens personalized, dynamically calculated insights.
- Subject insights include:
  - verified knowledge,
  - estimated frontier,
  - direct evidence count,
  - due/repair needs,
  - prerequisite blockers,
  - unknown concepts,
  - highest verified concept,
  - a recommended next move and explanation.
- The recommended lesson button opens the selected concept in Frontier and loads real teaching content.
- The insight drawer scrolls into view on mobile.

## Product rule

Verified progress and estimated placement must never be visualized as if they are the same measurement.

## Validation

- app.js syntax: checked with Node
- atlas-client.js syntax: checked with Node
- duplicate HTML IDs: checked
- map bar formula: verifiedN / total
- map detail click handler: present
- personalized recommendation: computed from current mastery, confidence, retention, prerequisites and route readiness
