import express from 'express';
import { PDFParse } from 'pdf-parse';
import Profile from '../models/Profile.js';
import Opportunity from '../models/Opportunity.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { resume as resumeUpload } from '../middleware/uploadMiddleware.js';
import { calculateMatch } from '../services/matchingService.js';
import { extractSkillsFromResume } from '../services/llmService.js';

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

    const extractedSkills = await extractSkillsFromResume(resumeText);
    console.log(`[Resume] Extracted ${extractedSkills.length} skills from resume`);

    profile.resumeText = resumeText;
    profile.resumeUploadedAt = new Date();
    if (extractedSkills.length > 0) {
      profile.skills = extractedSkills;
    }
    await profile.save();
    console.log(`[Resume Flow] Resume and ${profile.skills.length} skills saved to Profile (userId: ${req.user.userId})`);

    const opportunities = await Opportunity.find({ userId: req.user.userId });

    if (opportunities.length > 0) {
      await Opportunity.bulkWrite(
        opportunities.map(opp => {
          const match = calculateMatch(opp, profile);
          return {
            updateOne: {
              filter: { _id: opp._id },
              update: {
                $set: {
                  matchPercentage: match.matchPercentage,
                  matchStatus: match.matchStatus
                }
              }
            }
          };
        })
      );
      console.log(`Updated match scores for ${opportunities.length} opportunities`);
    }

    res.status(200).json({
      message: 'Resume uploaded successfully.',
      characterCount: resumeText.length,
      skillsExtracted: extractedSkills.length,
      skills: profile.skills || [],
    });
  } catch (error) {
    console.error('Resume upload error:', error.message);
    res.status(500).json({ message: 'Failed to upload resume.' });
  }
});

export default router;
