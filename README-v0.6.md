# Atlas Learning v0.6.5 — Teaching Overhaul

## Why this build exists

Real-device testing of v0.6.4 exposed a core product failure: Atlas could look like a learning app while serving assessment prompts and generic teaching placeholders instead of actual instruction.

The live `learning_objects` records confirmed that the affected lessons were being served by `atlas_fallback`. The fallback text told the learner to "focus on the mechanism," "use a concrete case," or "compare" ideas without actually explaining the subject. That is not acceptable teaching content.

v0.6.5 changes the contract of the product: **Atlas must teach before it tests.**

## The new learning loop

For normal Gap / Frontier / lesson work:

1. State a concrete learning objective.
2. Define the key terms.
3. Teach the actual subject matter and causal/mechanical explanation.
4. Walk through a worked example.
5. Explain any real connection precisely, including where the analogy breaks.
6. Identify common mistakes.
7. Give a concise takeaway.
8. Give guided practice.
9. Only then reveal a short content-specific understanding check.
10. Give answer-specific feedback.
11. Schedule retrieval later, only after Atlas actually taught the concept.

A generic prompt is no longer considered a lesson. If Atlas cannot obtain real instructional material, the UI says the lesson is unavailable rather than disguising a placeholder as instruction.

## Concrete curriculum included in the frontend

`core-lessons.js` contains 17 authored lessons that work even when the personalized AI provider is unavailable.

### Complete Economics ladder (12 / 12 routable Economics skills)

- Scarcity & Opportunity Cost
- Supply & Demand
- Elasticity
- Market Structures
- Externalities & Public Goods
- Labor Markets
- Money & Banking
- Inflation & Unemployment
- Fiscal Policy
- Monetary Policy
- International Trade
- Economic Growth

### Additional authored foundations

- Accounting Equation
- Balance Sheet
- Gene Expression
- Claims & Evidence
- Correlation vs Causation

Each authored lesson contains substantive explanation, key terms, a worked example, a structured connection, common mistakes, a takeaway, guided practice, and a content-specific quiz with feedback.

## Personalized / unseeded content

The live Supabase Edge Function `atlas-ai-content` is version 4. Its lesson prompt now enforces a real-teaching schema instead of accepting generic pedagogy. If the personalized provider is unavailable, the function tries a clearly attributed open-educational background source for unseeded concepts. Such material is recorded as exposure only unless it has a validated concept-specific check.

The v0.6.4 real-device session showed that the live function was taking its no-provider fallback path. Full personalized generation across all ~351 routable concepts therefore still requires the OpenAI API secret to be configured in Supabase. v0.6.5 does not hide that infrastructure state from the learner.

## Daily-session changes

- A first learning session is now dominated by actual lessons, not retrieval or map probes.
- Retrieval is eligible only for a concept Atlas previously taught with non-fallback content.
- A completed daily session stays complete for the local day.
- Finishing 4 / 4 no longer silently creates another daily assessment/plan.
- Daily progress is restored on reload; v0.6.4 had a restore function that was not actually called.
- The v0.6.5 daily progress key is versioned so a tester does not inherit a broken v0.6.4 plan.
- Normal lesson blocks show the lesson before the quiz. The quiz is hidden until the learner chooses **I learned this — check my understanding**.
- “I don’t know yet” remains available to prevent forced guessing.

## Connection changes

“Why this connects” must now explain:

- the exact shared mechanism;
- how that mechanism works in the target concept;
- where the analogy or connection breaks;
- why the connection helps the learner reason.

Same-subject fallback connections such as “connect Economics to Fiscal Policy” are no longer treated as cross-domain bridges.

## Live backend changes already applied

- `atlas-ai-content` Edge Function v4 is ACTIVE with JWT verification.
- Generic `atlas_fallback` learning objects cached from v0.6.4 were deleted from the live database.
- v4 refuses to create a generic diagnostic probe, Discovery connection, current-world explanation, or transfer challenge when the appropriate provider is unavailable.
- v4 includes concrete built-in lessons for several high-use concepts and can return open educational background for unseeded stable topics.

## Files

- `index.html`
- `styles.css`
- `atlas-client.js`
- `core-lessons.js`
- `app.js`
- `QA-v0.6.5.md`
- `ROADMAP-v0.6.md`

## Deployment acceptance test

After this exact frontend is uploaded to GitHub Pages, use a real signed-in tester account and verify:

1. Open **Frontier → Teach me** on Fiscal Policy. It should begin with real definitions/explanation and the $40B infrastructure worked example, not “focus on the mechanism.”
2. Start Today. A first 30-minute session should contain learning blocks and teach before checking.
3. Complete all four blocks. Today must remain **Session complete** rather than generating another plan.
4. Reload the page. Today’s completion/progress must still be present.
5. Open a lesson that is not in `core-lessons.js`. Atlas may serve attributed open educational material, but must not show a generic pseudo-lesson.
