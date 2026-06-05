import express from 'express';
import Profile from '../models/Profile.js';
import Opportunity from '../models/Opportunity.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { calculateMatch } from '../services/matchingService.js';

const router = express.Router();

async function recalculateAllMatches(userId, profile) {
  const opportunities = await Opportunity.find({ userId });

  for (const opportunity of opportunities) {
    const { matchPercentage, matchStatus } = calculateMatch(opportunity, profile);
    opportunity.matchPercentage = matchPercentage;
    opportunity.matchStatus = matchStatus;
    await opportunity.save();
  }
}

router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, branch, batch, cgpa, skills } = req.body;

    let profile = await Profile.findOne({ userId: req.user.userId });
    const skillsUpdated = skills !== undefined;

    if (!profile) {
      profile = new Profile({ userId: req.user.userId });
    }

    if (name !== undefined) profile.name = name;
    if (branch !== undefined) profile.branch = branch;
    if (batch !== undefined) profile.batch = batch;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (skills !== undefined) profile.skills = skills;

    profile.onboardingComplete = true;
    await profile.save();

    if (skillsUpdated && profile.resumeText) {
      await recalculateAllMatches(req.user.userId, profile);
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

export default router;
