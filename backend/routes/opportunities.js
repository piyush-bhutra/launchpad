import express from 'express';
import Opportunity from '../models/Opportunity.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { runInitialScan } from '../jobs/emailPoller.js';

const router = express.Router();

const ALLOWED_STATUSES = [
  'Interested',
  'Applied',
  'Rejected',
  'Completed',
  'Ignored',
  'New',
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

router.get('/deadlines', verifyToken, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      userId: req.user.userId,
      deadline: { $ne: null },
    }).sort({ deadline: 1 });

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekEnd = endOfDay(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
    const monthEnd = endOfDay(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));

    const today = [];
    const thisWeek = [];
    const thisMonth = [];
    const expired = [];

    for (const opp of opportunities) {
      const deadline = new Date(opp.deadline);

      if (deadline < todayStart) {
        expired.push(opp);
      } else if (deadline <= todayEnd) {
        today.push(opp);
      } else if (deadline <= weekEnd) {
        thisWeek.push(opp);
      } else if (deadline <= monthEnd) {
        thisMonth.push(opp);
      }
    }

    res.status(200).json({ today, thisWeek, thisMonth, expired });
  } catch (error) {
    console.error('Get deadlines error:', error.message);
    res.status(500).json({ message: 'Failed to fetch deadlines.' });
  }
});

router.get('/stats', verifyToken, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ userId: req.user.userId });

    const byType = {};
    const byStatus = {};
    const byMatchStatus = {};
    let totalMatch = 0;

    for (const opp of opportunities) {
      const typeKey = opp.type || 'Unknown';
      byType[typeKey] = (byType[typeKey] || 0) + 1;
      byStatus[opp.status] = (byStatus[opp.status] || 0) + 1;
      byMatchStatus[opp.matchStatus] = (byMatchStatus[opp.matchStatus] || 0) + 1;
      totalMatch += opp.matchPercentage || 0;
    }

    res.status(200).json({
      total: opportunities.length,
      byType,
      byStatus,
      byMatchStatus,
      averageMatchPercentage:
        opportunities.length > 0
          ? Math.round(totalMatch / opportunities.length)
          : 0,
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
});

router.post('/scan', verifyToken, async (req, res) => {
  try {
    console.log(`[Scan] Manual scan requested by user ${req.user.userId}`);
    const result = await runInitialScan(req.user.userId, { bypassOnboarding: true });

    res.status(200).json({
      success: true,
      scanned: result.saved,
      emailsFound: result.emailsFound,
      extractionsAttempted: result.extractionsAttempted,
      opportunitiesSaved: result.opportunitiesSaved,
      skipped: result.skipped,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Manual scan error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, matchStatus, status, search } = req.query;
    const filter = { userId: req.user.userId };

    if (type) filter.type = type;
    if (matchStatus) filter.matchStatus = matchStatus;
    if (status) filter.status = status;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { organization: regex }];
    }

    const opportunities = await Opportunity.find(filter).sort({ deadline: 1 });

    res.status(200).json(opportunities);
  } catch (error) {
    console.error('Get opportunities error:', error.message);
    res.status(500).json({ message: 'Failed to fetch opportunities.' });
  }
});

router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    opportunity.status = status;
    await opportunity.save();

    res.status(200).json(opportunity);
  } catch (error) {
    console.error('Update opportunity status error:', error.message);
    res.status(500).json({ message: 'Failed to update opportunity status.' });
  }
});

export default router;
