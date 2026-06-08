/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Supabase CMS admin setup for controlled candidate and poll editing.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-08
 Modification Notes:    Added CMS admin table, RLS policies, candidate and poll read/update permissions, candidate asset storage, and first admin email seed.
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
-- Poll read and edit policies for CMS admins
-- ========================================================

drop policy if exists "CMS admins can read all polls" on public.polls;
create policy "CMS admins can read all polls"
on public.polls for select
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can update polls" on public.polls;
create policy "CMS admins can update polls"
on public.polls for update
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

drop policy if exists "CMS admins can read all poll options" on public.poll_options;
create policy "CMS admins can read all poll options"
on public.poll_options for select
to authenticated
using (
  exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

drop policy if exists "CMS admins can update poll options" on public.poll_options;
create policy "CMS admins can update poll options"
on public.poll_options for update
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

grant select on public.polls to authenticated;
grant update on public.polls to authenticated;
grant select on public.poll_options to authenticated;
grant update on public.poll_options to authenticated;

-- ========================================================
-- Candidate asset storage bucket
-- ========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'candidate-assets',
  'candidate-assets',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ========================================================
-- Candidate asset storage policies
-- ========================================================

drop policy if exists "Public can read candidate assets" on storage.objects;
create policy "Public can read candidate assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'candidate-assets');

drop policy if exists "CMS admins can upload candidate assets" on storage.objects;
create policy "CMS admins can upload candidate assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'candidate-assets'
  and exists (
    select 1
    from public.cms_admins
    where lower(cms_admins.email) = lower(auth.jwt() ->> 'email')
  )
);

-- ========================================================
-- First CMS admin
-- ========================================================

insert into public.cms_admins (email)
values ('veezee4us@gmail.com')
on conflict (email) do nothing;
