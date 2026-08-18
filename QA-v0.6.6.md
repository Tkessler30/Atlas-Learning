# Atlas Learning v0.6.6 QA

## Today / guided session
- 30-minute profiles receive 2 focused teaching blocks by default.
- One Start/Continue button controls the daily session.
- The route preview is informational rather than a set of independent assessment buttons.
- Planner prefers the same subject for the second micro-lesson, with at most a tightly justified second subject.
- Explicit `learning_goal` biases routing; interests, gaps, frontier, and breadth remain active.

## Streak
- Current streak is derived from completed study sessions on load instead of relying only on a mutable counter.
- Today displays a dedicated streak card and tells the learner exactly what action extends the streak.
- Session completion syncs streak after the completed session is reloaded.

## Teaching coverage added
- Chemistry: States of Matter, Thermochemistry
- AI: Machine Learning Basics, Training vs Inference
- Biology: Cell Structure

## Regression checks
- JavaScript syntax checked.
- HTML IDs checked for uniqueness.
- Start session button, goal fields, streak renderer, and guided-session state are all wired.
