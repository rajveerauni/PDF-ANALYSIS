-- PDF Analyzer — Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── documents ───────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  file_type   text not null,  -- 'pdf' | 'docx' | 'txt'
  file_size   bigint not null,
  storage_path text not null,
  status      text not null default 'uploading',  -- uploading | parsing | analyzing | done | error
  page_count  int,
  char_count  int,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table public.documents enable row level security;
create policy "Users can manage own documents" on public.documents
  for all using (auth.uid() = user_id);

-- ─── insights ────────────────────────────────────────────────────────────────
create table if not exists public.insights (
  id                  uuid primary key default uuid_generate_v4(),
  document_id         uuid not null references public.documents(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  executive_summary   text,
  key_insights        jsonb,   -- string[]
  risks               jsonb,   -- string[]
  opportunities       jsonb,   -- string[]
  key_metrics         jsonb,   -- { label, value }[]
  recommendations     jsonb,   -- string[]
  confidence_score    int,     -- 0-100
  created_at          timestamptz default now() not null
);

alter table public.insights enable row level security;
create policy "Users can manage own insights" on public.insights
  for all using (auth.uid() = user_id);

-- ─── chats ───────────────────────────────────────────────────────────────────
create table if not exists public.chats (
  id          uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null,  -- 'user' | 'assistant'
  content     text not null,
  created_at  timestamptz default now() not null
);

alter table public.chats enable row level security;
create policy "Users can manage own chats" on public.chats
  for all using (auth.uid() = user_id);

-- ─── Storage bucket ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  20971520,  -- 20MB
  array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain']
) on conflict (id) do nothing;

create policy "Users can upload own documents" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own documents" on storage.objects
  for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own documents" on storage.objects
  for delete using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
