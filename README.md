# Complete Resume Builder Application

A production-ready web application for building professional resumes with AI assistance, live preview, and cloud synchronization.

🔗 **Live Demo:** [Insert Vercel Link Here]

---

## 🛠️ Tech Stack Used

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons), Inter (Google Font)
- **Database / Auth:** Supabase (PostgreSQL), Supabase Auth
- **AI Integration:** Google Gemini 1.5 Flash API
- **Export:** Browser Print API (PDF generation)
- **Deployment:** Vercel

---

## ⚙️ Setup Instructions

### Local Development

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key  # Optional
   ```

3. **Supabase Database Setup**
   Run the following schema in your Supabase SQL Editor to create the necessary tables and row-level security (RLS) policies:
   ```sql
   create table profiles (
     id uuid references auth.users(id) on delete cascade primary key,
     email text,
     is_premium boolean default false,
     created_at timestamptz default now()
   );

   create table resumes (
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

   create policy "Users manage their own resumes" on resumes for all using (auth.uid() = user_id);
   create policy "Users manage their own profile" on profiles for all using (auth.uid() = id);
   ```

4. **Start Dev Server**
   ```bash
   npm run dev
   ```

---

## ✨ Features Implemented

1. **Comprehensive Resume Editor:** Form sections for Personal Info, Summary, Experience, Education, Skills, Projects, and Certifications.
2. **Split-View Editing:** Live, real-time preview of the resume alongside the input form.
3. **Multiple Templates:** Instantly switch between Professional, Modern, and Executive (Premium) templates with visual thumbnails.
4. **AI Assistant:** Integration with Google Gemini to generate professional summaries, improve job descriptions, and suggest relevant skills based on job titles.
5. **Cloud Synchronization:** Secure user authentication (Email/Password) and PostgreSQL database storage via Supabase.
6. **Guest Mode:** Fully functional offline mode using `localStorage` for users who choose not to sign up.
7. **One-Click Export:** High-quality PDF generation directly from the browser.

---

## 🤔 Assumptions Made

1. **Premium Tier Simulation:** The payment gateway for "Premium" features (like the Executive template) is a simulated UI flow for demonstration purposes. No real monetary transactions occur.
2. **AI Fallback:** It is assumed the user might run the app without a Gemini API key. If the key is missing from `.env`, the app gracefully falls back to built-in mock AI responses so the feature can still be evaluated.
3. **Email Confirmation:** It is assumed that email confirmation in Supabase might be disabled for testing convenience. If enabled, the app's UI informs the user to check their inbox before logging in.
4. **PDF Generation Method:** Standard browser printing (`window.print()`) combined with CSS `@media print` rules provides the highest fidelity output for resumes compared to heavy client-side PDF libraries.
