import { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

export default function ModernTemplate({ resume }: TemplateProps) {
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-sm font-bold text-indigo-700 mb-3 pb-1.5 border-b-2 border-indigo-200 uppercase tracking-wider">
      {title}
    </h2>
  );

  return (
    <div className="bg-white shadow-lg max-w-[800px] mx-auto font-sans" id="resume-content">
      {/* Dark header */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white px-8 py-7">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300 mt-2">
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

      <div className="p-8">
        {/* Summary */}
        {resume.summary && (
          <div className="mb-6">
            <SectionTitle title="About Me" />
            <p className="text-gray-700 leading-relaxed text-sm">{resume.summary}</p>
          </div>
        )}

        {/* Skills - shown early in modern layout */}
        {resume.skills.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Skills" />
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-700 text-white text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Experience" />
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-4 border-indigo-300">
                <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-semibold text-indigo-700">{exp.company}</p>
                  <span className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Projects" />
            {projects.map((proj) => (
              <div key={proj.id} className="mb-4 pl-4 border-l-4 border-indigo-300">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                  {proj.link && (
                    <a data-pdf-link href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} className="text-xs text-indigo-500 hover:underline">{proj.link}</a>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-xs text-indigo-600 font-semibold mb-1">{proj.technologies}</p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Education" />
            {resume.education.map((edu) => (
              <div key={edu.id} className="mb-3 pl-4 border-l-4 border-indigo-300">
                <h3 className="text-base font-bold text-slate-900">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</h3>
                <div className="flex justify-between">
                  <p className="text-sm text-indigo-700 font-semibold">{edu.institution}</p>
                  <span className="text-xs text-gray-500">{edu.year}</span>
                </div>
                {edu.cgpa && <p className="text-xs text-gray-500">CGPA: {edu.cgpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <SectionTitle title="Certifications" />
            <div className="grid grid-cols-2 gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-2 p-2 bg-indigo-50 rounded-lg">
                  <span className="text-indigo-500 mt-0.5 text-xs">✦</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer} {cert.year && `· ${cert.year}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
