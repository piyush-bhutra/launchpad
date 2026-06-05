import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { encrypt } from '../services/encryptionService.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/emailService.js';

const router = express.Router();

const VIT_EMAIL_SUFFIX = '@vitstudent.ac.in';

function isVitEmail(email) {
  return email?.toLowerCase().endsWith(VIT_EMAIL_SUFFIX);
}

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpiry;
  delete obj.encryptedAccessToken;
  delete obj.encryptedRefreshToken;
  return obj;
}

function getOAuth2Client() {
  // TODO: requires GOOGLE_CLIENT_ID in env
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isVitEmail(email)) {
      return res.status(400).json({ message: 'Only @vitstudent.ac.in emails are allowed.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationToken,
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Verify email error:', error.message);
    res.status(500).json({ message: 'Email verification failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isVitEmail(email)) {
      return res.status(400).json({ message: 'Only @vitstudent.ac.in emails are allowed.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (email) {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();
        await sendPasswordResetEmail(user.email, resetToken);
      }
    }

    res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Password reset request failed.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Password reset failed.' });
  }
});

router.get('/google', async (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(500).json({ message: 'Failed to initiate Google authentication.' });
  }
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is missing.' });
    }

    // TODO: requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    if (!isVitEmail(googleUser.email)) {
      return res.status(400).json({ message: 'Only @vitstudent.ac.in emails are allowed.' });
    }

    let user = await User.findOne({ googleId: googleUser.id });

    if (!user) {
      user = await User.findOne({ email: googleUser.email.toLowerCase() });

      if (user) {
        user.googleId = googleUser.id;
      } else {
        user = new User({
          googleId: googleUser.id,
          email: googleUser.email.toLowerCase(),
        });
      }
    }

    if (tokens.access_token) {
      user.encryptedAccessToken = encrypt(tokens.access_token);
    }
    if (tokens.refresh_token) {
      user.encryptedRefreshToken = encrypt(tokens.refresh_token);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`);
  } catch (error) {
    console.error('Google callback error:', error.message);
    res.status(500).json({ message: 'Google authentication failed.' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Get me error:', error.message);
    res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
});

export default router;
