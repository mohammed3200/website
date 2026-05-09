import React from 'react';
import { Text, Section, Heading, Button } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface SubmissionConfirmationProps {
  name: string;
  type: 'collaborator' | 'innovator';
  locale?: 'ar' | 'en';
  submissionId?: string;
}

export const SubmissionConfirmation = ({
  name,
  type,
  locale = 'en',
  submissionId,
}: SubmissionConfirmationProps) => {
  const isArabic = locale === 'ar';
  const textAlign = isArabic ? 'right' : 'left';

  return (
    <BaseLayout locale={locale}>
      <Heading style={{ ...headingStyle, textAlign }}>
        {isArabic ? `عزيزي/عزيزتي ${name}،` : `Dear ${name},`}
      </Heading>

      <Text style={{ ...textStyle, textAlign }}>
        {isArabic
          ? `نشكركم على اهتمامكم ${
              type === 'collaborator'
                ? 'بالتعاون معنا'
                : 'بتقديم مشروعكم الابتكاري'
            }.`
          : `Thank you for your interest in ${
              type === 'collaborator'
                ? 'collaborating with us'
                : 'submitting your innovative project'
            }.`}
      </Text>

      <Section style={highlightBoxStyle}>
        <Text style={{ ...highlightTitleStyle, textAlign }}>
          ✅{' '}
          {isArabic ? 'تم استلام طلبك بنجاح' : 'Your Request Has Been Received'}
        </Text>
        <Text style={{ ...highlightTextStyle, textAlign }}>
          {isArabic
            ? `يقوم فريقنا حالياً بمراجعة ${
                type === 'collaborator' ? 'طلب التعاون' : 'مشروعك'
              } بعناية. سنقوم بالتواصل معكم في أقرب وقت ممكن.`
            : `Our team is currently reviewing your ${
                type === 'collaborator' ? 'collaboration request' : 'project'
              } carefully. We will contact you as soon as possible.`}
        </Text>
        {submissionId && (
          <Text style={{ ...referenceTextStyle, textAlign }}>
            {isArabic ? 'رقم المرجع:' : 'Reference ID:'}{' '}
            <strong>{submissionId}</strong>
          </Text>
        )}
      </Section>

      <Section style={{ marginTop: '32px' }}>
        <Text style={{ ...sectionTitleStyle, textAlign }}>
          {isArabic ? '📋 ماذا بعد؟' : "📋 What's Next?"}
        </Text>
        <ul
          style={{
            paddingRight: isArabic ? '20px' : '0',
            paddingLeft: isArabic ? '0' : '20px',
          }}
        >
          <li style={{ ...listItemStyle, textAlign }}>
            {isArabic
              ? `سيتم مراجعة ${type === 'collaborator' ? 'معلومات شركتكم' : 'تفاصيل مشروعكم'} من قبل فريق متخصص`
              : `Your ${type === 'collaborator' ? 'company information' : 'project details'} will be reviewed by a specialized team`}
          </li>
          <li style={{ ...listItemStyle, textAlign }}>
            {isArabic
              ? 'ستصلكم رسالة تأكيد خلال 3-5 أيام عمل'
              : 'You will receive a confirmation email within 3-5 business days'}
          </li>
          <li style={{ ...listItemStyle, textAlign }}>
            {isArabic
              ? 'في حالة الموافقة، سنتواصل معكم لترتيب الخطوات القادمة'
              : 'If approved, we will contact you to arrange the next steps'}
          </li>
        </ul>
      </Section>

      <Section style={{ marginTop: '32px', textAlign: 'center' as const }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://ebic.cit.edu.ly'}/${locale}`}
          style={buttonStyle}
        >
          {isArabic ? 'زيارة موقعنا' : 'Visit Our Website'}
        </Button>
      </Section>

      <Text style={{ ...textStyle, textAlign, marginTop: '32px' }}>
        {isArabic
          ? 'نقدر صبركم ونتطلع للعمل معكم!'
          : 'We appreciate your patience and look forward to working with you!'}
      </Text>

      <Text style={{ ...signatureStyle, textAlign }}>
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

// SHARED STYLES - Use these across all templates
const headingStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 24px',
};

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '16px 0',
};

const highlightBoxStyle = {
  backgroundColor: '#fff3e0',
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #fe6601',
  marginTop: '24px',
};

const highlightTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 12px',
};

const highlightTextStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0',
};

const referenceTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '16px 0 0',
};

const sectionTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 16px',
};

const listItemStyle = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#4b5563',
  marginBottom: '8px',
};

// FIXED: Changed from #2c3e50 to #fe6601 (primary orange)
const buttonStyle = {
  backgroundColor: '#fe6601',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'inline-block',
};

const signatureStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '24px 0 0',
};

export default SubmissionConfirmation;
