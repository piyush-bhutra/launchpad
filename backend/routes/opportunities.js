import express from 'express';
import mongoose from 'mongoose';
import Opportunity from '../models/Opportunity.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { runInitialScan } from '../jobs/emailPoller.js';
import rateLimit from 'express-rate-limit';

export const scanInProgress = new Map();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const router = express.Router();
const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    error: 'Scan limit reached. You can manually scan 3 times per hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});


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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const stats = await Opportunity.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(req.user.userId)
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgMatchPercentage: { $avg: '$matchPercentage' },
          byType: { $push: '$type' },
          byStatus: { $push: '$status' },
          byMatchStatus: { $push: '$matchStatus' }
        }
      }
    ]);

    const countOccurrences = (arr) => arr.reduce((acc, val) => {
      const key = val || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      total: stats[0]?.total || 0,
      avgMatchPercentage: Math.round(stats[0]?.avgMatchPercentage || 0),
      byType: countOccurrences(stats[0]?.byType || []),
      byStatus: countOccurrences(stats[0]?.byStatus || []),
      byMatchStatus: countOccurrences(stats[0]?.byMatchStatus || [])
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
});

router.post('/scan', verifyToken, scanLimiter, async (req, res) => {
  try {
    const userIdStr = req.user.userId.toString();

    if (scanInProgress.get(userIdStr)) {
      return res.status(409).json({ message: 'A scan is already in progress.' });
    }

    scanInProgress.set(userIdStr, true);
    res.status(202).json({ message: 'Scan started. Check back in a moment.' });

    console.log(`[Scan] Manual scan started in background by user ${userIdStr}`);
    
    runInitialScan(req.user.userId, { bypassOnboarding: true })
      .catch((error) => {
        console.error(`[Scan] Background scan failed for user ${userIdStr}:`, error.message);
      })
      .finally(() => {
        scanInProgress.delete(userIdStr);
      });
  } catch (error) {
    console.error('Manual scan error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, matchStatus, status, search, expired } = req.query;

    if (type) {
      const validTypes = ['Internship', 'Placement', 'Hackathon', 'Research', 'Scholarship', 'Competition', 'Fellowship', 'Workshop', 'Conference', 'Other'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
      }
    }

    if (matchStatus) {
      const validMatchStatuses = ['High Match', 'Good Match', 'Partial Match', 'Low Match', 'Pending'];
      if (!validMatchStatuses.includes(matchStatus)) {
        return res.status(400).json({ message: `MatchStatus must be one of: ${validMatchStatuses.join(', ')}` });
      }
    }

    if (search && search.length > 100) {
      return res.status(400).json({ message: 'Search query too long.' });
    }

    const filter = { 
      userId: req.user.userId
    };

    if (expired === 'false') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      filter.$or = [{ deadline: null }, { deadline: { $gte: startOfToday } }];
    }

    if (type) filter.type = type;
    if (matchStatus) filter.matchStatus = matchStatus;
    if (status) filter.status = status;

    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$and = [
        { $or: filter.$or },
        { $or: [{ title: regex }, { organization: regex }] }
      ];
      delete filter.$or;
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const total = await Opportunity.countDocuments(filter);
    const opportunities = await Opportunity.find(filter)
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      opportunities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get opportunities error:', error.message);
    res.status(500).json({ message: 'Failed to fetch opportunities.' });
  }
});

router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Interested', 'Applied', 'Rejected', 'Completed', 'Ignored', 'New'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of exactly: ${validStatuses.join(', ')}` });
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
