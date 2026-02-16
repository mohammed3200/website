import { parsePhoneNumber } from 'libphonenumber-js';
import { db } from '@/lib/db';
import { WhatsAppTransport } from './transports/wapi';
import { MessageStatus, Channel } from '@prisma/client';

export class WhatsAppService {
  private transport: WhatsAppTransport;

  constructor() {
    this.transport = new WhatsAppTransport();
  }

  /**
   * Send a plain text message via WhatsApp
   */
  async sendMessage(
    to: string,
    body: string,
    options: {
      marketing?: boolean;
      templateSlug?: string;
    } = {},
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // 1. Basic Validation
    if (!this.validateNumber(to)) {
      await this.logMessage(
        to,
        body || '',
        MessageStatus.FAILED,
        undefined,
        undefined,
        'Invalid phone number format',
      );
      return { success: false, error: 'Invalid phone number' };
    }

    // 2. Normalize and Send via Transport
    const normalizedTo = this.normalizePhone(to);
    if (!normalizedTo) {
      await this.logMessage(
        to,
        body || '',
        MessageStatus.FAILED,
        undefined,
        undefined,
        'Invalid phone number format',
      );
      return { success: false, error: 'Invalid phone number' };
    }

    const response = await this.transport.send(normalizedTo, body);

    // 3. Log Result
    const status = response.error ? MessageStatus.FAILED : MessageStatus.SENT;
    await this.logMessage(
      to,
      body,
      status,
      options.templateSlug,
      response.messageId,
      response.error,
    );

    return {
      success: !response.error,
      messageId: response.messageId,
      error: response.error,
    };
  }

  /**
   * Send a DB-driven template message
   */
  async sendTemplate(
    slug: string,
    to: string,
    variables: Record<string, string>,
    locale: 'ar' | 'en' = 'ar',
  ) {
    // 1. Fetch Template
    const template = await db.messageTemplate.findFirst({
      where: { slug, isActive: true },
    });

    if (!template) {
      console.error(`❌ Template not found or inactive: ${slug}`);
      return { success: false, error: 'Template not found' };
    }

    if (template.channel === Channel.EMAIL) {
      console.error(`❌ Template ${slug} is configured for EMAIL only.`);
      return { success: false, error: 'Template not supported on WhatsApp' };
    }

    // 2. Interpolate Variables
    let body = locale === 'ar' ? template.bodyAr : template.bodyEn;

    // Replace {{variable}} placeholders (SAFE)
    for (const [key, value] of Object.entries(variables)) {
      const token = `{{${key}}}`;
      body = body.split(token).join(value);
    }

    // 3. Send
    return this.sendMessage(to, body, { templateSlug: slug });
  }

  /**
   * Strict validation ensuring E.164 compliance via normalizePhone
   */
  validateNumber(phone: string): boolean {
    const cleaned = this.normalizePhone(phone);
    return !!cleaned;
  }

  /**
   * Normalizes phone number to E.164 international format (e.g. +218...)
   * Defaults to Libya (LY) if no country code provided.
   * Returns null if invalid.
   */
  normalizePhone(phone: string): string | null {
    try {
      const phoneNumber = parsePhoneNumber(phone, 'LY');
      if (phoneNumber && phoneNumber.isValid()) {
        return phoneNumber.number as string;
      }
    } catch (e) {
      // Invalid format
    }
    return null;
  }

  private async logMessage(
    to: string,
    body: string, // Not storing body in log currently to save space, but could add if needed
    status: MessageStatus,
    template?: string,
    messageId?: string,
    errorMessage?: string,
  ) {
    try {
      await db.whatsAppLog.create({
        data: {
          to,
          from: 'SYSTEM', // or configured sender
          template: template || 'MANUAL',
          status,
          messageId,
          errorMessage,
          sentAt: status === MessageStatus.SENT ? new Date() : null,
        },
      });
    } catch (e) {
      console.error('Failed to create WhatsApp log:', e);
    }
  }
}

export const whatsAppService = new WhatsAppService();
