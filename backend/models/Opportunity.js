import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  title: String,
  type: {
    type: String,
    enum: [
      'Internship',
      'Placement',
      'Hackathon',
      'Research',
      'Scholarship',
      'Competition',
      'Fellowship',
      'Workshop',
      'Conference',
      'Other',
    ],
  },
  organization: String,
  deadline: Date,
  description: String,
  eligibility: String,
  requiredSkills: [String],
  applyLink: String,
  gmailDeepLink: String,
  sourceEmailDate: Date,
  matchPercentage: {
    type: Number,
    default: 0,
  },
  matchStatus: {
    type: String,
    enum: ['High Match', 'Good Match', 'Partial Match', 'Low Match', 'Pending'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Interested', 'Applied', 'Rejected', 'Completed', 'Ignored', 'New'],
    default: 'New',
  },
  extractedAt: {
    type: Date,
    default: Date.now,
  },
});

opportunitySchema.index({ userId: 1, messageId: 1 }, { unique: true });
opportunitySchema.index({ userId: 1, deadline: 1 });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
