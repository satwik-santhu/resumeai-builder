import { FileText, Plus, Trash2, Eye, Edit2, Clock, Star, LogIn, LogOut, Cloud, HardDrive } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Resume } from '../types/resume';

interface DashboardProps {
  resumes: Resume[];
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
  user: User | null;
  onSignInClick: () => void;
  onLogout: () => void;
}

const TEMPLATE_GRADIENTS: Record<string, string> = {
  professional: 'from-slate-600 to-slate-800',
  modern: 'from-indigo-600 to-slate-800',
  executive: 'from-amber-600 to-amber-900',
};

export default function Dashboard({ resumes, onCreateNew, onEdit, onPreview, onDelete, user, onSignInClick, onLogout }: DashboardProps) {
  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: <FileText size={20} />, color: 'text-violet-400' },
    { label: 'Free Templates', value: resumes.filter(r => !r.isPremium).length, icon: <Star size={20} />, color: 'text-blue-400' },
    { label: 'Premium', value: resumes.filter(r => r.isPremium).length, icon: <Star size={20} />, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-violet-950/30 to-gray-900 border-b border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top bar: brand + auth */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">ResumeAI</span>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                  <Cloud size={12} className="text-green-400" />
                  <span className="text-xs text-green-300 font-medium">{user.email}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition text-xs font-medium"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-xl font-semibold hover:bg-violet-600/30 transition text-sm"
              >
                <LogIn size={16} /> Sign In to Sync
              </button>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-1">My Resumes</h1>
              <div className="flex items-center gap-2 text-sm">
                {user ? (
                  <span className="flex items-center gap-1.5 text-green-400"><Cloud size={13} /> Synced to Supabase</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-gray-500"><HardDrive size={13} /> Saved locally — <button onClick={onSignInClick} className="text-violet-400 hover:underline">sign in to sync</button></span>
                )}
              </div>
            </div>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/30 hover:-translate-y-0.5"
            >
              <Plus size={20} />
              New Resume
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className={`${s.color}`}>{s.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {resumes.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl">
            <div className="w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText size={36} className="text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No resumes yet</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">Create your first resume to get started. Choose from stunning templates and get AI-powered writing help.</p>
            <button
              onClick={onCreateNew}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/30"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10 transition-all group">
                {/* Thumbnail */}
                <div className={`h-36 bg-gradient-to-br ${TEMPLATE_GRADIENTS[resume.templateId] || 'from-gray-700 to-gray-900'} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
                    <div className="w-28 h-36 bg-white rounded flex flex-col items-start p-2 gap-1 overflow-hidden shadow-2xl">
                      <div className="h-2 bg-gray-500 rounded w-full mb-1" />
                      <div className="h-1.5 bg-gray-300 rounded w-3/4" />
                      <div className="h-1.5 bg-gray-300 rounded w-1/2 mb-1" />
                      <div className="h-1 bg-gray-400 rounded w-full" />
                      <div className="h-1 bg-gray-300 rounded w-4/5" />
                      <div className="h-1 bg-gray-300 rounded w-3/4" />
                      <div className="h-1 bg-gray-300 rounded w-2/3" />
                    </div>
                  </div>
                  {resume.isPremium && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-white text-xs font-bold rounded-full">
                      <Star size={10} fill="white" /> PREMIUM
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-white truncate mb-0.5">{resume.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{resume.personalInfo.fullName || 'No name set'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-white/10 border border-white/10 px-2 py-0.5 rounded-full text-gray-400 capitalize">{resume.templateId}</span>
                    {resume.personalInfo.email && (
                      <span className="text-xs text-gray-600 flex items-center gap-1 truncate"><Clock size={10} /> {resume.personalInfo.email}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-white/10 p-3 flex gap-2">
                  <button
                    onClick={() => onPreview(resume.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => onEdit(resume.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-violet-600/80 rounded-lg hover:bg-violet-600 transition"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(resume.id)}
                    className="px-3 py-2 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {/* New resume card */}
            <button
              onClick={onCreateNew}
              className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all min-h-[260px]"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-sm font-semibold">Create New Resume</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
