-- ============================================================
-- Proposo Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company_name text,
  company_logo_url text,
  brand_color text not null default '#2563eb',
  stripe_customer_id text unique,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'business', 'enterprise')),
  credits_remaining integer not null default 3,
  credits_used_this_month integer not null default 0,
  billing_cycle_start timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Clients
-- ============================================================
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text not null,
  company text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_clients_user_id on public.clients(user_id);

-- ============================================================
-- Proposals
-- ============================================================
create table public.proposals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  share_id text unique not null,
  content jsonb not null default '{}'::jsonb,
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz
);

create index idx_proposals_user_id on public.proposals(user_id);
create index idx_proposals_share_id on public.proposals(share_id);
create index idx_proposals_status on public.proposals(status);
create index idx_proposals_client_id on public.proposals(client_id);

-- ============================================================
-- Proposal Views (Analytics)
-- ============================================================
create table public.proposal_views (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid references public.proposals(id) on delete cascade not null,
  viewer_ip text,
  viewer_email text,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_proposal_views_proposal_id on public.proposal_views(proposal_id);

-- ============================================================
-- Updated_at trigger
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_clients_updated_at
  before update on public.clients
  for each row execute procedure public.update_updated_at();

create trigger update_proposals_updated_at
  before update on public.proposals
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- Profiles: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Clients: users can only CRUD their own clients
alter table public.clients enable row level security;

create policy "Users can view own clients"
  on public.clients for select
  using (auth.uid() = user_id);

create policy "Users can create own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

create policy "Users can update own clients"
  on public.clients for update
  using (auth.uid() = user_id);

create policy "Users can delete own clients"
  on public.clients for delete
  using (auth.uid() = user_id);

-- Proposals: users can CRUD their own proposals
alter table public.proposals enable row level security;

create policy "Users can view own proposals"
  on public.proposals for select
  using (auth.uid() = user_id);

create policy "Users can create own proposals"
  on public.proposals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own proposals"
  on public.proposals for update
  using (auth.uid() = user_id);

create policy "Users can delete own proposals"
  on public.proposals for delete
  using (auth.uid() = user_id);

-- Public access to proposals via share_id (for client portal)
create policy "Anyone can view shared proposals"
  on public.proposals for select
  using (share_id is not null);

-- Proposal views: users can view analytics for their proposals
alter table public.proposal_views enable row level security;

create policy "Users can view analytics for own proposals"
  on public.proposal_views for select
  using (
    exists (
      select 1 from public.proposals
      where proposals.id = proposal_views.proposal_id
      and proposals.user_id = auth.uid()
    )
  );

-- Anyone can insert views (for tracking)
create policy "Anyone can create proposal views"
  on public.proposal_views for insert
  with check (true);
