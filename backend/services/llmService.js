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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
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
