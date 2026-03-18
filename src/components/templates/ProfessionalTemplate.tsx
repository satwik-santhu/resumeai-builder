import { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

export default function ProfessionalTemplate({ resume }: TemplateProps) {
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  return (
    <div className="bg-white p-8 shadow-lg max-w-[800px] mx-auto font-sans" id="resume-content">
      {/* Header */}
      <div className="border-b-4 border-gray-800 pb-5 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
          {resume.personalInfo.email && (
            <a data-pdf-link href={`mailto:${resume.personalInfo.email}`} className="hover:underline">✉ {resume.personalInfo.email}</a>
          )}
          {resume.personalInfo.phone && <span>📞 {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>📍 {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedIn && (
            <a data-pdf-link href={resume.personalInfo.linkedIn.startsWith('http') ? resume.personalInfo.linkedIn : `https://${resume.personalInfo.linkedIn}`} className="hover:underline">🔗 {resume.personalInfo.linkedIn}</a>
          )}
          {resume.personalInfo.github && (
            <a data-pdf-link href={resume.personalInfo.github.startsWith('http') ? resume.personalInfo.github : `https://${resume.personalInfo.github}`} className="hover:underline">⌨ {resume.personalInfo.github}</a>
          )}
          {resume.personalInfo.portfolio && (
            <a data-pdf-link href={resume.personalInfo.portfolio.startsWith('http') ? resume.personalInfo.portfolio : `https://${resume.personalInfo.portfolio}`} className="hover:underline">🌐 {resume.personalInfo.portfolio}</a>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed text-sm">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase border-b border-gray-300 pb-1 mb-3">Work Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">{exp.company}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase border-b border-gray-300 pb-1 mb-3">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <span className="text-xs text-gray-500">{edu.year}</span>
              </div>
              <p className="text-sm text-gray-700">{edu.institution}</p>
              {edu.cgpa && <p className="text-xs text-gray-500 mt-0.5">CGPA: {edu.cgpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase border-b border-gray-300 pb-1 mb-3">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-bold text-gray-900">{proj.name}</h3>
                {proj.link && (
                  <a data-pdf-link href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} className="text-xs text-blue-600 hover:underline">{proj.link}</a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-xs text-gray-500 font-medium mb-1">Tech: {proj.technologies}</p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase border-b border-gray-300 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded border border-gray-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase border-b border-gray-300 pb-1 mb-3">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-semibold text-gray-800">{cert.name}</span>
                {cert.issuer && <span className="text-xs text-gray-500 ml-2">— {cert.issuer}</span>}
              </div>
              {cert.year && <span className="text-xs text-gray-500">{cert.year}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
