-- ============================================================
-- UGCFire.ai — Creator Network SQL Migration
-- Run this in your Supabase SQL Editor
-- These tables are optional; the UI works with demo fallback data.
-- ============================================================

-- ── creator_profiles ─────────────────────────────────────────────────────────
create table if not exists creator_profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text unique not null,
  display_name        text not null,
  avatar_url          text,
  bio                 text default '',
  specialties         text[] default '{}',
  available_for_work  boolean default false,
  featured            boolean default false,
  followers           integer default 0,
  projects_count      integer default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table creator_profiles enable row level security;

-- Public read access
create policy "creator_profiles_public_read"
  on creator_profiles for select using (true);

-- Creator can update their own profile
create policy "creator_profiles_self_update"
  on creator_profiles for update using (auth.uid() = id);

-- Creator can insert their own profile
create policy "creator_profiles_self_insert"
  on creator_profiles for insert with check (auth.uid() = id);


-- ── creator_projects ─────────────────────────────────────────────────────────
create table if not exists creator_projects (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid not null references creator_profiles(id) on delete cascade,
  title           text not null,
  description     text default '',
  thumbnail_url   text,
  media_url       text,
  media_type      text check (media_type in ('video', 'image')) default 'video',
  tags            text[] default '{}',
  likes           integer default 0,
  views           integer default 0,
  published       boolean default false,
  created_at      timestamptz default now()
);

alter table creator_projects enable row level security;

create policy "creator_projects_public_read"
  on creator_projects for select using (published = true);

create policy "creator_projects_self_all"
  on creator_projects for all using (auth.uid() = creator_id);


-- ── creator_saves ────────────────────────────────────────────────────────────
-- Admins saving creators they like
create table if not exists creator_saves (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid not null references auth.users(id) on delete cascade,
  creator_id   uuid not null references creator_profiles(id) on delete cascade,
  note         text default '',
  created_at   timestamptz default now(),
  unique (admin_id, creator_id)
);

alter table creator_saves enable row level security;

create policy "creator_saves_admin_only"
  on creator_saves for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ── creator_invites ──────────────────────────────────────────────────────────
create table if not exists creator_invites (
  id              uuid primary key default gen_random_uuid(),
  admin_id        uuid not null references auth.users(id),
  creator_id      uuid not null references creator_profiles(id),
  project_brief   text not null,
  budget_range    text default '',
  status          text check (status in ('Pending', 'Accepted', 'Declined')) default 'Pending',
  created_at      timestamptz default now()
);

alter table creator_invites enable row level security;

create policy "creator_invites_admin_send"
  on creator_invites for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "creator_invites_creator_read"
  on creator_invites for select using (
    auth.uid() = creator_id
    or exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "creator_invites_creator_respond"
  on creator_invites for update using (auth.uid() = creator_id);


-- ── community_posts ──────────────────────────────────────────────────────────
create table if not exists community_posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references auth.users(id) on delete cascade,
  category      text check (category in ('Feature Request', 'Bug Report', 'Idea', 'General')) not null,
  title         text not null,
  body          text default '',
  upvotes       integer default 0,
  comment_count integer default 0,
  status        text check (status in ('Under Review', 'Planned', 'Building', 'Launched')) default null,
  created_at    timestamptz default now()
);

alter table community_posts enable row level security;

create policy "community_posts_public_read"
  on community_posts for select using (true);

create policy "community_posts_auth_insert"
  on community_posts for insert with check (auth.uid() = author_id);

create policy "community_posts_self_update"
  on community_posts for update using (auth.uid() = author_id);


-- ── community_comments ───────────────────────────────────────────────────────
create table if not exists community_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references community_posts(id) on delete cascade,
  author_id   uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz default now()
);

alter table community_comments enable row level security;

create policy "community_comments_public_read"
  on community_comments for select using (true);

create policy "community_comments_auth_insert"
  on community_comments for insert with check (auth.uid() = author_id);


-- ── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists creator_profiles_username_idx on creator_profiles (username);
create index if not exists creator_profiles_afw_idx on creator_profiles (available_for_work);
create index if not exists creator_projects_creator_idx on creator_projects (creator_id);
create index if not exists community_posts_created_idx on community_posts (created_at desc);
