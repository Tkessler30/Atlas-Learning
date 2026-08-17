# Atlas Learning MVP

A mobile-first adaptive learning dashboard prototype.

## Included
- Local multi-profile login (device-local MVP)
- Adjustable study time (10 min/day to 2 hours/day)
- Forecasts based on weekly/annual deliberate-learning hours
- Knowledge map with 0–5 mastery scores
- Initial curriculum units across reasoning, math, science, history, geography, computing, economics, HVAC, and business
- Short quizzes that update mastery and progress
- Exportable progress JSON
- Mobile responsive design

## Run
Open `index.html` in a modern browser. For best behavior, serve the folder with a simple local web server, e.g.:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Data model / migration path
The MVP uses `localStorage` so it is free and runnable immediately. The UI and curriculum model are intentionally separated from the persistence layer. A later version can replace localStorage with Supabase (free tier) for real email/password accounts and cross-device sync.

## Forecast assumptions
Current prototype planning constants:
- ~320 deliberate hours: broad working competence target
- ~720 deliberate hours: broad competence plus meaningful depth target

These are intentionally planning estimates rather than guarantees. A production version should update forecasts using each learner's measured quiz performance, retention, review success, and learning velocity.
