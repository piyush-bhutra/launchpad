import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: String,
  branch: String,
  batch: String,
  cgpa: Number,
  skills: [String],
  resumeText: String,
  resumeUploadedAt: Date,
  onboardingComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
