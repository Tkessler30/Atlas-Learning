# Atlas Assessment Standard — v0.8.1

## Multiple choice
Every item has four diagnostic answer models plus a separate IDK option.

- Plausible misconception: fundamentally wrong but cognitively believable.
- Mixed model: a meaningful piece is correct and a meaningful piece is wrong.
- Near miss: very close, with one important missing/incorrect distinction.
- Full model: complete enough for the difficulty being sampled.
- I don't know: no reliable model demonstrated; kept separate from misconception.

The four diagnostic options are shuffled per attempt. Atlas stores the selected pattern/code, not just right/wrong.

## Open ended
Open-ended placement responses are not graded as right/wrong. `atlas-tutor` reads the response to infer:
- knowledge actually demonstrated
- depth and mechanism reasoning
- partial models and missing distinctions
- possible misconceptions with uncertainty
- cross-domain knowledge demonstrated spontaneously
- goal signals when the prompt is aspirational

Verbose writing is not rewarded. Short, precise answers can be strong evidence.

## Strongest evidence
Atlas no longer automatically crowns the subject with the highest estimated ability. It combines depth, difficulty, confidence, open-ended evidence, later mastery, and direct evidence. Unless one field clearly separates with sufficient evidence, the UI shows the top few as `Strongest evidence so far`.

## Existing testers
Completed placement is never reset. v0.8.1 can silently analyze previously saved open-ended responses and update the evidence profile without requiring a retake.
