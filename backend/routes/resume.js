import express from 'express';
import { PDFParse } from 'pdf-parse';
import Profile from '../models/Profile.js';
import Opportunity from '../models/Opportunity.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { resume as resumeUpload } from '../middleware/uploadMiddleware.js';
import { calculateMatch } from '../services/matchingService.js';

const router = express.Router();

router.post('/upload', verifyToken, (req, res, next) => {
  resumeUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    const resumeText = pdfData.text;

    let profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) {
      profile = await Profile.create({ userId: req.user.userId });
    }

    profile.resumeText = resumeText;
    profile.resumeUploadedAt = new Date();
    await profile.save();

    const pendingOpportunities = await Opportunity.find({
      userId: req.user.userId,
      matchStatus: 'Pending',
    });

    for (const opportunity of pendingOpportunities) {
      const { matchPercentage, matchStatus } = calculateMatch(opportunity, profile);
      opportunity.matchPercentage = matchPercentage;
      opportunity.matchStatus = matchStatus;
      await opportunity.save();
    }

    res.status(200).json({
      message: 'Resume uploaded successfully.',
      characterCount: resumeText.length,
    });
  } catch (error) {
    console.error('Resume upload error:', error.message);
    res.status(500).json({ message: 'Failed to upload resume.' });
  }
});

export default router;
