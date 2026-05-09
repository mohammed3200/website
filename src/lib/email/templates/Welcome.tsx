import React from 'react';
import { Text, Section, Heading, Button } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface WelcomeProps {
  name: string;
  role?: string;
  loginLink?: string;
  locale?: 'ar' | 'en';
}

export const Welcome = ({
  name,
  role,
  loginLink,
  locale = 'en',
}: WelcomeProps) => {
  const isArabic = locale === 'ar';
  const textAlign = isArabic ? 'right' : 'left';

  return (
    <BaseLayout locale={locale}>
      {/* Welcome Icon */}
      <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
        <Text style={{ fontSize: '64px', margin: '0' }}>🎉</Text>
      </Section>

      <Heading style={{ ...heading, textAlign }}>
        {isArabic ? `مرحباً ${name}!` : `Welcome ${name}!`}
      </Heading>

      <Text style={{ ...text, textAlign }}>
        {isArabic
          ? 'يسعدنا انضمامك إلى مركز الريادة والحاضنات والتطوير التقني - مصراتة!'
          : 'We are excited to have you join the Entrepreneurship, Incubators & Technical Development Center - Misrata!'}
      </Text>

      {/* Welcome Box */}
      <Section style={welcomeBox}>
        <Text style={{ ...boxTitle, textAlign }}>
          {isArabic ? '🚀 حسابك جاهز!' : '🚀 Your Account is Ready!'}
        </Text>
        <Text style={{ ...boxText, textAlign }}>
          {isArabic
            ? `تم إنشاء حسابك بنجاح${role ? ` كـ ${role}` : ''}. يمكنك الآن الوصول إلى جميع الميزات والخدمات المتاحة.`
            : `Your account has been successfully created${role ? ` as ${role}` : ''}. You can now access all available features and services.`}
        </Text>
      </Section>

      {/* Features Section */}
      <Section style={{ marginTop: '32px' }}>
        <Text style={{ ...sectionTitle, textAlign }}>
          {isArabic ? '✨ ماذا يمكنك أن تفعل الآن؟' : '✨ What Can You Do Now?'}
        </Text>

        <ul
          style={{
            paddingRight: isArabic ? '20px' : '0',
            paddingLeft: isArabic ? '0' : '20px',
          }}
        >
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'استكشف الفرص المتاحة للتعاون والابتكار'
              : 'Explore available collaboration and innovation opportunities'}
          </li>
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'تواصل مع الشركاء والمبتكرين الآخرين'
              : 'Connect with other partners and innovators'}
          </li>
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'احصل على الدعم والإرشاد من فريقنا'
              : 'Get support and guidance from our team'}
          </li>
          <li style={{ ...listItem, textAlign }}>
            {isArabic
              ? 'ابقَ على اطلاع بآخر الأخبار والفعاليات'
              : 'Stay updated with latest news and events'}
          </li>
        </ul>
      </Section>

      {/* Login Button */}
      {loginLink && (
        <Section style={{ marginTop: '32px', textAlign: 'center' as const }}>
          <Button href={loginLink} style={button}>
            {isArabic ? 'تسجيل الدخول الآن' : 'Login Now'}
          </Button>
        </Section>
      )}

      {/* Support Section */}
      <Section style={supportBox}>
        <Text style={{ ...supportTitle, textAlign }}>
          {isArabic ? '💬 هل تحتاج إلى مساعدة؟' : '💬 Need Help?'}
        </Text>
        <Text style={{ ...supportText, textAlign }}>
          {isArabic
            ? 'فريقنا هنا لمساعدتك! لا تتردد في التواصل معنا عبر البريد الإلكتروني أو زيارة موقعنا.'
            : 'Our team is here to help! Feel free to reach out via email or visit our website.'}
        </Text>
      </Section>

      {/* Closing */}
      <Text style={{ ...text, textAlign, marginTop: '32px' }}>
        {isArabic
          ? 'نتطلع للعمل معكم وتحقيق النجاح المشترك!'
          : 'We look forward to working with you and achieving mutual success!'}
      </Text>

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

const welcomeBox = {
  backgroundColor: '#fff3e0', // Consistent with other templates
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #fe6601', // Primary orange
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

const sectionTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 16px',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#2c3e50',
  marginBottom: '8px',
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

const supportBox = {
  backgroundColor: '#f8f9fa', // Matching footer background
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #eaeaea', // Matching container border
  marginTop: '32px',
};

const supportTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 8px',
};

const supportText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '0',
};

const signature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2c3e50',
  margin: '24px 0 0',
};

export default Welcome;
