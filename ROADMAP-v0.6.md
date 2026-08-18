# Atlas Learning v0.6.5 — 40-item acceptance roadmap

The v0.6.4 device test changed the meaning of **Built**. A code path existing is not enough. For this roadmap:

- **Built** = implemented and statically/backend-checked.
- **Built; device validation needed** = implemented but must be confirmed in the deployed real-device flow.
- **Provider-dependent** = implementation exists but its full behavior depends on the personalized AI provider being configured.
- **Starter coverage** = architecture works, but curriculum/media coverage still needs expansion.

1. **Built — Visible build/version number.**
2. **Built — Better first-login/post-assessment learner snapshot.**
3. **Built — Richer drill-down Knowledge Map.**
4. **Built — Explain every recommendation with route reasons.**
5. **Built; tune with testers — Adaptive pacing from performance, retention, confidence, difficulty, transfer, and history.**
6. **Built; tune with testers — Persistent misconception tracking.**
7. **Built; tune with testers — Difficulty calibration and map probes.**
8. **Reworked in v0.6.5 — Daily allocation is learning-first; retrieval only follows prior Atlas teaching, and the first sessions avoid review/probe domination.**
9. **Built / provider-dependent — Personalized generator receives mistakes, strengths, interests, mastery, prerequisites, retention, and history when the provider is active.**
10. **Built; tune with testers — Teaching-style adaptation from modality outcomes.**
11. **Built / starter coverage — Lesson objects can include visual causal sequences; content coverage still needs expansion.**
12. **Infrastructure + starter coverage — Curated media table and lesson media surfacing; catalog still needs expansion.**
13. **Provider-dependent — Personalized modalities can include case, analogy, worked example, scenario, mini-debate, prediction, troubleshooting, numerical problem, teach-back, and visual model.**
14. **Reworked in v0.6.5 — Teach me must serve actual instructional content; 17 authored core lessons are bundled, including the full Economics ladder. Dynamic coverage is provider-dependent.**
15. **Built / provider-dependent — Real-world transfer challenge mode refuses generic fallback challenges.**
16. **Built / provider-dependent — Cross-domain bridges require a real shared-mechanism explanation; same-subject pseudo-bridges are rejected.**
17. **Built — Connection history stored and shown.**
18. **Built; tune with testers — Assessment is not the final label; Map Probes can refine the model later.**
19. **Built — Unknown, weak, provisional, developing, verified, and retention-due are distinct states.**
20. **Built; tune with testers — Adaptive retention intervals / forgetting-rate model.**
21. **Built — Knowledge decay / retention-due visualization.**
22. **Built — Stronger Weekly Knowledge Statement.**
23. **Built — Monthly Knowledge Statement.**
24. **Built; tune with testers — Evidence/milestone-based celebrations.**
25. **Built; tune with testers — Healthy streak with grace-day logic.**
26. **Built — Intellectual milestone storage and display.**
27. **Built — Personal Curiosity Queue.**
28. **Built / provider-dependent — Finite Discovery refuses generic fake connections when the provider is unavailable.**
29. **Built — Feedback links to concept, route, provider, difficulty, and learning object.**
30. **Built — Learning-object and outcome telemetry support quality analysis.**
31. **Strengthened in v0.6.5 — Generic fallback cannot masquerade as teaching or create verified mastery; unvalidated OER is exposure only.**
32. **Built — Stable/current distinction and freshness rules in content engine.**
33. **Provider-dependent — Current-world mode uses live search only when the sourced provider is available; otherwise it refuses fresh claims.**
34. **Built; device validation needed — Cache/prefetch and nonessential background writes reduce perceived lag.**
35. **Built; device validation needed — Mobile layout/navigation polish.**
36. **Built — Search Your Knowledge with common-language aliases.**
37. **Built / provider-dependent — Ask Atlas Anything receives prerequisite context and can fall back to authored/OER stable background.**
38. **Built — Knowledge Map exploration with concept status and prerequisites.**
39. **Built — Persistent learner-history model across events, mastery, misconceptions, modalities, connections, retention, and learning objects.**
40. **Built — Admin-gated tester analytics RPC/UI; admin membership still must be configured for cross-user analytics.**

## Curriculum acceptance rule added in v0.6.5

Atlas is not considered a teaching product merely because it can route, assess, or generate prompts. A normal lesson must contain enough subject matter for the learner to leave knowing something they did not know before. See `TEACHING-CONTENT.md`.

## Immediate next acceptance milestone

The v0.6.5 deployed real-device test must demonstrate a complete cycle in which a learner opens Atlas, receives substantive teaching, completes guided practice and a content-specific check, finishes the planned session, and can accurately state something newly learned. If that does not happen, the build is not accepted regardless of how many backend features are technically working.
