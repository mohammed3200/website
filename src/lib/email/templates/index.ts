import { render } from '@react-email/components';
import SubmissionConfirmation from './SubmissionConfirmation';
import StatusUpdate from './StatusUpdate';
import PasswordReset from './PasswordReset';
import Welcome from './Welcome';
import TwoFactorAuth from './TwoFactorAuth';
import EmailVerification from './EmailVerification';
import AdminNotification from './AdminNotification';

export interface AdminNotificationData {
  adminName: string;
  title: string;
  message: string;
  actionUrl?: string;
  data?: Record<string, unknown>;
  locale?: 'ar' | 'en';
}

export interface SubmissionConfirmationData {
  name: string;
  type: 'collaborator' | 'innovator';
  locale?: 'ar' | 'en';
  submissionId?: string;
}

export interface StatusUpdateData {
  name: string;
  type: 'collaborator' | 'innovator';
  status: 'approved' | 'rejected';
  locale?: 'ar' | 'en';
  reason?: string;
  nextSteps?: string[];
}

export interface PasswordResetData {
  name: string;
  resetLink: string;
  locale?: 'ar' | 'en';
  expiresIn?: string;
}

export interface WelcomeData {
  name: string;
  role?: string;
  loginLink?: string;
  locale?: 'ar' | 'en';
}

export interface TwoFactorAuthData {
  name: string;
  code: string;
  locale?: 'ar' | 'en';
  expiresIn?: string;
}

export interface EmailVerificationData {
  name: string;
  verificationLink: string;
  locale?: 'ar' | 'en';
  expiresIn?: string;
}

/**
 * Render submission confirmation email template
 */
export async function renderSubmissionConfirmation(
  data: SubmissionConfirmationData,
): Promise<string> {
  return render(SubmissionConfirmation(data));
}

/**
 * Render status update email template
 */
export async function renderStatusUpdate(
  data: StatusUpdateData,
): Promise<string> {
  return render(StatusUpdate(data));
}

/**
 * Render password reset email template
 */
export async function renderPasswordReset(
  data: PasswordResetData,
): Promise<string> {
  return render(PasswordReset(data));
}

/**
 * Render welcome email template
 */
export async function renderWelcome(data: WelcomeData): Promise<string> {
  return render(Welcome(data));
}

/**
 * Render 2FA email template
 */
export async function renderTwoFactorAuth(
  data: TwoFactorAuthData,
): Promise<string> {
  return render(TwoFactorAuth(data));
}

/**
 * Render email verification template
 */
export async function renderEmailVerification(
  data: EmailVerificationData,
): Promise<string> {
  return render(EmailVerification(data));
}

/**
 * Render admin notification email template
 */
export async function renderAdminNotification(
  data: AdminNotificationData,
): Promise<string> {
  return render(AdminNotification(data));
}

/**
 * Get email subject for submission confirmation
 */
export function getSubmissionConfirmationSubject(
  type: 'collaborator' | 'innovator',
  locale: 'ar' | 'en' = 'en',
): string {
  const isArabic = locale === 'ar';

  if (isArabic) {
    return type === 'collaborator'
      ? 'تم استلام طلب التعاون'
      : 'تم استلام طلب الابتكار';
  }

  return type === 'collaborator'
    ? 'Collaboration Request Received'
    : 'Innovation Request Received';
}

/**
 * Get email subject for status update
 */
export function getStatusUpdateSubject(
  status: 'approved' | 'rejected',
  locale: 'ar' | 'en' = 'en',
): string {
  const isArabic = locale === 'ar';

  if (isArabic) {
    return status === 'approved'
      ? '✅ تمت الموافقة على طلبك'
      : '❌ تم رفض طلبك';
  }

  return status === 'approved'
    ? '✅ Your Request Has Been Approved'
    : '❌ Your Request Has Been Rejected';
}

/**
 * Get email subject for password reset
 */
export function getPasswordResetSubject(locale: 'ar' | 'en' = 'en'): string {
  return locale === 'ar'
    ? '🔐 إعادة تعيين كلمة المرور'
    : '🔐 Password Reset Request';
}

/**
 * Get email subject for welcome email
 */
export function getWelcomeSubject(locale: 'ar' | 'en' = 'en'): string {
  return locale === 'ar'
    ? '🎉 مرحباً بك في مركز الريادة والحاضنات والتطوير التقني - مصراتة'
    : '🎉 Welcome to Entrepreneurship, Incubators & Technical Development Center - Misrata';
}

/**
 * Get email subject for 2FA
 */
export function getTwoFactorAuthSubject(locale: 'ar' | 'en' = 'en'): string {
  return locale === 'ar'
    ? '🔐 رمز التحقق الخاص بك'
    : '🔐 Your Verification Code';
}

/**
 * Get email subject for email verification
 */
export function getEmailVerificationSubject(
  locale: 'ar' | 'en' = 'en',
): string {
  return locale === 'ar'
    ? '✉️ تأكيد البريد الإلكتروني'
    : '✉️ Email Verification';
}

/**
 * Get email subject for admin notification
 */
export function getAdminNotificationSubject(
  title: string,
  locale: 'ar' | 'en' = 'en',
): string {
  return locale === 'ar'
    ? `📢 تنبيه إداري: ${title}`
    : `📢 Admin Alert: ${title}`;
}

export {
  SubmissionConfirmation,
  StatusUpdate,
  PasswordReset,
  Welcome,
  TwoFactorAuth,
  EmailVerification,
  AdminNotification,
};
