import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { decrypt } from './encryptionService.js';

function decodeBase64Url(data) {
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf8');
}

function getHeader(headers, name) {
  const header = headers?.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header?.value || '';
}

function extractBody(payload) {
  try {
    if (!payload) return '';

    if (payload.mimeType === 'text/plain' && payload.body?.data) {
      return decodeBase64Url(payload.body.data);
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return decodeBase64Url(part.body.data);
        }
      }

      for (const part of payload.parts) {
        const body = extractBody(part);
        if (body) return body;
      }
    }

    if (payload.body?.data) {
      return decodeBase64Url(payload.body.data);
    }

    return '';
  } catch (error) {
    console.error('Failed to extract email body:', error.message);
    return '';
  }
}

export async function getAuthenticatedClient(user) {
  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    const refreshToken = decrypt(user.encryptedRefreshToken);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    return oauth2Client;
  } catch (error) {
    throw new Error(`Failed to authenticate Gmail client: ${error.message}`);
  }
}

export async function fetchRecentEmails(user, isFirstScan) {
  try {
    const auth = await getAuthenticatedClient(user);
    const gmail = google.gmail({ version: 'v1', auth });

    let query =
      'subject:(placement OR internship OR hackathon OR scholarship OR fellowship OR competition OR hiring OR opportunity OR "off campus" OR "apply now" OR "last date" OR "registration open")';

    if (!isFirstScan) {
      query += ' newer_than:2d';
    }

    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 100,
    });

    const messages = listResponse.data.messages;
    if (!messages || messages.length === 0) {
      return [];
    }

    const emails = [];

    for (const { id: messageId } of messages) {
      try {
        const messageResponse = await gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full',
        });

        const message = messageResponse.data;
        const headers = message.payload?.headers || [];

        const subject = getHeader(headers, 'Subject');
        const from = getHeader(headers, 'From');
        const date = getHeader(headers, 'Date');
        const body = extractBody(message.payload) || message.snippet || '';

        emails.push({
          messageId,
          subject,
          from,
          date,
          body,
        });
      } catch (error) {
        console.error(`Failed to fetch message ${messageId}:`, error.message);
      }
    }

    return emails;
  } catch (error) {
    throw new Error(`Failed to fetch recent emails: ${error.message}`);
  }
}
