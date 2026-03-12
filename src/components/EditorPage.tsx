import { useState } from 'react';
import { Resume } from '../types/resume';
import { templates } from '../data/templates';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import { Eye, EyeOff, Layers } from 'lucide-react';

interface EditorPageProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
  onSave: () => void;
  onCancel: () => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export default function EditorPage({ resume, onChange, onSave, onCancel, isPremium, onUpgradeClick }: EditorPageProps) {
  const [showPreview, setShowPreview] = useState(true);

  const handleTemplateChange = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (tpl?.isPaid && !isPremium) {
      onUpgradeClick();
      return;
    }
    onChange({ ...resume, templateId });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Layers size={18} className="text-violet-600" />
            <span className="text-sm font-bold text-gray-700">Template:</span>
          </div>
          <div className="flex gap-1">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleTemplateChange(tpl.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  resume.templateId === tpl.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                } ${tpl.isPaid && !isPremium ? 'opacity-70' : ''}`}
              >
                {tpl.name} {tpl.isPaid && !isPremium ? '🔒' : ''}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {/* Split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form panel */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col bg-white border-r border-gray-200 overflow-hidden transition-all duration-300`}>
          <ResumeForm
            resume={resume}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="w-1/2 flex flex-col overflow-hidden bg-gray-100">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold flex items-center gap-1.5">
              <Eye size={12} /> Live Preview
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="shadow-xl rounded-lg overflow-hidden">
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
