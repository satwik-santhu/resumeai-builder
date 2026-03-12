import { Lock, CheckCircle } from 'lucide-react';
import { templates } from '../data/templates';
import { Template } from '../types/resume';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

const TemplateMiniPreview = ({ templateId }: { templateId: string }) => {
  if (templateId === 'professional') {
    return (
      <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
        <div className="border-b-2 border-gray-800 pb-1.5 mb-1">
          <div className="h-3 bg-gray-800 rounded w-2/3 mb-1" />
          <div className="flex gap-1.5">
            <div className="h-1.5 bg-gray-300 rounded w-1/3" />
            <div className="h-1.5 bg-gray-300 rounded w-1/4" />
          </div>
        </div>
        <div className="h-1.5 bg-gray-200 rounded w-full" />
        <div className="h-1.5 bg-gray-200 rounded w-4/5" />
        <div className="h-1.5 bg-gray-100 rounded w-3/4 mt-1" />
        <div className="h-1.5 bg-gray-200 rounded w-full" />
        <div className="h-1.5 bg-gray-200 rounded w-5/6" />
        <div className="flex flex-wrap gap-1 mt-auto">
          {['skill', 'skill', 'skill'].map((_, i) => (
            <div key={i} className="h-2 bg-gray-100 border border-gray-200 rounded px-1.5 w-8" />
          ))}
        </div>
      </div>
    );
  }
  if (templateId === 'modern') {
    return (
      <div className="w-full h-full bg-white flex flex-col gap-0">
        <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-3">
          <div className="h-3 bg-white/80 rounded w-1/2 mb-1.5" />
          <div className="flex gap-1.5">
            <div className="h-1.5 bg-white/40 rounded w-1/4" />
            <div className="h-1.5 bg-white/40 rounded w-1/4" />
          </div>
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="flex gap-1 flex-wrap">
            {['', '', ''].map((_, i) => (
              <div key={i} className="h-2 bg-indigo-700 rounded-full px-2 w-8" />
            ))}
          </div>
          <div className="border-b border-indigo-200 pb-0.5">
            <div className="h-1.5 bg-indigo-700/60 rounded w-1/3" />
          </div>
          <div className="pl-2 border-l-4 border-indigo-300 space-y-0.5">
            <div className="h-1.5 bg-gray-600 rounded w-2/3" />
            <div className="h-1 bg-gray-300 rounded w-1/2" />
            <div className="h-1 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }
  if (templateId === 'executive') {
    return (
      <div className="w-full h-full bg-white flex">
        <div className="w-2/5 bg-gradient-to-b from-amber-800 to-amber-950 p-2 flex flex-col gap-2">
          <div className="h-3 bg-white/80 rounded w-3/4 mb-0.5" />
          <div className="h-2 bg-amber-400/60 rounded w-1/2" />
          <div className="border-b border-amber-600/80 mt-1" />
          <div className="space-y-0.5">
            <div className="h-1 bg-amber-100/50 rounded w-full" />
            <div className="h-1 bg-amber-100/40 rounded w-4/5" />
            <div className="h-1 bg-amber-100/40 rounded w-3/4" />
          </div>
          <div className="border-b border-amber-600/80 mt-1" />
          <div className="flex flex-col gap-0.5">
            {[80, 65, 70, 55].map((w, i) => (
              <div key={i} className="h-1 bg-amber-300/40 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-2 flex flex-col gap-2">
          <div className="border-b-2 border-amber-300 pb-0.5 mb-0.5">
            <div className="h-1.5 bg-amber-700/60 rounded w-1/2" />
          </div>
          <div className="space-y-0.5">
            <div className="h-1 bg-gray-400 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-5/6" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="border-b-2 border-amber-300 pb-0.5 mt-1">
            <div className="h-1.5 bg-amber-700/60 rounded w-2/5" />
          </div>
          <div className="space-y-1">
            {[1, 2].map(i => (
              <div key={i} className="space-y-0.5">
                <div className="h-1.5 bg-gray-600 rounded w-3/5" />
                <div className="h-1 bg-gray-300 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TemplateSelector({ selectedTemplate, onSelect, isPremium, onUpgradeClick }: TemplateSelectorProps) {
  const handleTemplateClick = (template: Template) => {
    if (template.isPaid && !isPremium) {
      onUpgradeClick();
    } else {
      onSelect(template.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-500">Select a layout that best represents your professional style</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isLocked = template.isPaid && !isPremium;
          return (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={`relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                isSelected
                  ? 'border-violet-600 shadow-xl shadow-violet-500/20'
                  : 'border-gray-200 hover:border-violet-400 hover:shadow-lg'
              }`}
            >
              {/* Mini preview */}
              <div className="h-52 overflow-hidden relative">
                <TemplateMiniPreview templateId={template.id} />
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-amber-500/90 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                      <Lock size={22} className="text-white" />
                    </div>
                    <p className="text-white text-sm font-bold">Premium Template</p>
                    <p className="text-amber-300 text-xs mt-0.5">Click to upgrade</p>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center shadow">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-bold text-gray-900">{template.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    template.isPaid ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    {template.isPaid ? 'PREMIUM' : 'FREE'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
