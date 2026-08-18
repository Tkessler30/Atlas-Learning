# Atlas Learning v0.4 — Polymath Engine

v0.4 moves Atlas toward an adaptive knowledge system rather than a fixed course.

Highlights:
- Broad polymath taxonomy sourced from Supabase
- HVAC removed from the general product and replaced by Trades, Construction & Mechanical Systems
- Adaptive 45-question placement scan + five open-ended reasoning prompts
- Pause/save every 15 multiple-choice questions
- Ability and confidence tracked separately
- Knowledge Portfolio and compounding forecast
- Interactive daily learning deposit
- Adaptive Frontier page
- Supabase Edge Function `atlas-ai-content`
- AI provider-ready architecture with a built-in $0 fallback engine

Important: a ChatGPT subscription cannot be used by a website as an API credential. To enable automatic OpenAI-generated content, configure an OPENAI_API_KEY secret for the Supabase Edge Function. Until then, the Edge Function returns adaptive fallback content so testing remains free.
