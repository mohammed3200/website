import React from 'react';
import { Text, Section, Heading, Button } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface EmailVerificationProps {
  name: string;
  verificationLink: string;
  locale?: 'ar' | 'en';
  expiresIn?: string;
}

export const EmailVerification = ({
  name,
  verificationLink,
  locale = 'en',
  expiresIn = '24 hours',
}: EmailVerificationProps) => {
  const isArabic = locale === 'ar';
  const textAlign = isArabic ? 'right' : 'left';

  return (
    <BaseLayout locale={locale}>
      {/* Welcome Icon */}
      <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
        <Text style={{ fontSize: '64px', margin: '0' }}>✉️</Text>
      </Section>

      <Heading style={{ ...heading, textAlign }}>
        {isArabic ? `مرحباً ${name}!` : `Hello ${name}!`}
      </Heading>

      <Text style={{ ...text, textAlign }}>
        {isArabic
          ? 'شكراً لتسجيلك في مركز الريادة والحاضنات والتطوير التقني - مصراتة!'
          : 'Thank you for registering with the Entrepreneurship, Incubators & Technical Development Center - Misrata!'}
      </Text>

      {/* Verification Box */}
      <Section style={verificationBox}>
        <Text style={{ ...boxTitle, textAlign }}>
          🔐 {isArabic ? 'تأكيد البريد الإلكتروني' : 'Email Verification'}
        </Text>
        <Text style={{ ...boxText, textAlign }}>
          {isArabic
            ? 'للبدء في استخدام حسابك، يرجى التحقق من عنوان بريدك الإلكتروني بالنقر على الزر أدناه:'
            : 'To start using your account, please verify your email address by clicking the button below:'}
        </Text>
      </Section>

      {/* Verification Button */}
      <Section style={{ marginTop: '32px', textAlign: 'center' as const }}>
        <Button href={verificationLink} style={button}>
          {isArabic ? 'تأكيد البريد الإلكتروني' : 'Verify Email Address'}
        </Button>
      </Section>

      {/* Alternative Link */}
      <Section style={{ marginTop: '24px' }}>
        <Text style={{ ...smallText, textAlign }}>
          {isArabic
            ? 'أو انسخ الرابط التالي والصقه في متصفحك:'
            : 'Or copy and paste this link into your browser:'}
        </Text>
        <Text style={linkCode}>{verificationLink}</Text>
      </Section>

      {/* Info Box */}
      <Section style={infoBox}>
        <Text style={{ ...infoTitle, textAlign }}>
          {isArabic ? 'ℹ️ معلومات مهمة:' : 'ℹ️ Important Information:'}
        </Text>
        <ul
          style={{
            paddingRight: isArabic ? '20px' : '0',
            paddingLeft: isArabic ? '0' : '20px',
            margin: '12px 0 0',
          }}
        >
          <li style={{ ...infoItem, textAlign }}>
            {isArabic
              ? `هذا الرابط صالح لمدة ${expiresIn}`
              : `This link is valid for ${expiresIn}`}
          </li>
          <li style={{ ...infoItem, textAlign }}>
            {isArabic
              ? 'بعد التحقق، ستتمكن من تسجيل الدخول إلى حسابك'
              : 'After verification, you will be able to log in to your account'}
          </li>
          <li style={{ ...infoItem, textAlign }}>
            {isArabic
              ? 'إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذه الرسالة بأمان'
              : 'If you did not create an account, you can safely ignore this email'}
          </li>
        </ul>
      </Section>

      {/* Help Section */}
      <Section style={{ marginTop: '32px' }}>
        <Text style={{ ...helpTitle, textAlign }}>
          {isArabic ? '💬 تحتاج مساعدة؟' : '💬 Need Help?'}
        </Text>
        <Text style={{ ...text, textAlign }}>
          {isArabic
            ? 'إذا كنت تواجه مشكلة في التحقق من بريدك الإلكتروني، يرجى التواصل مع فريق الدعم لدينا.'
            : 'If you are having trouble verifying your email, please contact our support team.'}
        </Text>
      </Section>

      {/* Closing */}
      <Text style={{ ...signature, textAlign }}>
        {isArabic ? 'مع أطيب التحيات،' : 'Best regards,'}
        <br />
        <strong>
          {isArabic
            ? 'فريق مركز الريادة والحاضنات والتطوير التقني - مصراتة'
            : 'Entrepreneurship, Incubators & Technical Development Center - Misrata Team'}
        </strong>
      </Text>
    </BaseLayout>
  );
};

// Styles matching the BaseLayout color scheme
const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 24px',
};

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '16px 0',
};

const verificationBox = {
  backgroundColor: '#fff3e0',
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #fe6601',
  marginTop: '24px',
};

const boxTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 12px',
};

const boxText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '0',
};

const button = {
  backgroundColor: '#fe6601',
  color: '#ffffff',
  padding: '14px 36px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'inline-block',
  fontSize: '16px',
};

const smallText = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '8px 0',
};

const linkCode = {
  backgroundColor: '#f8f9fa',
  padding: '12px',
  borderRadius: '4px',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  display: 'block',
  marginTop: '8px',
  color: '#2c3e50',
  border: '1px solid #eaeaea',
};

const infoBox = {
  backgroundColor: '#f0f9ff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #3498db',
  marginTop: '24px',
};

const infoTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0',
};

const infoItem = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#2c3e50',
  marginBottom: '8px',
};

const helpTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 12px',
};

const signature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '32px 0 0',
};

export default EmailVerification;