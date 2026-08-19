-- Applied to live Supabase on 2026-08-18.
-- Additive only: no tester records are dropped or rewritten.
alter table public.profiles add column if not exists last_seen_app_version text;
alter table public.profiles add column if not exists data_schema_version integer not null default 1;

-- Recovery snapshots before app-version transitions.
create table if not exists public.user_state_snapshots (...);

-- Durable Human Tutor state.
create table if not exists public.tutor_sessions (...);
create table if not exists public.tutor_turns (...);

-- Live database also includes RPC:
-- snapshot_current_user_state(reason, app_version, data_schema_version)
