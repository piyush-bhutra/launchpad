import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(toEmail, token) {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Verify your Launchpad account',
      html: `
        <h2>Welcome to Launchpad!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will expire once used.</p>
      `,
    });
  } catch (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function sendPasswordResetEmail(toEmail, token) {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Reset your Launchpad password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
      `,
    });
  } catch (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}
