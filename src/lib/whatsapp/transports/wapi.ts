interface WhatsAppTransportOptions {
  apiUrl: string;
  apiToken: string;
  senderNumber: string;
}

export class WhatsAppTransport {
  private options: WhatsAppTransportOptions;

  constructor(options: Partial<WhatsAppTransportOptions> = {}) {
    this.options = {
      apiUrl: options.apiUrl || process.env.WHATSAPP_API_URL || '',
      apiToken: options.apiToken || process.env.WHATSAPP_API_TOKEN || '',
      senderNumber:
        options.senderNumber || process.env.WHATSAPP_SENDER_NUMBER || '',
    };
  }

  async send(
    to: string,
    body: string,
  ): Promise<{ messageId?: string; error?: string }> {
    if (!this.options.apiUrl || !this.options.apiToken) {
      console.warn(
        '⚠️ WhatsApp API not configured. Logging message to console only.',
      );
      console.log(
        `[WhatsApp] To: ${to.slice(0, 4)}... | Body: [REDACTED] (${body.length} chars)`,
      );
      return { messageId: `mock-${Date.now()}` };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      // Example implementation for a generic JSON API
      // Adjust based on the actual provider (e.g. UltraMsg, WAPIfy, Twilio)
      const response = await fetch(`${this.options.apiUrl}/messages/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.options.apiToken}`,
        },
        body: JSON.stringify({
          to: to,
          body: body,
          sender: this.options.senderNumber,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `WhatsApp API error: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return { messageId: data.id || data.messageId };
    } catch (error: any) {
      console.error('❌ WhatsApp Transport Error:', error);
      return { error: error.message };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
