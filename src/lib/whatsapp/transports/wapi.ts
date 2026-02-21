/**
 * WhatsApp Transport — UltraMsg Provider
 * --------------------------------------
 * API Docs: https://docs.ultramsg.com/api/send-messages/chat-messages
 *
 * Required env vars:
 *   WHATSAPP_API_URL      = https://api.ultramsg.com/{instance_id}
 *   WHATSAPP_API_TOKEN    = your UltraMsg token
 *   WHATSAPP_SENDER_NUMBER = your WhatsApp number (e.g. +218921234567)
 *
 * How to get credentials:
 *   1. Sign up at ultramsg.com (free)
 *   2. Create an instance and scan the QR code with your WhatsApp
 *   3. Go to Settings → copy Instance ID and Token
 */

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
    // Mock mode — no credentials set
    if (!this.options.apiUrl || !this.options.apiToken) {
      console.warn(
        '⚠️  WhatsApp API not configured. Running in mock mode (no real message sent).',
      );
      console.log(
        `[WhatsApp MOCK] To: ${to.slice(0, 6)}... | Length: ${body.length} chars`,
      );
      return { messageId: `mock-${Date.now()}` };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      // UltraMsg API: POST /messages/chat
      // Credentials passed as form fields (token + to + body)
      const form = new URLSearchParams({
        token: this.options.apiToken,
        to: to,
        body: body,
      });

      const response = await fetch(`${this.options.apiUrl}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          (data as any).error ||
            (data as any).message ||
            `UltraMsg API error: ${response.status} ${response.statusText}`,
        );
      }

      // UltraMsg returns: { "sent": "true", "message": "ok", "id": "..." }
      const sent = (data as any).sent === 'true' || (data as any).sent === true;
      if (!sent) {
        throw new Error((data as any).message || 'Message not sent');
      }

      return {
        messageId: String((data as any).id || `ultramsg-${Date.now()}`),
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('❌ WhatsApp Transport: Request timed out (15s)');
        return { error: 'Request timed out' };
      }
      console.error('❌ WhatsApp Transport Error:', error.message);
      return { error: error.message };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
