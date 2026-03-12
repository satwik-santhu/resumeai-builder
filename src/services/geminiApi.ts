/**
 * Google Gemini AI API integration
 * Uses the Gemini 1.5 Flash model for fast text generation
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Calls the Google Gemini API with the given prompt.
 * Returns the generated text, or null if unavailable.
 */
export async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return null; // No API key – caller should use fallback
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ?? null;
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return null;
  }
}

/** Generate a professional summary using Gemini */
export async function generateSummaryWithAI(name: string, position: string): Promise<string | null> {
  const prompt = `Write a concise 3-sentence professional resume summary for a person named ${name || 'the candidate'} who works as a ${position || 'professional'}. Make it results-oriented, use strong action words, and avoid using first-person pronouns. Output only the summary text, no preamble.`;
  return callGemini(prompt);
}

/** Improve a work experience description using Gemini */
export async function improveDescriptionWithAI(description: string, position: string): Promise<string | null> {
  const prompt = `Improve this work experience bullet point for a resume: "${description}". The person's role is ${position || 'a professional'}. Make it concise, start with a strong action verb, quantify achievements where possible, and keep it under 3 sentences. Output only the improved description, no preamble.`;
  return callGemini(prompt);
}

/** Suggest skills using Gemini */
export async function suggestSkillsWithAI(position: string): Promise<string[] | null> {
  const prompt = `List exactly 8 of the most important technical and soft skills for a ${position || 'professional'} to include on a resume. Output as a comma-separated list with no numbering, no extra text, just the skills.`;
  const result = await callGemini(prompt);
  if (!result) return null;
  return result.split(',').map((s) => s.trim()).filter(Boolean);
}
