import React from 'react';
import { Text, Section, Heading, Button } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface PasswordResetProps {
  name: string;
  resetLink: string;
  locale?: 'ar' | 'en';
  expiresIn?: string;
}

export const PasswordReset = ({
  name,
  resetLink,
  locale = 'en',
  expiresIn = '1 hour',
}: PasswordResetProps) => {
  const isArabic = locale === 'ar';
  const textAlign = isArabic ? 'right' : 'left';

  return (
    <BaseLayout locale={locale}>
      <Heading style={{ ...heading, textAlign }}>
        {isArabic ? `عزيزي/عزيزتي ${name}،` : `Dear ${name},`}
      </Heading>

      <Text style={{ ...text, textAlign }}>
        {isArabic
          ? 'تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك.'
          : 'We received a request to reset your password for your account.'}
      </Text>

      {/* Action Box */}
      <Section style={actionBox}>
        <Text style={{ ...boxTitle, textAlign }}>
          🔐 {isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password'}
        </Text>
        <Text style={{ ...boxText, textAlign }}>
          {isArabic
            ? 'انقر على الزر أدناه لإنشاء كلمة مرور جديدة:'
            : 'Click the button below to create a new password:'}
        </Text>
      </Section>

      {/* Reset Button */}
      <Section style={{ marginTop: '32px', textAlign: 'center' as const }}>
        <Button href={resetLink} style={button}>
          {isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </Button>
      </Section>

      {/* Alternative Link */}
      <Section style={{ marginTop: '24px' }}>
        <Text style={{ ...smallText, textAlign }}>
          {isArabic
            ? 'أو انسخ الرابط التالي والصقه في متصفحك:'
            : 'Or copy and paste this link into your browser:'}
        </Text>
        <Text style={linkCode}>{resetLink}</Text>
      </Section>

      {/* Warning Box */}
      <Section style={warningBox}>
        <Text style={{ ...warningText, textAlign }}>
          ⚠️{' '}
          {isArabic
            ? `هذا الرابط صالح لمدة ${expiresIn} فقط.`
            : `This link is only valid for ${expiresIn}.`}
        </Text>
      </Section>

      {/* Security Note */}
      <Section style={{ marginTop: '32px' }}>
        <Text style={{ ...securityTitle, textAlign }}>
          {isArabic ? '🛡️ ملاحظة أمنية:' : '🛡️ Security Note:'}
        </Text>
        <Text style={{ ...text, textAlign }}>
          {isArabic
            ? 'إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان. حسابك آمن ولن يتم إجراء أي تغييرات.'
            : 'If you did not request a password reset, you can safely ignore this email. Your account is secure and no changes will be made.'}
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

// Updated Styles to match BaseLayout color scheme
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50', // Matching BaseLayout header title color
  margin: '0 0 24px',
};

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50', // Darker text for better readability
  margin: '16px 0',
};

const actionBox = {
  backgroundColor: '#fff3e0', // Light orange background matching highlightBox in SubmissionConfirmation
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #fe6601', // Primary orange color
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
  backgroundColor: '#fe6601', // Primary orange
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
  color: '#7f8c8d', // Matching BaseLayout subtitle color
  margin: '8px 0',
};

const linkCode = {
  backgroundColor: '#f8f9fa', // Matching BaseLayout footer background
  padding: '12px',
  borderRadius: '4px',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  display: 'block',
  marginTop: '8px',
  color: '#2c3e50',
  border: '1px solid #eaeaea', // Matching BaseLayout container border
};

const warningBox = {
  backgroundColor: '#fffbeb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #fbbf24',
  marginTop: '24px',
};

const warningText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
  fontWeight: '500',
};

const securityTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 8px',
};

const signature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '32px 0 0',
};

export default PasswordReset;
