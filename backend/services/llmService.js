import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// TODO: Get GEMINI_API_KEY from .env
// TODO: Get GROQ_API_KEY from .env

const SYSTEM_PROMPT = `You extract structured data from college placement emails.
Return ONLY a valid JSON object, no markdown, no explanation.
Schema: {
  title: string or null,
  type: one of [Internship, Placement, Hackathon, Research,
    Scholarship, Competition, Fellowship, Workshop, Conference, Other],
  organization: string or null,
  deadline: ISO 8601 date string or null,
  description: string max 150 chars or null,
  eligibility: string max 100 chars or null,
  requiredSkills: array of strings,
  applyLink: valid URL string or null
}
Use null for any field you cannot determine.
For deadline if only day and month mentioned assume current year.`;

const delay = (ms) => new Promise(r => setTimeout(r, ms));

function parseJsonResponse(text) {
  const cleaned = text
    .trim()
    .replace(/^```json?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  return JSON.parse(cleaned);
}

function isLikelyOpportunity(subject, body) {
  const text = (subject + ' ' + (body || '')).toLowerCase()
  
  const opportunityKeywords = [
    'internship', 'placement', 'hackathon', 'hiring',
    'apply', 'application', 'deadline', 'opportunity',
    'fellowship', 'scholarship', 'competition', 'recruit',
    'job', 'opening', 'registration', 'program', 'drive',
    'campus', 'off campus', 'interview', 'shortlist',
    'amazon', 'google', 'microsoft', 'goldman', 'ibm',
    'dell', 'samsung', 'volvo', 'fresher', 'graduate',
    'batch', 'eligible', 'apply now', 'last date',
    'register', 'enroll', 'participate', 'submit',
    'prize', 'reward', 'win', 'challenge', 'contest',
    'research', 'intern', 'full time', 'part time',
    'stipend', 'ctc', 'package', 'lpa', 'ppo'
  ]

  const hardSpamKeywords = [
    'unsubscribe', 'payment receipt', 'invoice',
    'order confirmation', 'your order', 'delivery update',
    'otp', 'verification code', 'bank statement',
    'electricity bill', 'water bill', 'recharge'
  ]

  const isHardSpam = hardSpamKeywords.some(k => text.includes(k))
  if (isHardSpam) return false

  const hasOpportunityKeyword = opportunityKeywords.some(k => 
    text.includes(k)
  )
  return hasOpportunityKeyword
}

async function callGeminiWithRetry(model, prompt, retries = 1) {
  try {
    const result = await model.generateContent(prompt)
    return result
  } catch (error) {
    if (error.message?.includes('429') && retries > 0) {
      console.log('[Gemini] Rate limited, waiting 2s before retry...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      return callGeminiWithRetry(model, prompt, retries - 1)
    }
    throw error
  }
}

export async function extractOpportunityData(emailBody, emailSubject, emailDate) {
  try {
    if (!isLikelyOpportunity(emailSubject, emailBody)) {
      console.log('[Scan] Skipping non-opportunity email:', emailSubject)
      return null
    }

    await delay(300);

    const prompt = `Subject: ${emailSubject}\nDate: ${emailDate}\n\nBody:\n${emailBody}`;

    console.log('[LLM] Trying Groq for:', emailSubject);
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      const responseText = response.choices[0].message.content;
      console.log('[LLM] Groq succeeded for:', emailSubject);
      return parseJsonResponse(responseText);
    } catch (groqError) {
      console.log('[LLM] Groq failed, trying Gemini fallback for:', emailSubject);
      console.log('[LLM] Trying Gemini for:', emailSubject);
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      const fallbackResult = await callGeminiWithRetry(model, prompt);
      const fallbackText = fallbackResult.response.text();
      
      if (!fallbackText) {
        console.log('[LLM] Both providers failed for:', emailSubject);
        return null;
      }
      console.log('[LLM] Gemini succeeded for:', emailSubject);
      return parseJsonResponse(fallbackText);
    }
  } catch (error) {
    console.log('[LLM] Both providers failed for:', emailSubject);
    console.error('Failed to extract opportunity data:', error.message);
    return null;
  }
}

export async function extractSkillsFromResume(resumeText) {
  try {
    if (!resumeText?.trim()) {
      return [];
    }

    const systemPrompt = `You extract professional and technical skills from resumes.
Return ONLY a valid JSON array of skill strings.
No markdown, no explanation, no object wrapper.
Example output: ["JavaScript", "React", "Node.js", "MongoDB"]
Extract all technical skills, programming languages,
frameworks, tools, and soft skills you can identify.
Return empty array if no skills found.`;

    console.log('[LLM] Trying Groq for skills extraction');
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: resumeText }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      const responseText = response.choices[0].message.content;
      console.log('[LLM] Groq succeeded for skills extraction');
      const parsed = parseJsonResponse(responseText);
      if (Array.isArray(parsed)) {
        return parsed.filter((s) => typeof s === 'string' && s.trim());
      }
      return [];
    } catch (groqError) {
      console.log('[LLM] Groq failed, trying Gemini fallback for skills extraction');
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        systemInstruction: systemPrompt,
      });

      const truncated = resumeText.slice(0, 15000);
      const result = await callGeminiWithRetry(model, truncated);
      const responseText = result.response.text();

      if (!responseText) {
        console.log('[LLM] Both providers failed for skills extraction');
        return [];
      }
      
      console.log('[LLM] Gemini succeeded for skills extraction');
      const parsed = parseJsonResponse(responseText);
      if (Array.isArray(parsed)) {
        return parsed.filter((s) => typeof s === 'string' && s.trim());
      }
      return [];
    }
  } catch (error) {
    console.error('Failed to extract skills from resume:', error.message);
    return [];
  }
}
