import cron from 'node-cron';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Opportunity from '../models/Opportunity.js';
import { fetchRecentEmails } from '../services/gmailService.js';
import { extractOpportunityData } from '../services/llmService.js';
import { calculateMatch } from '../services/matchingService.js';

async function processEmail(user, email, profile) {
  try {
    const existing = await Opportunity.findOne({ messageId: email.messageId });
    if (existing) return false;

    const extracted = await extractOpportunityData(
      email.body,
      email.subject,
      email.date
    );

    if (!extracted) return false;

    let matchPercentage = 0;
    let matchStatus = 'Pending';

    if (profile?.skills?.length > 0) {
      const match = calculateMatch(extracted, profile);
      matchPercentage = match.matchPercentage;
      matchStatus = match.matchStatus;
    }

    await Opportunity.create({
      userId: user._id,
      messageId: email.messageId,
      title: extracted.title,
      type: extracted.type || 'Other',
      organization: extracted.organization,
      deadline: extracted.deadline ? new Date(extracted.deadline) : undefined,
      description: extracted.description,
      eligibility: extracted.eligibility,
      requiredSkills: extracted.requiredSkills || [],
      applyLink: extracted.applyLink,
      gmailDeepLink: `https://mail.google.com/mail/u/0/#search/rfc822msgid:${email.messageId}`,
      sourceEmailDate: email.date ? new Date(email.date) : undefined,
      matchPercentage,
      matchStatus,
    });

    return true;
  } catch (error) {
    console.error(`Failed to process email ${email.messageId}:`, error.message);
    return false;
  }
}

async function processUserEmails(user, isFirstScan) {
  try {
    const profile = await Profile.findOne({ userId: user._id });

    if (!profile?.onboardingComplete) {
      console.log(`Skipping user ${user.email}: onboarding not complete.`);
      return 0;
    }

    const emails = await fetchRecentEmails(user, isFirstScan);
    let savedCount = 0;
    let skippedCount = 0;

    for (const email of emails) {
      const saved = await processEmail(user, email, profile);
      if (saved) {
        savedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `User ${user.email}: ${savedCount} new opportunities saved, ${skippedCount} skipped, ${emails.length} emails processed.`
    );

    return savedCount;
  } catch (error) {
    console.error(`Email poll failed for user ${user.email}:`, error.message);
    return 0;
  }
}

export function startEmailPoller() {
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('Starting scheduled email poll...');

      const users = await User.find({
        encryptedRefreshToken: { $exists: true, $ne: null },
      });

      for (const user of users) {
        await processUserEmails(user, false);
      }

      console.log('Scheduled email poll completed.');
    } catch (error) {
      console.error('Email poller error:', error.message);
    }
  });

  console.log('Email poller scheduled to run every 30 minutes.');
}

export async function runInitialScan(userId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.encryptedRefreshToken) {
      throw new Error('User has no Gmail connection.');
    }

    return await processUserEmails(user, true);
  } catch (error) {
    console.error('Initial scan error:', error.message);
    throw error;
  }
}
