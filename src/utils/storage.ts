import { Resume } from '../types/resume';

const STORAGE_KEY = 'resumes';
const PREMIUM_KEY = 'isPremiumUser';

export const saveResume = (resume: Resume): void => {
  const resumes = getResumes();
  const index = resumes.findIndex(r => r.id === resume.id);

  if (index >= 0) {
    resumes[index] = resume;
  } else {
    resumes.push(resume);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

export const getResumes = (): Resume[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getResumeById = (id: string): Resume | undefined => {
  return getResumes().find(r => r.id === id);
};

export const deleteResume = (id: string): void => {
  const resumes = getResumes().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

export const isPremiumUser = (): boolean => {
  return localStorage.getItem(PREMIUM_KEY) === 'true';
};

export const upgradeToPremium = (): void => {
  localStorage.setItem(PREMIUM_KEY, 'true');
};
