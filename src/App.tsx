import { useState, useEffect } from 'react';
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

  // ─── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      loadData();
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null);
      loadData();
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        loadData();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    const [resumes, premium] = await Promise.all([fetchResumes(), fetchIsPremium()]);
    setResumes(resumes);
    setIsPremium(premium);
  };

  // ─── Resume actions ────────────────────────────────────────────────────────
  const createNewResume = () => {
    setCurrentResume(createBlankResume());
    setCurrentView('template');
  };

  const handleTemplateSelect = (templateId: string) => {
    if (currentResume) {
      setCurrentResume({ ...currentResume, templateId, isPremium: templateId === 'executive' });
      setCurrentView('editor');
    }
  };

  const handleSaveResume = async () => {
    if (!currentResume) return;
    await saveResume({ ...currentResume, updatedAt: new Date().toISOString() });
    await loadData();
    setCurrentView('dashboard');
    setCurrentResume(null);
  };

  const handleEditResume = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) { setCurrentResume(resume); setCurrentView('editor'); }
  };

  const handlePreviewResume = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) { setCurrentResume(resume); setCurrentView('preview'); }
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
    await loadData(); // reload guest resumes
  };

  const handleCancel = () => {
    setCurrentView('dashboard');
    setCurrentResume(null);
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
        <LandingPage onGetStarted={() => setCurrentView('dashboard')} />
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
          onBack={() => setCurrentView('dashboard')}
          onEdit={() => setCurrentView('editor')}
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
