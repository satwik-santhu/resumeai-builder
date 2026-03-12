/**
 * run-schema.mjs
 * Applies the Supabase schema using direct SQL via the Management API.
 * Run: node run-schema.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(join(__dirname, '.env'), 'utf8');
const env = Object.fromEntries(
  envText.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
console.log(`Project ref: ${projectRef}`);

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
  if not exists (select 1 from pg_policies where tablename='resumes' and policyname='Users can manage their own resumes') then
    execute 'create policy "Users can manage their own resumes" on resumes for all using (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can manage their own profile') then
    execute 'create policy "Users can manage their own profile" on profiles for all using (auth.uid() = id)';
  end if;
end $$;

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

create or replace function update_updated_at_column()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists update_resumes_updated_at on resumes;
create trigger update_resumes_updated_at
  before update on resumes for each row execute function update_updated_at_column();
`;

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
  },
  body: JSON.stringify({ query: SQL }),
});

if (res.ok) {
  const data = await res.json();
  console.log('✅ Schema applied!', data);
} else {
  const txt = await res.text();
  console.log(`\nHTTP ${res.status}: ${txt}`);
  console.log('\n──────────────────────────────────────────────');
  console.log('⚠️  Automatic setup requires Supabase Management API token.');
  console.log('\n📋 Please do this ONE-TIME manual step:');
  console.log('1. Open: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('2. Paste and run the SQL below:');
  console.log('──────────────────────────────────────────────');
  console.log(SQL);
  console.log('──────────────────────────────────────────────');
  console.log('\nThe app will work immediately after you run that SQL once!');
}
