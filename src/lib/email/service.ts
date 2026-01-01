// src/lib/email/service.ts
import nodemailer from 'nodemailer';
import { createNodemailerTransport } from '@/lib/email/transports/nodemailer';
import { db } from '@/lib/db';
import { EmailStatus } from '@prisma/client';
import {
  renderSubmissionConfirmation,
  renderStatusUpdate,
  renderPasswordReset,
  renderWelcome,
  renderTwoFactorAuth,
  getSubmissionConfirmationSubject,
  getStatusUpdateSubject,
  getPasswordResetSubject,
  getWelcomeSubject,
  getTwoFactorAuthSubject,
  renderAdminNotification,
  getAdminNotificationSubject,
  renderEmailVerification,
  getEmailVerificationSubject,
} from './templates';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  locale?: 'ar' | 'en';
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isTestMode: boolean = false;

  constructor() {
    this.initializeTransport();
  }

  private initializeTransport() {
    // Check if SMTP credentials are available
    const hasSmtpCredentials =
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (hasSmtpCredentials) {
      try {
        this.transporter = createNodemailerTransport();
        this.isTestMode = false;
      } catch (error) {
        console.warn(
          '⚠️ Failed to initialize SMTP transport, falling back to test mode',
        );
        console.error('SMTP Error:', error);
        this.isTestMode = true;
      }
    } else {
      this.isTestMode = true;
    }
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<SendResult> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'Email transport not initialized',
      };
    }

    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: options.from || process.env.EMAIL_FROM || 'ebic@cit.edu.ly',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      // Log to database
      await this.logEmail({
        to: options.to,
        from: mailOptions.from as string,
        subject: options.subject,
        status: EmailStatus.SENT,
        messageId: info.messageId,
        template: 'custom',
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      console.error('❌ Email send error:', errorMessage);

      // Log failed email to database
      await this.logEmail({
        to: options.to,
        from: options.from || process.env.EMAIL_FROM || 'ebic@cit.edu.ly',
        subject: options.subject,
        status: EmailStatus.FAILED,
        errorMessage,
        template: 'custom',
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send submission confirmation email
   */
  async sendSubmissionConfirmation(
    type: 'collaborator' | 'innovator',
    data: {
      id: string;
      name?: string;
      companyName?: string;
      email: string;
    },
    locale: 'ar' | 'en' = 'en',
  ): Promise<SendResult> {
    try {
      const recipientName =
        type === 'collaborator' ? data.companyName : data.name;

      // Render template using React Email
      const html = await renderSubmissionConfirmation({
        name:
          recipientName || (locale === 'ar' ? 'شريك عزيز' : 'Valued Partner'),
        type,
        locale,
        submissionId: data.id,
      });

      const subject = getSubmissionConfirmationSubject(type, locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      console.error('Error rendering submission confirmation:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Template rendering failed',
      };
    }
  }

  /**
   * Send status update email (approval/rejection)
   */
  async sendStatusUpdate(
    type: 'collaborator' | 'innovator',
    data: {
      id: string;
      name?: string;
      companyName?: string;
      email: string;
    },
    status: 'approved' | 'rejected',
    options?: {
      reason?: string;
      nextSteps?: string[];
      locale?: 'ar' | 'en';
    },
  ): Promise<SendResult> {
    const locale = options?.locale || 'en';

    try {
      const recipientName =
        type === 'collaborator' ? data.companyName : data.name;

      // Render template using React Email
      const html = await renderStatusUpdate({
        name:
          recipientName || (locale === 'ar' ? 'شريك عزيز' : 'Valued Partner'),
        type,
        status,
        locale,
        reason: options?.reason,
        nextSteps: options?.nextSteps,
      });

      const subject = getStatusUpdateSubject(status, locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      console.error('Error rendering status update:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Template rendering failed',
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(
    data: {
      name: string;
      email: string;
      resetLink: string;
    },
    locale: 'ar' | 'en' = 'en',
    expiresIn?: string,
  ): Promise<SendResult> {
    try {
      const html = await renderPasswordReset({
        name: data.name,
        resetLink: data.resetLink,
        locale,
        expiresIn: expiresIn || (locale === 'ar' ? 'ساعة واحدة' : '1 hour'),
      });

      const subject = getPasswordResetSubject(locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send password reset',
      };
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcome(
    data: {
      name: string;
      email: string;
      role?: string;
      loginLink?: string;
    },
    locale: 'ar' | 'en' = 'en',
  ): Promise<SendResult> {
    try {
      const html = await renderWelcome({
        name: data.name,
        role: data.role,
        loginLink: data.loginLink,
        locale,
      });

      const subject = getWelcomeSubject(locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send welcome email',
      };
    }
  }

  /**
   * Send 2FA code email
   */
  async send2FA(
    data: {
      name: string;
      email: string;
      code: string;
    },
    locale: 'ar' | 'en' = 'en',
    expiresIn?: string,
  ): Promise<SendResult> {
    try {
      const html = await renderTwoFactorAuth({
        name: data.name,
        code: data.code,
        locale,
        expiresIn: expiresIn || (locale === 'ar' ? '10 دقائق' : '10 minutes'),
      });

      const subject = getTwoFactorAuthSubject(locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to send 2FA code',
      };
    }
  }
  
  /**
   * Send verification email
   */
  async sendEmailVerification(
    data: {
      name: string;
      email: string;
      verificationLink: string;
    },
    locale: 'ar' | 'en' = 'en',
    expiresIn?: string,
  ): Promise<SendResult> {
    try {
      const html = await renderEmailVerification({
        name: data.name,
        verificationLink: data.verificationLink,
        locale,
        expiresIn: expiresIn || (locale === 'ar' ? '24 ساعة' : '24 hours'),
      });

      const subject = getEmailVerificationSubject(locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send verification email',
      };
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(
    data: {
      adminName: string;
      email: string;
      title: string;
      message: string;
      actionUrl?: string;
      actionText?: string;
      priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
      timestamp?: Date;
    },
    locale: 'ar' | 'en' = 'en',
  ): Promise<SendResult> {
    try {
      const html = await renderAdminNotification({
        adminName: data.adminName,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        locale,
      });

      const subject = getAdminNotificationSubject(data.title, locale);

      return this.sendEmail({
        to: data.email,
        subject,
        html,
        locale,
      });
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send admin notification',
      };
    }
  }

  /**
   * Test connection to SMTP server
   */
  async testConnection(): Promise<{
    success: boolean;
    error?: string;
    provider?: string;
  }> {
    if (this.isTestMode) {
      return {
        success: true,
        provider: 'test-transport',
      };
    }

    if (!this.transporter) {
      return {
        success: false,
        error: 'Transport not initialized',
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        provider: process.env.EMAIL_PROVIDER || 'smtp',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        provider: process.env.EMAIL_PROVIDER || 'smtp',
      };
    }
  }

  /**
   * Log email to database
   */
  private async logEmail(data: {
    to: string;
    from: string;
    subject: string;
    status: EmailStatus;
    messageId?: string;
    errorMessage?: string;
    template: string;
  }) {
    try {
      await db.emailLog.create({
        data: {
          to: data.to,
          from: data.from,
          subject: data.subject,
          template: data.template,
          status: data.status,
          messageId: data.messageId,
          errorMessage: data.errorMessage,
          sentAt: data.status === EmailStatus.SENT ? new Date() : null,
        },
      });
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
