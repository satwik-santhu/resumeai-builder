# ResumeAI — AI-Powered Resume Builder

A **production-ready Resume Builder** with Google Gemini AI assistance, multiple professional templates, real-time preview, PDF export, **Supabase cloud storage**, and email authentication.

🔗 **Live Demo:** _Deploy to Vercel (see setup below)_

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 📝 Full Resume Editor | Personal info, Summary, Experience, Education, Skills, Projects, Certifications |
| 🎨 3 Templates | Professional (free), Modern (free), Executive (premium) |
| ✏️ Split-View Editor | Form + live preview side-by-side |
| 🤖 Google Gemini AI | Generate summaries, improve descriptions, suggest skills |
| 📄 PDF Export | One-click download |
| ☁️ Supabase Cloud Sync | Resumes saved to database when signed in |
| 🔐 Auth | Email/password login via Supabase Auth |
| 💾 Offline/Guest Mode | LocalStorage fallback when not signed in |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Inter Google Font |
| Cloud DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| AI | Google Gemini 1.5 Flash |
| PDF | Browser Print API |
| Backend | Node.js + Express (optional, see `/backend`) |

---

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx        # Hero landing page
│   │   ├── Dashboard.tsx          # Resume list + auth header
│   │   ├── EditorPage.tsx         # Split-view editor
│   │   ├── ResumeForm.tsx         # Tabbed resume form
│   │   ├── TemplateSelector.tsx   # Visual template picker
│   │   ├── PreviewPage.tsx        # Full preview + PDF download
│   │   ├── AuthModal.tsx          # Login / Sign Up modal
│   │   ├── PaymentModal.tsx       # Simulated premium upgrade
│   │   └── templates/
│   │       ├── ProfessionalTemplate.tsx
│   │       ├── ModernTemplate.tsx
│   │       └── ExecutiveTemplate.tsx
│   ├── services/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── resumeService.ts       # CRUD (Supabase + localStorage fallback)
│   │   └── geminiApi.ts           # Google Gemini AI
│   ├── types/resume.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── aiAssistant.ts         # Mock AI fallback
│   │   ├── pdfGenerator.ts        # PDF export
│   │   └── storage.ts             # localStorage helpers
│   └── App.tsx                    # Root with Supabase auth listener
├── backend/                       # Optional Node.js API
│   ├── server.js
│   ├── models/
│   ├── controllers/
│   └── routes/
├── .env                           # Environment variables
└── README.md
```

---

## ⚙️ Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables

Create/edit `.env` in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key   # optional
```

### 3. Set up Supabase database

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard)
2. Run the SQL from the **Database Schema** section below
3. In **Authentication → Settings**, disable email confirmation for easier testing (optional)

### 4. Run the app
```bash
npm run dev
```
Open **http://localhost:5173**

---

## 🗄️ Database Schema

Run this SQL once in [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new):

```sql
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
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

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
```

---

## 🔐 Supabase Auth — Email Confirmation

By default Supabase requires email confirmation. You have two options:

**Option A — Disable confirmation (easier for development/demo):**
> Supabase Dashboard → Authentication → Settings → **Disable "Enable email confirmations"**

**Option B — Keep confirmation enabled:**
> The app already handles this — after signup it shows _"Check your inbox and click the link, then come back and sign in."_

To set a custom redirect URL after email confirmation (for Vercel deployment):
> Authentication → URL Configuration → **Site URL** = `https://your-app.vercel.app`
> **Redirect URLs** = `https://your-app.vercel.app/**`

---

## 🚀 Deploying to Vercel

1. Push code to GitHub (see below)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
3. Set **Framework Preset** to **Vite**
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY` (optional)
5. Click **Deploy**

After deploying, update Supabase:
- **Authentication → URL Configuration → Site URL** = your Vercel URL
- **Redirect URLs** = `https://your-app.vercel.app/**`

---

## 🤖 Google Gemini AI Setup

1. Go to [aistudio.google.com](https://aistudio.google.com) → **Get API Key**
2. Add to `.env`: `VITE_GEMINI_API_KEY=your_key`

> Without a key, AI features use built-in mock responses. The app is fully functional without it.

---

## 📌 Notes

- **Premium templates** — Simulated upgrade. No real payment is processed.
- **Guest mode** — Works fully without signing in. Resumes are saved to browser localStorage.
- **PDF export** — Uses the browser print dialog. Print → **Save as PDF**.
