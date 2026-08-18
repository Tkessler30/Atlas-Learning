# Atlas Learning v0.7.0 — Deep Learning Engine QA

## Core changes
- Daily lessons are staged guided instruction instead of a single overview card.
- 8-stage lesson sequence: orient → mechanism → deepen → worked example → guided practice → transfer/self-explanation → mastery check → sources.
- Worked example is hidden until the learner makes a first-step prediction.
- Guided practice requires an attempt before continuing.
- 30+ minute learners must self-explain before the mastery check.
- "I don't know yet" remains available.
- Lesson-stage progress and draft text persist locally during the day.
- Source registry covers every Atlas subject with global/official/research/open-education source families.
- Source panel distinguishes "sources used for this lesson" from a general trusted reference shelf.
- Source entries contain reuse/license cautions; web availability is never treated as permission to copy.
- AI requests now include target lesson minutes, depth profile, source requirement and trusted source domains.
- Automatic update behavior from v0.6.10 is retained.

## Validation
- app.js syntax PASS
- atlas-client.js syntax PASS
- core-lessons.js syntax PASS
- source-registry.js syntax PASS
- duplicate HTML IDs: 0
- source registry loaded before app.js
- all Atlas subjects have at least one trusted-source family
- deep lesson stage renderer present
- prediction-before-reveal present
- guided practice gate present
- self-explanation gate present
- lesson draft persistence present
- version manifest v0.7.0
