# v0.8.1 Assessment Intelligence QA

- Human Tutor Reset retained.
- v0.7.2 no-repeat assessment retained.
- Focus Mode retained.
- 60 MC items retain unique keys/prompts.
- Every MC item has exactly one plausible misconception, one mixed model, one near miss, one full model, plus UI IDK.
- Diagnostic pattern/code/meaning are persisted.
- Open-ended answers can be as short as `I don't know`; no verbosity requirement.
- Open-ended semantic analysis is silent during placement; no right/wrong feedback contaminates later responses.
- Cross-domain evidence is allowed only when demonstrated in the response.
- Assessment-state aggregation combines MC evidence with open-ended semantic evidence.
- Strongest-signal UI replaced with cautious evidence ranking.
- Existing completed assessments are backfilled from saved open responses without retaking placement.
- Data schema v3; live migration additive.
- Upgrade snapshots now include open reasoning evaluations and tutor history.
