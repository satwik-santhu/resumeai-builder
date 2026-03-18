import { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

export default function ExecutiveTemplate({ resume }: TemplateProps) {
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const SideTitle = ({ title }: { title: string }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-2 pb-1.5 border-b border-amber-700">{title}</h2>
  );

  const MainTitle = ({ title }: { title: string }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-2 pb-1 border-b-2 border-amber-300">{title}</h2>
  );

  return (
    <div className="bg-white shadow-lg max-w-[800px] mx-auto font-sans" id="resume-content">
      <div className="flex min-h-[900px]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 bg-gradient-to-b from-amber-800 to-amber-950 text-white p-6">
          {/* Name */}
          <div className="mb-6 pb-4 border-b border-amber-600">
            <h1 className="text-2xl font-extrabold leading-tight">
              {resume.personalInfo.fullName || 'Your Name'}
            </h1>
          </div>

          {/* Contact */}
          <div className="mb-5">
            <SideTitle title="Contact" />
            <div className="space-y-1.5 text-xs text-amber-100">
              {resume.personalInfo.email && (
                <p className="break-words">
                  <a data-pdf-link href={`mailto:${resume.personalInfo.email}`} className="hover:underline">✉ {resume.personalInfo.email}</a>
                </p>
              )}
              {resume.personalInfo.phone && <p>📞 {resume.personalInfo.phone}</p>}
              {resume.personalInfo.location && <p>📍 {resume.personalInfo.location}</p>}
              {resume.personalInfo.linkedIn && (
                <p className="break-all">
                  <a data-pdf-link href={resume.personalInfo.linkedIn.startsWith('http') ? resume.personalInfo.linkedIn : `https://${resume.personalInfo.linkedIn}`} className="hover:underline">🔗 {resume.personalInfo.linkedIn}</a>
                </p>
              )}
              {resume.personalInfo.github && (
                <p className="break-all">
                  <a data-pdf-link href={resume.personalInfo.github.startsWith('http') ? resume.personalInfo.github : `https://${resume.personalInfo.github}`} className="hover:underline">⌨ {resume.personalInfo.github}</a>
                </p>
              )}
              {resume.personalInfo.portfolio && (
                <p className="break-all">
                  <a data-pdf-link href={resume.personalInfo.portfolio.startsWith('http') ? resume.personalInfo.portfolio : `https://${resume.personalInfo.portfolio}`} className="hover:underline">🌐 {resume.personalInfo.portfolio}</a>
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-5">
              <SideTitle title="Skills" />
              <div className="space-y-1">
                {resume.skills.map((skill, i) => (
                  <div key={i} className="text-xs text-amber-100 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-amber-400 rounded-full flex-shrink-0" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <SideTitle title="Certifications" />
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-xs font-semibold text-amber-200">{cert.name}</p>
                    <p className="text-xs text-amber-300">{cert.issuer} {cert.year && `· ${cert.year}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-7">
          {/* Summary */}
          {resume.summary && (
            <div className="mb-5">
              <MainTitle title="Executive Summary" />
              <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div className="mb-5">
              <MainTitle title="Professional Experience" />
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm font-semibold text-amber-800">{exp.company}</p>
                    <span className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-5">
              <MainTitle title="Key Projects" />
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <a data-pdf-link href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} className="text-xs text-amber-700 hover:underline">{proj.link}</a>
                    )}
                  </div>
                  {proj.technologies && (
                    <p className="text-xs text-amber-700 font-semibold mb-0.5">{proj.technologies}</p>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div>
              <MainTitle title="Education" />
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="text-sm font-bold text-gray-900">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</h3>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm text-amber-800 font-semibold">{edu.institution}</p>
                    <span className="text-xs text-gray-500">{edu.year}</span>
                  </div>
                  {edu.cgpa && <p className="text-xs text-gray-500">CGPA: {edu.cgpa}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
