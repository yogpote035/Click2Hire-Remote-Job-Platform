const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function getResumeFeedback(resumeText) {
  try {
    const prompt = `
You are a resume reviewer. Analyze the resume text and provide independent feedback.
Return ONLY valid JSON matching this TypeScript type:

{
  "overallScore": number,
  "summary": string,
  "issues": [{"type": "format"|"content"|"ATS"|"clarity", "note": string}],
  "strengths": string[],
  "actionableChecklist": string[]
}

Provide concise, actionable feedback focusing on:
- Clarity and formatting
- Content completeness
- ATS readability
- Highlight strengths
- Suggest improvements

RESUME_TEXT:
"""${resumeText.slice(0, 30000)}"""
`.trim();

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract text response safely
    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const jsonStr = rawText.slice(
      rawText.indexOf("{"),
      rawText.lastIndexOf("}") + 1
    );

    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    console.log(err);
    throw new Error(err.response?.statusText && err.response?.status === 429 && "Scan limit reached. Consider checking the resume manually or wait a few minutes before the next automated scan." || "Failed to get AI feedback");
  }
}

module.exports = { getResumeFeedback };
