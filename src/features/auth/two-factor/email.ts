/**
 * 2FA email payload builder + queue enqueue helper.
 * Re-uses the existing emailService.send2FA template renderer and the
 * email queue (so this path is identical to the one verified in Task 4).
 */
import { renderTwoFactorAuth, getTwoFactorAuthSubject } from '@/lib/email/templates';
import { emailService } from '@/lib/email/service';

export interface TwoFactorEmailPayload {
  to: string;
  subject: string;
  html: string;
  locale: 'ar' | 'en';
}

export function build2FAEmailPayload(
  name: string,
  email: string,
  code: string,
  locale: 'ar' | 'en',
): TwoFactorEmailPayload & { name: string; code: string } {
  return {
    to: email,
    subject: getTwoFactorAuthSubject(locale),
    html: '', // filled in by enqueue2FAEmail (the renderer is async)
    locale,
    name,
    code,
  };
}

export async function enqueue2FAEmail(payload: ReturnType<typeof build2FAEmailPayload>) {
  const html = await renderTwoFactorAuth({
    name: payload.name,
    code: payload.code,
    locale: payload.locale,
    expiresIn: payload.locale === 'ar' ? '10 دقائق' : '10 minutes',
  });

  // Use the existing async email queue path verified in Task 4
  const result = await emailService.sendEmailAsync({
    to: payload.to,
    subject: payload.subject,
    html,
    locale: payload.locale,
  });

  return { ok: result.success, jobId: result.jobId };
}

export async function sendLockoutAlert(
  email: string,
  name: string,
  locale: 'ar' | 'en',
) {
  const subject =
    locale === 'ar'
      ? '⚠️ تم قفل حسابك مؤقتاً'
      : '⚠️ Your account has been temporarily locked';

  const html =
    locale === 'ar'
      ? `<p dir="rtl">${name}،</p>
         <p dir="rtl">تم تجاوز الحد المسموح لمحاولات إدخال رمز التحقق. حسابك مقفل لمدة 15 دقيقة.</p>
         <p dir="rtl">إذا لم تكن أنت من حاول تسجيل الدخول، يُرجى التواصل مع الإدارة فوراً.</p>`
      : `<p>${name},</p>
         <p>The maximum number of verification attempts has been exceeded. Your account is locked for 15 minutes.</p>
         <p>If this was not you, please contact your administrator immediately.</p>`;

  await emailService.sendEmailAsync({
    to: email,
    subject,
    html,
    locale,
  });
}
