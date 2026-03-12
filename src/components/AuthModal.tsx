import { useState } from 'react';
import { X, Mail, Lock, Loader2, UserPlus, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Mode = 'login' | 'signup';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail(''); setPassword(''); setError(''); setSuccess('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        // Create profile directly from frontend (backup in case DB trigger fails)
        if (data.user && data.session) {
          // Email confirmation is disabled — user is immediately active
          await supabase.from('profiles').upsert(
            { id: data.user.id, email: data.user.email },
            { onConflict: 'id' }
          );
          handleClose();
          onSuccess();
        } else {
          // Email confirmation is enabled — tell user to check inbox
          setSuccess('✉️ Confirmation email sent! Check your inbox and click the link, then come back and sign in.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email first — check your inbox for a confirmation link.');
          }
          throw signInError;
        }
        handleClose();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            {mode === 'login' ? <LogIn size={18} className="text-white" /> : <UserPlus size={18} className="text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? 'Access your resumes from anywhere' : 'Save your resumes to the cloud'}
            </p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
            <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</> : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Mode switch */}
        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-violet-400 hover:text-violet-300 font-semibold transition"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {/* Guest note */}
        <p className="text-xs text-gray-600 text-center mt-3">
          You can also continue as a guest — resumes are saved locally on this device.
        </p>
      </div>
    </div>
  );
}
