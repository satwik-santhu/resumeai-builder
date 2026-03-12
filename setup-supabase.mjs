/**
 * setup-supabase.mjs
 * 
 * Run this script ONCE to create the Supabase tables and policies.
 * Usage:
 *   node setup-supabase.mjs
 * 
 * It reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually (no dotenv needed in modern Node)
const envPath = join(__dirname, '.env');
const envText = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envText.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=');
      return [key.trim(), rest.join('=').trim()];
    })
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── SQL Schema ───────────────────────────────────────────────────────────────
const SQL = `
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  is_premium boolean default false,
  created_at timestamptz default now()
);

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Untitled Resume',
  personal_info jsonb default '{}',
  summary text default '',
  experience jsonb default '[]',
  education jsonb default '[]',
  skills jsonb default '[]',
  projects jsonb default '[]',
  certifications jsonb default '[]',
  template_id text default 'professional',
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table resumes enable row level security;
alter table profiles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='resumes' and policyname='Users can manage their own resumes'
  ) then
    execute 'create policy "Users can manage their own resumes" on resumes for all using (auth.uid() = user_id)';
  end if;
  if not exists (
    select 1 from pg_policies where tablename='profiles' and policyname='Users can manage their own profile'
  ) then
    execute 'create policy "Users can manage their own profile" on profiles for all using (auth.uid() = id)';
  end if;
end $$;

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_resumes_updated_at on resumes;
create trigger update_resumes_updated_at
  before update on resumes
  for each row execute function update_updated_at_column();
`;

async function setup() {
  console.log('🔗 Connecting to Supabase at', SUPABASE_URL);
  console.log('⚙️  Running schema setup...\n');

  const { error } = await supabase.rpc('exec_sql', { sql: SQL }).single().catch(() => {
    return { error: { message: 'rpc/exec_sql not available' } };
  });

  if (error) {
    // exec_sql RPC not available – show manual instructions
    console.log('ℹ️  Could not run SQL automatically (requires service role key).');
    console.log('\n📋 MANUAL SETUP: Copy the SQL below and paste it into your Supabase SQL Editor:');
    console.log('   → https://supabase.com/dashboard/project/lmjevsljhexarrcwvupo/sql/new\n');
    console.log('─'.repeat(70));
    console.log(SQL);
    console.log('─'.repeat(70));
    console.log('\n✅ After running the SQL once, restart "npm run dev" and the app will use Supabase!');
  } else {
    console.log('✅ Schema created successfully!');
  }
}

setup();
