import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

// Create transporter - for development, you can use a test account
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  
  try {
  await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Auth App" <noreply@example.com>',
    to: email,
    subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  
  try {
  await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Auth App" <noreply@example.com>',
    to: email,
    subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
};

export const sendTwoFactorTokenEmail = async (
  email: string, 
  token: string,
) => {
  try {
  await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Auth App" <noreply@example.com>',
    to: email,
      subject: "2FA Code",
      html: `<p>Your 2FA code: ${token}</p>`,
    });
  } catch (error) {
    console.error("Failed to send 2FA token email:", error);
  }
};
