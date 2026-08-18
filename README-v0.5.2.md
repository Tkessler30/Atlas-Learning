# Atlas Learning v0.5.2 — 200-Hour Pacing Release

Built against the expanded live graph: 388 total concepts, 351 routable skills, 398 prerequisite links.

Key changes:
- Concept-level pacing uses levels, prerequisites, placement confidence, and demonstrated mastery.
- One correct answer cannot unlock the next concept. A concept must have stronger evidence (mastery >= 65 plus confidence >= 42 / at least two evidence points) before satisfying prerequisites.
- Low-confidence placement results are uncertainty, not automatic weakness.
- Map Probes test uncertain domains at a calibrated level without first showing the answer.
- Failed evidence lowers the inferred frontier; successful verified evidence raises it.
- High-performing users accelerate faster without forcing average learners into advanced content.
- The Knowledge Map reports a demonstrated frontier and confidence rather than inflating a whole subject from one good concept.
- The AI engine receives concept-level difficulty and route purpose: Retain, Gap, Probe, Frontier, or Bridge.

- Fallback AI content is never allowed to create verified mastery. Generic fallback quick checks are capped below the prerequisite-verification threshold, and fallback diagnostic probes do not change concept mastery at all.
