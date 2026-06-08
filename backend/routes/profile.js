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

    console.log(`[Resume Flow] Profile loaded for user ${req.user.userId}. Skills count: ${profile.skills?.length || 0}`);
    res.status(200).json(profile);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, branch, batch, cgpa, skills } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.length > 100) {
        return res.status(400).json({ message: 'Name must be a string up to 100 characters.' });
      }
    }

    if (branch !== undefined) {
      const validBranches = ['CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil', 'AIDS', 'CSBS', 'other'];
      if (!validBranches.includes(branch)) {
        return res.status(400).json({ message: `Branch must be one of: ${validBranches.join(', ')}` });
      }
    }

    if (batch !== undefined) {
      if (typeof batch !== 'string' || !/^\d{4}$/.test(batch)) {
        return res.status(400).json({ message: 'Batch must be a 4 digit year string.' });
      }
      const year = parseInt(batch, 10);
      if (year < 2015 || year > 2035) {
        return res.status(400).json({ message: 'Batch must be between 2015 and 2035.' });
      }
    }

    if (cgpa !== undefined) {
      if (typeof cgpa !== 'number' || cgpa < 0 || cgpa > 10) {
        return res.status(400).json({ message: 'CGPA must be a number between 0 and 10.' });
      }
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({ message: 'Skills must be an array of strings.' });
      }
      if (skills.length > 30) {
        return res.status(400).json({ message: 'Skills array cannot exceed 30 items.' });
      }
      for (const skill of skills) {
        if (typeof skill !== 'string' || skill.length > 50) {
          return res.status(400).json({ message: 'Each skill must be a string up to 50 characters.' });
        }
      }
    }

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
