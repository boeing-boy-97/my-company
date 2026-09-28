-- =============================================================
-- Kiln Technology Studio — PostgreSQL schema
-- Target: Supabase (Postgres 15+)
-- This is the production data model. In this workspace the app
-- runs on a file-backed store (lib/store.ts) that mirrors this
-- schema 1:1, so swapping to Supabase is a repository-layer
-- change, not a rewrite. See README.md → "Going to production".
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- users / auth ----------
create table users (
  id            uuid primary key default gen_random_uuid(),
  email         citext unique not null,
  password_hash text not null,
  role          text not null check (role in ('admin','client')) default 'client',
  full_name     text,
  status        text not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index users_role_idx on users (role);

-- ---------- clients ----------
create table clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references users(id) on delete set null,
  company       text not null,
  contact_name  text,
  email         text,
  phone         text,
  country       text,
  currency      text check (currency in ('USD','INR','EUR','GBP','AED')),
  notes         text,
  status        text not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- leads (project intake, contact forms, AI consultant) ----------
create table leads (
  id                uuid primary key default gen_random_uuid(),
  reference         text unique not null,
  source            text not null default 'website-form',
  kind              text not null default 'project-brief',
  project_types     text[] not null default '{}',
  objective         text,
  existing_assets   text[] not null default '{}',
  timeline          text,
  budget_range      text,
  currency          text,
  company_name      text,
  website           text,
  industry          text,
  country           text,
  contact_name      text,
  email             text,
  phone             text,
  whatsapp          text,
  preferred_channel text,
  consultant_log    jsonb,
  status            text not null default 'new'
                    check (status in ('new','contacted','qualified','proposal','won','lost')),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index leads_status_idx on leads (status);
create index leads_created_idx on leads (created_at desc);

-- ---------- projects ----------
create table projects (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id),
  name        text not null,
  summary     text,
  status      text not null default 'discovery'
              check (status in ('discovery','design','build','qa','live','paused','complete')),
  progress    int not null default 0,
  started_at  date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index projects_client_idx on projects (client_id);

create table project_milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  title       text not null,
  detail      text,
  status      text not null default 'pending' check (status in ('done','active','pending')),
  progress    int not null default 0,
  due_date    date,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index milestones_project_idx on project_milestones (project_id);

create table project_messages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  author_role text not null check (author_role in ('client','studio')),
  author_name text,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index messages_project_idx on project_messages (project_id, created_at desc);

create table project_files (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  name        text not null,
  path        text not null,        -- storage object key
  mime        text,
  size_bytes  bigint,
  uploaded_by text,
  created_at  timestamptz not null default now()
);
create index files_project_idx on project_files (project_id);

-- ---------- marketing / CMS ----------
create table services (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  summary     text not null,
  body        jsonb not null default '[]',
  status      text not null default 'published',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table industries (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  problems    text[] not null default '{}',
  solutions   text[] not null default '{}',
  systems     text[] not null default '{}',
  status      text not null default 'published',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table case_studies (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  client      text not null,
  industry    text,
  category    text,
  year        text,
  summary     text,
  stack       text[] not null default '{}',
  sections    jsonb not null default '[]',
  metrics     jsonb not null default '[]',
  status      text not null default 'draft' check (status in ('draft','published')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table blog_categories (
  id    uuid primary key default gen_random_uuid(),
  slug  text unique not null,
  name  text not null
);

create table blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  category_id  uuid references blog_categories(id),
  author       text,
  published_at date,
  body         jsonb not null default '[]',
  status       text not null default 'draft' check (status in ('draft','published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index posts_category_idx on blog_posts (category_id);

create table team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  bio        text,
  photo_url  text,
  is_placeholder boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id         uuid primary key default gen_random_uuid(),
  quote      text not null,
  person     text,
  role       text,
  company    text,
  is_placeholder boolean not null default true,
  status     text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table jobs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  location    text,
  type        text,
  summary     text,
  description jsonb not null default '[]',
  status      text not null default 'open' check (status in ('open','closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table applications (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid references jobs(id),
  name       text not null,
  email      text not null,
  resume_key text,            -- storage object key (validated upload)
  portfolio  text,
  github     text,
  linkedin   text,
  message    text,
  status     text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  topic      text,
  message    text not null,
  status     text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array[
    'users','clients','leads','projects','project_milestones','services',
    'industries','case_studies','blog_posts','team_members','testimonials','jobs','applications'
  ] loop
    execute format('create trigger %I before update on %I for each row execute function touch_updated_at()',
      t || '_touch', t);
  end loop;
end $$;

-- ---------- row level security ----------
alter table leads enable row level security;
alter table projects enable row level security;
alter table project_milestones enable row level security;
alter table project_messages enable row level security;
alter table project_files enable row level security;

-- Policies are provisioned per-deployment:
--  * admins  → full access
--  * clients → read/write scoped to their own client_id / project_id
