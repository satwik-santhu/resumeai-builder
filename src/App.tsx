import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { Resume } from './types/resume';
import { supabase, isSupabaseConfigured } from './services/supabase';
import {
  fetchResumes,
  saveResume,
  deleteResume,
  fetchIsPremium,
  upgradeToPremium,
} from './services/resumeService';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import EditorPage from './components/EditorPage';
import TemplateSelector from './components/TemplateSelector';
import PreviewPage from './components/PreviewPage';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';

type View = 'landing' | 'dashboard' | 'editor' | 'template' | 'preview';

interface HistoryState {
  view: View;
  resumeId: string | null;
}

const createBlankResume = (): Resume => ({
  id: crypto.randomUUID(),
  name: 'Untitled Resume',
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedIn: '', github: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  templateId: 'professional',
  isPremium: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function App() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Data Loading ──────────────────────────────────────────────────────────
  const loadData = useCallback(async (): Promise<Resume[]> => {
    const [fetchedResumes, premiumStatus] = await Promise.all([fetchResumes(), fetchIsPremium()]);
    setResumes(fetchedResumes);
    setIsPremium(premiumStatus);
    return fetchedResumes;
  }, []);

  // ─── Browser History Navigation ────────────────────────────────────────────
  /**
   * Push (or replace) a view onto the browser history stack.
   * This is the ONLY way we change the view — so every transition creates
   * a history entry that the Back / Forward buttons can traverse.
   */
  const navigate = useCallback(
    (view: View, resume?: Resume | null, replace = false) => {
      const resumeId = resume !== undefined ? (resume?.id ?? null) : null;
      const state: HistoryState = { view, resumeId };
      const hash = `#${view}`;

      if (replace) {
        window.history.replaceState(state, '', hash);
      } else {
        window.history.pushState(state, '', hash);
      }

      setCurrentView(view);
      if (resume !== undefined) {
        setCurrentResume(resume);
      }
    },
    []
  );

  // Restore state when the user presses Back / Forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState | null;
      if (!state) {
        setCurrentView('landing');
        setCurrentResume(null);
        return;
      }
      setCurrentView(state.view);
      if (state.resumeId) {
        // Look up the resume in our current list
        setResumes(prev => {
          const found = prev.find(r => r.id === state.resumeId) ?? null;
          setCurrentResume(found);
          return prev;
        });
      } else {
        setCurrentResume(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ─── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      loadData();
      // Seed the initial history entry
      window.history.replaceState({ view: 'landing', resumeId: null } as HistoryState, '', '#landing');
      return;
    }

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null);
      loadData();
      setLoading(false);
      // Seed the initial history entry
      window.history.replaceState({ view: 'landing', resumeId: null } as HistoryState, '', '#landing');

      // If the user arrived via a Supabase email-confirmation link, open the
      // login modal automatically so they can sign in right away.
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
      const type = params.get('type');
      if ((type === 'signup' || type === 'recovery') && !data.session) {
        // Clean the URL so the tokens aren't visible
        window.history.replaceState({ view: 'landing', resumeId: null } as HistoryState, '', '#landing');
        setShowAuthModal(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        loadData();
      }
    );

    return () => subscription.unsubscribe();
  }, [loadData]);

  // ─── Resume actions ────────────────────────────────────────────────────────
  const createNewResume = () => {
    const blank = createBlankResume();
    setCurrentResume(blank);
    navigate('template', blank);
  };

  const handleTemplateSelect = (templateId: string) => {
    if (currentResume) {
      const updated = { ...currentResume, templateId, isPremium: templateId === 'executive' };
      setCurrentResume(updated);
      navigate('editor', updated);
    }
  };

  const handleSaveResume = async () => {
    if (!currentResume) return;
    await saveResume({ ...currentResume, updatedAt: new Date().toISOString() });
    await loadData();
    navigate('dashboard', null);
  };

  const handleEditResume = (id: string) => {
    const resume = resumes.find(r => r.id === id) ?? null;
    if (resume) navigate('editor', resume);
  };

  const handlePreviewResume = (id: string) => {
    const resume = resumes.find(r => r.id === id) ?? null;
    if (resume) navigate('preview', resume);
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    await deleteResume(id);
    await loadData();
  };

  // ─── Premium / Payment ─────────────────────────────────────────────────────
  const handleUpgradeClick = () => setShowPaymentModal(true);

  const handlePaymentSuccess = async () => {
    await upgradeToPremium();
    setIsPremium(true);
    setShowPaymentModal(false);
  };

  // ─── Auth ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    await loadData();
    navigate('dashboard', null, true);
  };

  const handleCancel = () => {
    navigate('dashboard', null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={() => navigate('dashboard')} />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          resumes={resumes}
          onCreateNew={createNewResume}
          onEdit={handleEditResume}
          onPreview={handlePreviewResume}
          onDelete={handleDeleteResume}
          user={user}
          onSignInClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'template' && currentResume && (
        <div className="min-h-screen bg-white py-10">
          <TemplateSelector
            selectedTemplate={currentResume.templateId}
            onSelect={handleTemplateSelect}
            isPremium={isPremium}
            onUpgradeClick={handleUpgradeClick}
          />
          <div className="text-center mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {currentView === 'editor' && currentResume && (
        <EditorPage
          resume={currentResume}
          onChange={setCurrentResume}
          onSave={handleSaveResume}
          onCancel={handleCancel}
          isPremium={isPremium}
          onUpgradeClick={handleUpgradeClick}
        />
      )}

      {currentView === 'preview' && currentResume && (
        <PreviewPage
          resume={currentResume}
          onBack={() => navigate('dashboard', null)}
          onEdit={() => navigate('editor', currentResume)}
        />
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

export default App;
