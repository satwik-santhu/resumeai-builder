export const generateSummary = (name: string, position?: string): string => {
  const summaries = [
    `Results-driven professional${name ? ` like ${name}` : ''} with extensive experience in delivering high-quality solutions. Proven track record of success in fast-paced environments. Strong communicator with excellent problem-solving abilities.`,
    `Dedicated ${position || 'professional'} with a passion for innovation and excellence. Skilled in collaborating with cross-functional teams to achieve organizational goals. Committed to continuous learning and growth.`,
    `Dynamic and motivated ${position || 'professional'} with expertise in driving successful outcomes. Known for attention to detail and ability to manage multiple priorities. Excellent interpersonal and leadership skills.`,
  ];

  return summaries[Math.floor(Math.random() * summaries.length)];
};

export const improveDescription = (description: string): string => {
  if (!description.trim()) {
    return 'Led key initiatives and collaborated with cross-functional teams to deliver impactful results. Implemented best practices and drove continuous improvement across the organization.';
  }

  const improvements = [
    `Enhanced ${description.toLowerCase()} through strategic planning and execution, resulting in measurable improvements in team productivity and project outcomes.`,
    `Successfully ${description.toLowerCase()} while maintaining high standards of quality. Collaborated with stakeholders to ensure alignment with organizational objectives.`,
    `Spearheaded initiatives to ${description.toLowerCase()}, demonstrating strong leadership and technical expertise. Achieved significant milestones through effective project management.`,
  ];

  return improvements[Math.floor(Math.random() * improvements.length)];
};

export const suggestSkills = (position?: string): string[] => {
  const generalSkills = [
    'Project Management',
    'Team Leadership',
    'Problem Solving',
    'Communication',
    'Strategic Planning',
    'Data Analysis',
    'Process Improvement',
    'Stakeholder Management',
  ];

  const techSkills = [
    'JavaScript/TypeScript',
    'React',
    'Node.js',
    'Python',
    'SQL',
    'Git',
    'Agile/Scrum',
    'REST APIs',
  ];

  return position?.toLowerCase().includes('developer') || position?.toLowerCase().includes('engineer')
    ? techSkills
    : generalSkills;
};
