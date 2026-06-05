import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `You extract structured opportunity data from college placement emails.
Return ONLY valid JSON. No markdown. No explanation. No code blocks.
Schema: { title: string|null, type: Internship|Placement|Hackathon|
Research|Scholarship|Competition|Fellowship|Workshop|Conference|Other,
organization: string|null, deadline: ISO8601 string|null,
description: string max 200 chars|null, eligibility: string|null,
requiredSkills: string[], applyLink: valid URL|null }
Use null for unknown fields. For partial dates assume nearest future.`;

function parseJsonResponse(text) {
  const cleaned = text
    .trim()
    .replace(/^```json?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  return JSON.parse(cleaned);
}

export async function extractOpportunityData(emailBody, emailSubject, emailDate) {
  try {
    console.log('[Gemini] Using model: gemini-2.5-flash');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `Subject: ${emailSubject}\nDate: ${emailDate}\n\nBody:\n${emailBody}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      return null;
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Failed to extract opportunity data:', error.message);
    return null;
  }
}

const SKILLS_INSTRUCTION = `Extract technical and professional skills from this resume text.
Return ONLY a valid JSON array of skill strings. No markdown. No explanation.
Example: ["Python", "React", "SQL", "Machine Learning"]`;

export async function extractSkillsFromResume(resumeText) {
  try {
    if (!resumeText?.trim()) {
      return [];
    }

    console.log('[Gemini] Using model: gemini-2.5-flash');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SKILLS_INSTRUCTION,
    });

    const truncated = resumeText.slice(0, 15000);
    const result = await model.generateContent(truncated);
    const responseText = result.response.text();

    if (!responseText) {
      return [];
    }

    const parsed = parseJsonResponse(responseText);
    if (Array.isArray(parsed)) {
      return parsed.filter((s) => typeof s === 'string' && s.trim());
    }
    if (Array.isArray(parsed?.skills)) {
      return parsed.skills.filter((s) => typeof s === 'string' && s.trim());
    }

    return [];
  } catch (error) {
    console.error('Failed to extract skills from resume:', error.message);
    return [];
  }
}
