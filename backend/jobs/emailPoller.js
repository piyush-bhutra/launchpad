import cron from 'node-cron';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Opportunity from '../models/Opportunity.js';
import { fetchRecentEmails } from '../services/gmailService.js';
import { extractOpportunityData } from '../services/llmService.js';
import { calculateMatch } from '../services/matchingService.js';
import { scanInProgress } from '../routes/opportunities.js';

function createScanStats() {
  return {
    emailsFound: 0,
    extractionsAttempted: 0,
    opportunitiesSaved: 0,
    skipped: 0,
    errors: [],
  };
}

async function processEmail(user, email, profile, stats) {
  try {
    const existing = await Opportunity.findOne({
      userId: user._id,
      messageId: email.messageId,
    });

    if (existing) {
      stats.skipped++;
      console.log(`[Scan] Skipped duplicate messageId ${email.messageId}`);
      return false;
    }

    if (!email.subject.match(/internship|placement|hiring|job|recruitment|career|scholarship|fellowship|research|apply now|registration open|opportunity/i)) {
      console.log('[Scan] Skipping non-opportunity email:', email.subject);
      stats.skipped++;
      return false;
    }

    stats.extractionsAttempted++;
    console.log(`[Scan] Gemini extraction attempted for: "${email.subject}"`);

    const extracted = await extractOpportunityData(
      email.body,
      email.subject,
      email.date
    );

    if (!extracted) {
      stats.skipped++;
      console.log(`[Scan] Gemini returned null for: "${email.subject}"`);
      return false;
    }

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

    stats.opportunitiesSaved++;
    console.log(`[Scan] Opportunity saved: "${extracted.title || email.subject}"`);
    return true;
  } catch (error) {
    stats.errors.push({ messageId: email.messageId, subject: email.subject, error: error.message });
    console.error(`[Scan] Error processing ${email.messageId}:`, error.message);
    return false;
  }
}

async function processUserEmails(user, isFirstScan, options = {}) {
  const { bypassOnboarding = false } = options;
  const stats = createScanStats();

  try {
    let profile = await Profile.findOne({ userId: user._id });

    if (!bypassOnboarding && !profile?.onboardingComplete) {
      console.log(`[Scan] Skipping user ${user.email}: onboarding not complete.`);
      return { saved: 0, ...stats };
    }

    if (bypassOnboarding) {
      if (!profile) {
        profile = await Profile.create({ userId: user._id, onboardingComplete: true });
        console.log(`[Scan] Created profile with onboardingComplete for ${user.email}`);
      } else if (!profile.onboardingComplete) {
        profile.onboardingComplete = true;
        await profile.save();
        console.log(`[Scan] Marked onboardingComplete for ${user.email}`);
      }
    }

    console.log(`[Scan] Fetching Gmail messages for ${user.email} (firstScan=${isFirstScan})`);
    const emails = await fetchRecentEmails(user, isFirstScan);
    stats.emailsFound = emails.length;
    console.log(`[Scan] Gmail messages found: ${emails.length}`);

    for (const email of emails) {
      await processEmail(user, email, profile, stats);
    }

    console.log(
      `[Scan] User ${user.email} complete — saved: ${stats.opportunitiesSaved}, ` +
      `skipped: ${stats.skipped}, extractions: ${stats.extractionsAttempted}, ` +
      `errors: ${stats.errors.length}`
    );

    return { saved: stats.opportunitiesSaved, ...stats };
  } catch (error) {
    stats.errors.push({ error: error.message });
    console.error(`[Scan] Email poll failed for user ${user.email}:`, error.message);
    return { saved: 0, ...stats };
  }
}

export function startEmailPoller() {
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('[Poller] Starting scheduled email poll...');

      const users = await User.find({
        encryptedRefreshToken: { $exists: true, $ne: null },
      });

      for (const user of users) {
        try {
          const userIdStr = user._id.toString();
          if (scanInProgress.get(userIdStr)) {
            console.log(`Skipping user scan, manual scan in progress: ${userIdStr}`);
            continue;
          }
          await processUserEmails(user, false);
        } catch (userErr) {
          console.error(`[Poller] Unexpected error for user ${user._id}:`, userErr.message);
        }
      }

      console.log('[Poller] Scheduled email poll completed.');
    } catch (error) {
      console.error('[Poller] Email poller error:', error.message);
    }
  });

  console.log('Email poller started');
}

export async function runInitialScan(userId, options = {}) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.encryptedRefreshToken) {
      throw new Error('User has no Gmail connection.');
    }

    return await processUserEmails(user, true, options);
  } catch (error) {
    console.error('[Scan] Initial scan error:', error.message);
    throw error;
  }
}
