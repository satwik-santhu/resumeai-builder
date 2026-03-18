import { useState } from 'react';
import { Resume, Experience, Education, Project, Certification } from '../types/resume';
import { Sparkles, Plus, Trash2, Github, Linkedin, Globe, MapPin, Mail, Phone, Award, Briefcase, GraduationCap, Code, User, AlignLeft } from 'lucide-react';
import { generateSummaryWithAI, improveDescriptionWithAI, suggestSkillsWithAI } from '../services/geminiApi';
import { generateSummary, improveDescription, suggestSkills } from '../utils/aiAssistant';

interface ResumeFormProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
  onSave: () => void;
  onCancel: () => void;
}

type Section = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export default function ResumeForm({ resume, onChange, onSave, onCancel }: ResumeFormProps) {
  const [aiLoading, setAiLoading] = useState<string | false>(false);
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [skillInput, setSkillInput] = useState('');

  const updateField = (field: keyof Resume, value: any) => {
    onChange({ ...resume, [field]: value });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({ ...resume, personalInfo: { ...resume.personalInfo, [field]: value } });
  };

  // ---- Experience helpers ----
  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' };
    updateField('experience', [...resume.experience, newExp]);
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    updateField('experience', resume.experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeExperience = (id: string) => updateField('experience', resume.experience.filter(e => e.id !== id));

  // ---- Education helpers ----
  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), institution: '', degree: '', field: '', year: '', cgpa: '' };
    updateField('education', [...resume.education, newEdu]);
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateField('education', resume.education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeEducation = (id: string) => updateField('education', resume.education.filter(e => e.id !== id));

  // ---- Projects helpers ----
  const addProject = () => {
    const newProj: Project = { id: Date.now().toString(), name: '', description: '', technologies: '', link: '' };
    updateField('projects', [...(resume.projects || []), newProj]);
  };
  const updateProject = (id: string, field: keyof Project, value: string) => {
    updateField('projects', (resume.projects || []).map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const removeProject = (id: string) => updateField('projects', (resume.projects || []).filter(p => p.id !== id));

  // ---- Certifications helpers ----
  const addCertification = () => {
    const newCert: Certification = { id: Date.now().toString(), name: '', issuer: '', year: '' };
    updateField('certifications', [...(resume.certifications || []), newCert]);
  };
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    updateField('certifications', (resume.certifications || []).map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  const removeCertification = (id: string) => updateField('certifications', (resume.certifications || []).filter(c => c.id !== id));

  // ---- AI handlers ----
  const handleAISummary = async () => {
    setAiLoading('summary');
    try {
      const aiResult = await generateSummaryWithAI(resume.personalInfo.fullName, resume.experience[0]?.position || '');
      updateField('summary', aiResult ?? generateSummary(resume.personalInfo.fullName, resume.experience[0]?.position));
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIImprove = async (expId: string) => {
    setAiLoading(expId);
    const exp = resume.experience.find(e => e.id === expId);
    try {
      const aiResult = exp ? await improveDescriptionWithAI(exp.description, exp.position) : null;
      const improved = aiResult ?? (exp ? improveDescription(exp.description) : '');
      updateExperience(expId, 'description', improved);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAISkills = async () => {
    setAiLoading('skills');
    try {
      const aiResult = await suggestSkillsWithAI(resume.experience[0]?.position || '');
      const skills = aiResult ?? suggestSkills(resume.experience[0]?.position);
      updateField('skills', [...new Set([...resume.skills, ...skills])]);
    } finally {
      setAiLoading(false);
    }
  };

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal', icon: <User size={16} /> },
    { id: 'summary', label: 'Summary', icon: <AlignLeft size={16} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Code size={16} /> },
    { id: 'certifications', label: 'Certifications', icon: <Award size={16} /> },
  ];

  const inputCls = 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div className="flex flex-col h-full">
      {/* Resume name bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <input
          type="text"
          value={resume.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="w-full text-lg font-semibold border-0 focus:outline-none text-gray-800 placeholder-gray-300"
          placeholder="Resume Name (e.g., Software Engineer Resume)"
        />
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === s.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

        {/* Personal Information */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><User size={18} className="text-violet-600" /> Personal Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Full Name</label>
                <input type="text" value={resume.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} className={inputCls} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelCls}><Mail size={11} className="inline mr-1" />Email</label>
                <input type="email" value={resume.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} className={inputCls} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelCls}><Phone size={11} className="inline mr-1" />Phone</label>
                <input type="tel" value={resume.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} className={inputCls} placeholder="+1 234 567 8900" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}><MapPin size={11} className="inline mr-1" />Address / Location</label>
                <input type="text" value={resume.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} className={inputCls} placeholder="San Francisco, CA" />
              </div>
              <div>
                <label className={labelCls}><Linkedin size={11} className="inline mr-1" />LinkedIn</label>
                <input type="text" value={resume.personalInfo.linkedIn || ''} onChange={e => updatePersonalInfo('linkedIn', e.target.value)} className={inputCls} placeholder="linkedin.com/in/john-doe" />
              </div>
              <div>
                <label className={labelCls}><Github size={11} className="inline mr-1" />GitHub</label>
                <input type="text" value={resume.personalInfo.github || ''} onChange={e => updatePersonalInfo('github', e.target.value)} className={inputCls} placeholder="github.com/johndoe" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}><Globe size={11} className="inline mr-1" />Portfolio / Website</label>
                <input type="text" value={resume.personalInfo.portfolio || ''} onChange={e => updatePersonalInfo('portfolio', e.target.value)} className={inputCls} placeholder="johndoe.dev" />
              </div>
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {activeSection === 'summary' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><AlignLeft size={18} className="text-violet-600" /> Professional Summary</h3>
              <button
                onClick={handleAISummary}
                disabled={!!aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 transition-all shadow-sm"
              >
                <Sparkles size={13} />
                {aiLoading === 'summary' ? 'Generating…' : 'AI Generate'}
              </button>
            </div>
            <textarea
              value={resume.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              className={`${inputCls} h-36 resize-none`}
              placeholder="Write a brief summary of your professional background, skills, and goals..."
            />
            <p className="text-xs text-gray-400">💡 Click "AI Generate" to let Gemini write a professional summary based on your experience.</p>
          </div>
        )}

        {/* Work Experience */}
        {activeSection === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><Briefcase size={18} className="text-violet-600" /> Work Experience</h3>
              <button onClick={addExperience} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <Plus size={14} /> Add
              </button>
            </div>
            {resume.experience.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Briefcase size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No experience added yet</p>
                <button onClick={addExperience} className="mt-2 text-violet-600 text-sm font-semibold hover:underline">+ Add Work Experience</button>
              </div>
            )}
            {resume.experience.map((exp) => (
              <div key={exp.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => removeExperience(exp.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={15} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Company</label>
                    <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className={inputCls} placeholder="Google Inc." />
                  </div>
                  <div>
                    <label className={labelCls}>Role / Position</label>
                    <input type="text" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} className={inputCls} placeholder="Senior Software Engineer" />
                  </div>
                  <div>
                    <label className={labelCls}>Start Date</label>
                    <input type="text" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className={inputCls} placeholder="Jan 2022" />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    <input type="text" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className={inputCls} placeholder="Present" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description / Responsibilities</label>
                  <div className="flex gap-2">
                    <textarea
                      value={exp.description}
                      onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                      className={`${inputCls} h-24 resize-none flex-1`}
                      placeholder="Describe your role, responsibilities, and key achievements..."
                    />
                    <button
                      onClick={() => handleAIImprove(exp.id)}
                      disabled={!!aiLoading}
                      title="AI Improve Description"
                      className="px-2 py-1 bg-gradient-to-b from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 transition"
                    >
                      <Sparkles size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeSection === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><GraduationCap size={18} className="text-violet-600" /> Education</h3>
              <button onClick={addEducation} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <Plus size={14} /> Add
              </button>
            </div>
            {resume.education.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <GraduationCap size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No education added yet</p>
                <button onClick={addEducation} className="mt-2 text-violet-600 text-sm font-semibold hover:underline">+ Add Education</button>
              </div>
            )}
            {resume.education.map((edu) => (
              <div key={edu.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => removeEducation(edu.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={15} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>University / Institution</label>
                    <input type="text" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} className={inputCls} placeholder="MIT" />
                  </div>
                  <div>
                    <label className={labelCls}>Degree</label>
                    <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className={inputCls} placeholder="Bachelor of Science" />
                  </div>
                  <div>
                    <label className={labelCls}>Field of Study</label>
                    <input type="text" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} className={inputCls} placeholder="Computer Science" />
                  </div>
                  <div>
                    <label className={labelCls}>Graduation Year</label>
                    <input type="text" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} className={inputCls} placeholder="2023" />
                  </div>
                  <div>
                    <label className={labelCls}>CGPA / GPA</label>
                    <input type="text" value={edu.cgpa || ''} onChange={e => updateEducation(edu.id, 'cgpa', e.target.value)} className={inputCls} placeholder="3.85 / 4.0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><Code size={18} className="text-violet-600" /> Skills</h3>
              <button
                onClick={handleAISkills}
                disabled={!!aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 transition shadow-sm"
              >
                <Sparkles size={13} />
                {aiLoading === 'skills' ? 'Thinking…' : 'AI Suggest'}
              </button>
            </div>

            {/* Tag display */}
            {resume.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                    {skill}
                    <button
                      onClick={() => updateField('skills', resume.skills.filter((_, j) => j !== i))}
                      className="text-violet-400 hover:text-violet-700 leading-none"
                    >×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Enter-to-add input */}
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const trimmed = skillInput.trim().replace(/,$/, '');
                  if (trimmed && !resume.skills.includes(trimmed)) {
                    updateField('skills', [...resume.skills, trimmed]);
                  }
                  setSkillInput('');
                } else if (e.key === 'Backspace' && skillInput === '' && resume.skills.length > 0) {
                  // Remove last tag on backspace when input is empty
                  updateField('skills', resume.skills.slice(0, -1));
                }
              }}
              className={inputCls}
              placeholder="Type a skill and press Enter…"
            />
            <p className="text-xs text-gray-400">Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> after each skill to add it as a tag. Backspace removes the last tag.</p>
          </div>
        )}

        {/* Projects */}
        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><Code size={18} className="text-violet-600" /> Projects</h3>
              <button onClick={addProject} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <Plus size={14} /> Add
              </button>
            </div>
            {(resume.projects || []).length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Code size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No projects added yet</p>
                <button onClick={addProject} className="mt-2 text-violet-600 text-sm font-semibold hover:underline">+ Add Project</button>
              </div>
            )}
            {(resume.projects || []).map((proj) => (
              <div key={proj.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => removeProject(proj.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={15} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Project Name</label>
                    <input type="text" value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} className={inputCls} placeholder="E-Commerce Platform" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Technologies Used</label>
                    <input type="text" value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} className={inputCls} placeholder="React, Node.js, MongoDB, Stripe" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} className={`${inputCls} h-20 resize-none`} placeholder="What did this project do? What problem did it solve? What was your role?" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Link (optional)</label>
                    <input type="text" value={proj.link || ''} onChange={e => updateProject(proj.id, 'link', e.target.value)} className={inputCls} placeholder="github.com/yourname/project" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {activeSection === 'certifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><Award size={18} className="text-violet-600" /> Certifications</h3>
              <button onClick={addCertification} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <Plus size={14} /> Add
              </button>
            </div>
            {(resume.certifications || []).length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Award size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No certifications added yet</p>
                <button onClick={addCertification} className="mt-2 text-violet-600 text-sm font-semibold hover:underline">+ Add Certification</button>
              </div>
            )}
            {(resume.certifications || []).map((cert) => (
              <div key={cert.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => removeCertification(cert.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={15} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Certification Name</label>
                    <input type="text" value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} className={inputCls} placeholder="AWS Certified Solutions Architect" />
                  </div>
                  <div>
                    <label className={labelCls}>Issuing Organization</label>
                    <input type="text" value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} className={inputCls} placeholder="Amazon Web Services" />
                  </div>
                  <div>
                    <label className={labelCls}>Year</label>
                    <input type="text" value={cert.year} onChange={e => updateCertification(cert.id, 'year', e.target.value)} className={inputCls} placeholder="2023" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save / Cancel */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition shadow-sm"
        >
          Save Resume
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
