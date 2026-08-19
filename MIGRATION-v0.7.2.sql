-- Already applied to the live Supabase project for v0.7.2.
alter table public.placement_responses
  add column if not exists diagnostic_score numeric,
  add column if not exists diagnostic_level text,
  add column if not exists max_diagnostic_score numeric default 3;
