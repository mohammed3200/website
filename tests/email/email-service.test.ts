import { Transporter } from 'nodemailer';

// Import SendMailOptions from nodemailer
import { SendMailOptions } from 'nodemailer';
/**
 * @jest-environment node
 */

import dotenv from 'dotenv';
import path from 'path';
import { createNodemailerTransport } from '../../src/lib/email/transports/nodemailer';

// Load .env so the SMTP credentials from the repository are available
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

jest.setTimeout(30000);

describe('Nodemailer transport - integration send', () => {
  it('should send an email to wwyuu799@gmail.com using SMTP env vars', async () => {
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      throw new Error(
        `Missing SMTP env vars: ${missing.join(', ')} - cannot run integration test`,
      );
    }
    const transporter: Transporter = createNodemailerTransport();

    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const to = 'wwyuu799@gmail.com';

    const mailOptions: SendMailOptions = {
      from,
      to,
      subject: 'Integration test email from repository',
      text: 'This is a test email sent by the automated integration test.',
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Send info:', info);

    expect(info).toBeDefined();
    // Different transports/platforms provide different shapes; check common fields
    expect(info.messageId || info.accepted).toBeDefined();

    if (typeof transporter.close === 'function')
      try {
        transporter.close();
      } catch (e) {
        console.error('Error closing transporter:', e);
      }
    if (
      typeof (transporter as Transporter & { close?: () => void }).close ===
      'function'
    ) {
      try {
        (transporter as Transporter & { close?: () => void }).close!();
      } catch (e) {
        console.error('Error closing transporter:', e);
      }
    }
  });
});
