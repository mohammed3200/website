// src/lib/email/service.ts
import nodemailer from 'nodemailer';
import { createNodemailerTransport } from "@/lib/email/transports/nodemailer";
import { db } from '@/lib/db';
import { EmailStatus } from '@prisma/client';

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

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isTestMode: boolean = false;

  constructor() {
    this.initializeTransport();
  }

  private initializeTransport() {
    // Check if SMTP credentials are available
    const hasSmtpCredentials = 
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS;

    if (hasSmtpCredentials) {
      try {
        this.transporter = createNodemailerTransport();
        this.isTestMode = false;
        console.log('✅ Email service initialized with SMTP transport');
      } catch (error) {
        console.warn('⚠️ Failed to initialize SMTP transport, falling back to test mode');
        console.error('SMTP Error:', error);
        this.isTestMode = true;
      }
    } else {
      console.log('📧 No SMTP credentials found, using test transport');
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
        error: 'Email transport not initialized'
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
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
    locale: 'ar' | 'en' = 'en'
  ): Promise<SendResult> {
    const isArabic = locale === 'ar';
    
    const subject = isArabic
      ? type === 'collaborator'
        ? 'تم استلام طلب التعاون'
        : 'تم استلام طلب الابتكار'
      : type === 'collaborator'
        ? 'Collaboration Request Received'
        : 'Innovation Request Received';

    const recipientName = type === 'collaborator' ? data.companyName : data.name;

    const html = this.generateSubmissionConfirmationHTML(
      recipientName || 'Valued Partner',
      type,
      locale
    );

    return this.sendEmail({
      to: data.email,
      subject,
      html,
      locale,
    });
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
    }
  ): Promise<SendResult> {
    const locale = options?.locale || 'en';
    const isArabic = locale === 'ar';
    
    const subject = isArabic
      ? status === 'approved'
        ? '✅ تمت الموافقة على طلبك'
        : '❌ تم رفض طلبك'
      : status === 'approved'
        ? '✅ Your Request Has Been Approved'
        : '❌ Your Request Has Been Rejected';

    const recipientName = type === 'collaborator' ? data.companyName : data.name;

    const html = this.generateStatusUpdateHTML(
      recipientName || 'Valued Partner',
      status,
      type,
      options?.reason,
      options?.nextSteps,
      locale
    );

    return this.sendEmail({
      to: data.email,
      subject,
      html,
      locale,
    });
  }

  /**
   * Test connection to SMTP server
   */
  async testConnection(): Promise<{ success: boolean; error?: string; provider?: string }> {
    if (this.isTestMode) {
      return {
        success: true,
        provider: 'test-transport'
      };
    }

    if (!this.transporter) {
      return {
        success: false,
        error: 'Transport not initialized'
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        provider: process.env.EMAIL_PROVIDER || 'smtp'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        provider: process.env.EMAIL_PROVIDER || 'smtp'
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

  /**
   * Generate submission confirmation HTML
   */
  private generateSubmissionConfirmationHTML(
    name: string,
    type: 'collaborator' | 'innovator',
    locale: 'ar' | 'en'
  ): string {
    const isArabic = locale === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';
    
    if (isArabic) {
      return `
<!DOCTYPE html>
<html dir="${dir}" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Arial', sans-serif; direction: ${dir}; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #fe6601 0%, #fd7724 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; margin-top: 0; }
    .content p { color: #666; line-height: 1.8; font-size: 16px; }
    .highlight { background-color: #fff3e0; padding: 20px; border-radius: 8px; border-right: 4px solid #fe6601; margin: 20px 0; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 مركز مصراتة لريادة الأعمال</h1>
    </div>
    <div class="content">
      <h2>عزيزي/عزيزتي ${name}،</h2>
      <p>نشكركم على اهتمامكم ${type === 'collaborator' ? 'بالتعاون معنا' : 'بتقديم مشروعكم الابتكاري'}.</p>
      <div class="highlight">
        <p><strong>✅ تم استلام طلبك بنجاح</strong></p>
        <p>يقوم فريقنا حالياً بمراجعة ${type === 'collaborator' ? 'طلب التعاون' : 'مشروعك'} بعناية. سنقوم بالتواصل معكم في أقرب وقت ممكن.</p>
      </div>
      <p><strong>ماذا بعد؟</strong></p>
      <ul>
        <li>سيتم مراجعة ${type === 'collaborator' ? 'معلومات شركتكم' : 'تفاصيل مشروعكم'} من قبل فريق متخصص</li>
        <li>ستصلكم رسالة تأكيد خلال 3-5 أيام عمل</li>
        <li>في حالة الموافقة، سنتواصل معكم لترتيب الخطوات القادمة</li>
      </ul>
      <p>نقدر صبركم ونتطلع للعمل معكم!</p>
      <p>مع أطيب التحيات،<br><strong>فريق مركز مصراتة لريادة الأعمال</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} مركز مصراتة لريادة الأعمال |كلية التقنية الصناعية - مصراتة</p>
      <p>📧 ebic@cit.edu.ly | 🌐 www.cit.edu.ly</p>
    </div>
  </div>
</body>
</html>`;
    } else {
      return `
<!DOCTYPE html>
<html dir="${dir}" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Arial', sans-serif; direction: ${dir}; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #fe6601 0%, #fd7724 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; margin-top: 0; }
    .content p { color: #666; line-height: 1.8; font-size: 16px; }
    .highlight { background-color: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #fe6601; margin: 20px 0; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Misurata Entrepreneurship Center</h1>
    </div>
    <div class="content">
      <h2>Dear ${name},</h2>
      <p>Thank you for your interest in ${type === 'collaborator' ? 'collaborating with us' : 'submitting your innovative project'}.</p>
      <div class="highlight">
        <p><strong>✅ Your Request Has Been Received</strong></p>
        <p>Our team is currently reviewing your ${type === 'collaborator' ? 'collaboration request' : 'project'} carefully. We will contact you as soon as possible.</p>
      </div>
      <p><strong>What's Next?</strong></p>
      <ul>
        <li>Your ${type === 'collaborator' ? 'company information' : 'project details'} will be reviewed by a specialized team</li>
        <li>You will receive a confirmation email within 3-5 business days</li>
        <li>If approved, we will contact you to arrange the next steps</li>
      </ul>
      <p>We appreciate your patience and look forward to working with you!</p>
      <p>Best regards,<br><strong>Misurata Entrepreneurship Center Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Misurata Entrepreneurship Center | Misurata College of Industrial Technology</p>
      <p>📧 ebic@cit.edu.ly | 🌐 www.cit.edu.ly</p>
    </div>
  </div>
</body>
</html>`;
    }
  }

  /**
   * Generate status update HTML
   */
  private generateStatusUpdateHTML(
    name: string,
    status: 'approved' | 'rejected',
    type: 'collaborator' | 'innovator',
    reason?: string,
    nextSteps?: string[],
    locale: 'ar' | 'en' = 'en'
  ): string {
    const isArabic = locale === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';
    const isApproved = status === 'approved';
    
    if (isArabic) {
      return `
<!DOCTYPE html>
<html dir="${dir}" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Arial', sans-serif; direction: ${dir}; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: ${isApproved ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}; padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; margin-top: 0; }
    .content p { color: #666; line-height: 1.8; font-size: 16px; }
    .highlight { background-color: ${isApproved ? '#f0fdf4' : '#fef2f2'}; padding: 20px; border-radius: 8px; border-right: 4px solid ${isApproved ? '#10b981' : '#ef4444'}; margin: 20px 0; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isApproved ? '✅' : '❌'} مركز مصراتة لريادة الأعمال</h1>
    </div>
    <div class="content">
      <h2>عزيزي/عزيزتي ${name}،</h2>
      <div class="highlight">
        <p><strong>${isApproved ? '🎉 تمت الموافقة على طلبك!' : '😔 نأسف لإبلاغك'}</strong></p>
        <p>${isApproved 
          ? `يسرنا إبلاغكم بأنه تمت الموافقة على ${type === 'collaborator' ? 'طلب التعاون الخاص بكم' : 'مشروعكم الابتكاري'}!`
          : `بعد المراجعة الدقيقة، لم نتمكن من قبول ${type === 'collaborator' ? 'طلب التعاون' : 'المشروع'} في هذا الوقت.`
        }</p>
      </div>
      ${reason ? `<p><strong>السبب:</strong> ${reason}</p>` : ''}
      ${nextSteps && nextSteps.length > 0 ? `
        <p><strong>الخطوات القادمة:</strong></p>
        <ul>
          ${nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      ` : ''}
      <p>نقدر اهتمامكم ونتطلع ${isApproved ? 'للعمل معكم' : 'لفرص تعاون مستقبلية'}!</p>
      <p>مع أطيب التحيات،<br><strong>فريق مركز مصراتة لريادة الأعمال</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} مركز مصراتة لريادة الأعمال | كلية التقنية الصناعية - مصراتة</p>
      <p>📧 ebic@cit.edu.ly | 🌐 www.cit.edu.ly</p>
    </div>
  </div>
</body>
</html>`;
    } else {
      return `
<!DOCTYPE html>
<html dir="${dir}" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Arial', sans-serif; direction: ${dir}; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: ${isApproved ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}; padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; margin-top: 0; }
    .content p { color: #666; line-height: 1.8; font-size: 16px; }
    .highlight { background-color: ${isApproved ? '#f0fdf4' : '#fef2f2'}; padding: 20px; border-radius: 8px; border-left: 4px solid ${isApproved ? '#10b981' : '#ef4444'}; margin: 20px 0; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isApproved ? '✅' : '❌'} Misurata Entrepreneurship Center</h1>
    </div>
    <div class="content">
      <h2>Dear ${name},</h2>
      <div class="highlight">
        <p><strong>${isApproved ? '🎉 Your Request Has Been Approved!' : '😔 We Regret to Inform You'}</strong></p>
        <p>${isApproved 
          ? `We are pleased to inform you that your ${type === 'collaborator' ? 'collaboration request' : 'innovative project'} has been approved!`
          : `After careful review, we were unable to accept your ${type === 'collaborator' ? 'collaboration request' : 'project'} at this time.`
        }</p>
      </div>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      ${nextSteps && nextSteps.length > 0 ? `
        <p><strong>Next Steps:</strong></p>
        <ul>
          ${nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      ` : ''}
      <p>We appreciate your interest and look forward to ${isApproved ? 'working with you' : 'future collaboration opportunities'}!</p>
      <p>Best regards,<br><strong>Misurata Entrepreneurship Center Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Misurata Entrepreneurship Center | Misurata College of Industrial Technology</p>
      <p>📧 ebic@cit.edu.ly | 🌐 www.cit.edu.ly</p>
    </div>
  </div>
</body>
</html>`;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();