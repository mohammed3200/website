import React from 'react';
import { Text, Section, Heading } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface TwoFactorAuthProps {
  name: string;
  code: string;
  locale?: 'ar' | 'en';
  expiresIn?: string;
}

export const TwoFactorAuth = ({
  name,
  code,
  locale = 'en',
  expiresIn = '10 minutes',
}: TwoFactorAuthProps) => {
  const isArabic = locale === 'ar';
  const textAlign = isArabic ? 'right' : 'left';

  return (
    <BaseLayout locale={locale}>
      {/* Security Icon */}
      <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
        <Text style={{ fontSize: '64px', margin: '0' }}>🔐</Text>
      </Section>

      <Heading style={{ ...heading, textAlign }}>
        {isArabic ? `عزيزي/عزيزتي ${name}،` : `Dear ${name},`}
      </Heading>

      <Text style={{ ...text, textAlign }}>
        {isArabic
          ? 'تلقينا طلب تسجيل دخول إلى حسابك. استخدم رمز التحقق أدناه لإكمال عملية تسجيل الدخول.'
          : 'We received a login request for your account. Use the verification code below to complete the login process.'}
      </Text>

      {/* Code Box */}
      <Section style={codeBox}>
        <Text style={{ ...codeLabel, textAlign }}>
          {isArabic ? 'رمز التحقق:' : 'Verification Code:'}
        </Text>
        <Text style={codeDisplay}>{code}</Text>
      </Section>

      {/* Instructions */}
      <Section style={{ marginTop: '24px' }}>
        <Text style={{ ...instructionTitle, textAlign }}>
          {isArabic ? '📝 كيفية الاستخدام:' : '📝 How to Use:'}
        </Text>
        <ol
          style={{
            paddingRight: isArabic ? '20px' : '0',
            paddingLeft: isArabic ? '0' : '20px',
          }}
        >
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'انسخ رمز التحقق أعلاه'
              : 'Copy the verification code above'}
          </li>
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'ارجع إلى صفحة تسجيل الدخول'
              : 'Return to the login page'}
          </li>
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'الصق الرمز في حقل التحقق'
              : 'Paste the code in the verification field'}
          </li>
        </ol>
      </Section>

      {/* Warning Box */}
      <Section style={warningBox}>
        <Text style={{ ...warningText, textAlign }}>
          ⏱️{' '}
          {isArabic
            ? `هذا الرمز صالح لمدة ${expiresIn} فقط.`
            : `This code is only valid for ${expiresIn}.`}
        </Text>
      </Section>

      {/* Security Note */}
      <Section style={securityBox}>
        <Text style={{ ...securityTitle, textAlign }}>
          {isArabic ? '🛡️ تنبيه أمني مهم:' : '🛡️ Important Security Alert:'}
        </Text>
        <Text style={{ ...securityText, textAlign }}>
          {isArabic
            ? 'إذا لم تحاول تسجيل الدخول، يُرجى تجاهل هذه الرسالة وتغيير كلمة المرور فوراً. لا تشارك هذا الرمز مع أي شخص.'
            : 'If you did not attempt to log in, please ignore this email and change your password immediately. Never share this code with anyone.'}
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
  color: '#2c3e50',
  margin: '0 0 24px',
};

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '16px 0',
};

const codeBox = {
  backgroundColor: '#f8f9fa', // Matching footer background
  padding: '32px',
  borderRadius: '12px',
  border: '2px solid #eaeaea', // Matching container border
  marginTop: '24px',
  textAlign: 'center' as const,
};

const codeLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#7f8c8d', // Subtitle color
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const codeDisplay = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#fe6601', // Primary orange
  backgroundColor: '#ffffff',
  padding: '16px 24px',
  borderRadius: '8px',
  border: '2px dashed #fe6601', // Primary orange
  display: 'inline-block',
  letterSpacing: '0.1em',
  fontFamily: 'monospace',
};

const instructionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 12px',
};

const listItem = {
  fontSize: '15px',
  lineHeight: '1.8',
  color: '#2c3e50',
  marginBottom: '8px',
};

const warningBox = {
  backgroundColor: '#fffbeb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #fbbf24',
  marginTop: '24px',
  textAlign: 'center' as const,
};

const warningText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
  fontWeight: '600',
};

const securityBox = {
  backgroundColor: '#fef2f2',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #fca5a5',
  marginTop: '24px',
};

const securityTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#991b1b',
  margin: '0 0 8px',
};

const securityText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#7f1d1d',
  margin: '0',
};

const signature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '32px 0 0',
};

export default TwoFactorAuth;
