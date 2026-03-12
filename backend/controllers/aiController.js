const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Helper: Call Gemini and return text
 */
const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

/**
 * POST /api/ai/generate-summary
 * Body: { name, position }
 * Returns: { success, summary }
 */
exports.generateSummary = async (req, res) => {
  try {
    const { name, position } = req.body;
    const prompt = `Write a concise 3-sentence professional resume summary for ${name || 'a candidate'} who works as a ${position || 'professional'}. Use strong action words, focus on value delivered, avoid first-person. Output only the summary text.`;
    const summary = await callGemini(prompt);
    res.json({ success: true, summary: summary.trim() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/ai/improve-description
 * Body: { description, position }
 * Returns: { success, improved }
 */
exports.improveDescription = async (req, res) => {
  try {
    const { description, position } = req.body;
    const prompt = `Improve this work experience description for a resume: "${description}". Role: ${position || 'professional'}. Start with a strong action verb, quantify achievements where possible, keep it under 3 sentences. Output only the improved text.`;
    const improved = await callGemini(prompt);
    res.json({ success: true, improved: improved.trim() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/ai/suggest-skills
 * Body: { position }
 * Returns: { success, skills: string[] }
 */
exports.suggestSkills = async (req, res) => {
  try {
    const { position } = req.body;
    const prompt = `List exactly 8 key skills for a ${position || 'professional'} resume. Output as a comma-separated list only, no numbering, no explanation.`;
    const result = await callGemini(prompt);
    const skills = result.split(',').map(s => s.trim()).filter(Boolean);
    res.json({ success: true, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
