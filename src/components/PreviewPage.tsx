import { useState } from 'react';
import { Download, ArrowLeft, Edit2, Loader2 } from 'lucide-react';
import { Resume } from '../types/resume';
import ResumePreview from './ResumePreview';
import { downloadResumePDF } from '../utils/pdfGenerator';

interface PreviewPageProps {
  resume: Resume;
  onBack: () => void;
  onEdit: () => void;
}

export default function PreviewPage({ resume, onBack, onEdit }: PreviewPageProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadResumePDF(resume.name);
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-white/10 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg hidden md:block">{resume.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition text-sm font-medium"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-violet-500/30 text-sm font-bold"
            >
              {downloading ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><Download size={16} /> Download PDF</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">📄 Your resume preview — <strong className="text-gray-300">Download PDF</strong> to save a copy</p>
        </div>
        <div className="shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
