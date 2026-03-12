import { supabase, isSupabaseConfigured } from './supabase';
import { Resume } from '../types/resume';

/* ─── Helpers: convert between Supabase DB row ↔ frontend Resume type ─────── */

const toResume = (row: any): Resume => ({
  id: row.id,
  name: row.name,
  personalInfo: row.personal_info ?? {},
  summary: row.summary ?? '',
  experience: row.experience ?? [],
  education: row.education ?? [],
  skills: row.skills ?? [],
  projects: row.projects ?? [],
  certifications: row.certifications ?? [],
  templateId: row.template_id ?? 'professional',
  isPremium: row.is_premium ?? false,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toRow = (resume: Resume, userId: string) => ({
  id: resume.id,
  user_id: userId,
  name: resume.name,
  personal_info: resume.personalInfo,
  summary: resume.summary,
  experience: resume.experience,
  education: resume.education,
  skills: resume.skills,
  projects: resume.projects ?? [],
  certifications: resume.certifications ?? [],
  template_id: resume.templateId,
  is_premium: resume.isPremium,
});

/* ─── localStorage fallback (used when not signed in) ─────────────────────── */
const LS_KEY = 'resumes_guest';
const lsGet = (): Resume[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
};
const lsSave = (resumes: Resume[]) => localStorage.setItem(LS_KEY, JSON.stringify(resumes));

/* ─── Public API ────────────────────────────────────────────────────────────── */

/**
 * Fetch all resumes for the current signed-in user.
 * Falls back to localStorage for guests.
 */
export async function fetchResumes(): Promise<Resume[]> {
  if (!isSupabaseConfigured) return lsGet();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return lsGet();

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) { console.error('fetchResumes error:', error); return lsGet(); }
  return (data ?? []).map(toResume);
}

/**
 * Save (upsert) a resume.
 * Inserts if new, updates if existing.
 */
export async function saveResume(resume: Resume): Promise<void> {
  if (!isSupabaseConfigured) {
    const all = lsGet();
    const idx = all.findIndex(r => r.id === resume.id);
    if (idx >= 0) all[idx] = resume; else all.push(resume);
    lsSave(all);
    return;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    // Guest fallback
    const all = lsGet();
    const idx = all.findIndex(r => r.id === resume.id);
    if (idx >= 0) all[idx] = resume; else all.push(resume);
    lsSave(all);
    return;
  }

  const userId = sessionData.session.user.id;
  const row = toRow(resume, userId);

  const { error } = await supabase.from('resumes').upsert(row, { onConflict: 'id' });
  if (error) console.error('saveResume error:', error);
}

/**
 * Delete a resume by id.
 */
export async function deleteResume(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    lsSave(lsGet().filter(r => r.id !== id));
    return;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    lsSave(lsGet().filter(r => r.id !== id));
    return;
  }

  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) console.error('deleteResume error:', error);
}

/* ─── Premium status (stored in profiles table) ─────────────────────────────── */

export async function fetchIsPremium(): Promise<boolean> {
  if (!isSupabaseConfigured) return localStorage.getItem('isPremiumUser') === 'true';

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return localStorage.getItem('isPremiumUser') === 'true';

  const { data } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', sessionData.session.user.id)
    .single();

  return data?.is_premium ?? false;
}

export async function upgradeToPremium(): Promise<void> {
  localStorage.setItem('isPremiumUser', 'true'); // always set locally too

  if (!isSupabaseConfigured) return;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return;

  await supabase
    .from('profiles')
    .update({ is_premium: true })
    .eq('id', sessionData.session.user.id);
}
