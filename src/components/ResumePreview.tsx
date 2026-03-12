import { Resume } from '../types/resume';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (resume.templateId) {
      case 'professional':
        return <ProfessionalTemplate resume={resume} />;
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
}
