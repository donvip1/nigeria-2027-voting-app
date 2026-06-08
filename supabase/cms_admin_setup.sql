/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase CMS admin setup for controlled candidate editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added CMS admin table, RLS policies, candidate read/update permissions, and first admin email seed.
*********************************************************/

-- ========================================================
-- Extensions
-- ========================================================

create extension if not exists pgcrypto;

-- ========================================================
-- CMS admin allow-list table
-- ========================================================

create table if not exists public.cms_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.cms_admins enable row level security;

-- ========================================================
-- CMS admin allow-list policies
-- ========================================================

drop policy if exists "CMS admins can read own allow-list row" on public.cms_admins;
create policy "CMS admins can read own allow-list row"
on public.cms_admins for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

-- ========================================================
-- Candidate read and edit policies for CMS admins
-- ========================================================

drop policy if exists "CMS admins can read all candidates" on public.candidates;
create policy "CMS admins can read all candidates"
on public.candidates for select
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can update candidates" on public.candidates;
create policy "CMS admins can update candidates"
on public.candidates for update
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

grant select on public.cms_admins to authenticated;
grant select on public.candidates to authenticated;
grant update on public.candidates to authenticated;

-- ========================================================
-- First CMS admin
-- ========================================================

insert into public.cms_admins (email)
values ('veezee4us@gmail.com')
on conflict (email) do nothing;
